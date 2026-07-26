module.exports = {
  apps: [
    {
      name: 'mw-api',
      script: 'src/server.js',
      cwd: '/home/projetos/agile-macros/server',
      env: {
        NODE_ENV: 'production',
        PORT: 4000
      },
      instances: 1,
      autorestart: true,
      max_memory_restart: '300M',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: '/home/projetos/agile-macros/logs/api-error.log',
      out_file: '/home/projetos/agile-macros/logs/api-out.log'
    },
    {
      name: 'mw-landing',
      script: '.output/server/index.mjs',
      cwd: '/home/projetos/agile-macros/landing_page',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOST: '0.0.0.0',
        NUXT_PUBLIC_APP_URL: 'https://app.macroweek.com.br'
      },
      instances: 1,
      autorestart: true,
      max_memory_restart: '300M',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: '/home/projetos/agile-macros/logs/landing-error.log',
      out_file: '/home/projetos/agile-macros/logs/landing-out.log'
    }
  ]
};
