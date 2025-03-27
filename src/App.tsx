import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HeaderLayout } from './layouts/headerLayout'
import { MainLayout } from './layouts/mainLayout'
import { FooterLayout } from './layouts/footerLayout'
import { Index } from './pages/index'
import { CtiMarket } from './pages/ctiMarket'
import { KnowledgePlane } from './pages/knowlegePlane'
import { BcBrowser } from './pages/bcBrowser'
import './App.css'
import { WindowManagerProvider } from '@/context/WindowManager'
import { MessageProvider } from './context/MessageProvider';
import Sidebar from '@/layouts/sidebar'
import { LoadingProvider } from '@/context/LoadingProvider';
const App: React.FC = () => {
  return (
    <LoadingProvider>
      <MessageProvider>
        <WindowManagerProvider>
          <Sidebar />
        <BrowserRouter>
          <HeaderLayout />
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Index />} />
              <Route path="cti-market" element={<CtiMarket />} />
              <Route path="knowledge-plane" element={<KnowledgePlane />} />
              <Route path="block-browser" element={<BcBrowser />} />
            </Route>
          </Routes>
          <FooterLayout />
        </BrowserRouter>
      </WindowManagerProvider>
    </MessageProvider>
    </LoadingProvider>
  )
}

export default App
