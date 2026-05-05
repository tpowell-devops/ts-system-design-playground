import "dotenv/config";
import express from "express";
import { createClient } from "redis";
import { Job, serializeJob, jobKey, config } from "@job-system/shared";
import cors from 'cors';

const app = express();

app.use(express.json());

const allowedOrigins = [
    'http://localhost:3001',      // browser accessing frontend on host
    'http://UI:80',               // optional: container-to-container if needed
];

app.use(cors({
    origin: allowedOrigins, // frontend origin
    credentials: true,
}));

const QUEUE = "jobs";
// const RETRY_QUEUE = "jobs:retry";
// const DLQ = "jobs:dead";
// const MAX_RETRIES = 3;

const client = createClient({
    url: config.redisUrl,
});

client.connect();

// function jobKey(id: number) {
//     return `job:${id}`;
// }

function parseJob(raw: string): Job {
    const payload = JSON.parse(raw) as Job; // cast to Job

    // Optional runtime check
    if (!payload.id || !payload.type || !payload.payload ) {
        console.error(payload);
        throw new Error('Invalid job format');
    }

    return payload;
}

app.get("/health", (_, res) => {
    res.json({status: "ok"});
});

app.post("/job", async (req, res) => {
    const job: Job = {
        id: Date.now(),
        type: "email",
        payload: req.body,
        attempts: 0,
        status: "queued"
    };

    // store full job state
    await client.hSet(jobKey(job.id),serializeJob(job));
    await client.sAdd("jobs:queued", job.id.toString());
    await client.lPush(QUEUE, job.id.toString());

    res.json({
        message: "job queued",
        job,
    });
});

app.get("/jobs", async (req, res) => {
    console.log("hit from front-end");
    // store full job state
    const processingJobIds = await client.lRange('jobs', 0, -1);
    console.log("Processing Job Ids", processingJobIds);
    const jobList = await Promise.all(
        processingJobIds.map(async (id) => {
            const jobData = await client.hGetAll(jobKey(id));
            console.log("jobData", jobData);
            if (!jobData.id || !jobData.type || !jobData.payload) {
                console.warn('Skipping invalid job', jobData);
                return null;
            }
            return {
                ...jobData,
                payload: JSON.parse(jobData.payload), // if payload was JSON serialized
            };
        })
    );
    console.log(jobList);
    // const jobList : Job[] = rawJobList.map(parseJob);
    res.json(jobList);
});

app.listen(3000, () => {
    console.log("API running on port 3000");
});