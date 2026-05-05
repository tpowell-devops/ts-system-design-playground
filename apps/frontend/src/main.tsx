// main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './app/App';

// React Query setup: manages server state (API data) in a cache-friendly way
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 1️⃣ Create a QueryClient instance
//    This object manages caching, background updates, and error handling for API data.
const queryClient = new QueryClient();

// 2️⃣ Render the root React element
ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        {/* 3️⃣ Wrap the app in QueryClientProvider so all components can use React Query */}
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <App />
            </QueryClientProvider>
        </BrowserRouter>
    </React.StrictMode>
);

// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.tsx'
//
// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
