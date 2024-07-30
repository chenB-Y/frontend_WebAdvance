import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// Load SSL certificates
const keyPath = path.resolve(__dirname, '../../client-key.pem');
const certPath = path.resolve(__dirname, '../../client-cert.pem');

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    },
    host: '0.0.0.0', // Set your IP address here
    port: 443,
  },
});
