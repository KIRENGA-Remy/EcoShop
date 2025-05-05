import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderApi } from '../../api';
import { Eye, CheckCircle, XCircle } from 'lucide-react';
import Loader from '../../components/ui/Loader';
import Message from '../../components/ui/Message';

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

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data } = await orderApi.getAll();
        setOrders(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load orders');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="page-transition">
      <h1 className="text-3xl font-bold mb-6">Orders</h1>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="error">{error}</Message>
      ) : orders.length === 0 ? (
        <Message>No orders found</Message>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-cell-header">ID</th>
                  <th className="table-cell-header">User</th>
                  <th className="table-cell-header">Date</th>
                  <th className="table-cell-header">Total</th>
                  <th className="table-cell-header">Payment</th>
                  <th className="table-cell-header">Method</th>
                  <th className="table-cell-header">Delivered</th>
                  <th className="table-cell-header"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="table-row">
                    <td className="table-cell font-medium text-gray-900">
                      {order.id.substring(0, 8)}...
                    </td>
                    <td className="table-cell">
                      {order.user?.username || 'Unknown'}
                    </td>
                    <td className="table-cell">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="table-cell font-medium">
                      ${order.totalPrice.toFixed(2)}
                    </td>
                    <td className="table-cell">
                      {order.isPaid ? (
                        <div className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-emerald-500 mr-1" />
                          <span className="text-sm">
                            {/* {new Date(order.paidAt).toLocaleDateString()} */}
                            {order.paidAt ? new Date(order.paidAt).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <XCircle className="h-5 w-5 text-rose-500 mr-1" />
                          <span>Not Paid</span>
                        </div>
                      )}
                    </td>
                    <td className="table-cell">
                      <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800">
                        {order.paymentMethod === 'stripe' ? 'Credit Card' : 'Bitcoin'}
                      </span>
                    </td>
                    <td className="table-cell">
                      {order.isDelivered ? (
                        <div className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-emerald-500 mr-1" />
                          <span className="text-sm">
                            {/* {new Date(order.deliveredAt).toLocaleDateString()} */}
                            { order.deliveredAt ? new Date(order.deliveredAt).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <XCircle className="h-5 w-5 text-rose-500 mr-1" />
                          <span>Not Delivered</span>
                        </div>
                      )}
                    </td>
                    <td className="table-cell text-right">
                      <Link
                        to={`/order/${order.id}`}
                        className="text-indigo-600 hover:text-indigo-900 flex items-center justify-end"
                      >
                        <Eye className="h-5 w-5 mr-1" />
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;