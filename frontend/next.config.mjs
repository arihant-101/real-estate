/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "www.astapropertymanagement.co.uk", pathname: "/**" },
      { protocol: "https", hostname: "astapropertymanagement.co.uk", pathname: "/**" },
      { protocol: "http", hostname: "localhost", pathname: "/**" },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://www.astapropertymanagement.co.uk/api/:path*",
      },
    ];
  },
};

export default nextConfig;
