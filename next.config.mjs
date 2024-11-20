/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["hwqcsflrmhlffnqlprib.supabase.co"],
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};

export default nextConfig;