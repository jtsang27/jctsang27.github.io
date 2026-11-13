import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// USER page: the repo is named <user>.github.io, so the site is served from the
// root at https://jtsang27.github.io/ and base is '/'.
export default defineConfig({
  plugins: [react()],
  base: '/',
});
