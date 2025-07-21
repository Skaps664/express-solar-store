/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    optimizePackageImports: ["@/components"],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  images: {
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
