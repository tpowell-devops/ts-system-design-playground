import axios from 'axios';

// Centralized HTTP client
// This is where all API calls flow through

//const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const apiUrl = import.meta.env.VITE_API_URL || '/api';
// console.log(import.meta.env.VITE_API_URL);
// console.log(http.defaults.baseURL);

export const http = axios.create({
    baseURL: apiUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

// axios.get('/api/jobs')
// export const http = axios.create({
//     baseURL: 'http://localhost:3000', // your API service
//     headers: {
//         'Content-Type': 'application/json',
//     },
// });