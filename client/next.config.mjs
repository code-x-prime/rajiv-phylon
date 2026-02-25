/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // R2_PUBLIC_URL (and any https image host) allowed for Next/Image
    remotePatterns: [
      { protocol: "https", hostname: "**", pathname: "/**" },
      { protocol: "http", hostname: "localhost", pathname: "/**" },
    ],
  },
};

export default nextConfig;
