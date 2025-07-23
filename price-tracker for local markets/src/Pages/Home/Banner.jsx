import React from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";

const Banner = () => {
  return (
    <div className="bg-[#C7EDC3] py-8 sm:py-20"> {/* slightly less padding on small */}
      <div className="max-w-7xl mx-auto px-4 flex flex-col-reverse md:flex-row items-center justify-between gap-8 sm:gap-10">

        {/* Text Section */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 text-center md:text-left"
        >
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold inter text-green-700 mb-3 sm:mb-4 leading-snug">
            Daily Local Market Price Tracker
          </h1>
          <p className="text-gray-700 text-base sm:text-lg inter mb-5 sm:mb-6 max-w-md mx-auto inter md:mx-0">
            Stay updated with daily product prices, compare across markets, and shop smarter!
          </p>
          <Link
            to="/products"
            className="inline-block px-5 py-3 sm:px-6 sm:py-3 bg-green-600 text-white inter text-base sm:text-lg font-medium rounded-lg hover:bg-green-700 transition-all shadow-md hover:scale-105"
          >
            View Today's Prices
          </Link>
        </motion.div>

        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1"
        >
          <div className="relative w-full max-w-xs sm:max-w-md h-44 sm:h-72 mx-auto">
            <motion.img
              src="/assets/banner1.png"
              alt="Market Van"
              className="lg:absolute lg:top-0 lg:left-0 w-full h-full object-contain z-10"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            />
            <motion.img
              src="/assets/banner-img.png"
              alt="Vegetable Crate"
              className="absolute -bottom-2 -right-2 w-20 h-28 sm:w-44 sm:h-52 object-contain z-20 transform translate-x-1 translate-y-1 sm:translate-x-5 sm:translate-y-5"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Banner;
