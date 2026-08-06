/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "**", pathname: "/**" },
      { protocol: "http", hostname: "**", pathname: "/**" },
    ],
  },
  async redirects() {
    return [
      {
        source: "/wp-content/uploads/2025/08/RAJIV-PHYLON-1.pdf",
        destination: "/catalog",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
