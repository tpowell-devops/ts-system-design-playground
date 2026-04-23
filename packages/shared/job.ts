export type JobStatus =
    | "queued"
    | "processing"
    | "completed"
    | "failed"
    | "dead";

export type Job = {
    id: number;
    type: string;
    payload: any;
    attempts: number;
    status: JobStatus;
    processingAt?: number;
    processingBy?: string;
    error?: string;
};

export function serializeJob(job: Job) {
    return {
        id: job.id.toString(),
        type: job.type,
        payload: JSON.stringify(job.payload),
        attempts: job.attempts.toString(),
        status: job.status,
        processingAt: job.processingAt?.toString() || "",
        processingBy: job.processingBy || "",
        error: job.error || "",
    };
}

export function deserializeJob(hash: Record<string, string>): Job {
    return {
        id: Number(hash.id),
        type: hash.type,
        payload: hash.payload ? JSON.parse(hash.payload) : null,
        attempts: Number(hash.attempts || 0),
        status: hash.status as JobStatus,
        processingAt: hash.processingAt ? Number(hash.processingAt) : undefined,
        processingBy: hash.processingBy || undefined,
        error: hash.error || undefined,
    };
}

export function jobKey(id: number) {
    return `job:${id}`;
}