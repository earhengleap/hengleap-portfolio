/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disable the `react/no-unescaped-entities` rule
    dirs: ["pages", "components"], // Optionally specify which directories to apply the rule to
    ignoreDuringBuilds: true, // Optional: Ignore ESLint during build process
  },
  images: {
    domains: ["images.unsplash.com"],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
};

export default nextConfig;
