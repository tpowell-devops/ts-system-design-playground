import { useQuery } from '@tanstack/react-query';
import { getJobs } from '../api/jobs.api.js';

// Custom hook abstracts data fetching
export function useJobs() {
    return useQuery({
        queryKey: ['jobs'],
        queryFn: getJobs,
        refetchInterval: 1000,
    });
}