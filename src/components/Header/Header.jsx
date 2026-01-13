"use client";

import { Command } from "cmdk";
import { AnimatePresence, motion } from "framer-motion"; // Add this for smooth transitions
import {
  Bell,
  ChevronDown,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Moon,
  Search,
  Settings,
  ShoppingBag,
  Sun,
  User,
  Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

// Mock Data
const notifications = [
  { id: 1, text: "New order #1234 received.", time: "5m ago", unread: true },
  { id: 2, text: "User John Doe registered.", time: "1h ago", unread: false },
  { id: 3, text: "Stock low for Product XYZ.", time: "3h ago", unread: false },
];

const DashboardHeader = ({
  userName = "Md Yousuf",
  userEmail = "yousuf@example.com",
}) => {
  const [openCommandPalette, setOpenCommandPalette] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  // --- Handlers ---
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  // Close dropdowns on click outside
  useEffect(() => {
    const closeAll = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setOpenProfile(false);
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target)
      )
        setOpenNotifications(false);
    };
    document.addEventListener("mousedown", closeAll);
    return () => document.removeEventListener("mousedown", closeAll);
  }, []);

  // Keyboard Shortcut
  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpenCommandPalette((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* LEFT: Search Trigger */}
          <div className="flex flex-1 items-center">
            <button
              onClick={() => setOpenCommandPalette(true)}
              className="group flex items-center gap-3 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm text-zinc-500 transition-all hover:border-zinc-300 hover:bg-white hover:ring-4 hover:ring-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:ring-zinc-900/50"
            >
              <Search className="h-4 w-4 transition-colors group-hover:text-indigo-500" />
              <span className="hidden lg:inline">Search anything...</span>
              <kbd className="ml-8 hidden items-center gap-1 rounded border border-zinc-200 bg-white px-1.5 font-mono text-[10px] font-medium text-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 sm:flex">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="rounded-full p-2 text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setOpenNotifications(!openNotifications)}
                className="relative rounded-full p-2 text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute right-2 top-2 flex h-2 w-2 rounded-full bg-indigo-600 ring-2 ring-white dark:ring-zinc-950" />
              </button>

              <AnimatePresence>
                {openNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-3 w-80 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    <div className="border-b border-zinc-100 p-4 dark:border-zinc-800">
                      <h3 className="text-sm font-semibold">Notifications</h3>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className="group cursor-pointer border-b border-zinc-50 p-4 transition-colors hover:bg-zinc-50 dark:border-zinc-800/50 dark:hover:bg-zinc-800/50"
                        >
                          <p
                            className={`text-sm ${n.unread ? "font-medium text-zinc-900 dark:text-zinc-100" : "text-zinc-600 dark:text-zinc-400"}`}
                          >
                            {n.text}
                          </p>
                          <span className="text-[11px] text-zinc-400">
                            {n.time}
                          </span>
                        </div>
                      ))}
                    </div>
                    <Link
                      to="/notifications"
                      className="block p-3 text-center text-xs font-medium text-indigo-600 hover:bg-zinc-50 dark:text-indigo-400 dark:hover:bg-zinc-800"
                    >
                      View all notifications
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setOpenProfile(!openProfile)}
                className="flex items-center gap-2 rounded-full border border-zinc-200 p-1 pr-3 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-xs font-bold text-white">
                  {userName.charAt(0)}
                </div>
                <span className="hidden text-sm font-medium text-zinc-700 dark:text-zinc-300 lg:block">
                  {userName}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-zinc-400 transition-transform ${openProfile ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {openProfile && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-56 origin-top-right rounded-xl border border-zinc-200 bg-white p-1.5 shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    <div className="px-3 py-2">
                      <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                        Account
                      </p>
                      <p className="truncate text-sm font-semibold text-zinc-900 dark:text-white">
                        {userEmail}
                      </p>
                    </div>
                    <div className="my-1 h-px bg-zinc-100 dark:bg-zinc-800" />
                    <DropdownItem icon={<User size={16} />} label="Profile" />
                    <DropdownItem
                      icon={<Settings size={16} />}
                      label="Settings"
                    />
                    <DropdownItem
                      icon={<LifeBuoy size={16} />}
                      label="Support"
                    />
                    <div className="my-1 h-px bg-zinc-100 dark:bg-zinc-800" />
                    <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                      <LogOut size={16} /> Sign out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* COMMAND PALETTE (Search Modal) */}
      <AnimatePresence>
        {openCommandPalette && (
          <Command.Dialog
            open={openCommandPalette}
            onOpenChange={setOpenCommandPalette}
            label="Global Menu"
            className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-2xl overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex items-center border-b border-zinc-200 px-4 dark:border-zinc-800">
                <Search className="h-5 w-5 text-zinc-400" />
                <Command.Input
                  placeholder="What are you looking for?"
                  className="h-14 w-full bg-transparent px-4 text-sm outline-none dark:text-white"
                />
              </div>

              <Command.List className="max-h-[300px] overflow-y-auto p-2">
                <Command.Empty className="py-10 text-center text-sm text-zinc-500">
                  No results found for that query.
                </Command.Empty>

                <CommandGroup heading="Navigation">
                  <CommandItem
                    icon={<LayoutDashboard size={18} />}
                    label="Dashboard"
                  />
                  <CommandItem
                    icon={<ShoppingBag size={18} />}
                    label="Orders"
                  />
                  <CommandItem icon={<Users size={18} />} label="Customers" />
                </CommandGroup>
              </Command.List>

              <div className="flex items-center justify-between border-t border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/50">
                <p className="text-[11px] text-zinc-400">
                  Use <span className="font-bold">↑↓</span> to navigate,{" "}
                  <span className="font-bold">↵</span> to select
                </p>
                <button
                  onClick={() => setOpenCommandPalette(false)}
                  className="rounded border border-zinc-200 bg-white px-2 py-1 text-[10px] font-medium text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800"
                >
                  ESC
                </button>
              </div>
            </motion.div>
            <div
              className="fixed inset-0 -z-10 bg-zinc-900/20 backdrop-blur-sm"
              onClick={() => setOpenCommandPalette(false)}
            />
          </Command.Dialog>
        )}
      </AnimatePresence>
    </>
  );
};

// Helper Components for Cleaner Code
const DropdownItem = ({ icon, label }) => (
  <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100">
    {icon} {label}
  </button>
);

const CommandGroup = ({ heading, children }) => (
  <Command.Group
    heading={heading}
    className="px-2 py-2 text-[11px] font-medium uppercase tracking-wider text-zinc-400"
  >
    {children}
  </Command.Group>
);

const CommandItem = ({ icon, label }) => (
  <Command.Item className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-3 text-sm text-zinc-700 transition-colors aria-selected:bg-indigo-600 aria-selected:text-white dark:text-zinc-300">
    {icon} {label}
  </Command.Item>
);

export default DashboardHeader;
