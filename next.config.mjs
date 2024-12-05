/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ hostname: "images.pexels.com" }],
    domains: ["utfs.io"],
  },
  output: "standalone",
};

export default nextConfig;
