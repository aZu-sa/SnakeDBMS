const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      fallback: {
        crypto: false,
        stream: false,
        timers: false,
        zlib: false
      }
    }
  },
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true
    }
  }
})
