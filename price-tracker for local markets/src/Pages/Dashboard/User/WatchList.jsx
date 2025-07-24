import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { AuthContext } from "../../../context/AuthContext";

const WatchList = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);

  useEffect(() => {
    if (!user?.email || !token) {
      setWatchlist([]);
      setLoading(false);
      return;
    }
    fetchWatchlist();
  }, [user, token]);

  const fetchWatchlist = () => {
    setLoading(true);
    axios
      .get("https://price-tracker-of-market-server.onrender.com/watchlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // Filter items belonging to current logged-in user only
        const filtered = res.data.filter(
          (item) => item.userEmail === user.email
        );
        setWatchlist(filtered);
      })
      .catch(() => {
        Swal.fire("Error", "Failed to fetch watchlist", "error");
      })
      .finally(() => setLoading(false));
  };

  const handleRemove = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to remove this item from your watchlist!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, remove it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`https://price-tracker-of-market-server.onrender.com/watchlist/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then(() => {
            setWatchlist((prev) => prev.filter((item) => item._id !== id));
            Swal.fire("Removed!", "Item has been removed.", "success");
          })
          .catch(() => {
            Swal.fire("Error", "Failed to remove item", "error");
          });
      }
    });
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <svg
          className="animate-spin -ml-1 mr-3 h-10 w-10 text-green-600"
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
        <span className="text-green-600 text-lg font-semibold">Loading watchlist...</span>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Manage Watchlist</h2>

      <button
        onClick={() => navigate("/products")}
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Add More
      </button>

      {watchlist.length === 0 ? (
        <p className="text-center text-gray-500">No items in your watchlist.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">Product Name</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Market Name</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {watchlist.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{item.itemName}</td>
                  <td className="border border-gray-300 px-4 py-2">{item.marketName || "-"}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.prices && item.prices.length > 0
                      ? new Date(
                          [...item.prices].sort(
                            (a, b) => new Date(b.date) - new Date(a.date)
                          )[0].date
                        ).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button
                      onClick={() => handleRemove(item._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default WatchList;
