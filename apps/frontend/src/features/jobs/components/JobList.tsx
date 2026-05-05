import { useJobs } from '../hooks/useJobs.js';

export default function JobView({ id }: { id: string }) {
    const { data } = useJobs();
    if (!data) return <div>Loading...</div>;

    return (
        <div>
        {data.map(job => (
        <ul>
            <li>ID: {job.id}</li>
            <li>Status: {job.status}</li>
            <li>Result: {JSON.stringify(job.payload)}</li>
        </ul>))
        }
        </div>
    );
}
// import { useJob } from '../hooks/useJob';
//
// export default function JobList() {
//     const { data, isLoading, error } = useJob();
//
//     if (isLoading) return <div>Loading jobs...</div>;
//     if (error) return <div>Failed to load jobs</div>;
//
//     return (
//         <div>
//             <h2 className="text-lg font-semibold mb-2">Jobs</h2>
//
//             <ul>
//                 {data?.map((job) => (
//                     <li key={job.id}>
//                         <strong>{job.id}</strong> — {job.status}
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// }