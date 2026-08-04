import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
  /* async redirects() {
      return[
        {
          source: '/',
          destination:'/id/',
          permanent: true,
        }
      ]
  }, */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.tvku.tv',
        port: '',
        pathname: '/**',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'apidev.tvku.tv',
        port: '',
        pathname: '/**',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'storage.tvku.tv',
        port: '',
        pathname: '/**',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'tvku.tv',
        port: '',
        pathname: '/**',
        search: '',
      },
    ],
  }
};


export default nextConfig;
