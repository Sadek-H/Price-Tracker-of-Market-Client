import React, { use, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/AuthContext';

const AllOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const {token} = use(AuthContext);
  useEffect(() => {
    // Fetch all orders when component mounts
    axios.get('https://price-tracker-of-market-server.onrender.com/orders',
      {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
      )
      .then(res => setOrders(res.data))
      .catch(err => {
        toast.error('Failed to fetch orders:', err);
       
      })
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return (
    <div className="max-w-7xl flex justify-center items-center h-64">
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
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
      <span className="text-blue-600 text-lg font-semibold">Loading orders...</span>
    </div>
  );

  if (!orders.length) return (
    <div className="text-center text-gray-500 text-xl mt-10">
      ❌ No orders found!
    </div>
  );

  return (
       <div className="pt-4 max-w-6xl mx-auto px-2">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">🛒 All Orders</h2>

      {/*  Table View for md+ */}
      <div className="hidden md:block overflow-x-auto">
        <table className="table-auto w-full bg-white shadow rounded-lg border border-gray-200">
          <thead className="bg-blue-100">
            <tr>
              <th className="px-4 py-2 border">#</th>
              <th className="px-4 py-2 border">Customer</th>
              <th className="px-4 py-2 border">Product</th>
              <th className="px-4 py-2 border">Price</th>
              <th className="px-4 py-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="border px-4 py-2 text-center">{idx + 1}</td>
                <td className="border px-4 py-2">{order.userName || "N/A"}</td>
                <td className="border px-4 py-2">{order.productName}</td>
                <td className="border px-4 py-2">${order.amount} Cents</td>
                <td className="border px-4 py-2 text-center">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      order.status === "delivered"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/*  Card View for small devices */}
      <div className="md:hidden flex flex-col gap-4">
        {orders.map((order, idx) => (
          <div key={order._id} className="border border-gray-300 p-4 rounded-lg shadow bg-white">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-blue-600">Order #{idx + 1}</h3>
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${
                  order.status === "delivered"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {order.status}
              </span>
            </div>
            <p><span className="font-semibold">Customer:</span> {order.userName || "N/A"}</p>
            <p><span className="font-semibold">Product:</span> {order.productName}</p>
            <p><span className="font-semibold">Price:</span> ${order.amount} Cents</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllOrder;




