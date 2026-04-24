import dotenv from "dotenv";

dotenv.config();

function required(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing env var: ${key}`);
    }
    return value;
}

export const config = {
    redisUrl: required("REDIS_URL"),
    port: Number(process.env.PORT || 3000),
    workerId: process.env.WORKER_ID || "worker-default",
    visibilityTimeout: Number(process.env.VISIBILITY_TIMEOUT_MS || 10000),
    maxRetries: Number(process.env.MAX_RETRIES || 3),
};