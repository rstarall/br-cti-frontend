const { defineConfig } = require('@vue/cli-service')
const { name } = require('./package.json')

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  publicPath: process.env.NODE_ENV === 'production' ? '/data-view/' : '/',
  devServer: {
    client: {
      overlay: true
    },
    port: 8081,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  configureWebpack: {
    output: {
      library: `data-view`,
      libraryTarget: 'umd',
      chunkLoadingGlobal: `webpackJsonp_data-view`
    }
  }
})
