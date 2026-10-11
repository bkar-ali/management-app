"use client";
import { usePathname } from "next/navigation";

import Link from "next/link";

import { IconType } from "react-icons";

// Projects Icon
// import { FaAngleUp } from "react-icons/fa6";
// import { FaAngleDown } from "react-icons/fa6";

// Main Icons
import { GoHome } from "react-icons/go";
import { CiFolderOn } from "react-icons/ci";
import { MdOutlineTimeline } from "react-icons/md";
import { GoBriefcase } from "react-icons/go";
import { CiSearch } from "react-icons/ci";
import { CiSettings } from "react-icons/ci";
import { CiUser } from "react-icons/ci";
import { RiTeamLine } from "react-icons/ri";

// Priority Icons
// import { CiWarning } from "react-icons/ci";
// import { IoLayersOutline } from "react-icons/io5";
// import { FiAlertCircle } from "react-icons/fi";
// import { FiAlertOctagon } from "react-icons/fi";
// import { LuShieldAlert } from "react-icons/lu";

import { AiOutlineHeatMap } from "react-icons/ai";

type Props = {
  sidebarState: boolean;
};

const Sidebar = ({ sidebarState }: Props) => {
  console.count("Sidebar Render");
  return (
    <div
      className={`${sidebarState ? "w-64 px-3 " : "w-0"} duration-300 bg-sidebar text-mainText border-r border-mainBorder/60 transition-all ease-in-out relative 
      flex flex-col items-center min-h-screen shadow-2xl overflow-y-auto overflow-x-hidden `}
    >
      <div className="px-1 my-5 flex w-full items-center">
        <span className="rounded-md text-4xl">
          <AiOutlineHeatMap />
        </span>
        <span className="text-2xl ml-3">Assel</span>
      </div>

      <div className="w-full flex flex-col space-y-3 ">
        <SidebarLink href="/" icon={GoHome} label="Home" />
        <SidebarLink href="/projects" icon={CiFolderOn} label="Projects" />
        <SidebarLink
          href="/timeline"
          icon={MdOutlineTimeline}
          label="Timeline"
        />
        <SidebarLink href="/search" icon={CiSearch} label="Search" />
        <SidebarLink href="/setting" icon={CiSettings} label="Setting" />
        <SidebarLink href="/users" icon={CiUser} label="Users" />
        <SidebarLink href="/teams" icon={RiTeamLine} label="Teams" />
      </div>
    </div>
  );
};

interface sidebarLinkProps {
  href: string;
  icon: IconType;
  label: string;
}

const SidebarLink = ({ href, icon: Icon, label }: sidebarLinkProps) => {
  const pathName = usePathname();
  const isActive =
    pathName === href ||
    (pathName === "/" && href === "/dashboard") ||
    pathName.startsWith(`${href}/`);
  return (
    <Link href={href} className="w-full m-0 text-mainText">
      <div className={`w-full`}>
        <div
          className={`relative flex items-center pl-3 mb-1.5  ${isActive ? "text-primary bg-primary-light" : "hover:bg-primary-light/60"} duration-300 px-8 py-3 space-x-4 rounded-xl`}
        >
          <Icon className="h-6 w-6" />
          <span className="">{label}</span>
        </div>
      </div>
    </Link>
  );
};

export default Sidebar;
