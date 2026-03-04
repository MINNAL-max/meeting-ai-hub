import React from 'react'
import { NavLink } from 'react-router-dom';
const Sidebar = () => {
    function NavItem({ to, label }) {
        return (
            <NavLink
                to={to}
                className={({ isActive }) =>
                    `block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 
        ${isActive
                        ? "bg-blue-500 text-white shadow-md"
                        : "text-slate-300 hover:bg-slate-700 hover:text-white"
                    }`
                }
            >
                {label}
            </NavLink>
        );
    }
    return (
        <><div className="h-screen w-60 bg-slate-900 text-slate-200 fixed left-0 top-0 p-6">

            {/* Logo */}
            <h1 className="text-lg font-bold mb-8 text-blue-500">
                Meeting Hub
            </h1>

            {/* Navigation Links */}
            <nav className="flex flex-col space-y-3">
                <NavItem to="/" label="Dashboard" />
                <NavItem to="/upload" label="Upload" />
                <NavItem to="/meetings" label="Meetings" />
                <NavItem to="/sentiments" label="Sentiments" />
            </nav>

        </div></>


    )
}

export default Sidebar