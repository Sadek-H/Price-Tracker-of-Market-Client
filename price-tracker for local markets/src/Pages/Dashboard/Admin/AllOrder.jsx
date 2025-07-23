import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AllOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all orders when component mounts
    axios.get('http://localhost:3000/orders')
      .then(res => setOrders(res.data))
      .catch(err => {
        console.error('Failed to fetch orders:', err);
        alert('Failed to load orders. Please try again later.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
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
    <div className="overflow-x-auto p-4 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">🛒 All Orders</h2>
      <table className="table-auto w-full bg-white shadow rounded-lg border border-gray-200">
        <thead className="bg-blue-100">
          <tr>
            <th className="px-4 py-2 border border-gray-300">#</th>
            <th className="px-4 py-2 border border-gray-300">Customer</th>
            <th className="px-4 py-2 border border-gray-300">Product</th>
            <th className="px-4 py-2 border border-gray-300">Price</th>
            <th className="px-4 py-2 border border-gray-300">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, idx) => (
            <tr key={order._id} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2 text-center">{idx + 1}</td>
              <td className="border border-gray-300 px-4 py-2">{order.userName || 'N/A'}</td>
              <td className="border border-gray-300 px-4 py-2">{order.productName}</td>
              <td className="border border-gray-300 px-4 py-2">${order.amount} Cents</td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold
                    ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}
                >
                  {order.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllOrder;
