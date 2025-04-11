/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https', // Use 'https' since the URL is HTTPS
        hostname: 'i.pravatar.cc', // Specific hostname
        port: '', // Leave empty unless a specific port is used
        pathname: '/**', // Allow any path under this domain
      },
    ],
  },
}

export default nextConfig
