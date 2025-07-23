import React from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';

const Notfound = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center min-h-screen text-center">

        {/* Image */}
        <motion.div
          className="mb-6 shadow-xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <img
            src="https://i.ibb.co/KcxTTxYs/3737258.jpg"
            alt="Page Not Found"
            className="w-52 sm:w-80 md:w-96 lg:w-1/4 mx-auto"
          />
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-500 mb-4 mulish"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          404 - Page Not Found
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 mulish"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Oops! The page you're looking for doesn't exist.
        </motion.p>

        {/* Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <Link
            to="/"
            className="bg-green-600 text-white rounded-lg hover:bg-green-700 px-5 sm:px-6 py-2 sm:py-3 text-sm sm:text-base mulish transition-all duration-300"
          >
            Go Back Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Notfound;
