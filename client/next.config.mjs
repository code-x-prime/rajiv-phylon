/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // R2_PUBLIC_URL (and any https image host) allowed for Next/Image
    remotePatterns: [
      { protocol: "https", hostname: "**", pathname: "/**" },
      { protocol: "http", hostname: "localhost", pathname: "/**" },
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
