/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  env: {
    GOOGLE_DRIVE_API_KEY: process.env.GOOGLE_DRIVE_API_KEY,
    GOOGLE_DRIVE_FOLDER_ID: process.env.GOOGLE_DRIVE_FOLDER_ID,
    SILO_C_SYNC_INTERVAL_MS: process.env.SILO_C_SYNC_INTERVAL_MS || '100',
    EXISTON_UPDATE_FREQUENCY_HZ: process.env.EXISTON_UPDATE_FREQUENCY_HZ || '10',
  },
  productionBrowserSourceMaps: false,
  compress: true,
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ['react', 'react-dom'],
  },
};

module.exports = nextConfig;
