/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["hwqcsflrmhlffnqlprib.supabase.co"],
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  async headers() {
    return [
      {
        // Apply CORS to /api/widget
        source: "/api/widget",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*", // Allow all origins, or specify a domain if needed
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
      {
        // Apply CORS to /api/externalReviews
        source: "/api/externalReviews",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*", // Allow all origins, or specify a domain if needed
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
