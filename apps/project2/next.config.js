/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 添加以下配置
  experimental: {
    // 这将抑制水合错误警告
    suppressHydrationWarning: true,
  },
  // 禁用错误覆盖层和指示器
  devIndicators: {
    buildActivity: true,
    buildActivityPosition: 'bottom-left',
  },
  // 启动端口
  serverRuntimeConfig: {
    port: 3001, 
  }
}

module.exports = nextConfig
