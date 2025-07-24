import React, { use, useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../../../context/AuthContext";

const MyAds = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingAd, setEditingAd] = useState(null);
  const {token} = use(AuthContext);
  useEffect(() => {
    axios
      .get("https://price-tracker-of-market-server.onrender.com/dashboard/my-ads",
        {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
      )
      .then((res) => {
        setAds(res.data);
        setLoading(false);
      })
      .catch(() => {
        setAds([]);
        setLoading(false);
      });
  }, [token]);

  const handleEditClick = (ad) => {
    setEditingAd(ad);
    setShowFormModal(true);
  };

  const handleDeleteClick = (id) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "No, cancel!",
    reverseButtons: true,
  }).then((result) => {
    if (result.isConfirmed) {
      axios
        .delete(`https://price-tracker-of-market-server.onrender.com/dashboard/delete-ads/${id}`,
           {
          headers: {
            Authorization: `Bearer ${token}`, //send token in header
          },
        }
        )
        .then((res) => {
          if (res.data.deletedCount > 0) {
            setAds((prevAds) => prevAds.filter((ad) => ad._id !== id));
            Swal.fire("Deleted!", "Your advertisement has been deleted.", "success");
          }
        });
    }
  });
};

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const formdata = new FormData(form);
    const data = Object.fromEntries(formdata.entries());

    const addata = {
      title: data.title,
      description: data.description,
      image: data.image,
      status: "pending",
    };
    axios
      .put(
        `https://price-tracker-of-market-server.onrender.com/dashboard/update-ads/${editingAd._id}`,
        addata ,
         {
          headers: {
            Authorization: `Bearer ${token}`, //send token in header
          },
        }
      )
      .then((res) => {
        if (res.data.modifiedCount > 0) {
          setAds((preAds) =>
            preAds.map((ad) =>
              ad._id === editingAd._id ? { ...ad, ...addata } : ad
            )
          );
        }
      });
    setShowFormModal(false);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">📢 My Advertisements</h2>

      {/* 🔵 Attractive Bouncing Dots Loader */}
      {loading ? (
        <div className="flex justify-center items-center h-64 space-x-3">
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-4 h-4 bg-green-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
          <div className="w-4 h-4 bg-purple-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Ad Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {ads.map((ad) => (
                <tr key={ad._id}>
                  <td>{ad.title}</td>
                  <td>{ad.description}</td>
                  <td>{ad.status}</td>
                  <td className="flex gap-2">
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => handleEditClick(ad)}
                    >
                      Update
                    </button>
                    <button
                      className="btn btn-sm btn-error"
                      onClick={() => handleDeleteClick(ad._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {showFormModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">✏️ Edit Advertisement</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Ad Title */}
              <div>
                <label className="block font-medium mb-1">📢 Ad Title</label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g. Special Discount on Onions"
                  className="input input-bordered w-full"
                  defaultValue={editingAd ? editingAd.title : ""}
                  required
                />
              </div>

              {/* Short Description */}
              <div>
                <label className="block font-medium mb-1">
                  📝 Short Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  className="textarea textarea-bordered w-full"
                  placeholder="Write a short promotional message..."
                  defaultValue={editingAd ? editingAd.description : ""}
                  required
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block font-medium mb-1">
                  🖼️ Banner / Image URL
                </label>
                <input
                  type="text"
                  name="image"
                  className="input input-bordered w-full"
                  placeholder="Enter image URL..."
                  required
                />
              </div>

              {/* Hidden Status */}
              <input type="hidden" name="status" value="pending" />

              {/* Submit Button */}
              <div className="flex gap-2 ">
                <button type="submit" className="btn btn-success text-lg">
                  Update
                </button>
                <button
                  type="button"
                  className="btn btn-error text-lg"
                  onClick={() => setShowFormModal(false)}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAds;
