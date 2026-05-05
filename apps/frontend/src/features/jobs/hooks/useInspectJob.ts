import {useQuery} from "@tanstack/react-query";
import {getJobs} from "../api/jobs.api";

export function useInspectJob(id: string) {
    return useQuery({
        queryKey: ['jobs'],
        queryFn: getJobs,
        refetchInterval: 1000,
    });
}