import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  // 在这里添加你的路由配置
  {
    path: '/',
    component: () => import('@/App.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router 