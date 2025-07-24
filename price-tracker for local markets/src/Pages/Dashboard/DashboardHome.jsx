import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useOutletContext } from "react-router";
import {
  FaUsers,
  FaBoxOpen,
  FaBullhorn,
  FaShoppingCart,
} from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";

const StatCard = ({ icon: Icon, label, value, bgColor }) => (
  <div className="bg-white p-6 rounded-2xl shadow group hover:shadow-lg transition duration-300 border border-gray-100">
    <div className="flex items-center space-x-4">
      <div
        className={`p-4 rounded-full text-white text-xl shadow-inner ${bgColor}`}
      >
        <Icon />
      </div>
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="text-2xl font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  </div>
);

const DashboardHome = () => {
  const { role } = useOutletContext();
  const { user,token } = useContext(AuthContext);
  const [stats, setStats] = useState({});

  useEffect(() => {
    if (role === "admin") {
      Promise.all([
        axios.get("https://price-tracker-of-market-server.onrender.com/admin/total-users",
          {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
        ),
        axios.get("https://price-tracker-of-market-server.onrender.com/admin/total-products",
          {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
        ),
        axios.get("https://price-tracker-of-market-server.onrender.com/admin/total-ads",
          {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
        ),
        axios.get("https://price-tracker-of-market-server.onrender.com/admin/total-orders",
          {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
        ),
      ])   
        .then(([usersRes, productsRes, adsRes, ordersRes]) => {
          setStats({
            totalUsers: usersRes.data?.totalUsers || 0,
            totalProducts: productsRes.data?.totalProducts || 0,
            totalAds: adsRes.data?.totalAds || 0,
            totalOrders: ordersRes.data?.totalOrders || 0,
          });
        })
        .catch((error) => {
          console.error("Admin stats fetch error:", error);
        });
    } else if (role === "vendor" && user?.email) {
      Promise.all([
        axios.get(`https://price-tracker-of-market-server.onrender.com/dashboard/myproducts?email=${user.email}`,
          {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
        ),
        axios.get(`https://price-tracker-of-market-server.onrender.com/vendor/dashboard/Ads?email=${user.email}`,
          {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
        ),
      ])
        .then(([productsRes, adsRes]) => {
          setStats({
            totalProducts: productsRes.data.length || 0,
            totalAds: adsRes.data.length || 0,
          });
        })
        .catch((error) => {
          console.error("Vendor stats fetch error:", error);
        });
    }
    // No stats fetch for user, just show welcome message
  }, [role, user?.email,token]);

  // Dashboard Configuration
  let statsToShow = [];
  let dashboardTitle = "";

  if (role === "admin") {
    dashboardTitle = "🧮 Admin Dashboard Overview";
    statsToShow = [
      {
        icon: FaUsers,
        label: "Total Users",
        value: stats.totalUsers || 0,
        bgColor: "bg-gradient-to-r from-blue-500 to-blue-700",
      },
      {
        icon: FaBoxOpen,
        label: "Total Products",
        value: stats.totalProducts || 0,
        bgColor: "bg-gradient-to-r from-green-500 to-green-700",
      },
      {
        icon: FaBullhorn,
        label: "Total Ads",
        value: stats.totalAds || 0,
        bgColor: "bg-gradient-to-r from-orange-500 to-orange-700",
      },
      {
        icon: FaShoppingCart,
        label: "Total Orders",
        value: stats.totalOrders || 0,
        bgColor: "bg-gradient-to-r from-purple-500 to-purple-700",
      },
    ];
  } else if (role === "vendor") {
    dashboardTitle = "🏬 Vendor Dashboard";
    statsToShow = [
      {
        icon: FaBoxOpen,
        label: "My Products",
        value: stats.totalProducts || 0,
        bgColor: "bg-gradient-to-r from-green-500 to-green-700",
      },
      {
        icon: FaBullhorn,
        label: "My Ads",
        value: stats.totalAds || 0,
        bgColor: "bg-gradient-to-r from-orange-500 to-orange-700",
      },
    ];
  } else {
   // dashboardTitle = "👤 User Dashboard";
    statsToShow = []; // No stats for user
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center text-gray-700 mb-12">
        {dashboardTitle}
      </h1>

      {role === "user" ? (
        <div className="text-center p-10 bg-white rounded-2xl shadow max-w mx-auto">
          <h2 className="text-3xl font-semibold mb-4">Welcome to your dashboard!</h2>
          <p className="text-gray-600 mb-6">
            Explore your account and discover what you can do here.
          </p>
          <img
            src={user?.photoURL}
            alt="Welcome"
            className="w-40 rounded-full mx-auto"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsToShow.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
