const { i18n } = require('./next-i18next.config');

/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n,
  output: 'standalone', // 改为standalone模式以支持服务端渲染
  images: {
    unoptimized: true
  },
  // 配置代理,类似vite
  async rewrites() {
    return [
      {
        source: '/data-view/:path*', 
        destination: 'http://localhost:8081/:path*'
      }
    ]
  }
}

module.exports = nextConfig