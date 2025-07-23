import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import { toast } from "react-toastify";

const Allusers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const { token } = useContext(AuthContext); // ✅ fix here

  // Fetch users
  useEffect(() => {
    axios
      .get("http://localhost:3000/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setUsers(res.data))
      .catch((err) => {
        console.error("Fetch failed:", err);
        setUsers([]);
      });
  }, [token]);

  // ✅ Handle Role Change
  const handleRoleChange = (userId, newRole) => {
    axios
      .patch(
        `http://localhost:3000/users/role/${userId}`,
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

  // Search filtering
  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination slice
  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold text-center text-green-600 mb-4">
        All Registered Users
      </h1>

      <div className="mb-4 flex justify-center">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search by name or email..."
          className="border px-4 py-2 rounded w-full max-w-md"
        />
      </div>

      {currentUsers.length === 0 ? (
        <div className="text-center text-gray-500">No users found.</div>
      ) : (
        <div className="overflow-x-auto">
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
                  <td className="px-4 py-2 border-t">{user.email || "N/A"}</td>
                  <td className="px-4 py-2 border-t capitalize">
                    {user.role || "user"}
                    {user.role !== "admin" && (
                      <button
                        onClick={() => handleRoleChange(user._id, "admin")}
                        className="ml-2 px-2 py-1 text-xs bg-blue-500 text-white rounded"
                      >
                        Make Admin
                      </button>
                    )}
                    {user.role !== "vendor" && (
                      <button
                        onClick={() => handleRoleChange(user._id, "vendor")}
                        className="ml-2 px-2 py-1 text-xs bg-purple-500 text-white rounded"
                      >
                        Make Vendor
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded"
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
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
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Allusers;
