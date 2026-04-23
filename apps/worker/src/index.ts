import { createClient } from "redis";
import { deserializeJob, jobKey } from "@shared/job";

const redisUrl = "redis://localhost:6379";
const QUEUE = "jobs";
const RETRY_QUEUE = "jobs:retry";
const DLQ = "jobs:dead";
const MAX_RETRIES = 3;
const WORKER_ID = `worker-${process.pid}`;
const VISIBILITY_TIMEOUT_MS = 10_000; // 10 seconds
const LOCK_TTL_SECONDS = 15;
const LOCK_RENEW_INTERVAL_MS = 3000;

const client = createClient({
    url: redisUrl,
});

function sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
}

// simulate random failure (for testing)
function processJob(job: any) {
    console.log("🔥 processing:", job.id);

    if (Math.random() < 0.5) {
        throw new Error("Random failure occurred");
    }

    console.log("✅ success:", job.id);
}

async function startWorker() {
    console.log("Worker starting...");

    client.on("error", (err) => {
        console.error("Redis Client Error:", err);
    });

    await client.connect();

    console.log("Connected to Redis");

    // --- Step 1 behavior: keep process alive + sanity check Redis ---
    // let counter = 0;
    //
    // setInterval(async () => {
    //     counter++;
    //
    //     // lightweight heartbeat write
    //     await client.set("worker:heartbeat", new Date().toISOString());
    //
    //     console.log(`Worker alive... tick ${counter}`);
    // }, 3000);

    // --- Step 2 behavior: keep process alive + sanity check Redis ---
    while (true) {
        try {

            // 1. prioritize retry queue first
            const result = await client.brPop(RETRY_QUEUE, 1)
                || await client.brPop(QUEUE, 1);

            // // 🧠 BLOCKING call — waits until a job appears
            // if (!result){
            //     result = await client.brPop(QUEUE, 0);
            // }

            if (!result) continue;

            const jobId = Number(result.element);
            const key = jobKey(jobId);
            // const job = JSON.parse(result.element);

            const jobRaw = await client.hGetAll(jobKey(jobId));
            if (!jobRaw || !jobRaw.id) continue;

            // const job = {
            //     ...jobRaw,
            //     id: Number(jobRaw.id),
            //     attempts: Number(jobRaw.attempts),
            //     payload: JSON.parse(jobRaw.payload),
            // };

            const job = deserializeJob(jobRaw);

            const locked = await acquireLock(client, jobId, WORKER_ID);

            if (!locked) {
                console.log(`job ${jobId} already locked, skipping`);
                continue;
            }

            const renewalTimer = await startLockRenewal(client, jobId, WORKER_ID);

            try {
                await client.sRem("jobs:queued", job.id.toString());
                await client.sAdd("jobs:processing", job.id.toString());

                // mark processing
                await client.hSet(key, {
                    status: "processing",
                    processingAt: Date.now().toString(),
                    processingBy: WORKER_ID,
                });

                await processJob(job);

                // success state
                await client.hSet(key, {
                    status: "completed",
                    processingAt: Date.now().toString(),
                    processingBy: WORKER_ID,
                });
            } catch (err) {
                job.attempts += 1;

                await client.hSet(key, {
                    status: "failed",
                    attempts: job.attempts,
                    error: err instanceof Error ? err.message : String(err)
                });

                console.log(
                    `failed job ${job.id}, attempt ${job.attempts}`
                );

                await client.sRem("jobs:processing", job.id.toString());

                if (job.attempts >= MAX_RETRIES) {
                    await client.hSet(key, {
                        status: "dead",
                    });
                    await client.lPush(DLQ, job.id.toString());
                    console.log(`moved to DLQ: ${job.id}`);
                } else {
                    await sleep(1000 * job.attempts); // exponential-ish backoff
                    await client.sAdd("jobs:queued", job.id.toString());
                    await client.lPush(RETRY_QUEUE, job.id.toString());
                    console.log(`retrying job: ${job.id}`);
                }
            } finally {
                // STOP renewal first
                clearInterval(renewalTimer);

                // release lock
                await releaseLock(client, job.id);
            }
            // console.log("🔥 Processing job:", job);
            //
            // // simulate work
            // await new Promise((r) => setTimeout(r, 1000));
            //
            // console.log("✅ Job done:", job.id);
        } catch (err) {
            console.error("Worker error:", err);
        }
    }
}

async function recoverStuckJobs(client: any) {
    const jobs = await client.sMembers("jobs:processing");

    for (const jobId of jobs) {
        const reclaimKey = `recovery:lock:${jobId}`;
        const acquired = await client.set(reclaimKey, "1", {
            NX: true,
            EX: 5,
        });

        if (!acquired) continue;

        const key = jobKey(Number(jobId));
        const jobRaw = await client.hGetAll(key);

        if (!jobRaw.id) continue;
        if (jobRaw.status !== "processing") continue;

        const startedAt = Number(jobRaw.processingAt || 0);

        if (Date.now() - startedAt <= VISIBILITY_TIMEOUT_MS) continue;

        //
        // const isStuck =
        //     Date.now() - startedAt > VISIBILITY_TIMEOUT_MS;
        //
        // if (!isStuck) continue;

        console.log(`recovering stuck job ${jobId}`);

        const attempts = Number(jobRaw.attempts || 0) + 1;

        await client.hSet(key, {
            status: attempts >= MAX_RETRIES ? "dead" : "queued",
            attempts: attempts.toString(),
            processingAt: "",
            processingBy: "",
        });

        await client.sRem("jobs:processing", jobId);

        if (attempts >= MAX_RETRIES) {
            await client.sAdd("jobs:dead", jobId);
            await client.lPush(DLQ, jobId);
        } else {
            await client.sAdd("jobs:queued", jobId);
            await client.lPush("jobs", jobId);
        }
    }
}

// async function recoverStuckJobs(client: any) {
//     while (true) {
//         try {
//             const keys = await client.keys("job:*");
//
//             for (const key of keys) {
//                 const type = await client.type(key);
//
//                 if (type !== "hash") {
//                     console.warn("Skipping invalid job key:", key, type);
//                     continue;
//                 }
//
//                 const job = await client.hGetAll(key);
//
//                 if (!job.id) continue;
//
//                 if (job.status !== "processing") continue;
//
//                 const startedAt = Number(job.processingAt || 0);
//
//                 // const isStuck =
//                 //     Date.now() - startedAt > VISIBILITY_TIMEOUT_MS;
//                 //
//                 // if (isStuck) {
//                 console.log(`recovering stuck job ${job.id}`);
//                 const attempts = Number(job.attempts || 0) + 1;
//                 await client.hSet(key, {
//                     status: attempts >= MAX_RETRIES ? "dead" : "queued",
//                     attempts: attempts.toString(),
//                     processingAt: "",
//                     processingBy: "",
//                 });
//                 if (attempts >= MAX_RETRIES) {
//                     await client.hSet(key, {
//                         status: "dead",
//                     });
//                     await client.lPush(DLQ, job.id);
//                     console.log(`moved to DLQ: ${job.id}`);
//                 } else {
//                     await client.lPush("jobs", job.id);
//                 }
//             }
//             // }
//         } catch (err) {
//             console.error("Recovery error:", err);
//         }
//
//         await new Promise((r) => setTimeout(r, 5000));
//     }
// }

async function acquireLock(client: any, jobId: number, workerId: string) {
    const lockKey = `job:${jobId}:lock`;

    return await client.set(lockKey, workerId, {
        NX: true,
        EX: LOCK_TTL_SECONDS,
    });
}

async function releaseLock(client: any, jobId: number) {
    const lockKey = `job:${jobId}:lock`;
    await client.del(lockKey);
}

async function startLockRenewal(client: any, jobId: number, workerId: string) {
    const key = `job:${jobId}:lock`;

    const interval = setInterval(async () => {
        try {
            const currentOwner = await client.get(key);

            // Only renew if we still own it
            if (currentOwner === workerId) {
                await client.expire(key, LOCK_TTL_SECONDS);
                console.log(`renewed lock for job ${jobId}`);
            } else {
                console.log(`lost lock for job ${jobId}`);
                clearInterval(interval);
            }
        } catch (err) {
            console.error("renewal error:", err);
            clearInterval(interval);
        }
    }, LOCK_RENEW_INTERVAL_MS);

    return interval;
}
// startWorker().catch((err) => {
//     console.error("Worker failed to start:", err);
//     process.exit(1);
// });

startWorker();
setInterval(() => {
    recoverStuckJobs(client);
}, 5000);
