import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'cdn.jsdelivr.net' }
    ]
  },
  experimental: {
    // Enable modern features
  },
  async redirects() {
    return [
      // SEO-friendly service URLs (old slugs -> new slugs)
      { source: '/seo', destination: '/seo-services', permanent: true },
      { source: '/google-maps', destination: '/local-seo', permanent: true },
      { source: '/ppc', destination: '/google-ads-management', permanent: true },
      { source: '/social-media', destination: '/social-media-marketing', permanent: true }
    ];
  }
};

export default nextConfig;
