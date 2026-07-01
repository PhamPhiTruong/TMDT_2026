const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'bizweb.dktcdn.net',
      },
    ],
  },
  allowedDevOrigins: ['192.168.1.7'],
};

export default nextConfig;