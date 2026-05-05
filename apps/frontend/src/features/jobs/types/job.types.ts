export type JobStatus = 'pending' | 'processing' | 'done' | 'failed';

export interface Job {
    id: string;
    status: JobStatus;
    payload: unknown;
    result?: unknown;
    createdAt: string;
}