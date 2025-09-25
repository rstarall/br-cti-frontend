/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['@ant-design/icons', '@ant-design/icons-svg', 'antd', '@ant-design/cssinjs'],
  webpack: (config) => {
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://172.22.232.42:8006/:path*'
      }
    ];
  },
  devIndicators: {
    buildActivity: true,
    buildActivityPosition: 'bottom-right',
  },
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000,
    pagesBufferLength: 5,
  },
  modularizeImports: {
    antd: {
      transform: 'antd/lib/{{member}}',
      skipDefaultConversion: true
    }
  },
  experimental: {
    optimizePackageImports: ['antd']
  }
};

module.exports = nextConfig; 