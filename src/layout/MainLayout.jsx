import React, { useState } from "react"
import Sidebar from "./Sidebar"
import { Outlet } from "react-router-dom"
import bgImage from "../assets/a.jpg"
import { ToastContainer } from "react-toastify"

const MainLayout = () => {

  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat text-slate-200"
      style={{ backgroundImage: `url(${bgImage})` }}
    >

      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        closeSidebar={closeSidebar}
      />

      <div className="transition-all duration-300">

        {/* Navbar */}
        <div className="h-14 flex items-center justify-between px-6
        border-b border-white/10 bg-black/40 backdrop-blur-md">

          <button
            onClick={toggleSidebar}
            className="text-xl text-white"
          >
            ☰
          </button>

          <h1 className="text-lg font-bold tracking-widest text-white">
            MEETING <span className="text-blue-400">AI HUB</span>
          </h1>

        </div>

        <div className="p-6">
          <Outlet />
        </div>

      </div>

      <ToastContainer />

    </div>
  )
}

export default MainLayout