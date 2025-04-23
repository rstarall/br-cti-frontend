import { registerMicroApps, start, initGlobalState } from 'qiankun'
import router from './router'

// 初始化全局状态
export const { onGlobalStateChange, setGlobalState } = initGlobalState({
  user: null,
  token: ''
})

export const registerApps = () => {
  registerMicroApps([
    {
      name: 'vite-app',
      entry: import.meta.env.DEV ? '//localhost:3001' : '/vite-app/',
      container: '#sub-container',
      activeRule: '/vite',
      props: {
        mainRouter: router,
        mainState: { onGlobalStateChange, setGlobalState }
      }
    },
    {
      name: 'next-app',
      entry: import.meta.env.DEV ? '//localhost:3002' : '/next-app/',
      container: '#sub-container',
      activeRule: '/next',
      props: {
        mainRouter: router,
        mainState: { onGlobalStateChange, setGlobalState }
      }
    },
    {
      name: 'vue-app',
      entry: import.meta.env.DEV ? '//localhost:3003' : '/vue-app/',
      container: '#sub-container',
      activeRule: '/vue',
      props: {
        mainRouter: router,
        mainState: { onGlobalStateChange, setGlobalState }
      }
    }
    // 其他子应用配置...
  ])

  start({
    sandbox: {
      experimentalStyleIsolation: true // 开启样式隔离
    },
    prefetch: 'all' // 预加载所有子应用
  })
}