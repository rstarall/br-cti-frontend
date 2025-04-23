'use client' // 必须标记为客户端组件

import { useEffect } from 'react'
import { registerMicroApps, start } from 'qiankun'

export default function MicroAppPage() {
  useEffect(() => {
    registerMicroApps([
      {
        name: 'data-view',
        entry: process.env.NODE_ENV === 'development' 
          ? '//localhost:8081' 
          : '/data-view',
        container: '#subapp-container',
        activeRule: '/data-view',
      }
    ])

    start({
      sandbox: {
        experimentalStyleIsolation: true, // 样式沙箱
        strictStyleIsolation: false
      }
    })
  }, [])

  return (
    <div className="container">
      <div id="subapp-container" style={{ height: '100vh' }} />
    </div>
  )
}