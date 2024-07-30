module.exports = {
  apps: [
    {
      name: 'frontend',
      script: 'vite',
      args: 'preview --port 443',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
