import React from 'react'
import { Outlet } from 'react-router-dom'
import Footer from '../components/Footer/Footer'
import Sidebar from '../components/SIdebar/Sidebar'

const MainLayout = () => {
    return (
        <>
            <Sidebar/>
            <Outlet />
            <Footer/>
        </>
    )
}

export default MainLayout