"use client";
import { useTheme } from "next-themes";
import { useGetUserByIdQuery } from "../store/api";
import { useLogoutMutation } from "../store/api";
// import tippy from "tippy.js";
// import "tippy.js/dist/tippy.css";
// import { Tooltip } from "react-tooltip";
// import "react-tooltip/dist/react-tooltip.css";
//icons
import { MdAccountCircle } from "react-icons/md";

import { IoIosNotifications } from "react-icons/io";
import { GoSidebarExpand } from "react-icons/go";
import { GoSidebarCollapse } from "react-icons/go";
import { IoIosArrowDown } from "react-icons/io";
import { GoPerson } from "react-icons/go";
import { IoLogOutOutline } from "react-icons/io5";

import { FaRegMoon } from "react-icons/fa";
import { MdOutlineWbSunny } from "react-icons/md";
import { useState } from "react";
import type { RefObject } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import Input from "./SearchInput";
import Image from "next/image";
import Link from "next/link";

// import Link from "next/link";
//? const { scrollY } = useScroll(); (Default Watch window / document scroll)

type Props = {
  scrollContainer: RefObject<HTMLElement | null>;
  setSidebarState: (sidebarState: boolean) => void;
  sidebarState: boolean;
};

const Navbar = ({ scrollContainer, setSidebarState, sidebarState }: Props) => {
  const [logout] = useLogoutMutation();

  const [profileToggle, setProfileToggle] = useState(false);

  const { resolvedTheme, setTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);

  const { scrollY } = useScroll({
    container: scrollContainer,
  });

  useMotionValueEvent(scrollY, "change", (scrollValue) => {
    setIsScrolled(scrollValue > 50);
  });

  const { data } = useGetUserByIdQuery();
  const { user } = data ?? {};

  if (!user) return <div>User Not Found</div>;

  return (
    <div
      className={`duration-500 ${
        isScrolled
          ? "bg-mainBackground/85 shadow-md backdrop-blur-[3px]"
          : "bg-transparent"
      } w-full sticky top-0 z-50 flex items-center justify-between px-4 py-3`}
    >
      <button
        className="cursor-pointer"
        onClick={() => {
          setSidebarState(!sidebarState);
        }}
      >
        {sidebarState ? (
          <GoSidebarExpand size={25} id="close" />
        ) : (
          <GoSidebarCollapse size={25} id="open" />
        )}
      </button>
      <div className={`flex items-center space-x-3 md:space-x-5`}>
        <Input type={"text"} placeholder={"Search..."} />
        {/* <div className={`tabsStyle`}>
          <IoIosNotifications className="icons" />
        </div> */}
        <button
          className={`tabsStyle`}
          onClick={() => {
            setTheme(resolvedTheme === "dark" ? "light" : "dark");
          }}
        >
          <FaRegMoon className="hidden dark:block" />
          <MdOutlineWbSunny className="block dark:hidden" />
        </button>
        <div
          // href={"/profile"}
          id="profile"
          // data-tooltip-id="profile"
          // data-tooltip-content={user.username}
          // data-tooltip-place="bottom-start"
          className={`tabsStyle cursor-default! p-1! inset-0 relative flex items-center space-x-1`}
          // onClick={() => {
          //   setProfileToggle((prev) => !prev);
          // }}
          onMouseEnter={() => {
            setProfileToggle(true);
          }}
          onMouseLeave={() => {
            setProfileToggle(false);
          }}
        >
          {user.profilePictureUrl ? (
            <Image
              src={`/${user?.profilePictureUrl}`}
              alt=""
              width={20}
              height={20}
              className="w-6 h-6 object-cover rounded-full"
            />
          ) : (
            <MdAccountCircle className="icons" />
          )}
          <IoIosArrowDown size={12} />
          {profileToggle && (
            <div
              className={`absolute min-w-fit p-3 min-h-fit bg-mainBackground border border-mainBorder top-full right-0 rounded-xl z-50`}
            >
              <div className="flex flex-col border-b pb-2 mb-2 border-mainBorder/80 cursor-auto">
                <span className="font-medium text-[14px]">{user.username}</span>
                <span className="text-xs text-gray-500">{user.email}</span>
              </div>
              <div className="border-b border-mainBorder/80">
                <Link
                  href={"/profile"}
                  className="duration-300 flex w-full items-center space-x-2 hover:bg-primary-light-hover px-1 py-2 rounded-lg mb-1"
                >
                  <GoPerson size={14} />
                  <span className="text-xs">My Profile</span>
                </Link>
              </div>
              <button
                className="duration-300 flex w-full items-center space-x-2 hover:bg-red-600/10 px-1 py-2 rounded-lg mt-2 text-red-500 cursor-pointer"
                onClick={() => logout()}
              >
                <IoLogOutOutline size={16} />
                <span className="text-xs">Log out</span>
              </button>
            </div>
          )}
        </div>
      </div>
      {/* <Tooltip
        id="profile"
        place="bottom-start"
        positionStrategy="fixed"
        className="text-mainText! bg-tooltip!"
      /> */}
    </div>
  );
};

export default Navbar;

//Search Animation Idea (1)
//   <div className="relative">
//     <input
//       type="text"
//       placeholder="Search..."
//       className={`border border-black rounded-2xl
// transition-all duration-300 ease-in-out
// overflow-hidden${
//   search
//     ? "w-60 opacity-100 px-3 py-1"
//     : "w-0 opacity-0 px-0 py-1 border-0"
// }`}
//     />
//     <CiSearch
//       className="absolute right-1 top-1/2 transform -translate-y-1/2 cursor-pointer"
//       onClick={() => {
//         setSearch(!search);
//       }}
//     />
