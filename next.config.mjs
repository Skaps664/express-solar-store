/** @type  // API rewrites to proxy to backend
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3000/api/:path*',
      },
    ];
  },'next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // API rewrites to proxy to backend
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:3000/api/:path*",
      },
    ];
  },

  // Performance optimizations
  experimental: {
    optimizePackageImports: ["@/components"],
    scrollRestoration: true,
  },

  // Remove console.logs in production
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Enable compression
  compress: true,

  // Optimize images for faster loading
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
    domains: [
      "images.unsplash.com",
      "www.pv-magazine.com",
      "www.solarpowerworldonline.com",
      "www.energysage.com",
      "www.cleanenergyreviews.info",
      "cdn.shopify.com",
      "www.jinko.com",
      "www.canadiansolar.com",
      "www.longi.com",
      "www.tesla.com",
      "www.growatt.com",
      "www.sma-sunny.com",
      "encrypted-tbn0.gstatic.com",
      "img.freepik.com",
      "www.freepik.com",
      "www.solaredge.com",
      "www.solarpanelsnetwork.com",
      "www.solartechnology.co.uk",
      "www.solarpowereurope.org",
      "www.solarreviews.com",
      "www.solarchoice.net.au",
      "www.solarpanelstore.com",
      "cdn.pixabay.com",
      "images.pexels.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
