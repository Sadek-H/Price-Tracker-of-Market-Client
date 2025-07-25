import React, { use, useState } from "react";
import { Link } from "react-router";
import { RxCross2 } from "react-icons/rx";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signout } = use(AuthContext);

  const handlesignout = () => {
    signout().then(() => {
      toast.success("User LogOut Successfully");
      setIsOpen(false);
    });
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 px-4 lg:px-10 font-[Inter] w-full">
      <div className="flex justify-between items-center max-w-7xl mx-auto py-3">
        {/* Left (Logo + Hamburger for Mobile) */}
        <div className="flex items-center gap-2">
          {/* Hamburger - only visible on mobile */}
          <button
            onClick={() => setIsOpen(true)}
            className="text-green-700 hover:text-green-900 transition lg:hidden"
            aria-label="Open menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-1">
            <img
              className="w-8 h-8 border rounded-b-full"
              src="https://i.ibb.co/7LM7D10/vegetable.png"
              alt="logo"
            />
            <span className="text-lg md:text-2xl font-bold text-green-700">
              কাঁচাবাজার
            </span>
          </Link>
        </div>

        {/* Center - Desktop Links */}
        <div className="hidden lg:flex items-center gap-6">
          <Link to="/" className="text-green-700 hover:text-green-800 transition">
            Home
          </Link>
          <Link to="/products" className="text-green-700 hover:text-green-800 transition">
            All Products
          </Link>
          <Link to="/dashboard" className="text-green-700 hover:text-green-800 transition">
            Dashboard
          </Link>
        </div>

        {/* Right - Auth buttons */}
        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <>
              <img
                className="w-8 h-8 rounded-full"
                src={user?.photoURL}
                alt={user?.displayName}
              />
              <button
                onClick={handlesignout}
                className="px-4 py-1.5 border border-red-600 text-red-700 hover:bg-red-600 hover:text-white transition rounded-full font-semibold text-sm"
              >
                LogOut
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-1.5 border border-green-600 text-green-700 hover:bg-green-600 hover:text-white transition rounded-full font-semibold text-sm"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white transition rounded-full font-semibold text-sm"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Drawer panel */}
          <div className="w-72 bg-white shadow-xl h-full p-5 relative">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setIsOpen(false)}
                className="text-green-700 hover:text-green-900 transition"
              >
                <RxCross2 className="inline-block mb-1" size={22} />{" "}
                <span className="text-xl">Close</span>
              </button>
            </div>

            {/* Mobile Links */}
            <ul className="space-y-4 text-green-700 text-base font-medium">
              <li>
                <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
              </li>
              <li>
                <Link to="/products" onClick={() => setIsOpen(false)}>All Products</Link>
              </li>
              <li>
                <Link to="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link>
              </li>
            </ul>

            <hr className="my-6 border-green-200" />

            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center gap-3">
                <img
                  className="w-8 h-8 rounded-full"
                  src={user?.photoURL}
                  alt={user?.displayName}
                />
                <button
                  onClick={handlesignout}
                  className="px-4 py-1.5 border border-red-600 text-red-700 hover:bg-red-600 hover:text-white transition rounded-full font-semibold text-sm"
                >
                  LogOut
                </button>
              </div>
            ) : (
              <div className="space-y-3 mt-4">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center py-2 border border-green-600 rounded-full text-green-700 hover:bg-green-600 hover:text-white transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center py-2 bg-green-600 rounded-full text-white hover:bg-green-700 transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Backdrop */}
          <div
            className="flex-1 bg-black bg-opacity-30"
            onClick={() => setIsOpen(false)}
          ></div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
