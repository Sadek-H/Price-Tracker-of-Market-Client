import axios from "axios";
import React, { use, useEffect, useState } from "react";
import { FaCheck, FaTimes, FaTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { AuthContext } from "../../../context/AuthContext";

const Allads = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true); // loader state
  const { token } = use(AuthContext);
  // Load all ads
  useEffect(() => {
    axios
      .get("http://localhost:3000/admin/ads", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setAds(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false); // stop loading even if error
      });
  }, []);

  const handleapprove = (id) => {
    axios
      .put(
        `http://localhost:3000/admin/update-ads/${id}`,
        { status: "approved" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        if (res.data.modifiedCount) {
          setAds((prevAds) =>
            prevAds.map((ad) =>
              ad._id === id ? { ...ad, status: "approved" } : ad
            )
          );
          toast.success("Advertisement approved!");
        }
      });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:3000/admin/delete-ads/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            if (res.data.deletedCount > 0) {
              setAds((prevAds) => prevAds.filter((ad) => ad._id !== id));
              toast.success("Advertisement deleted!");
            }
          });
      }
    });
  };

  return (
    <div className="overflow-x-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-green-700">
        📢 All Advertisements
      </h2>

      {/* Loader */}
      {loading ? (
        <div className="flex justify-center items-center h-60">
          <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-green-600"></div>
        </div>
      ) : ads.length === 0 ? (
        <div className="text-center text-gray-500 text-xl mt-10">
          ❌ No advertisements found!
        </div>
      ) : (
        <table className="table w-full bg-white shadow rounded-lg">
          <thead className="bg-green-100">
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Short Desc</th>
              <th>Status</th>
              <th>Update Status</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {ads.map((ad, index) => (
              <tr key={ad._id} className="hover">
                <td>{index + 1}</td>
                <td>{ad.title}</td>
                <td>{ad.description?.slice(0, 40)}...</td>
                <td>
                  <span
                    className={`badge ${
                      ad.status === "approved"
                        ? "badge-success"
                        : "badge-warning"
                    }`}
                  >
                    {ad.status}
                  </span>
                </td>
                <td>
                  {ad.status === "pending" ? (
                    <button
                      onClick={() => handleapprove(ad._id)}
                      className="btn btn-xs btn-success"
                      title="Approve"
                    >
                      <FaCheck />
                    </button>
                  ) : (
                    <button
                      className="btn btn-xs btn-warning"
                      title="Revert to Pending"
                      disabled
                    >
                      <FaTimes />
                    </button>
                  )}
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(ad._id)}
                    className="btn btn-xs btn-error"
                    title="Delete"
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Allads;
