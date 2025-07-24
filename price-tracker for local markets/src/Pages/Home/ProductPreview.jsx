import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { motion } from 'framer-motion';

// Create animated Link component
const MotionLink = motion(Link);

const ProductPreview = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("https://price-tracker-of-market-server.onrender.com/products")
      .then((res) => {
        if (res.data) setProducts(res.data);
      });
  }, []);

  return (
    <div className="px-6 py-12 bg-white min-h-screen">
      <motion.h2
        className="text-3xl font-extrabold text-center text-green-800 mb-12 flex items-center justify-center gap-2"
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span role="img" aria-label="cart">🛒</span> Featured Market Products
      </motion.h2>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
        }}
      >
    {products
  .filter(product => product.status === "approved")
  .map(product => {
    const sortedPrices = [...(product.prices || [])].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    const latestPriceObj = sortedPrices[0] || { price: 0, date: '' };
    const latestPrice = Number(latestPriceObj.price);
    const latestDate = latestPriceObj.date || product.date;

  return (
    <motion.div
      key={product._id}
      className="bg-green-50 rounded-xl border border-green-200 shadow-md hover:shadow-lg transition-shadow cursor-pointer flex flex-col max-w-sm"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      whileHover={{ scale: 1.03 }}
      onClick={() => navigate(`/details/${product._id}`)}
    >
      {/* Image */}
      <div className="rounded-t-xl overflow-hidden shadow-inner">
        <img
          src={product.imageUrl}
          alt={product.itemName}
          className="w-full h-42 object-center object-fill"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Status */}
        <span
          className={`w-max mb-2 px-2 py-1 rounded-full text-xs font-semibold
            ${product.status === 'approved' ? 'bg-green-200 text-green-800' : 
              product.status === 'pending' ? 'bg-yellow-200 text-yellow-800' : 
              'bg-red-200 text-red-800'}`}
        >
          {product.status.toUpperCase()}
        </span>

        {/* Market & Date */}
        <h3 className="text-base font-semibold text-green-900 mb-1">{product.marketName}</h3>
        <p className="text-xs text-green-700 mb-3">📅 {new Date(latestDate).toLocaleDateString()}</p>

        {/* Item & Price */}
        <p className="text-green-800 font-semibold mb-5 text-sm">
          🧅 {product.itemName} — <span className="text-green-900 font-bold">৳{latestPrice}</span>/kg
        </p>

        {/* Description */}
        {product.description && (
          <p className="text-green-700 text-xs mb-6 line-clamp-3">
            {product.description}
          </p>
        )}

        {/* Button */}
        <MotionLink
          to={`/details/${product._id}`}
          whileTap={{ scale: 0.95 }}
          className="mt-auto bg-green-600 hover:bg-green-700 text-white rounded-lg py-2 font-medium transition text-sm text-center block"
          onClick={(e) => e.stopPropagation()}
        >
          🔍 View Details
        </MotionLink>
      </div>
    </motion.div>
  );
})}

      </motion.div>
    </div>
  );
};

export default ProductPreview;
