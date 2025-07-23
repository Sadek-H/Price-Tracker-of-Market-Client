import React, { useEffect, useState, useContext } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
import { useLoaderData, useParams } from "react-router";
import { toast } from "react-toastify";

const EditmyProducts = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [singleproduct, setSingleProduct] = useState({});
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const data = useLoaderData();
  const [userRole, setUserRole] = useState("");

  // Load user role
  useEffect(() => {
    if (user?.email) {
      axios.get(`http://localhost:3000/users`).then((res) => {
        const currentUser = res.data.find((u) => u.email === user.email);
        if (currentUser) {
          setUserRole(currentUser.role);
        }
      });
    }
  }, [user]);

  // Load the product to edit
  useEffect(() => {
    if (data) {
      const product = data.find((item) => item._id === id);
      if (product) {
        setSingleProduct(product);
        const latestDate = product?.prices?.[0]?.date || new Date();
        setSelectedDate(new Date(latestDate));
      }
    }
  }, [data, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSingleProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;

    const newPriceEntry = {
      date: selectedDate.toISOString().split("T")[0],
      price: Number(form.price.value),
    };

   
    // Ensure all existing prices are numbers
    const existingPrices = (singleproduct?.prices || []).map((p) => ({
      ...p,
      price: Number(p.price),
    }));

    //  Check if current date already exists
    const isDateExists = existingPrices.some(
      (p) => p.date === newPriceEntry.date
    );

    let updatedPrices = [...existingPrices];

    if (!isDateExists) {
      updatedPrices.push(newPriceEntry); 
    } else {
     
      updatedPrices = updatedPrices.map((p) =>
        p.date === newPriceEntry.date ? { ...p, price: newPriceEntry.price } : p
      );
    }

    const productData = {
      // vendorEmail: user?.email,
      // vendorName: user?.displayName || "Unknown",
      marketName: form.marketName.value,
      date: newPriceEntry.date,
      description: form.description.value,
      itemName: form.itemName.value,
      imageUrl: form.imageUrl.value,
      itemDescription: form.itemDescription.value,
      status: "pending",
      prices: updatedPrices,
      // pricePerUnit: newPriceEntry.price // optional field to keep latest price separate
    };

    const endpoint =
      userRole === "admin"
        ? `http://localhost:3000/admin/update-product/${id}`
        : `http://localhost:3000/dashboard/update-product/${id}`;

    axios
      .put(endpoint, productData)
      .then((res) => {
        if (res.data.modifiedCount > 0) {
          toast.success("Product updated successfully!");
        } else {
          toast.info("No changes made.");
        }
      })
      .catch((err) => {
        console.error("Update failed:", err);
        toast.error("Failed to update product.");
      });
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-semibold mb-6 text-center text-green-700 border-b pb-2">
        🛒 Update Market Product Info
      </h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Vendor Email (Read only) */}
        <div className="col-span-2">
          <label className="block font-medium mb-1">📧 Vendor Email</label>
          <input
            type="email"
            className="input input-bordered w-full bg-gray-100"
            name="vendorEmail"
            // value={user?.email || ""}
            readOnly
            required
          />
        </div>

        {/* Vendor Name (Read only) */}
        <div className="col-span-2">
          <label className="block font-medium mb-1">🧑‍🌾 Vendor Name</label>
          <input
            type="text"
            className="input input-bordered w-full bg-gray-100"
            name="vendorName"
            //  value={user?.displayName || "Unknown Vendor"}
            readOnly
          />
        </div>

        {/* Market Name */}
        <div>
          <label className="block font-medium mb-1">🏪 Market Name</label>
          <input
            type="text"
            name="marketName"
            className="input input-bordered w-full"
            value={singleproduct.marketName || ""}
            onChange={handleChange}
            required
          />
        </div>

        {/* Date Picker */}
        <div>
          <label className="block font-medium mb-1">📅 Date</label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            className="input input-bordered w-full"
          />
        </div>

        {/* Description */}
        <div className="col-span-2">
          <label className="block font-medium mb-1">
            📝 Market Description
          </label>
          <textarea
            name="description"
            rows={3}
            className="textarea textarea-bordered w-full"
            value={singleproduct.description || ""}
            onChange={handleChange}
            required
          />
        </div>

        {/* Item Name */}
        <div>
          <label className="block font-medium mb-1">🥦 Item Name</label>
          <input
            type="text"
            name="itemName"
            className="input input-bordered w-full"
            value={singleproduct.itemName || ""}
            onChange={handleChange}
            required
          />
        </div>

        {/* Price */}
        <div>
          <label className="block font-medium mb-1">
            💵 Price per Unit (৳)
          </label>
          <input
            type="number"
            name="price"
            className="input input-bordered w-full"
            defaultValue={singleproduct?.prices?.[0]?.price || ""}
            required
            min="0"
            step="0.01"
          />
        </div>

        {/* Image URL */}
        <div className="col-span-2">
          <label className="block font-medium mb-1">🖼️ Product Image URL</label>
          <input
            type="url"
            name="imageUrl"
            className="input input-bordered w-full"
            value={singleproduct.imageUrl || ""}
            onChange={handleChange}
            required
          />
        </div>

        {/* Item Description */}
        <div className="col-span-2">
          <label className="block font-medium mb-1">
            📝 Item Description (Optional)
          </label>
          <textarea
            name="itemDescription"
            rows={2}
            className="textarea textarea-bordered w-full"
            value={singleproduct.itemDescription || ""}
            onChange={handleChange}
          />
        </div>

        {/* Hidden status */}
        <input type="hidden" name="status" value="pending" />

        <div className="col-span-2">
          <button type="submit" className="btn btn-success w-full text-lg">
            ✅ Update Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditmyProducts;
