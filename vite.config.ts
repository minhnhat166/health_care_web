import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import dynamicImport from 'vite-plugin-dynamic-import'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react({
            babel: {
                plugins: ['babel-plugin-macros'],
            },
        }),
        dynamicImport(),
    ],
    assetsInclude: ['**/*.md'],
    resolve: {
        alias: {
            '@': path.join(__dirname, 'src'),
        },
    },
    define: {
        'process.env': process.env,
        VITE_API_HOST: JSON.stringify(process.env.VITE_SWAGGER_URL),
    },
    server: {
        hmr: {
            overlay: false, // Disable the HMR overlay
        },
    },
})
