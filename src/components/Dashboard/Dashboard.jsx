"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronRight,
  ExternalLink,
  FileText,
  LayoutDashboard,
  Library,
  ListOrdered,
  Menu,
  MessageSquare,
  ShoppingBag,
  Image as SliderIcon,
  Tags,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

// Components
import Footer from "../Footer/Footer";
import Header from "../Header/Header";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openMenus, setOpenMenus] = useState({}); // Dynamic state for multiple dropdowns
  const location = useLocation();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const toggleMenu = (name) => {
    if (!isSidebarOpen) setIsSidebarOpen(true);
    setOpenMenus((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const sidebarItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/dashboard",
    },
    {
      name: "Slider",
      icon: <SliderIcon size={20} />,
      path: "/dashboard/slider",
    },
    {
      name: "Products",
      icon: <ShoppingBag size={20} />,
      path: "/dashboard/products",
      hasDropdown: true,
      subItems: [
        { name: "Add New Product", path: "/dashboard/products/addNewProduct" },
        { name: "Manage Products", path: "/dashboard/products/manageProducts" },
      ],
    },
    {
      name: "Orders",
      icon: <ListOrdered size={20} />,
      path: "/dashboard/order",
    },
    { name: "Category", icon: <Tags size={20} />, path: "/dashboard/category" },
    {
      name: "Blog Post",
      icon: <FileText size={20} />,
      path: "/dashboard/blogPost",
    },
    {
      name: "Collection",
      icon: <Library size={20} />,
      path: "/dashboard/collection",
    },
    {
      name: "Message",
      icon: <MessageSquare size={20} />,
      path: "/dashboard/message",
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      {/* SIDEBAR */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="relative z-50 flex flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between px-4">
          <AnimatePresence transition={{ duration: 0.1 }}>
            {isSidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                  <ShoppingBag size={18} />
                </div>
                <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">
                  NexusStore
                </span>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={toggleSidebar}
            className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.path;
            const isMenuOpen = openMenus[item.name];

            return (
              <div key={item.name} className="mb-1">
                {item.hasDropdown ? (
                  <>
                    <button
                      onClick={() => toggleMenu(item.name)}
                      className={`group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                        isMenuOpen
                          ? "bg-zinc-50 text-indigo-600 dark:bg-zinc-800 dark:text-indigo-400"
                          : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={
                            isMenuOpen
                              ? "text-indigo-600"
                              : "text-zinc-400 group-hover:text-zinc-900"
                          }
                        >
                          {item.icon}
                        </span>
                        {isSidebarOpen && <span>{item.name}</span>}
                      </div>
                      {isSidebarOpen && (
                        <ChevronRight
                          size={16}
                          className={`transition-transform duration-200 ${isMenuOpen ? "rotate-90" : ""}`}
                        />
                      )}
                    </button>

                    <AnimatePresence>
                      {isMenuOpen && isSidebarOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="ml-9 mt-1 space-y-1 border-l-2 border-zinc-100 py-1 dark:border-zinc-800">
                            {item.subItems.map((sub) => (
                              <Link
                                key={sub.path}
                                to={sub.path}
                                className={`block px-4 py-2 text-xs font-medium transition-colors ${
                                  location.pathname === sub.path
                                    ? "text-indigo-600 dark:text-indigo-400"
                                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
                                }`}
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <Link
                    to={item.path}
                    className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                      isActive
                        ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400"
                        : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                    }`}
                  >
                    <span
                      className={
                        isActive
                          ? "text-indigo-600"
                          : "text-zinc-400 group-hover:text-zinc-900"
                      }
                    >
                      {item.icon}
                    </span>
                    {isSidebarOpen && <span>{item.name}</span>}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            <ExternalLink size={18} />
            {isSidebarOpen && <span>Live Preview</span>}
          </Link>
        </div>
      </motion.aside>

      {/* MAIN CONTENT AREA */}
      <div className="relative flex flex-1 flex-col overflow-y-auto">
        <Header />

        <main className="flex-1 p-6 lg:p-10">
          <div className="mx-auto max-w-7xl">
            {/* Breadcrumb or Page Header can go here */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold capitalize text-zinc-900 dark:text-white">
                {location.pathname.split("/").pop() || "Dashboard"}
              </h2>
              <p className="text-sm text-zinc-500">
                Manage your store activities and data.
              </p>
            </div>

            <Outlet />
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;
