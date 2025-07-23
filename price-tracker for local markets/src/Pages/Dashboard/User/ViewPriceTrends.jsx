import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const ViewPriceTrends = () => {
  const [groupedProducts, setGroupedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    axios.get("http://localhost:3000/watchlist")
      .then(res => {
        const data = res.data;
        const productMap = new Map();

        data.forEach(item => {
          const itemName = item.itemName;

          if (!productMap.has(itemName)) {
            productMap.set(itemName, {
              itemName: itemName,
              prices: []
            });
          }

          if (Array.isArray(item.prices)) {
            item.prices.forEach(p => {
              const cleanedPrice = Number(String(p.price).replace(/[^\d.]/g, ""));
              const dateObject = new Date(p.date);
              const isValidDate = p.date && !isNaN(dateObject.getTime());

              if (isValidDate && cleanedPrice > 0) {
                productMap.get(itemName).prices.push({
                  date: dateObject,
                  price: cleanedPrice
                });
              }
            });
          }
        });

        const processedProducts = Array.from(productMap.values()).map(product => ({
          ...product,
          prices: product.prices.sort((a, b) => a.date.getTime() - b.date.getTime())
        }));

        setGroupedProducts(processedProducts);
        if (processedProducts.length > 0) {
          setSelectedIndex(0);
        }
      })
      .catch(err => {
        console.error("Error fetching watchlist data:", err);
        alert("Failed to fetch watchlist data. Please check your server.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <svg
          className="animate-spin -ml-1 mr-3 h-10 w-10 text-purple-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
        <span className="text-purple-600 text-lg font-semibold">Loading price trends...</span>
      </div>
    );

  if (!groupedProducts.length) return <p className="text-center mt-8 text-gray-500">No tracked items found.</p>;

  const selectedProduct = groupedProducts[selectedIndex] || {};
  const { itemName, prices = [] } = selectedProduct;

  const chartData = prices.map(({ date, price }) => ({
    date: date.toLocaleDateString("en-GB"),
    price
  }));

  if (!chartData.length && itemName) {
    chartData.push({ date: "No data", price: 0 });
  }

  const calculateTrendPercentage = () => {
    if (prices.length < 2) return '0%';

    const latestPriceEntry = prices.at(-1);
    const latestPrice = latestPriceEntry.price;
    const latestDate = latestPriceEntry.date;

    const sevenDaysAgo = new Date(latestDate);
    sevenDaysAgo.setDate(latestDate.getDate() - 7);

    let historicalPrice = prices[0].price;
    for (let i = prices.length - 1; i >= 0; i--) {
      if (prices[i].date <= sevenDaysAgo) {
        historicalPrice = prices[i].price;
        break;
      }
    }

    if (historicalPrice <= 0) return '0%';

    const change = ((latestPrice - historicalPrice) / historicalPrice) * 100;
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(1)} %`;
  };

  const trendPercentage = calculateTrendPercentage();

  return (
    <div className="max-w-5xl mx-auto my-8 flex gap-5 px-4">
      {/* Sidebar */}
      <aside className="flex-1 border-r border-gray-300 pr-4">
        <h3 className="text-2xl font-bold mb-4">Tracked Items</h3>
        <ul className="list-none p-0 m-0">
          {groupedProducts.map((product, idx) => {
            const isSelected = selectedIndex === idx;
            return (
              <li
                key={product.itemName}
                onClick={() => setSelectedIndex(idx)}
                className={`cursor-pointer rounded-md mb-2 px-3 py-2
                  ${isSelected ? 'bg-gray-200 font-semibold' : 'hover:bg-gray-100'}`}
              >
                {product.itemName}
              </li>
            );
          })}
        </ul>
      </aside>

      {/* Chart Section */}
      <main className="flex-3 pl-6 w-full">
        <h2 className="text-xl font-semibold mb-4">{itemName}</h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={value => `৳${value}`} />
            <Legend />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
              name="Price (৳)"
            />
          </LineChart>
        </ResponsiveContainer>

        <p className="mt-4 font-bold">
          Trend:{' '}
          <span className={trendPercentage.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
            {trendPercentage} last 7 days
          </span>
        </p>
      </main>
    </div>
  );
};

export default ViewPriceTrends;
