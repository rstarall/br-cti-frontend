import { Outlet } from 'react-router-dom'
import '../styles/main.css'

export const MainLayout = () => {
  return (
    <div>
      <div className="main-layout">
        <Outlet />
      </div>
    </div>
  )
}
