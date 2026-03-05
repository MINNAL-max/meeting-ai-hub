import React, { useState } from "react"
import Sidebar from "./Sidebar"
import { Outlet } from "react-router-dom"
import bgImage from "../assets/a.jpg"
import { ToastContainer } from "react-toastify"

const MainLayout = () => {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div
      className="h-screen text-slate-200 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgImage})` }}
    >

      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* Top Navbar */}
      <div className="h-14 flex items-center justify-between px-6 border-b border-slate-800 bg-black/40 backdrop-blur-sm">

        {/* Left - Hamburger */}
        <button
          onClick={toggleSidebar}
          className="text-xl text-white"
        >
          ☰
        </button>

        {/* Right - Title */}
        <h1 className="text-lg font-bold text-white tracking-widest">
          MEETING <span className="text-blue-400">AI HUB</span>
        </h1>

      </div>

      {/* Page Content */}
      <div className="p-6">
        <Outlet />
      </div>
      <ToastContainer/>

    </div>
  )
}

export default MainLayout