import React, { useEffect, useState, useContext } from "react";
import Navbar from "../Components/Navbar";
import { NavLink, Outlet } from "react-router";
import axios from "axios";
import loaderlottie from "../assets/looties/Loading.json";
import { AuthContext } from "../context/AuthContext";
import Lottie from "lottie-react";
import { ToastContainer } from "react-toastify";
import { FaBars, FaTimes } from "react-icons/fa";
import Footer from "../Pages/Home/Footer";

const DashboardLayout = () => {
  const { user, token } = useContext(AuthContext);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (user?.email) {
      axios
        .get(`https://price-tracker-of-market-server.onrender.com/users/role/${user.email}`)
        .then((res) => {
          setRole(res.data.role);
          setLoading(false);
        })
        .catch((err) => console.log(err));
    }
  }, [user, token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Lottie
          animationData={loaderlottie}
          loop
          className="max-w-[550px] w-full"
        />
      </div>
    );
  }

  const renderLinks = () => {
    if (role === "user") {
      return (
        <>
          <NavLink to="/dashboard/watchlist">📌 Manage Watchlist</NavLink>
          <NavLink to="/dashboard/my-orders">🛒 My Order List</NavLink>
          <NavLink to="/dashboard/pricetrends">📈 View Price Trends</NavLink>
          <NavLink to="/dashboard/become-vendor">⚙️ Become a Vendor</NavLink>
        </>
      );
    }

    if (role === "vendor") {
      return (
        <>
          <NavLink to="/dashboard/add-product">➕ Add Product</NavLink>
          <NavLink to="/dashboard/my-products">📦 My Products</NavLink>
          <NavLink to="/dashboard/add-advertisement">
            📢 Add Advertisement
          </NavLink>
          <NavLink to="/dashboard/my-ads">🧾 My Advertisements</NavLink>
        </>
      );
    }

    if (role === "admin") {
      return (
        <>
          <NavLink to="/dashboard/users">👥 All Users</NavLink>
          <NavLink to="/dashboard/all-products">📋 All Products</NavLink>
          <NavLink to="/dashboard/all-ads">📢 All Advertisements</NavLink>
          <NavLink to="/dashboard/all-orders">🛍 All Orders</NavLink>
          <NavLink to="/dashboard/all-vendors">🧾 Vendor Requests</NavLink>
        </>
      );
    }
  };

  return (
    <div>
      <ToastContainer autoClose={900} position="top-right" theme="light" />
      <Navbar />

      {/* Mobile menu toggle button */}
      <div className="md:hidden p-2 text-right">
        <button
          onClick={() => setMenuOpen(true)}
          className="text-green-800 text-2xl"
        >
          <p className="btn btn-info">DashBoard bar</p>
        </button>
      </div>

      <div className="flex min-h-screen relative">
        {/* Sidebar */}
        <aside
          className={`
            fixed md:static top-0 z-50 md:z-auto bg-white md:bg-gradient-to-br 
            md:from-green-100 md:via-white md:to-green-200 text-green-900 shadow-xl 
            md:rounded-r-2xl space-y-2 p-4 transition-all duration-300 ease-in-out
            ${
              menuOpen ? "left-0 w-64 min-h-screen" : "-left-full"
            } md:w-72 md:min-h-screen
          `}
        >
          {/* Close icon (mobile only) */}
          <div className="flex justify-end md:hidden">
            <button
              onClick={() => setMenuOpen(false)}
              className="text-2xl text-green-800 mb-2"
            >
              <FaTimes />
            </button>
          </div>

          <li className="font-bold text-lg mb-2 flex items-center gap-2">
            📊 Dashboard
          </li>

          <div className="flex flex-col space-y-2">{renderLinks()}</div>

          <NavLink to="/">🏠 Back to Home</NavLink>

          <span className="text-xs text-gray-500 block mt-4">
            Logged in as: {user?.email}
          </span>
        </aside>

        {/* Main content area */}
        <main className="flex-1 p-4 mt-4 md:mt-0">
          <Outlet context={{ role }} />
        </main>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default DashboardLayout;
