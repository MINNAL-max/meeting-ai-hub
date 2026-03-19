import { NavLink } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { LayoutDashboard, UploadCloud, Video, Heart, MessageSquare } from "lucide-react"

const Sidebar = ({ isSidebarOpen, closeSidebar }) => {

  const linkStyle = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${isActive
      ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
      : "bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white"
    }`

  const handleClick = () => {
    // Only close sidebar on mobile (if we implement a proper responsive strategy, for now it matches old behavior)
    closeSidebar()
  }

  const navItems = [
    { name: "DASHBOARD", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "UPLOAD", path: "/upload", icon: <UploadCloud size={20} /> },
    { name: "MEETINGS", path: "/meetings", icon: <Video size={20} /> },
    { name: "SENTIMENTS", path: "/sentiments", icon: <Heart size={20} /> },
    { name: "CHAT", path: "/chat", icon: <MessageSquare size={20} /> },
  ]

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm z-40 lg:hidden"
            onClick={closeSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ x: isSidebarOpen ? 0 : "-100%" }}
        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
        className="fixed top-0 left-0 h-full w-72 bg-gray-900/90 backdrop-blur-xl border-r border-white/10 z-50 flex flex-col shadow-2xl"
      >
        <div className="p-8 text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 tracking-wider">
          MEETING<span className="text-white">HUB</span>
        </div>

        <div className="flex flex-col gap-3 px-6 pb-6 overflow-y-auto">
          {navItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={linkStyle}
              onClick={handleClick}
            >
              {item.icon}
              <span className="tracking-wide">{item.name}</span>
            </NavLink>
          ))}
        </div>
      </motion.div>
    </>
  )
}

export default Sidebar