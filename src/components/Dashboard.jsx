import React from 'react'
import { Link, Outlet } from 'react-router-dom'

const Dashboard = () => {
   return (
      <div className="flex">
         {/* Sidebar */}
         <aside className="w-[250px] min-h-screen bg-sky-300">
            <div className="border-b-2 p-2 border-purple-400">
               <Link to="/">
                  <h1 className="text-xl font-semibold">E-Commerce App</h1>
               </Link>
            </div>
            <div className="flex pl-3 flex-col gap-3">
               <Link to="addProduct">Add Product</Link>
               <Link to="blogPost">Blog Post</Link>
               <Link to="collection">Collection</Link>
               <Link to="message">Message</Link>
            </div>
         </aside>

         {/* Main Content Area for Nested Routes */}
         <main className="flex-1 p-4">
            <Outlet /> {/* Renders the nested route component */}
         </main>
      </div>
   )
}

export default Dashboard
