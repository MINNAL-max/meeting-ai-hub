import React from 'react'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <div className='flex min-h-screen bg-slate-950 text-slate-200'>
            <div className='w-60'><Sidebar /></div>
            <div className='p-8 flex-1'>
                <Outlet />
            </div>
        </div>
  )
}

export default MainLayout
