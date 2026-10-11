"use client";
// Next.js
import Image from "next/image";
//  Icons
import { CiLocationOn } from "react-icons/ci";
import { CiCalendar } from "react-icons/ci";
import { MdOutlineEdit } from "react-icons/md";
import { RiAdminLine } from "react-icons/ri";
import { IoPersonOutline } from "react-icons/io5";
import { PiCameraLight } from "react-icons/pi";

import { GoPerson } from "react-icons/go";
import { FiUsers } from "react-icons/fi";
import { MdOutlineEmail } from "react-icons/md";
import { MdOutlinePhone } from "react-icons/md";
import { TbWorld } from "react-icons/tb";

import { AiOutlineUpload } from "react-icons/ai";
import { FiUpload } from "react-icons/fi";
import { GoLinkExternal } from "react-icons/go";

import { RiLinksFill } from "react-icons/ri";
import { FaLinkedinIn } from "react-icons/fa6";
import { FiGithub } from "react-icons/fi";
import { FaInstagram } from "react-icons/fa";

import { MdOutlineShield } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";

// Api
import { useGetUserByIdQuery } from "@/app/store/api";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { useGetProjectByIdQuery } from "@/app/store/api";

import { format } from "date-fns";
import Header from "@/app/components/Header";

const Page = () => {
  const { data, isLoading, error } = useGetUserByIdQuery();
  const { user } = data ?? {};
  const joined = user?.createdAt
    ? format(new Date(user.createdAt), "MMM dd, yyyy")
    : "N/A";

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error Fitshing User</div>;

  return (
    <div className="p-6 w-full h-full">
      <Header margin={false} name="Profile" />
      <p className="mt-0.5 mb-3 text-[14px] text-mainText/60">
        Manage Your Personal Information And Accoutn Setting{" "}
      </p>
      <div className="w-full bg-input flex border border-mainBorder p-4 rounded-2xl overflow-hidden relative">
        <div
          className="absolute p-2 rounded-full -top-2 -left-5 scale-150 lg:scale-200"
          style={{ boxShadow: "var(--primary) -20px 0px 150px 40px" }}
        />
        <div
          className="absolute p-2 rounded-full -bottom-4 -right-5 scale-150 lg:scale-200"
          style={{ boxShadow: "var(--primary) -20px 0px 150px 40px" }}
        />
        <div className="w-fit px-4">
          <div className="relative w-30 h-30 md:w-44 md:h-44">
            <Image
              src={`/${user?.profilePictureUrl}`}
              alt=""
              fill
              className="object-cover relative rounded-full "
            />
            <div className="absolute bottom-0 right-0 border-4 border-mainBackground text-white bg-primary rounded-full p-1 cursor-pointer">
              <PiCameraLight className="size-6 md:size-7" />
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col">
          <div className="w-full h-full flex justify-between items-start pl-3 pb-3 border-b border-mainBorder/40">
            <div className="w-full flex-1 space-y-2">
              <div className="flex items-center">
                <span className="text-3xl font-semibold">{user?.username}</span>
                {user?.role === "MEMBER" ? (
                  <span className="text-xs  ml-2 py-1 px-3 dark:bg-green-600/20 dark:text-green-300 bg-green-300/40 text-green-700 rounded-2xl">
                    <IoPersonOutline className="inline" /> Member
                  </span>
                ) : (
                  <span className="text-xs  ml-2 py-0.5 px-3 bg-purple-600/20 text-purple-300 rounded-2xl">
                    <RiAdminLine className="inline" /> Admin
                  </span>
                )}
              </div>
              <div className="text-mainText/70 text-xs tracking-wide">
                Full Stack Developer
              </div>
              <div className="flex items-center">
                <div className="mr-4 text-xs flex items-center text-mainText/60">
                  <CiLocationOn className="inline mr-2 text-lg" />
                  Egypt/Cairo
                </div>
                <div className="mr-4 text-xs flex items-center text-mainText/60">
                  <CiCalendar className="inline mr-2 text-lg" />
                  Joined {joined}
                </div>
              </div>
            </div>
            <button className="text-primary border border-primary rounded-lg py-2 px-5 flex items-center">
              <MdOutlineEdit className="inline mr-2 text-lg" /> Edit Profile
            </button>
          </div>

          <div className="w-full h-full flex items-center pt-1">
            <div className="flex flex-col justify-center items-center w-1/4 h-fit border-r border-mainBorder/40">
              <div className="text-xl">24</div>
              <div className="text-mainText/40">Projects</div>
            </div>
            <div className="flex flex-col justify-center items-center w-1/4 h-fit border-r border-mainBorder/40">
              <div className="text-xl">182</div>
              <div className="text-mainText/40">Tasks Completed</div>
            </div>
            <div className="flex flex-col justify-center items-center w-1/4 h-fit border-r border-mainBorder/40">
              <div className="text-xl">12</div>
              <div className="text-mainText/40">Team Members</div>
            </div>
            <div className="flex flex-col justify-center items-center w-1/4">
              <div className="text-xl">98%</div>
              <div className="text-mainText/40">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-full grid grid-cols-[70%_30%] py-3">
        <div className="grid grid-rows-[70%_30%] pr-2">
          <div className="bg-input rounded-2xl border border-mainBorder p-5 mb-3">
            <h2 className="flex items-center text-2xl font-semibold mb-2">
              <GoPerson className="inline mr-2" />
              About Me
            </h2>
            <p className="w-3/4 mb-5 text-mainText/60">
              A Full Stack MERN Developer passionate about building modern and
              responsive web applications. <br />I enjoy creating clean user
              interfaces and improving user experience. I specialize in React,
              Next.js, TypeScript, Node.js, Express.js, MongoDB, Tailwind CSS,
              and RESTful APIs.
            </p>
            <div className="md:w-1/2 lg:w-1/3 space-y-3">
              <div className="flex w-full">
                <div className="w-1/2">
                  <FiUsers className="inline mr-2" />
                  Full Name
                </div>
                <div className="w-1/2">{user?.username}</div>
              </div>

              <div className="flex w-full">
                <div className="w-1/2">
                  <MdOutlineEmail className="inline mr-2" />
                  Email
                </div>
                <div className="w-1/2">{user?.email}</div>
              </div>

              <div className="flex w-full">
                <div className="w-1/2">
                  <MdOutlinePhone className="inline mr-2" />
                  Phone
                </div>
                <div className="w-1/2">+2001111045313</div>
              </div>

              <div className="flex w-full">
                <div className="w-1/2">
                  <CiLocationOn className="inline mr-2" />
                  Location
                </div>
                <div className="w-1/2">Cairo/15May</div>
              </div>

              <div className="flex w-full">
                <div className="w-1/2">
                  <TbWorld className="inline mr-2" />
                  Website
                </div>
                <a
                  className="w-1/2 hover:text-primary duration-300 hover:underline cursor-pointer"
                  href="https://my-portfolio-jade-seven-41.vercel.app/"
                >
                  my-portfolio <GoLinkExternal className="inline" />
                </a>
              </div>
            </div>
          </div>
          <div className="bg-input rounded-2xl border border-mainBorder p-5">
            <h2 className="flex items-center text-2xl font-semibold mb-2">
              <GoPerson className="inline mr-2" />
              About Me
            </h2>
            <p className="w-3/4 mb-5 text-mainText/60">
              Hi, I&apos;m Abubakr loves turning ideas into interactive and
              responsive web experience
            </p>
          </div>
        </div>
        <div className="grid grid-rows-[70%_30%]">
          <div className=" w-full h-full">
            <div className="w-full h-1/2 bg-input rounded-2xl border border-mainBorder p-5 mb-2">
              <h2 className="flex items-center text-2xl font-semibold mb-2">
                <GoPerson className="inline mr-2" />
                Profile Photo
              </h2>
              <div className="w-full flex items-center justify-center flex-col space-x-1">
                <div className="relative w-20 h-20 md:w-25 md:h-25">
                  <Image
                    src={`/${user?.profilePictureUrl}`}
                    alt=""
                    fill
                    className="object-cover relative rounded-full "
                  />
                  {/* <div className="absolute bottom-0 right-0 border-4 border-mainBackground text-white bg-primary rounded-full p-1 cursor-pointer">
                    <PiCameraLight className="size-4 md:size-5" />
                  </div> */}
                </div>
                <button className="cursor-pointer text-primary border border-primary rounded-lg py-1 px-4 flex items-center mt-2">
                  <FiUpload className="inline mr-2 text-lg" /> Change Photo
                </button>
              </div>
            </div>

            <div className="w-full h-[45%] bg-input rounded-2xl border border-mainBorder p-5 mb-3">
              <h2 className="flex items-center text-2xl font-semibold mb-2">
                <RiLinksFill className="inline mr-2" />
                Socila Links
              </h2>
              <div className="w-full space-y-3">
                <div className="flex w-full">
                  <div className="w-1/2">
                    <FaLinkedinIn className="inline mr-2" />
                    LinkedIn
                  </div>
                  <a className="w-1/2">
                    Link
                    <GoLinkExternal className="inline ml-2" />
                  </a>
                </div>

                <div className="flex w-full">
                  <div className="w-1/2">
                    <FiGithub className="inline mr-2" />
                    Github
                  </div>
                  <a className="w-1/2">
                    Link
                    <GoLinkExternal className="inline ml-2" />
                  </a>
                </div>

                <div className="flex w-full">
                  <div className="w-1/2">
                    <FaInstagram className="inline mr-2" />
                    Instgram
                  </div>
                  <a className="w-1/2">
                    Link
                    <GoLinkExternal className="inline ml-2" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-input rounded-2xl border border-mainBorder p-5">
            <h2 className="flex items-center text-2xl font-semibold mb-2">
              <MdOutlineShield className="inline mr-2" />
              Account Status
            </h2>
            <div
              className={`p-5 flex justify-between ${user?.role ? "bg-green-600/10" : "bg-red-600/10"}  rounded-2xl`}
            >
              <div
                className={`flex flex-col ${user?.role ? "text-green-400" : "text-red-400"}`}
              >
                <span className={`text-lg`}>
                  {user?.role ? "Account Verified" : "Account Not Verified"}
                </span>
                <span className="text-xs text-mainText/60">
                  {user?.role
                    ? "Your Account is Verified and Secure"
                    : "Your Account is Not Verified and Secure"}
                </span>
              </div>
              <div
                className={`px-3 py-3 ${user?.role ? "bg-green-400/30" : "bg-red-400/30"} rounded-full flex justify-center items-center`}
              >
                {user?.role ? <FaCheck size={20} /> : <IoClose size={20} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
