import React, { use, useState } from "react";
//import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../../../context/AuthContext";

const BecomeVendor = () => {
  const { user, token } = use(AuthContext);
  const [marketName, setMarketName] = useState("");
  const [description, setDescription] = useState("");
  // const navigate = useNavigate();

  const handleVendorRequest = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:3000/become-vendor",
        {
          email: user.email,
          name: user.displayName,
          photo: user.photoURL,
          marketName,
          description,
          status: "pending",
          role: "vendor-request",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.insertedId) {
        console.log(res.data);

        Swal.fire("Success", "Vendor request submitted!", "success");
        //navigate("/dashboard");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Something went wrong!", "error");
    }
  };

  return (
    <motion.div
      className="max-w-2xl mx-auto px-4 py-10"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">
        Become a Vendor
      </h2>
      <form
        onSubmit={handleVendorRequest}
        className="bg-white shadow-lg rounded-xl p-6 space-y-4"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Your Name</label>
          <input
            type="text"
            value={user?.displayName}
            readOnly
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={user?.email}
            readOnly
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Market Name</label>
          <input
            type="text"
            value={marketName}
            onChange={(e) => setMarketName(e.target.value)}
            required
            className="input input-bordered w-full"
            placeholder="e.g. Karwan Bazar"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Why do you want to become a vendor?
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            required
            className="textarea textarea-bordered w-full"
            placeholder="Write a short reason and your experience..."
          />
        </div>

        <button type="submit" className="btn btn-success w-full">
          Submit Request
        </button>
      </form>
    </motion.div>
  );
};

export default BecomeVendor;
