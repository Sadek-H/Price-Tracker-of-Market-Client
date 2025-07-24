import axios from "axios";
import React, { use } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../../../context/AuthContext";

const AddAds = () => {
  const { user, token } = use(AuthContext);
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const formdata = new FormData(form);
    const data = Object.fromEntries(formdata.entries());
    console.log(data);
    const adData = {
      userEmail: user?.email,
      title: data.title,
      description: data.description,
      image: data.image,
      status: "pending",
    };
    axios
      .post("https://price-tracker-of-market-server.onrender.com/dashboard/add-advertisement", adData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data.insertedId) {
          Swal.fire("Success", "Advertisement added successfully!", "success");
          form.reset();
        }
      });
  };
  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md p-8 rounded-xl">
      <h2 className="text-3xl font-bold text-green-700 text-center mb-6 border-b pb-2">
        📢 Post New Advertisement
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Ad Title */}
        <div>
          <label className="block font-medium mb-1">📢 Ad Title</label>
          <input
            type="text"
            name="title"
            placeholder="e.g. Special Discount on Onions"
            className="input input-bordered w-full"
            required
          />
        </div>

        {/* Short Description */}
        <div>
          <label className="block font-medium mb-1">📝 Short Description</label>
          <textarea
            name="description"
            rows={3}
            className="textarea textarea-bordered w-full"
            placeholder="Write a short promotional message..."
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
        <div>
          <button type="submit" className="btn btn-success w-full text-lg">
            ✅ Submit Advertisement
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAds;
