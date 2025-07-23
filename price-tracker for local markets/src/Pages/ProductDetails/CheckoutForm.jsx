import React, { use, useEffect, useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/AuthContext';

const CheckoutForm = ({selectedProduct}) => {
  const stripe = useStripe();
  const elements = useElements();
  const {user} = use(AuthContext);
  const [clientSecret, setClientSecret] = useState('');
  const [processing, setProcessing] = useState(false);
  const [paymentSucceeded, setPaymentSucceeded] = useState(false);
 
 
   const amount = parseInt(selectedProduct?.prices?.[0]?.price || "0") * 100;

  useEffect(() => {
    // Call your backend to create payment intent and get clientSecret
    axios
      .post('http://localhost:3000/create-payment-intent', { amount })
      .then((res) => setClientSecret(res.data.clientSecret))
      .catch(() => toast.error('Unable to start payment process.'));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);

    const card = elements.getElement(CardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card,
    });

    if (error) {
      toast.error(error.message);
      setProcessing(false);
      return;
    }

    const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethod.id,
    });

    if (confirmError) {
      toast.error(confirmError.message);
      setProcessing(false);
      return;
    }

    if (paymentIntent.status === 'succeeded') {
        const paymentData ={
            userEmail:user?.email,
            userName : user?.displayName,
            amount : amount,
            paymentIntentId : paymentIntent.id,
            status: paymentIntent.status,
            productId: selectedProduct._id,
            productName : selectedProduct.itemName,
            marketName : selectedProduct.marketName,
            date: new Date().toISOString().split("T")[0],
        }
        axios.post("http://localhost:3000/payments",paymentData)
        .then(()=>  toast.success('Payment successful! Thank you.'));
    
      setPaymentSucceeded(true);
    }
    setProcessing(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white shadow-lg rounded-lg max-w-md w-full p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Pay for Parcel Pickup
        </h2>

        {paymentSucceeded ? (
          <div className="text-center text-green-600 font-semibold text-lg">
            🎉 Your payment was successful!
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label className="block mb-2 text-gray-700 font-medium">
              Card details
            </label>
            <div className="border border-gray-300 rounded-md p-3 mb-6 focus-within:ring-2 focus-within:ring-indigo-400">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#1a202c',
                      '::placeholder': {
                        color: '#a0aec0',
                      },
                    },
                    invalid: {
                      color: '#e53e3e',
                    },
                  },
                }}
              />
            </div>

            <button
              type="submit"
              disabled={!stripe || !clientSecret || processing}
              className={`w-full py-3 rounded-md text-white font-semibold transition ${
                processing
                  ? 'bg-indigo-300 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {processing ? 'Processing...' : 'Pay Now'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CheckoutForm;
