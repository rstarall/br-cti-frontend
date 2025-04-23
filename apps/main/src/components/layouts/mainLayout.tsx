"use client"
import Sidebar from "./sidebar";
export const MainLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return (
    <div>
      <div className="flex justify-start items-center min-h-screen">
        {children}
        <Sidebar/>
      </div>
    </div>
  )
}
