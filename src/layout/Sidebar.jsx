import React from "react"
import { NavLink } from "react-router-dom"

function NavItem({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `block px-4 py-3 rounded-lg text-sm font-medium transition
        ${isActive
          ? "bg-blue-600 text-white"
          : "text-slate-300 hover:bg-slate-800 hover:text-white"}`
      }
    >
      {label}
    </NavLink>
  )
}

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {

  return (
    <>
      {/* Background overlay */}
      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/40 z-40"
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed top-0 left-0 h-full w-64 bg-slate-900 text-slate-200
        transform transition-transform duration-300 ease-in-out z-50
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >

        <div className="p-6">

          <h1 className="text-lg font-bold mb-8 text-blue-500">
            Meeting Hub
          </h1>

          <nav className="flex flex-col space-y-3">

            <NavItem to="/" label="Dashboard" />
            <NavItem to="/upload" label="Upload" />
            <NavItem to="/meetings" label="Meetings" />
            <NavItem to="/sentiments" label="Sentiments" />
            <NavItem to="/chat" label="Chatbot" />

          </nav>

        </div>

      </div>
    </>
  )
}

export default Sidebar