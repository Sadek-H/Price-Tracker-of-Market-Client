import React, { useContext, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import DatePicker from "react-datepicker";
import axios from "axios";
import Swal from "sweetalert2";
const AddProduct = () => {
  const { user } = useContext(AuthContext);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const formdata = new FormData(form);
    const data = Object.fromEntries(formdata.entries());

    const priceDate = [
      { date: selectedDate.toISOString().split("T")[0], price: parseFloat(data.price)},
    ];

    const productData = {
      vendorEmail: data.vendorEmail,
      vendorName: data.vendorName,
      marketName: data.marketName,
      date: data.date || selectedDate.toISOString().split("T")[0],
      description: data.description,
      itemName: data.itemName,
      imageUrl: data.imageUrl,
      itemDescription: data.itemDescription || "",
      status: "pending",
      prices:priceDate,
    };

    console.log(productData);

    axios
      .post("http://localhost:3000/dashboard/add-product", productData)
      .then((res) => {
        if (res.data.insertedId) {
          Swal.fire("Success", "Product added successfully!", "success");
          form.reset();
        }
      });
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-semibold mb-6 text-center text-green-700 border-b pb-2">
        🛒 Submit Daily Market Price
      </h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Vendor Email - read-only */}
        <div className="col-span-2">
          <label className="block font-medium mb-1">📧 Vendor Email</label>
          <input
            type="email"
            className="input input-bordered w-full bg-gray-100"
            name="vendorEmail"
            value={user?.email || ""}
            readOnly
            required
          />
        </div>

        {/* Vendor Name - read-only */}
        <div className="col-span-2">
          <label className="block font-medium mb-1">🧑‍🌾 Vendor Name</label>
          <input
            type="text"
            className="input input-bordered w-full bg-gray-100"
            name="vendorName"
            value={user?.displayName || "Unknown Vendor"}
            readOnly
          />
        </div>

        {/* Market Name */}
        <div className="col-span-1">
          <label className="block font-medium mb-1">🏪 Market Name</label>
          <input
            type="text"
            name="marketName"
            className="input input-bordered w-full"
            required
            placeholder="e.g., Dhaka New Market"
          />
        </div>

        {/* Date (default today) */}
        <div className="col-span-1">
          <label className="block font-medium mb-1">📅 Date</label>
          <DatePicker
            className="input input-bordered w-full"
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
          />
        </div>

        {/* Market Description */}
        <div className="col-span-2">
          <label className="block font-medium mb-1">
            📝 Market Description
          </label>
          <textarea
            name="description"
            rows={3}
            className="textarea textarea-bordered w-full"
            required
            placeholder="Where is the market located? When was it established? Any other info."
          />
        </div>

        {/* Item Name */}
        <div className="col-span-1">
          <label className="block font-medium mb-1">🥦 Item Name</label>
          <input
            type="text"
            name="itemName"
            className="input input-bordered w-full"
            required
            placeholder="e.g., Onion"
          />
        </div>

        {/* Price per Unit */}
        <div className="col-span-1">
          <label className="block font-medium mb-1">
            💵 Price per Unit (৳)
          </label>
          <input
            type="number"
            name="price"
            className="input input-bordered w-full"
            required
            min="0"
            step="0.01"
            placeholder="e.g., 30"
          />
        </div>

        {/* Product Image URL */}
        <div className="col-span-2">
          <label className="block font-medium mb-1">🖼️ Product Image URL</label>
          <input
            type="url"
            name="imageUrl"
            className="input input-bordered w-full"
            required
            placeholder="Image URL"
          />
        </div>

        {/* Item Description (optional) */}
        <div className="col-span-2">
          <label className="block font-medium mb-1">
            📝 Item Description{" "}
            <span className="text-sm text-gray-400">(Optional)</span>
          </label>
          <textarea
            name="itemDescription"
            rows={2}
            className="textarea textarea-bordered w-full"
            placeholder="Freshness, quality, notes, etc."
          />
        </div>

        {/* Status hidden input (default pending) */}
        <input type="hidden" name="status" value="pending" />

        {/* Submit Button */}
        <div className="col-span-2">
          <button type="submit" className="btn btn-success w-full text-lg">
            ✅ Submit Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
