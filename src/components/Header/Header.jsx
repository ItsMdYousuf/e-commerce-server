import React, { useEffect, useRef, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { IoMdNotificationsOutline } from "react-icons/io";
import Input from "../Input";

const Header = () => {
  const [toggleDropDown, setToggleDropDown] = useState(false); // for avatar
  const [toggleNotification, setToggleNotification] = useState(false); // for notification

  const dropDownRef = useRef(null); // for outSide click to close menu
  const notificationRef = useRef(null); // for outSide click to close menu

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
        setToggleDropDown(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setToggleNotification(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white px-3 py-2">
      <div className="flex items-center">
        {/* Search bar */}
        <div>
          <Input
            placeholder="ctrl + k"
            className="rounded-md border-[1px] px-[5px] py-[3px] pl-8"
          />
        </div>

        {/* Header menus */}
        <div className="flex w-full justify-end gap-5">
          {/* Notification */}
          <div
            ref={notificationRef}
            onClick={() => setToggleNotification((prev) => !prev)}
            className="relative mt-2 cursor-pointer select-none"
          >
            <span>
              <IoMdNotificationsOutline className="text-xl" />
            </span>
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 p-2 text-white">
              2
            </span>
            <div
              className={`absolute right-0 top-12 w-[12rem] cursor-pointer rounded-lg bg-white px-5 py-3 shadow-lg transition-all duration-300 ease-in-out ${
                toggleNotification
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none -translate-y-5 opacity-0"
              }`}
            >
              <ul className="w-auto">
                <li>Latest product</li>
                <li>Hot product</li>
                <li>UpComing product</li>
                <li>Combo product</li>
              </ul>
            </div>
          </div>

          {/* Avatar */}
          <div
            ref={dropDownRef}
            onClick={() => setToggleDropDown((prev) => !prev)}
            className="w-34 relative cursor-pointer select-none rounded-md px-3 py-2 transition-all duration-150 ease-in-out hover:bg-gray-100"
          >
            <div className="flex items-center gap-3">
              <CgProfile className="text-2xl" />
              <h2 className="text-sm font-bold">Md Yousuf</h2>
            </div>
            <div
              className={`absolute right-0 top-14 w-[14rem] rounded-lg bg-white px-5 py-3 shadow-xl transition-all duration-300 ease-in-out ${
                toggleDropDown
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none -translate-y-5 opacity-0"
              }`}
            >
              <p>Name: Yousuf</p>
              <p>Setting</p>
              <p>Team Support</p>
              <p>Report</p>
              <p>Sign Out</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
