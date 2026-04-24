import express from "express";
import { createClient } from "redis";
import { Job, serializeJob, jobKey } from "@job-system/shared/";
import { config } from "@job-system/shared";
import "dotenv/config";

const app = express();

app.use(express.json());

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

app.listen(3000, () => {
    console.log("API running on port 3000");
})