"use client";

import Header from "@/app/components/Header";

import { IconType } from "react-icons";
import { IoGridOutline } from "react-icons/io5";
import { IoIosList } from "react-icons/io";
import { GoClock } from "react-icons/go";
import { LuTable } from "react-icons/lu";
import { CiFilter } from "react-icons/ci";
import { IoShareSocial } from "react-icons/io5";
import ModalNewProject from "@/app/components/ModalNewProject";

import { useAppDispatch } from "@/app/hooks/reduxHooks";
import { openNewProjectModal } from "@/app/features/auth/globalSlice";
import Breadcrumbs from "@/app/components/Breadcrumbs";
import { useGetProjectByIdQuery } from "@/app/store/api";
import { useParams } from "next/navigation";

type Props = {
  activeTab: string;
  setActiveTab: (tabName: string) => void;
};

const ProjectHeader = ({ activeTab, setActiveTab }: Props) => {
  const dispatch = useAppDispatch();

  const { id } = useParams<{ id: string }>();

  const { data: project } = useGetProjectByIdQuery(id);

  return (
    <div className="px-4 xl:px-6">
      <ModalNewProject />

      <div className="pb-6 pt-6 lg:pt-8 lg:pb-4">
        <Breadcrumbs
          items={[
            { label: "projects", href: "/projects" },
            { label: `${project?.name ?? "project"}`, href: `/projects/${id}` },
          ]}
        />
        <Header
          name="Product Design Development"
          buttonName="New Boards"
          event={() => dispatch(openNewProjectModal())}
        />
      </div>
      {/* Tabs */}
      <div className="flex flex-wrap-reverse gap-2 border-y border-gray-200 pb-2 pt-2 md:items-center">
        <div className="flex flex-1 items-center gap-2 md:gap-4">
          <TabButton
            name="Board"
            icon={IoGridOutline}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
          <TabButton
            name="List"
            icon={IoIosList}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
          <TabButton
            name="Time line"
            icon={GoClock}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
          <TabButton
            name="Table"
            icon={LuTable}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="text-gray-500 hover:text-gray-600 dark:text-neutral-500 dark:hover:text-gray-300">
            <CiFilter className="h5 w-5" />
          </button>
          <button className="text-gray-500 hover:text-gray-600 dark:text-neutral-500 dark:hover:text-gray-300">
            <IoShareSocial className="h-5 w-5" />
          </button>
          <div className="relative group">
            <input
              type="text"
              placeholder="Search Task"
              className="rounded-md border py-1 pl-10 pr-4 focus:outline-none"
            />
            <LuTable className="absolute top-1/2 -translate-y-1/2 left-2 w-4 h-4 text-gray-600 group-focus-within:text-primary duration-300" />
          </div>
        </div>
      </div>
      {/* Tabs */}
    </div>
  );
};

type tabButtonProps = {
  name: string;
  icon: IconType;
  setActiveTab: (tabName: string) => void;
  activeTab: string;
};
const TabButton = ({
  activeTab,
  icon: Icon,
  name,
  setActiveTab,
}: tabButtonProps) => {
  const isActive = activeTab === name;
  return (
    <button
      className={`duration-300 relative flex items-center gap-2 px-1 py-2 text-gray-500 after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-full hover:text-primary sm:px-2 lg:px-4 
        ${isActive ? "text-primary after:bg-primary" : ""}`}
      onClick={() => setActiveTab(name)}
    >
      <Icon className="w-5 h-5" />
      {name}
    </button>
  );
};

export default ProjectHeader;
