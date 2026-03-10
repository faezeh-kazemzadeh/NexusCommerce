import { defineConfig , loadEnv} from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      host: true, 
      port: 3000, 
      watch: {
        usePolling: true, 
      },
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://server:5000',
          changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''), 

        },
      },
    },
  };
});