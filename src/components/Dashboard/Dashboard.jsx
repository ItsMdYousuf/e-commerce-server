import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import Footer from '../Footer/Footer'
import Header from '../Header/Header'

const Dashboard = () => {
   return (
      <div className="flex">
         {/* Sidebar */}
         <aside className="w-[250px] min-h-screen bg-gray-50">
            {/* logo */}
            <div className="border-b-2 p-2 border-purple-400">
               <Link to="/">
                  <h1 className="text-xl font-semibold">E-Commerce App</h1>
               </Link>
            </div>
            {/* sidebar nav */}
            <div className="flex pl-3 flex-col gap-3"> 
               <Link to="addProduct">Add Product</Link>
               <Link to="blogPost">Blog Post</Link>
               <Link to="collection">Collection</Link>
               <Link to="message">Message</Link>
            </div>
         </aside>

         {/*  Nested Routes */}
         <main className='flex-1'> 
            <Header />
            <div className='  bg-slate-200 h-screen'>
            <Outlet />  
            </div>
            <Footer />
         </main>
      </div>
   )
}

export default Dashboard
