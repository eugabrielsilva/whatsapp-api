module.exports = {
  apps: [
    {
      name: 'whatsapp-api',
      script: 'npm',
      args: 'run start:prod',
      cron_restart: '0 */2 * * *',
      max_memory_restart: '1G',
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};