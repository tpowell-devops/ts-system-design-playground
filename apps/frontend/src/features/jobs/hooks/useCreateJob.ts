import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createJob } from '../api/jobs.api';

// Hook responsible for creating jobs (write operation)
export function useCreateJob() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createJob,
        // When job is successfully created:
        onSuccess: () => {
            // invalidate job list so UI refreshes automatically
            queryClient.invalidateQueries({ queryKey: ['jobs'] });
        },
    });
}