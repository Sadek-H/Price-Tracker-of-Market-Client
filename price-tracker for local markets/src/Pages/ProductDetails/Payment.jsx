import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import { useParams } from 'react-router';
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext'; 

const stripePromise = loadStripe(import.meta.env.VITE_payment_key);

const Payment = () => {
  const { id } = useParams(); 
  const { user } = useContext(AuthContext); 
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`https://price-tracker-of-market-server.onrender.com/products/${id}`) 
      .then(res => {
        setSelectedProduct(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        console.error("Failed to load product.");
      });
  }, [id]);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (!selectedProduct) {
    return <div className="text-center py-10 text-red-500">Product not found.</div>;
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm selectedProduct={selectedProduct} user={user} />
    </Elements>
  );
};

export default Payment;
