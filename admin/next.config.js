const path = require('path');

module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')]
  },
  distDir: 'dist/.next',
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors. in development we need to run yarn lint
    ignoreDuringBuilds: true
  },
  reactStrictMode: true,
  poweredByHeader: false,
  swcMinify: true,
  serverRuntimeConfig: {
    // Will only be available on the server side
    API_ENDPOINT: process.env.NEXT_PUBLIC_API_SERVER_ENDPOINT || process.env.API_ENDPOINT
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    API_ENDPOINT: process.env.API_ENDPOINT
  },
  async rewrites() {
    return [
      {
        source: '/login',
        destination: '/auth/login'
      },
      {
        source: '/forgot-password',
        destination: '/auth/forgot-password'
      }
    ];
  }
};
