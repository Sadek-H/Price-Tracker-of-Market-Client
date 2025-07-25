import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import { toast } from "react-toastify";

const Allusers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    setLoading(true);
    axios
      .get("https://price-tracker-of-market-server.onrender.com/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setUsers(res.data))
      .catch((err) => {
        console.error("Fetch failed:", err);
        setUsers([]);
        toast.error("Failed to fetch users.");
      })
      .finally(() => setLoading(false));
  }, [token]);

  const handleRoleChange = (userId, newRole) => {
    axios
      .patch(
        `https://price-tracker-of-market-server.onrender.com/users/role/${userId}`,
        { role: newRole },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        if (res.data.modifiedCount > 0) {
          setUsers((prev) =>
            prev.map((user) =>
              user._id === userId ? { ...user, role: newRole } : user
            )
          );
          toast.success(`User role updated to ${newRole}`);
        }
      })
      .catch((err) => {
        console.error("Role update failed:", err);
        toast.error("Failed to update role.");
      });
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

 return (
  <div className="w-full p-6 bg-white rounded shadow">
    <h1 className="text-2xl font-bold text-center text-green-600 mb-4">
      All Registered Users
    </h1>

    <div className="mb-4 flex justify-center">
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search by name or email..."
        disabled={loading}
        className="border px-4 py-2 rounded w-full max-w-md disabled:opacity-50"
      />
    </div>

    {loading ? (
      <div className="flex justify-center items-center py-16">
        <svg
          className="animate-spin h-10 w-10 text-green-600"
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
        <span className="ml-3 text-green-600 font-semibold">
          Loading users...
        </span>
      </div>
    ) : currentUsers.length === 0 ? (
      <div className="text-center text-gray-500">No users found.</div>
    ) : (
      <>
        {/* For larger screens - show table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-green-100 text-green-800">
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Role</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user._id} className="hover:bg-green-50">
                  <td className="px-4 py-2 border-t">{user.name || "N/A"}</td>
                  <td className="px-4 py-2 border-t break-all">{user.email || "N/A"}</td>
                  <td className="px-4 py-2 border-t">
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user._id, e.target.value)
                      }
                      disabled={loading}
                      className="border px-2 py-1 rounded capitalize"
                    >
                      <option value="user">User</option>
                      <option value="vendor">Vendor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* For small screens - show cards */}
        <div className="sm:hidden grid grid-cols-1 gap-4">
          {currentUsers.map((user) => (
            <div key={user._id} className="border rounded p-4 shadow-sm">
              <h2 className="font-semibold text-lg mb-1">
                {user.name || "Unnamed"}
              </h2>
              <p className="text-sm break-all text-gray-600 mb-2">
                {user.email || "No Email"}
              </p>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Role:</label>
                <select
                  value={user.role}
                  onChange={(e) =>
                    handleRoleChange(user._id, e.target.value)
                  }
                  disabled={loading}
                  className="border px-2 py-1 rounded capitalize text-sm"
                >
                  <option value="user">User</option>
                  <option value="vendor">Vendor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-4 gap-2 flex-wrap">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || loading}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                disabled={loading}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1
                    ? "bg-green-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages || loading}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </>
    )}
  </div>
);

};

export default Allusers;
