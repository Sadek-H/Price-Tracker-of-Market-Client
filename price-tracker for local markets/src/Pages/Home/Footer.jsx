import { motion } from "framer-motion";

const Footer = () => {
  return (
    <motion.footer
      className="bg-gray-900 text-gray-300 py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
        
        {/* Logo & Name */}
        <div className="flex items-center space-x-3">
          {/* Replace with your own logo img or SVG */}
       <img className="w-10 h-10 border-1  rounded-b-full" src="  https://i.ibb.co/7LM7D10/vegetable.png" alt="" />
          <span className="text-xl font-semibold">কাঁচাবাজার</span>
        </div>

        {/* Contact Details */}
        <div className="text-center md:text-left space-y-1">
          <p>📞 +880 1234 567890</p>
          <p>✉️ info@localmarkettracker.com</p>
          <p>🏠 Dhaka, Bangladesh</p>
        </div>

        {/* Terms & Social */}
        <div className="flex flex-col items-center md:items-end space-y-4">
          <a
            href="/terms"
            className="text-gray-400 hover:text-green-400 transition-colors duration-300"
          >
            Terms & Conditions
          </a>

          <div className="flex space-x-4">
            {/* Facebook */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:text-green-400 transition-colors duration-300"
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M22 12a10 10 0 10-11.6 9.8v-6.9h-2v-2.9h2v-2.2c0-2 1.2-3.1 3-3.1.9 0 1.8.2 1.8.2v2h-1c-1 0-1.3.6-1.3 1.2v1.9h2.3l-.4 2.9h-1.9v6.9A10 10 0 0022 12z" />
              </svg>
            </a>

            {/* Twitter */}
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="hover:text-green-400 transition-colors duration-300"
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M23 3a10.9 10.9 0 01-3.14.86 4.48 4.48 0 001.98-2.48 9.14 9.14 0 01-2.88 1.1 4.52 4.52 0 00-7.7 4.12A12.8 12.8 0 013 4.8 4.52 4.52 0 004.88 11a4.5 4.5 0 01-2.05-.57v.06a4.52 4.52 0 003.63 4.43 4.52 4.52 0 01-2.04.08 4.52 4.52 0 004.22 3.13 9 9 0 01-5.59 1.92A9.06 9.06 0 012 19.54a12.7 12.7 0 006.92 2" />
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-green-400 transition-colors duration-300"
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm0 2h10a3 3 0 013 3v10a3 3 0 01-3 3H7a3 3 0 01-3-3V7a3 3 0 013-3zm5 3a4 4 0 100 8 4 4 0 000-8zm0 2a2 2 0 110 4 2 2 0 010-4zm4.5-3a1 1 0 100 2 1 1 0 000-2z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="mt-10 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} LocalMarket Tracker. All rights reserved.
      </div>
    </motion.footer>
  );
};

export default Footer;
