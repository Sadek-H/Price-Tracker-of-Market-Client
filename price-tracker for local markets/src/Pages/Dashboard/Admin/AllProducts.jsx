import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { FaEdit, FaTrashAlt, FaCheck, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { AuthContext } from "../../../context/AuthContext";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { token } = useContext(AuthContext); // ✅ Correct usage

  // Fetch products
  useEffect(() => {
    axios
      .get("https://price-tracker-of-market-server.onrender.com/dashboard/my-products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [token]);

  // Approve product
  const handleApprove = (id) => {
    axios
      .put(
        `https://price-tracker-of-market-server.onrender.com/dashboard/approveProduct/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        if (res.data.modifiedCount) {
          setProducts((prev) =>
            prev.map((p) => (p._id === id ? { ...p, status: "approved" } : p))
          );
          toast.success("Approved successfully");
        }
      })
      .catch((err) => {
        console.error("Error approving product:", err);
        toast.error("Failed to approve product");
      });
  };

  // Reject product
  const handleReject = (id) => {
    Swal.fire({
      title: "Reject Product",
      input: "text",
      inputLabel: "Reason for rejection",
      inputPlaceholder: "Enter a reason...",
      showCancelButton: true,
      confirmButtonText: "Reject",
      cancelButtonText: "Cancel",
      inputValidator: (value) => {
        if (!value) {
          return "You must provide a reason!";
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const reason = result.value;

        axios
          .post(
            "https://price-tracker-of-market-server.onrender.com/dashboard/rejectProduct",
            {
              productId: id,
              reason: reason,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then(() => {
            axios
              .put(
                `https://price-tracker-of-market-server.onrender.com/dashboard/rejectProduct/${id}`,
                {
                  status: "rejected",
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              )
              .then((res) => {
                if (res.data.modifiedCount) {
                  setProducts((prev) =>
                    prev.map((p) =>
                      p._id === id ? { ...p, status: "rejected" } : p
                    )
                  );
                  toast.success("Product rejected with reason");
                } else {
                  toast.warn("Product status not updated, but reason saved.");
                }
              })
              .catch((err) => {
                console.error("Error updating status:", err);
                toast.error("Request failed.");
              });
          })
          .catch((err) => {
            console.error("Error posting reason:", err);
            toast.error("Request failed.");
          });
      }
    });
  };

  // Delete product
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to undo this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`https://price-tracker-of-market-server.onrender.com/dashboard/deleteProduct/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            if (res.data.deletedCount) {
              setProducts((prevProducts) =>
                prevProducts.filter((p) => p._id !== id)
              );
              Swal.fire("Deleted!", "The product has been removed.", "success");
            } else {
              Swal.fire("Failed!", "Product could not be deleted.", "error");
            }
          })
          .catch((err) => {
            console.error("Error deleting product:", err);
            Swal.fire(
              "Error!",
              "An error occurred while deleting the product.",
              "error"
            );
          });
      }
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">📋 All Vendor Products</h2>
      <div className="overflow-x-auto rounded-xl shadow">
        <table className="table w-full">
          <thead className="bg-base-200 text-base">
            <tr>
              <th>#</th>
              <th>Item</th>
              <th>Vendor</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => (
              <tr key={p._id}>
                <td>{i + 1}</td>
                <td>{p.itemName}</td>
                <td>{p.vendorName}</td>
                <td
                  className={`font-semibold ${
                    p.status === "rejected"
                      ? "text-red-500"
                      : p.status === "approved"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {p.status}
                </td>
                <td className="flex gap-2">
                  {p.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleApprove(p._id)}
                        className="btn btn-xs btn-success"
                      >
                        <FaCheck />
                      </button>
                      <button
                        onClick={() => handleReject(p._id)}
                        className="btn btn-xs btn-warning"
                      >
                        <FaTimes />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() =>
                      navigate(`/dashboard/update-product/${p._id}`)
                    }
                    className="btn btn-xs btn-info"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="btn btn-xs btn-error"
                  >
                    <FaTrashAlt />
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

export default AllProducts;
