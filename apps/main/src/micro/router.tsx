import { createBrowserRouter, RouteObject } from 'react-router-dom'

// 定义路由
const routes: RouteObject[] = [
  {
    path: '/',
    element: <div/>
  },
  {
    path: '/*',  // 通配符路由
    element: <div />  // 空元素，确保子应用路由不会被主应用拦截
  }
]

// 创建路由实例
const router = createBrowserRouter(routes)

export default router
