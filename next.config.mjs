/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
    ],
  },
  // ESLint is handled via .eslintrc or eslint.config.js
  // Removed deprecated eslint config from here
};

export default nextConfig;
