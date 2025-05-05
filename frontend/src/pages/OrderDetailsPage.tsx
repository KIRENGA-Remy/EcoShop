import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { orderApi } from '../api';
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
    product: Product;
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
    paymentCurrency: string;
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

const OrderDetailsPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if(!id) return;
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const { data } = await orderApi.getById(id);
        setOrder(data);
        setLoading(false);
      } catch (err) {
        setError('Could not fetch order details');
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  return (
    <div className="page-transition">
      <h1 className="text-3xl font-bold mb-6">Order Details</h1>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="error">{error}</Message>
      ) : order ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Order Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Order Information</h2>
              <p className="mb-1">
                <span className="font-medium">Order ID:</span> {order.id}
              </p>
              <p className="mb-1">
                <span className="font-medium">Date Placed:</span>{' '}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <p className="mb-1">
                <span className="font-medium">Payment Method:</span>{' '}
                {order.paymentMethod === 'stripe' ? 'Credit Card' : 'Bitcoin'}
              </p>
              <p>
                <span className="font-medium">Payment Currency:</span>{' '}
                {order.paymentCurrency}
              </p>
            </div>

            {/* Shipping Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
              <p className="mb-1">
                <span className="font-medium">Address:</span>{' '}
                {order.shippingAddress.address}
              </p>
              <p className="mb-1">
                <span className="font-medium">City:</span>{' '}
                {order.shippingAddress.city}
              </p>
              <p className="mb-1">
                <span className="font-medium">Postal Code:</span>{' '}
                {order.shippingAddress.postalCode}
              </p>
              <p>
                <span className="font-medium">Country:</span>{' '}
                {order.shippingAddress.country}
              </p>
              
              <div className="mt-4 pt-4 border-t">
                <p className="flex justify-between">
                  <span className="font-medium">Delivery Status:</span>
                  <span className={`${order.isDelivered ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {order.isDelivered ? `Delivered on ${new Date(order.deliveredAt ? order.deliveredAt : '').toLocaleDateString()}` : 'Not Delivered'}
                  </span>
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Order Items</h2>
              <div className="divide-y">
                {order.orderItems.map((orderItem) => {
                  const product = orderItem.product;
                  return (
                    <div key={product.id} className="py-4 flex">
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <div className="ml-4 flex flex-1 flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium text-gray-900">
                            <h3>{product.name}</h3>
                            <p className="ml-4">${orderItem.price.toFixed(2)}</p>
                          </div>
                        </div>
                        <div className="flex flex-1 items-end justify-between text-sm">
                          <p className="text-gray-500">Qty {orderItem.quantity}</p>
                          <p className="text-gray-800 font-medium">
                            Subtotal: ${(orderItem.price * orderItem.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-2 border-b pb-4">
                <div className="flex justify-between">
                  <span>Items</span>
                  <span>${order.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>Included</span>
                </div>
              </div>
              <div className="flex justify-between font-bold text-lg py-4">
                <span>Total</span>
                <span>${order.totalPrice.toFixed(2)}</span>
              </div>
              
              {!order.isPaid ? (
                <div className="mt-4 bg-amber-50 p-4 rounded-md border border-amber-200">
                  <p className="text-amber-800 font-medium">
                    Payment Pending
                  </p>
                  <p className="text-amber-700 text-sm mt-1">
                    Your payment has not been processed yet.
                  </p>
                </div>
              ) : (
                <div className="mt-4 bg-emerald-50 p-4 rounded-md border border-emerald-200">
                  <p className="text-emerald-800 font-medium">
                    Payment Complete
                  </p>
                  <p className="text-emerald-700 text-sm mt-1">
                    Paid on {new Date(order.paidAt ? order.paidAt : '').toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <Message variant="error">Order not found</Message>
      )}
    </div>
  );
};

export default OrderDetailsPage;