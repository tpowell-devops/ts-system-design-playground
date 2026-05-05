import * as path from "path";
import * as fs from "fs";
import * as dotenv from "dotenv";

// Helper to require env variables
function required(key: string) {
    const value = process.env[key];
    if (!value) throw new Error(`Missing env var: ${key}`);
    return value;
}

// Determine which .env to load
function findEnv(startDir: string): string | null {
    let dir = startDir;
    while (dir !== path.dirname(dir)) {
        const envPath = path.join(dir, ".env");
        if (fs.existsSync(envPath)) return envPath;
        dir = path.dirname(dir);
    }
    return null;
}

// Priority:
// 1. Use .env.docker if in Docker
// 2. Otherwise, find nearest .env
const envPath = process.env.DOCKER
    ? path.resolve(__dirname, "../../../.env.docker")
    : findEnv(process.cwd()) || ".env";

dotenv.config({ path: envPath });

// Export config with lazy getters
export const config = {
    get redisUrl() { return required("REDIS_URL"); },
    get port() { return Number(process.env.PORT || 3000); },
    get workerId() { return process.env.WORKER_ID || "worker-default"; },
    get visibilityTimeout() { return Number(process.env.VISIBILITY_TIMEOUT_MS || 10000); },
    get maxRetries() { return Number(process.env.MAX_RETRIES || 3); },
};