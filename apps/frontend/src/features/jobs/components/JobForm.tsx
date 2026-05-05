import { useState } from 'react';
import { useCreateJob } from '../hooks/useCreateJob.js';

export default function JobForm() {
    // const [input, setInput] = useState('');
    //
    // const createJob = useCreateJob();
    //
    // const handleSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault();
    //
    //     if (!input.trim()) return;
    //
    //     // Send job to backend → Redis queue
    //     createJob.mutate({
    //             message: input
    //     });
    //
    //     // // Send job to backend → Redis queue
    //     // createJob.mutate({
    //     //     payload: {
    //     //         message: input,
    //     //     },
    //     // });
    //
    //     // reset input after submission
    //     setInput('');
    // };
    //
    // return (
    //     <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
    //         <input
    //             value={input}
    //             onChange={(e) => setInput(e.target.value)}
    //             placeholder="Enter job payload..."
    //             style={{ marginRight: 10 }}
    //         />
    //
    //         <button type="submit" disabled={createJob.isPending}>
    //             {createJob.isPending ? 'Submitting...' : 'Submit Job'}
    //         </button>
    //
    //         {/* optional feedback */}
    //         {createJob.isError && (
    //             <p style={{ color: 'red' }}>Failed to create job</p>
    //         )}
    //     </form>
    // );

    const [input, setInput] = useState('');
    const createJob = useCreateJob();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!input.trim()) return;

        // Send job payload to backend
        createJob.mutate(
            { message: input }, // <-- send raw payload
            {
                onSuccess: () => {
                    setInput(''); // clear input on success
                    alert('Job queued successfully!');
                },
                onError: (err: any) => {
                    console.error('Failed to create job:', err);
                    alert('Failed to create job');
                },
            }
        );
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter job message"
            />
            <button type="submit" disabled={createJob.isLoading}>
                {createJob.isLoading ? 'Submitting...' : 'Create Job'}
            </button>
        </form>
    );
}