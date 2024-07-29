module.exports = {
  apps: [
    {
      name: 'vite-preview',
      script: 'vite',
      args: 'preview --port 443',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
