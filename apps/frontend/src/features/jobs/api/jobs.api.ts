import { http } from '../../../../shared/api/http';
import { Job } from '@job-system/shared';

// Fetch all jobs
export const getJobs = async (): Promise<Job[]> => {
    const res = await http.get('/jobs');
    return res.data;
};

// Create a new job (enqueue into Redis via API)
export const createJob = async (payload: unknown): Promise<Job> => {
    try {
        const res = await http.post("/job", payload);
        // Axios returns the body in `res.data`
        return res.data;
    } catch (err: any) {
        // Axios throws for non-2xx status codes
        throw new Error(err.response?.data?.error || "Failed to create job");
    }
};
    // const res = await http.post('/job', payload);
    // return res.data;

