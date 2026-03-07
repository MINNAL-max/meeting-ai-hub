import { NavLink } from "react-router-dom"

const Sidebar = ({ isSidebarOpen, closeSidebar }) => {

  const linkStyle =
    "block px-4 py-2 rounded-full bg-white/80 text-black font-medium hover:bg-white transition"

  const handleClick = () => {
    closeSidebar()
  }

  return (
    <>
      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm z-40"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white/5 backdrop-blur-xl
  z-50 transform transition-transform duration-500
  ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-6 text-xl font-bold text-white">
          MEETING HUB
        </div>

        <div className="flex flex-col gap-4 px-6">

          <NavLink to="/" className={linkStyle} onClick={handleClick}>
            DASHBOARD
          </NavLink>

          <NavLink to="/upload" className={linkStyle} onClick={handleClick}>
            UPLOAD
          </NavLink>

          <NavLink to="/meetings" className={linkStyle} onClick={handleClick}>
            MEETINGS
          </NavLink>

          <NavLink to="/sentiments" className={linkStyle} onClick={handleClick}>
            SENTIMENTS
          </NavLink>

          <NavLink to="/chat" className={linkStyle} onClick={handleClick}>
            CHAT
          </NavLink>

        </div>
      </div>
    </>
  )
}

export default Sidebar