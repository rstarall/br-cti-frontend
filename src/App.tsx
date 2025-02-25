import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HeaderLayout } from './layouts/headerLayout'
import { MainLayout } from './layouts/mainLayout'
import { FooterLayout } from './layouts/footerLayout'
import { Index } from './pages/index'
import { CtiMarket } from './pages/ctiMarket'
import './App.css'


function App() {
  return (
    <BrowserRouter>
      <HeaderLayout />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Index />} />
          <Route path="cti-market" element={<CtiMarket />} />
        </Route>
      </Routes>
      <FooterLayout />
    </BrowserRouter>
  )
}

export default App
