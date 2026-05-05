import { http } from './http';
import { Job } from '@job-system/shared';

// Fetch all jobs
export const getJobs = async (): Promise<Job[]> => {
    const res = await http.get('/jobs');
    return res.data;
};

// Create a new job (enqueue into Redis via API)
export const createJob = async (payload: unknown): Promise<Job> => {
    const res = await http.post('/job', payload);
    return res.data;
};

