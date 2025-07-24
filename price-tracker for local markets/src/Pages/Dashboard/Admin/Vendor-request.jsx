import React, { use, useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../../../context/AuthContext";

const VendorRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
 const {token} = use(AuthContext);
  const fetchRequests = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/dashboard/vendor-requests",
        {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      );
      setRequests(res.data);
    } catch (err) {
      console.error("❌ Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.patch(
        `http://localhost:3000/dashboard/vendor-requests/approve/${id}`,
        {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      );
      Swal.fire("Approved!", "Vendor request approved.", "success");
      setRequests((prev) =>
        prev.map((r) =>
          r._id === id ? { ...r, status: "approved", role: "vendor" } : r
        )
      );
    } catch (err) {
      console.error("❌ Approve Error:", err);
      Swal.fire("Error", "Could not approve request.", "error");
    }
  };

  const handleReject = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This action will reject the vendor request.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, reject it!",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.patch(
          `http://localhost:3000/dashboard/vendor-requests/reject/${id}`,
          {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
        );
        Swal.fire("Rejected!", "Vendor request has been rejected.", "success");
        setRequests((prev) =>
          prev.map((r) => (r._id === id ? { ...r, status: "rejected" } : r))
        );
      } catch (err) {
        console.error("❌ Reject Error:", err);
        Swal.fire("Error", "Could not reject request.", "error");
      }
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-10 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center sm:text-left">
        Vendor Requests
      </h1>

      {loading ? (
        <div className="text-center py-20">
          <span className="loading loading-spinner loading-lg text-green-600"></span>
        </div>
      ) : requests.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          No vendor requests found.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 whitespace-nowrap">Name</th>
                <th className="px-4 py-3 whitespace-nowrap">Email</th>
                <th className="px-4 py-3 whitespace-nowrap">Market</th>
                <th className="px-4 py-3 max-w-xs truncate whitespace-normal">
                  Description
                </th>
                <th className="px-4 py-3 whitespace-nowrap">Status</th>
                <th className="px-4 py-3 text-center whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {requests.map((r) => (
                <tr key={r._id} className="hover:bg-gray-50 align-top">
                  <td className="px-4 py-4 font-medium text-gray-800 whitespace-nowrap max-w-[150px] truncate">
                    {r.name}
                  </td>
                  <td className="px-4 py-4 text-gray-600 whitespace-nowrap max-w-[200px] truncate">
                    {r.email}
                  </td>
                  <td className="px-4 py-4 text-gray-600 whitespace-nowrap max-w-[120px] truncate">
                    {r.marketName}
                  </td>
                  <td
                    className="px-4 py-4 text-gray-500 max-w-xs max-h-20 overflow-y-auto break-words pr-2 border border-gray-100 rounded"
                    title={r.description}
                  >
                    {r.description}
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                        r.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : r.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
                      <button
                        onClick={() => handleApprove(r._id)}
                        disabled={r.status !== "pending"}
                        className="inline-flex items-center px-4 py-1.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md disabled:opacity-50 transition"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(r._id)}
                        disabled={r.status !== "pending"}
                        className="inline-flex items-center px-4 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md disabled:opacity-50 transition"
                      >
                        Reject
                      </button>
                    </div>
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

export default VendorRequest;
