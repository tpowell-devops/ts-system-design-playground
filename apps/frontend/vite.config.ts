import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";

export default defineConfig({
    plugins: [react()],
    root: path.resolve(__dirname),
    build: {
        outDir: 'dist', // relative to root
    },
    base: '/',
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },
    server: {
        host: true, // same as 0.0.0.0
        port: 5173,
        proxy: {
            '/api': {
                target: 'http://api:3000',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''), ///api/jobs → http://api:3000/jobs
            },
        }
    }
})

// export default defineConfig({
//     plugins: [react()],
//     root: path.resolve(__dirname), // frontend folder
//     resolve: {
//         alias: {
//             '@': path.resolve(__dirname, "src"),
//         },
//     },
//     optimizeDeps: {
//         include: ['@tanstack/react-query', '@job-system/shared'],
//     },
//     server: {
//         fs: {
//             allow: [path.resolve(__dirname)]
//         }
//     }
// });

// https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })
