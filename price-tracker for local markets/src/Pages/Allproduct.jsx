import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router";
import ReactDatePicker from "react-datepicker";

const Allproduct = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter/sort states
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [sorting, setSorting] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(6);

  // Current page items
  const [currentItems, setCurrentItems] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("https://price-tracker-of-market-server.onrender.com/productsAll");
      if (res.data) {
        setProducts(res.data);
        setFilteredProducts(res.data);
      }
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch products");
      setLoading(false);
    }
  };

  const applyFilterAndSort = () => {
    let filtered = [...products];

    if (startDate) {
      filtered = filtered.filter((product) =>
        product.prices.some((price) => new Date(price.date) >= startDate)
      );
    }

    if (endDate) {
      filtered = filtered.filter((product) =>
        product.prices.some((price) => new Date(price.date) <= endDate)
      );
    }

    filtered = filtered.map((product) => {
      const sortedPrices = [...product.prices].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      return {
        ...product,
        prices: sortedPrices,
        latestPrice: sortedPrices[0]?.price || 0,
      };
    });

    if (sorting === "asc") {
      filtered.sort((a, b) => a.latestPrice - b.latestPrice);
    } else if (sorting === "desc") {
      filtered.sort((a, b) => b.latestPrice - a.latestPrice);
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page after filtering/sorting
  };

  // Calculate total pages reactively
  const totalPages = useMemo(() => {
    return Math.ceil(filteredProducts.length / rowsPerPage);
  }, [filteredProducts, rowsPerPage]);

  // Update currentItems when filteredProducts or currentPage changes
  useEffect(() => {
    const indexOfLastItem = currentPage * rowsPerPage;
    const indexOfFirstItem = indexOfLastItem - rowsPerPage;
    const items = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
    setCurrentItems(items);
  }, [filteredProducts, currentPage, rowsPerPage]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
        All Market Products
      </h2>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-6 mb-8 p-4 bg-gray-50 rounded-lg shadow-sm">
        <div>
          <label className="block mb-1 font-medium text-gray-700 text-sm">
            📅 Start Date
          </label>
          <ReactDatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="yyyy-MM-dd"
            maxDate={new Date()}
            className="border rounded px-3 py-1 text-sm w-36"
            placeholderText="Select start"
            isClearable
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700 text-sm">
            📅 End Date
          </label>
          <ReactDatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="yyyy-MM-dd"
            minDate={startDate}
            maxDate={new Date()}
            className="border rounded px-3 py-1 text-sm w-36"
            placeholderText="Select end"
            isClearable
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700 text-sm">
            ↕️ Sort by Price
          </label>
          <select
            value={sorting}
            onChange={(e) => setSorting(e.target.value)}
            className="border rounded px-3 py-1 text-sm bg-white"
          >
            <option value="">Default</option>
            <option value="asc">Low to High</option>
            <option value="desc">High to Low</option>
          </select>
        </div>

        <button
          onClick={applyFilterAndSort}
          className="bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700"
        >
          Apply Filters
        </button>
      </div>

      {/* Loader & Error */}
      {loading ? (
        <p className="text-center text-green-600">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : currentItems.length === 0 ? (
        <p className="text-center text-gray-600">No products found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentItems.map((product) => {
              const currentPriceData = product.prices?.reduce(
                (latest, current) =>
                  new Date(current.date) > new Date(latest.date) ? current : latest,
                product.prices[0]
              );

              return (
                <div
                  key={product._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
                >
                  <img
                    src={product.imageUrl || product.image}
                    alt={product.marketName}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4 space-y-2">
                    <h3 className="text-xl font-semibold">{product.marketName}</h3>
                    <p className="text-sm text-gray-600">
                      📅 Date: {currentPriceData?.date}
                    </p>
                    <p className="text-md text-gray-800">
                      💵 ৳{currentPriceData?.price || "N/A"}/kg
                    </p>
                    <p className="text-xs text-gray-500">
                      👨‍🌾 Vendor: {product.vendorName}
                    </p>
                    <Link
                      to={`/details/${product._id}`}
                      className="mt-2 block bg-green-600 text-white text-center py-2 rounded hover:bg-green-700"
                    >
                      🔍 View Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          <div className="mt-8 flex justify-center gap-2 items-center">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === idx + 1 ? "bg-green-600 text-white" : "bg-gray-100"
                }`}
              >
                {idx + 1}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Allproduct;
