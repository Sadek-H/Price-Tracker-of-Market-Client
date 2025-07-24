import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../../../context/AuthContext";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const MyProduct = () => {
  const [products, setProducts] = useState([]);
  const { user,token } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [rejection, setRejection] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/dashboard/rejectProduct",
      {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
    ).then((res) => {
      if (res.data) {
        setRejection(res.data);
      }
    });
  });
  useEffect(() => {
    if (!user?.email) return;
    axios
      .get(
        `http://localhost:3000/dashboard/my-products?vendorEmail=${user.email}`,
        {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
      )
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      });
  }, [user?.email,token]);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This product will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:3000/dashboard/deleteProduct/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((res) => {
            if (res.data.deletedCount > 0) {
              setProducts((prev) => prev.filter((p) => p._id !== id));
              toast.success(" Product deleted successfully!");
            }
          });
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500 border-opacity-50"></div>
        <p className="text-xl font-semibold text-green-600">
          Waiting for your products...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-green-700">
        📦 My Submitted Products
      </h2>
      <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200">
        <table className="table w-full text-sm">
          <thead className="bg-green-100 text-green-800 text-sm font-semibold">
            <tr>
              <th>#</th>
              <th>Item</th>
              <th>Market</th>
              <th>Price</th>
              <th>Date</th>
              <th>Status</th>
              <th>✏️</th>
              <th>🗑️</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, idx) => (
              <tr key={p._id} className="hover">
                <td className="font-medium">{idx + 1}</td>
                <td>{p.itemName}</td>
                <td>{p.marketName}</td>
                <td>৳{p.prices?.[p.prices.length - 1]?.price}/kg</td>
                <td>{p.date}</td>
                <td>
                  <div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold block w-fit ${
                        p.status === "approved"
                          ? "bg-green-200 text-green-800"
                          : p.status === "rejected"
                          ? "bg-red-200 text-red-800"
                          : "bg-yellow-200 text-yellow-800"
                      }`}
                    >
                      {p?.status}
                    </span>

                    {p.status === "rejected" && (
                      <p className="text-xs text-red-600 mt-1 italic">
                        Reason:{" "}
                        {rejection.find((r) => r.productId === p._id)?.reason ||
                          "No reason provided"}
                      </p>
                    )}
                  </div>
                </td>

                <td>
                  <button
                    onClick={() =>
                      navigate(`/dashboard/update-product/${p._id}`)
                    }
                    className="btn btn-xs btn-info text-white"
                  >
                    Edit
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="btn btn-xs btn-error text-white"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No products found for this account.
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProduct;
