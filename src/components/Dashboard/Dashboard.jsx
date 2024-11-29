import React, { useState } from "react";
import { BsCollection } from "react-icons/bs";
import { FiMenu } from "react-icons/fi";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import {
  RiBloggerLine,
  RiMessage3Line,
  RiProductHuntLine,
} from "react-icons/ri";
import { TfiLayoutSliderAlt } from "react-icons/tfi";
import { Link, Outlet, useLocation } from "react-router-dom";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  // Sidebar items
  const sidebarItems = [
    {
      name: "Dashboard",
      icon: <MdOutlineSpaceDashboard />,
      path: "/dashboard",
    },
    {
      name: "Add Slider",
      icon: <TfiLayoutSliderAlt />,
      path: "/dashboard/slider",
    },
    {
      name: "Add Product",
      icon: <RiProductHuntLine />,
      path: "/dashboard/addProduct",
    },
    { name: "Blog Post", icon: <RiBloggerLine />, path: "/dashboard/blogPost" },
    {
      name: "Collection",
      icon: <BsCollection />,
      path: "/dashboard/collection",
    },
    { name: "Message", icon: <RiMessage3Line />, path: "/dashboard/message" },
  ];

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-[200px]" : "w-[60px]"
        } min-h-screen bg-gray-50 transition-all duration-300 ease-in-out`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between border-b-2 border-purple-400 p-2">
          <button
            onClick={toggleSidebar}
            className="rounded-md bg-purple-500 p-2 text-white"
          >
            <FiMenu className="text-xl" />
          </button>
          {isSidebarOpen && (
            <Link to="/">
              <h1 className="text-xl font-semibold">E-Commerce App</h1>
            </Link>
          )}
        </div>

        {/* Sidebar Nav */}
        <div
          className={`mt-3 flex flex-col gap-3 ${
            !isSidebarOpen
              ? "items-center justify-center"
              : "justify-start px-5"
          }`}
        >
          {sidebarItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 rounded-md px-2 py-2 ${
                location.pathname === item.path
                  ? "bg-purple-500 text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              {item.icon}
              {isSidebarOpen && <span>{item.name}</span>}
            </Link>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Header */}
        <Header />
        <div className="min-h-screen bg-slate-100">
          <Outlet />
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default Dashboard;
