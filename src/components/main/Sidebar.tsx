"use client";
import React from "react";
import { useAuth } from "../../context/Authcontext"; // Import useAuth from context
import { LuNotepadText } from "react-icons/lu";
import { CiCalendar } from "react-icons/ci";
import { FaRegStar } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { TbCalendarUser } from "react-icons/tb";
import { IoMdAdd } from "react-icons/io";
import { IoInformationCircle } from "react-icons/io5";
import Link from "next/link";

const Sidebar = () => {
  const { isAuthenticated, user, logout } = useAuth(); // Use authentication from context

  return (
    <div
      className={`w-80 h-screen bg-[#EFF6EF] flex flex-col transform transition-transform duration-300 ease-in-out`}
    >
      {/* Profile Section */}
      <div className="h-1/2 bg-[#EFF6EF] flex flex-col items-center justify-center">
        <Link href={""} className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
          {/* Profile Image Placeholder */}
        </Link>
        {isAuthenticated && <h1 className="mt-4 text-lg font-bold">{user?.name}</h1>}
        <div>
          {isAuthenticated ? (
            <button
              onClick={logout} // Logout function from context
              className="cursor-pointer transition-all bg-green-400 text-white px-6 py-2 rounded-lg border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
            >
              Logout
            </button>
          ) : (
            <div className="flex mt-8 gap-4">
              <Link href={"/login"}>
                <button className="cursor-pointer transition-all bg-green-400 text-white px-6 py-2 rounded-lg border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]">
                  Login
                </button>
              </Link>
              <Link href={"/signup"}>
                <button className="cursor-pointer transition-all bg-green-400 text-white px-6 py-2 rounded-lg border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]">
                  SignUp
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Items */}
      <div className="space-y-4 py-6 mx-3 bg-white text-black">
        <ul className="space-y-2">
          <Link href={"/listall"} className="flex gap-2 items-center hover:bg-[#EFF6EF] p-2 px-4 rounded w-full">
            <LuNotepadText />
            <li>All Tasks</li>
          </Link>
          <Link href={"/today"} className="gap-2 flex items-center hover:bg-[#EFF6EF] p-2 px-4 rounded w-full">
            <CiCalendar />
            <li>Today</li>
          </Link>
          <Link href={"/important"} className="gap-2 flex items-center hover:bg-[#EFF6EF] p-2 px-4 rounded w-full">
            <FaRegStar />
            <li>Important</li>
          </Link>
          <Link href={""} className="gap-2 flex items-center hover:bg-[#EFF6EF] p-2 px-4 rounded w-full">
            <CiEdit />
            <li>Planned</li>
          </Link>
          <Link href={"/"} className="gap-2 flex items-center hover:bg-[#EFF6EF] p-2 px-4 rounded w-full">
            <TbCalendarUser />
            <li>Assigned to Me</li>
          </Link>
        </ul>
      </div>

      {/* Add List Button */}
      <div className="flex mt-5 bg-white items-center h-[90px]">
        <button className="w-full flex items-center mx-4 gap-3 rounded-lg text-center font-bold">
          <IoMdAdd className="text-3xl" />
          Add List
        </button>
      </div>

      {/* Today Tasks Section */}
      <div className="flex bg-white justify-between h-[90px] my-4">
        <div className="mt-4 px-4">
          <p>Today Tasks</p>
          <p>11</p>
        </div>
        <IoInformationCircle className="mt-4 text-2xl px-3 text-gray-400" />
      </div>

      {/* Tasks Done Today */}
      <div className="flex bg-white flex-col items-center">
        <p className="text-sm mt-2">Tasks Done Today</p>
      </div>
    </div>
  );
};

export default Sidebar;
