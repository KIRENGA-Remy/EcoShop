import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { orderApi, paymentApi } from '../api';
import { useAuthStore } from '../store/authStore';
import { CreditCard, Bitcoin } from 'lucide-react';
import Message from '../components/ui/Message';
import Loader from '../components/ui/Loader';
import { toast } from 'react-toastify';

// Stripe imports
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentForm = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    cartItems,
    shippingAddress,
    savePaymentMethod,
    savePaymentCurrency,
    clearCart,
  } = useCartStore();

  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [paymentCurrency, setPaymentCurrency] = useState('USD');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/checkout');
    }
  }, [shippingAddress, navigate]);

  // Calculate order total
  const itemsPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxRate = 0.15;
  const taxPrice = itemsPrice * taxRate;
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    savePaymentMethod(paymentMethod);
    savePaymentCurrency(paymentCurrency);
    
    if (!stripe || !elements) {
      return;
    }
    
    try {
      setProcessing(true);
      setError('');
      
      // Create order
      const orderData = {
        orderItems: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        shippingAddress,
        paymentMethod,
        paymentCurrency,
        totalPrice
      };
      
      // Create order first (to get order ID)
      const { data: order } = await orderApi.create(orderData);
      
      if (paymentMethod === 'stripe' && paymentCurrency === 'USD') {
        // Process Stripe payment
        const cardElement = elements.getElement(CardElement);
        
        if (!cardElement) {
          throw new Error('Card information is missing');
        }
        
        const { error: stripeError, paymentMethod: stripePaymentMethod } = await stripe.createPaymentMethod({
          type: 'card',
          card: cardElement,
        });
        
        if (stripeError) {
          throw new Error(stripeError.message);
        }
        
        const { data: paymentResult } = await paymentApi.processStripe({
          amount: totalPrice,
          paymentMethodId: stripePaymentMethod.id,
          description: `Order ${order.id}`
        });
        
        // Update order with payment result
        await orderApi.pay(order.id, paymentResult);
        
      } else if (paymentMethod === 'bitpay' && paymentCurrency === 'BTC') {
        // Create BitPay invoice
        const { data: invoice } = await paymentApi.createBitpayInvoice({
          amount: totalPrice,
          orderId: order.id,
          buyerEmail: user?.email
        });
        
        // Redirect to BitPay hosted payment page
        window.location.href = invoice.url;
        return;
      }
      
      // Clear cart and navigate to success page
      clearCart();
      navigate(`/order/success?id=${order.id}`);
      
    } catch (err: any) {
      setError(err.message || 'Payment processing failed');
      toast.error('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto page-transition">
      <h1 className="text-3xl font-bold mb-2">Payment</h1>
      <p className="text-gray-600 mb-6">Step 2: Select Payment Method</p>
      
      {error && <Message variant="error">{error}</Message>}
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Payment Method</label>
            <div className="flex flex-col space-y-3">
              <label className="flex items-center space-x-3 p-3 border rounded cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  value="stripe"
                  checked={paymentMethod === 'stripe'}
                  onChange={() => setPaymentMethod('stripe')}
                  className="h-4 w-4 text-indigo-600"
                />
                <CreditCard className="h-5 w-5 text-gray-600" />
                <span>Credit Card (Stripe)</span>
              </label>
              
              <label className="flex items-center space-x-3 p-3 border rounded cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  value="bitpay"
                  checked={paymentMethod === 'bitpay'}
                  onChange={() => setPaymentMethod('bitpay')}
                  className="h-4 w-4 text-indigo-600"
                />
                <Bitcoin className="h-5 w-5 text-gray-600" />
                <span>Bitcoin (BitPay)</span>
              </label>
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Payment Currency</label>
            <div className="flex flex-col space-y-3">
              <label className="flex items-center space-x-3 p-3 border rounded cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  value="USD"
                  checked={paymentCurrency === 'USD'}
                  onChange={() => setPaymentCurrency('USD')}
                  className="h-4 w-4 text-indigo-600"
                />
                <span>USD (US Dollar)</span>
              </label>
              
              <label className={`flex items-center space-x-3 p-3 border rounded ${paymentMethod === 'bitpay' ? 'cursor-pointer hover:bg-gray-50' : 'cursor-not-allowed bg-gray-50 opacity-60'}`}>
                <input
                  type="radio"
                  value="BTC"
                  checked={paymentCurrency === 'BTC'}
                  onChange={() => setPaymentCurrency('BTC')}
                  disabled={paymentMethod !== 'bitpay'}
                  className="h-4 w-4 text-indigo-600"
                />
                <span>BTC (Bitcoin)</span>
              </label>
            </div>
            
            {paymentMethod === 'bitpay' && paymentCurrency === 'BTC' && (
              <p className="text-sm text-gray-600 mt-2">
                The Bitcoin amount will be calculated at the current exchange rate during checkout.
              </p>
            )}
          </div>
          
          {paymentMethod === 'stripe' && (
            <div className="form-group">
              <label className="form-label">Card Details</label>
              <div className="border rounded p-3">
                <CardElement 
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#424770',
                        '::placeholder': {
                          color: '#aab7c4',
                        },
                      },
                      invalid: {
                        color: '#9e2146',
                      },
                    },
                  }}
                />
              </div>
            </div>
          )}
          
          <div className="border-t mt-6 pt-6">
            <div className="flex justify-between mb-2">
              <span>Subtotal:</span>
              <span>${itemsPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping:</span>
              <span>${shippingPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Tax:</span>
              <span>${taxPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>
          
          <button
            type="submit"
            className="btn btn-primary w-full py-3 mt-6 flex items-center justify-center"
            disabled={!stripe || processing}
          >
            {processing ? <Loader /> : 'Complete Payment'}
          </button>
        </form>
      </div>
    </div>
  );
};

const PaymentPage = () => {
  const [stripeLoading, setStripeLoading] = useState(true);

  useEffect(() => {
    // Simulate stripe loading
    const timer = setTimeout(() => {
      setStripeLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {stripeLoading ? (
        <div className="text-center">
          <Loader />
          <p className="mt-2 text-gray-600">Initializing payment system...</p>
        </div>
      ) : (
        <Elements stripe={stripePromise}>
          <PaymentForm />
        </Elements>
      )}
    </div>
  );
};

export default PaymentPage;