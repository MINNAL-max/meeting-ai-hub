import React, { useState } from "react"
import Sidebar from "./Sidebar"
import { Outlet, useLocation } from "react-router-dom"
import bgImage from "../assets/a.jpg"
import { ToastContainer } from "react-toastify"
import { motion, AnimatePresence } from "framer-motion"
import { Menu } from "lucide-react"

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const location = useLocation()

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  return (
    <div
      className="min-h-screen text-slate-200 overflow-x-hidden flex bg-transparent"
    >
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        closeSidebar={closeSidebar}
      />

      {/* Main content area */}
      <div
        className={`transition-all duration-500 min-h-screen flex flex-col flex-1 ${isSidebarOpen ? 'lg:pl-72' : 'lg:pl-0'}`}
      >
        {/* Navbar */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/10 bg-black/40 backdrop-blur-md sticky top-0 z-30">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
          >
            <Menu size={24} />
          </button>

          <h1 className="text-xl font-black tracking-widest text-white">
            MEETING <span className="text-blue-400">AI HUB</span>
          </h1>
        </div>

        {/* Page Content */}
        <div className="flex-1 p-6 relative overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-full h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <ToastContainer theme="dark" position="bottom-right" />
    </div>
  )
}

export default MainLayout