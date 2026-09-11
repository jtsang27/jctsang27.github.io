import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// This is a PROJECT page (repo name != <user>.github.io), so it deploys to
// https://jtsang27.github.io/jctsang27.github.io/ and base must match the repo name.
export default defineConfig({
  plugins: [react()],
  base: '/jctsang27.github.io/',
});
