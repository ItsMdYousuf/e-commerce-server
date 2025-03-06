import React, { useState } from "react";
import { BsCollection } from "react-icons/bs";
import { FiChevronDown, FiChevronUp, FiMenu } from "react-icons/fi";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import {
  RiBloggerLine,
  RiMessage3Line,
  RiProductHuntLine,
} from "react-icons/ri";
import { TbCategory2 } from "react-icons/tb";
import { TfiLayoutSliderAlt } from "react-icons/tfi";
import { Link, Outlet, useLocation } from "react-router-dom";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false); // State for dropdown
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const toggleProductDropdown = () => {
    setIsProductDropdownOpen((prev) => !prev);
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
      name: "Products",
      icon: <RiProductHuntLine />,
      path: "/dashboard/products",
      hasDropdown: true, // Indicates this item has a dropdown
      subItems: [
        { name: "Add New Product", path: "/dashboard/products/addNewProduct" },
        { name: "Manage Products", path: "/dashboard/products/manageProducts" },
      ],
    },
    { name: "Category", icon: <TbCategory2 />, path: "/dashboard/category" },
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
          isSidebarOpen ? "w-[250px]" : "w-[60px]"
        } flex h-screen flex-col bg-gray-50 transition-all duration-300 ease-in-out`}
      >
        {/* Sidebar Header */}
        <div className="flex shrink-0 items-center justify-between border-b-2 border-purple-400 p-2">
          <button
            onClick={toggleSidebar}
            className="rounded-md bg-purple-500 p-2 text-white"
          >
            <FiMenu className="text-xl" />
          </button>
          {isSidebarOpen && (
            <Link to="/">
              <h1 className="text-md font-semibold">E-Commerce App</h1>
            </Link>
          )}
        </div>

        {/* Scrollable Nav Items */}
        <div className="flex-1 overflow-y-auto">
          <div
            className={`mt-3 flex flex-col gap-3 ${
              !isSidebarOpen
                ? "items-center justify-center"
                : "justify-start px-5"
            }`}
          >
            {sidebarItems.map((item) => (
              <div key={item.path}>
                {/* Main Item */}
                <div
                  onClick={item.hasDropdown ? toggleProductDropdown : undefined}
                  className={`flex items-center justify-between gap-3 rounded-md px-2 py-2 ${
                    location.pathname === item.path
                      ? "bg-purple-500 text-white"
                      : "text-gray-700 hover:bg-gray-200"
                  } ${item.hasDropdown ? "cursor-pointer" : ""}`}
                >
                  <Link
                    to={item.path}
                    className="flex flex-1 items-center gap-3"
                  >
                    {item.icon}
                    {isSidebarOpen && <span>{item.name}</span>}
                  </Link>

                  {/* Dropdown Icon */}
                  {item.hasDropdown && isSidebarOpen && (
                    <span>
                      {isProductDropdownOpen ? (
                        <FiChevronUp />
                      ) : (
                        <FiChevronDown />
                      )}
                    </span>
                  )}
                </div>

                {/* Dropdown Items */}
                {item.hasDropdown && isProductDropdownOpen && isSidebarOpen && (
                  <div className="ml-5 mt-2 flex flex-col gap-2">
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.path}
                        to={subItem.path}
                        className={`flex items-center gap-3 rounded-md px-2 py-2 ${
                          location.pathname === subItem.path
                            ? "bg-purple-500 text-white"
                            : "text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {isSidebarOpen && <span>{subItem.name}</span>}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
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
