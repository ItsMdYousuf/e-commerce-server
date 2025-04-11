"use client"; // Add this if using Next.js App Router

import { Command } from "cmdk"; // Command palette package
import {
  Bell, // Close icon
  LayoutDashboard,
  LifeBuoy, // For Support
  LogOut, // Example: For Theme Toggle
  Moon,
  Search,
  Settings, // Example command icon
  ShoppingBag,
  Sun,
  User, // Example command icon
  Users,
} from "lucide-react"; // Icon library
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

// Mock data/functions (replace with your actual logic)
const notifications = [
  { id: 1, text: "New order #1234 received.", time: "5m ago" },
  { id: 2, text: "User John Doe registered.", time: "1h ago" },
  { id: 3, text: "Stock low for Product XYZ.", time: "3h ago" },
];

const handleSignOut = () => {
  console.log("Signing out...");
  // Add your sign-out logic here
};

const goToSettings = () => {
  console.log("Navigating to settings...");
  // Add navigation logic here
};

const goToProfile = () => {
  console.log("Navigating to profile...");
  // Add navigation logic here
};

const DashboardHeader = ({ userName = "Md Yousuf" }) => {
  // State for command palette (search)
  const [openCommandPalette, setOpenCommandPalette] = useState(false);

  // State for dropdowns
  const [openProfileDropdown, setOpenProfileDropdown] = useState(false);
  const [openNotificationDropdown, setOpenNotificationDropdown] =
    useState(false);

  // Refs for closing dropdowns on outside click
  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  // State for theme (example)
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle command palette
  const toggleCommandPalette = useCallback(() => {
    setOpenCommandPalette((prev) => !prev);
  }, []);

  // Keyboard shortcut for command palette (Ctrl+K or Cmd+K)
  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleCommandPalette();
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [toggleCommandPalette]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setOpenProfileDropdown(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setOpenNotificationDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Toggle theme (example)
  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
    // Add logic to apply theme change (e.g., add/remove 'dark' class to html element)
    if (!isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    console.log("Toggling theme");
  };

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:px-6">
        {/* Left side: Search */}
        <div className="flex items-center gap-4">
          {/* Search Button */}
          <button
            onClick={toggleCommandPalette}
            className="flex items-center gap-2 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-500 transition-colors hover:border-gray-400 hover:text-gray-700 dark:border-gray-600 dark:text-gray-400 dark:hover:border-gray-500 dark:hover:text-gray-300"
            aria-label="Open command palette"
          >
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Search...</span>
            <kbd className="pointer-events-none hidden select-none items-center gap-1 rounded border border-gray-300 bg-gray-100 px-1.5 font-mono text-[10px] font-medium text-gray-600 opacity-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 sm:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>
        </div>

        {/* Right side: Theme Toggle, Notifications, Profile */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle Button (Example) */}
          <button
            onClick={toggleTheme}
            className="rounded-full p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          {/* Notification Dropdown */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setOpenNotificationDropdown((prev) => !prev)}
              className="relative rounded-full p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
              aria-label="Open notifications"
            >
              <Bell className="h-5 w-5" />
              {notifications.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {notifications.length}
                </span>
              )}
            </button>

            {/* Notification Panel */}
            <div
              className={`absolute right-0 top-full mt-2 w-72 origin-top-right rounded-md border border-gray-200 bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition-all duration-200 ease-out dark:border-gray-700 dark:bg-gray-800 ${
                openNotificationDropdown
                  ? "scale-100 transform opacity-100"
                  : "pointer-events-none scale-95 transform opacity-0"
              }`}
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="notification-button"
            >
              <div className="p-2">
                <h3 className="px-2 py-1 text-sm font-semibold text-gray-800 dark:text-gray-200">
                  Notifications
                </h3>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <a
                      key={notif.id}
                      href="#" // Replace with actual link
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      role="menuitem"
                    >
                      <p className="truncate">{notif.text}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {notif.time}
                      </p>
                    </a>
                  ))
                ) : (
                  <p className="px-4 py-3 text-center text-sm text-gray-500 dark:text-gray-400">
                    No new notifications
                  </p>
                )}
              </div>
              <div className="border-t border-gray-200 p-1 dark:border-gray-700">
                <a
                  href="#" // Replace with link to all notifications page
                  className="block rounded px-3 py-1.5 text-center text-sm font-medium text-blue-600 hover:bg-gray-100 dark:text-blue-400 dark:hover:bg-gray-700"
                  role="menuitem"
                >
                  View all
                </a>
              </div>
            </div>
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setOpenProfileDropdown((prev) => !prev)}
              className="flex items-center gap-2 rounded-full p-1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Open user menu"
              aria-haspopup="true"
              aria-expanded={openProfileDropdown}
            >
              {/* You can replace this with an Avatar component */}
              <User className="h-6 w-6 rounded-full bg-gray-200 p-0.5 text-gray-600 dark:bg-gray-600 dark:text-gray-300" />
              <span className="hidden text-sm font-medium text-gray-700 dark:text-gray-300 lg:block">
                {userName}
              </span>
            </button>

            {/* Profile Panel */}
            <div
              className={`absolute right-0 top-full mt-2 w-56 origin-top-right rounded-md border border-gray-200 bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition-all duration-200 ease-out dark:border-gray-700 dark:bg-gray-800 ${
                openProfileDropdown
                  ? "scale-100 transform opacity-100"
                  : "pointer-events-none scale-95 transform opacity-0"
              }`}
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="user-menu-button"
            >
              <div className="px-4 py-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Signed in as
                </p>
                <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                  {userName}
                </p>
              </div>
              <div className="py-1" role="none">
                <button
                  onClick={goToProfile}
                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  role="menuitem"
                >
                  <User className="mr-2 h-4 w-4" />
                  Your Profile
                </button>
                <button
                  onClick={goToSettings}
                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  role="menuitem"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </button>
                <a // Use anchor if it navigates
                  href="#" // Replace with actual support link
                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  role="menuitem"
                >
                  <LifeBuoy className="mr-2 h-4 w-4" />
                  Support
                </a>
              </div>
              <div
                className="border-t border-gray-100 py-1 dark:border-gray-700"
                role="none"
              >
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700"
                  role="menuitem"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Command Palette (Search Modal) */}
      <Command.Dialog
        open={openCommandPalette}
        onOpenChange={setOpenCommandPalette}
        label="Global Command Menu"
        // Apply Tailwind classes for styling the dialog
        className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] backdrop-blur-sm"
      >
        <div className="w-full max-w-lg overflow-hidden rounded-lg border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-800">
          <div className="relative">
            {/* Input field */}
            <Command.Input
              className="w-full border-b border-gray-200 bg-transparent px-4 py-3 pr-10 text-sm text-gray-900 placeholder-gray-500 focus:outline-none dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
              placeholder="Type a command or search..."
            />
            {/* Optional: Add a search icon inside the input */}
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>

          {/* List of commands */}
          <Command.List className="max-h-[40vh] overflow-y-auto p-2">
            <Command.Empty className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
              No results found.
            </Command.Empty>

            {/* Example Command Group */}
            <Command.Group
              heading="Navigation"
              className="px-2 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400"
            >
              <Command.Item
                onSelect={() => {
                  console.log("Navigate to Dashboard");
                  setOpenCommandPalette(false);
                }}
                className="flex cursor-pointer select-none items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 aria-selected:bg-gray-100 dark:text-gray-300 dark:aria-selected:bg-gray-700"
              >
                <LayoutDashboard className="h-4 w-4" />
                <Link to="/dashboard">Dashboard</Link>
              </Command.Item>
              <Command.Item
                onSelect={() => {
                  console.log("Navigate to Orders");
                  setOpenCommandPalette(false);
                }}
                className="flex cursor-pointer select-none items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 aria-selected:bg-gray-100 dark:text-gray-300 dark:aria-selected:bg-gray-700"
              >
                <ShoppingBag className="h-4 w-4" />
                <Link to="/dashboard/order">Orders</Link>
              </Command.Item>
              <Command.Item
                onSelect={() => {
                  console.log("Navigate to Customers");
                  setOpenCommandPalette(false);
                }}
                className="flex cursor-pointer select-none items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 aria-selected:bg-gray-100 dark:text-gray-300 dark:aria-selected:bg-gray-700"
              >
                <Users className="h-4 w-4" />
                Customers
              </Command.Item>
            </Command.Group>

            {/* Example Command Group */}
            <Command.Group
              heading="Settings"
              className="px-2 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400"
            >
              <Command.Item
                onSelect={() => {
                  goToProfile();
                  setOpenCommandPalette(false);
                }}
                className="flex cursor-pointer select-none items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 aria-selected:bg-gray-100 dark:text-gray-300 dark:aria-selected:bg-gray-700"
              >
                <User className="h-4 w-4" />
                Profile
              </Command.Item>
              <Command.Item
                onSelect={() => {
                  goToSettings();
                  setOpenCommandPalette(false);
                }}
                className="flex cursor-pointer select-none items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 aria-selected:bg-gray-100 dark:text-gray-300 dark:aria-selected:bg-gray-700"
              >
                <Settings className="h-4 w-4" />
                Account Settings
              </Command.Item>
              <Command.Item
                onSelect={() => {
                  toggleTheme();
                  setOpenCommandPalette(false);
                }}
                className="flex cursor-pointer select-none items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 aria-selected:bg-gray-100 dark:text-gray-300 dark:aria-selected:bg-gray-700"
              >
                {isDarkMode ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
                Toggle Theme
              </Command.Item>
            </Command.Group>

            {/* Add more Command.Item and Command.Group as needed */}
          </Command.List>

          {/* Optional: Footer for the command palette */}
          <div className="border-t border-gray-200 bg-gray-50 px-4 py-2 text-right text-xs text-gray-500 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-400">
            Press{" "}
            <kbd className="rounded border border-gray-300 bg-gray-100 px-1 font-mono text-[9px] dark:border-gray-600 dark:bg-gray-700">
              esc
            </kbd>{" "}
            to close.
          </div>
        </div>
        {/* Click outside to close */}
        <div
          className="fixed inset-0 -z-10"
          onClick={() => setOpenCommandPalette(false)}
        />
      </Command.Dialog>
    </>
  );
};

export default DashboardHeader;
