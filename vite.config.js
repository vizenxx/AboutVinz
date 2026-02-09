import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
<<<<<<< HEAD
});

=======
  base: '/',
  server: {
    host: true,
    port: 5173,
  }
})
>>>>>>> 1d779f1 (Configure custom domain vinz.info)
