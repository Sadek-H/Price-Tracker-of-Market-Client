// components/WhyTrackPrices.jsx
import { motion } from "framer-motion";

const TracPrices = () => {
  return (
    <section className="py-16 bg-green-50">
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
        {/* Image Section */}
        <motion.img
          src="https://i.ibb.co/RTTVK3s2/premium-photo-1686878950187-faf4bb17f5f1-mark-https-images-unsplash-com-opengraph-logo-png-mark-w-64.jpg"
          alt="Local Market"
          className="rounded-xl shadow-lg"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        />

        {/* Text Section */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-green-700 mb-4">
            Why Track Daily Prices?
          </h2>
          <ul className="space-y-3 text-lg text-gray-700">
            <li>✔️ Save money with accurate pricing.</li>
            <li>✔️ Avoid overpriced items in the market.</li>
            <li>✔️ Know price trends at a glance.</li>
            <li>✔️ Buy when prices drop!</li>
            <li>✔️ Make smarter shopping decisions.</li>
          </ul>
          <button className="mt-6 px-5 py-2 bg-green-600 text-white rounded-full hover:bg-green-700">
            Start Now
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default TracPrices;
