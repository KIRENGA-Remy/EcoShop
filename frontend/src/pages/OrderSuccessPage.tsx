import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { orderApi } from '../api';
import { CheckCircle } from 'lucide-react';
import Loader from '../components/ui/Loader';
import Message from '../components/ui/Message';

interface Product {
    id: string;
    name: string;
    price: number;
    description?: string;
    image: string;
    category: string;
    countInStock: number;
    rating?: number;
    numReviews?: number;
    createdAt?: string;
    updatedAt?: string;
  }

interface User {
    id: string;
    username: string;
    email: string;
  }
  
  interface OrderItem {
    product: string | Product;
    name: string;
    quantity: number;
    price: number;
  }

interface Order {
    id: string;
    user: User;
    orderItems: OrderItem[];
    shippingAddress: {
      address: string;
      city: string;
      postalCode: string;
      country: string;
    };
    paymentMethod: string;
    itemsPrice: number;
    taxPrice: number;
    shippingPrice: number;
    totalPrice: number;
    isPaid: boolean;
    paidAt?: string;
    isDelivered: boolean;
    deliveredAt?: string;
    createdAt: string;
    updatedAt?: string;
  }


const OrderSuccessPage = () => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  
  const location = useLocation();
  const orderId = new URLSearchParams(location.search).get('id');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (orderId) {
          setLoading(true);
          const { data } = await orderApi.getById(orderId);
          setOrder(data);
          setLoading(false);
        }
      } catch (err) {
        setError('Could not fetch order details');
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  return (
    <div className="max-w-lg mx-auto text-center page-transition">
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="error">{error}</Message>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-gray-600 mb-6">
              Thank you for your purchase. Your order has been confirmed.
            </p>
            
            {order && (
              <div className="border-t pt-4 mt-4">
                <p className="text-gray-700 mb-1">
                  <span className="font-medium">Order ID:</span> {order.id}
                </p>
                <p className="text-gray-700 mb-1">
                  <span className="font-medium">Payment Method:</span>{' '}
                  {order.paymentMethod === 'stripe' ? 'Credit Card' : 'Bitcoin'}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Amount Paid:</span> ${order.totalPrice.toFixed(2)}
                </p>
              </div>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
            <Link to="/" className="btn btn-primary px-8 py-3">
              Continue Shopping
            </Link>
            <Link to="/orders" className="btn btn-secondary px-8 py-3">
              View My Orders
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderSuccessPage;