import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { AuthContext } from "../../../context/AuthContext";

const Orderlist = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);

  useEffect(() => {
    if (!user?.email || !token) {
      setOrders([]);
      setLoading(false);
      return;
    }

    axios
      .get("https://price-tracker-of-market-server.onrender.com/orders", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        // Filter orders for current logged-in user only
        const userOrders = res.data.filter(
          (order) => order.userEmail === user.email
        );
        setOrders(userOrders);
      })
      .catch((err) => {
        toast.error("Failed to fetch orders");
      })
      .finally(() => setLoading(false));
  }, [token, user]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <svg
          className="animate-spin -ml-1 mr-3 h-10 w-10 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
        <span className="text-blue-600 text-lg font-semibold">
          Loading orders...
        </span>
      </div>
    );

  if (!orders.length)
    return (
      <p className="text-center mt-8 text-gray-500">No orders found.</p>
    );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Order List</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">
                Product Name
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Market Name
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Price
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
              <th className="border border-gray-300 px-4 py-2 text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">
                  {order.productName}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {order.marketName || "-"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  ৳{order.amount || "N/A"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {order.date ? new Date(order.date).toLocaleDateString() : "-"}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button
                    onClick={() => navigate(`/details/${order.productId}`)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    🔍 View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orderlist;
