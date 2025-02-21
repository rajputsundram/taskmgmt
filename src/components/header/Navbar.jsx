'use client'
import { FaBars } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";
import { FaListUl } from "react-icons/fa";
import { FiGrid } from "react-icons/fi";
import { RiMoonClearFill } from "react-icons/ri";



const Navbar = () => {
  return (
    <div className="w-full bg-white shadow-md p-4 sticky top-0 z-10">
      <div className="flex justify-between items-center">
        
        {/* Logo Section */}
        <div className="flex items-center gap-4">
        <span className=""   onClick={''}><FaBars size={24} /></span> {/* Hamburger for mobile */}
        
          <span className="text-2xl font-bold text-[#3F9142]">Logo</span>
        
        
        </div>

        {/* Navbar Items Section */}
        <div className="flex gap-6 items-center " >
          <span className="text-xl">
            <IoSearchOutline size={24} />
          </span>
          <span className="text-xl">
            <FaListUl size={24} />
          </span>
          <span className="text-xl">
            <FiGrid size={24} />
          </span>
          <span className="text-xl">
            <RiMoonClearFill size={24} />
          </span>
        </div>
        
      </div>
    </div>
  );
};

export default Navbar;
