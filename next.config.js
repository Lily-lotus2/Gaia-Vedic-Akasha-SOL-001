/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for development
  reactStrictMode: true,

  // Environment variables
  env: {
    GOOGLE_DRIVE_API_KEY: process.env.GOOGLE_DRIVE_API_KEY,
    GOOGLE_DRIVE_FOLDER_ID: process.env.GOOGLE_DRIVE_FOLDER_ID,
    SILO_C_SYNC_INTERVAL_MS: process.env.SILO_C_SYNC_INTERVAL_MS || '100',
    EXISTON_UPDATE_FREQUENCY_HZ: process.env.EXISTON_UPDATE_FREQUENCY_HZ || '10',
  },

  // API routes configuration
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },

  // Build configuration
  productionBrowserSourceMaps: false,

  // Headers for security
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/json',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
    ];
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/',
        destination: '/api/system-state',
        permanent: false,
      },
    ];
  },

  // Rewrites for API routes
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/api/:path*',
          destination: '/api/:path*',
        },
      ],
    };
  },

  // Compression
  compress: true,

  // PoweredBy header removal
  poweredByHeader: false,

  // Optimization
  swcMinify: true,

  // Experimental features (optional)
  experimental: {
    // Enable optimized package imports if needed
    optimizePackageImports: ['react', 'react-dom'],
  },
};

module.exports = nextConfig;
