import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderApi } from '../api';
import { Clock, CheckCircle, Package, Eye } from 'lucide-react';
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

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data } = await orderApi.getMyOrders();
        setOrders(data);
        setLoading(false);
      } catch (err) {
        setError('Could not fetch orders');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getOrderStatusIcon = (order: any) => {
    if (!order.isPaid) {
      return <Clock className="h-5 w-5 text-amber-500" />;
    } else if (!order.isDelivered) {
      return <Package className="h-5 w-5 text-indigo-500" />;
    } else {
      return <CheckCircle className="h-5 w-5 text-emerald-500" />;
    }
  };

  const getOrderStatus = (order: any) => {
    if (!order.isPaid) {
      return 'Awaiting Payment';
    } else if (!order.isDelivered) {
      return 'Processing';
    } else {
      return 'Delivered';
    }
  };

  return (
    <div className="page-transition">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="error">{error}</Message>
      ) : orders.length === 0 ? (
        <Message>You have no orders yet</Message>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-cell-header">Order ID</th>
                <th className="table-cell-header">Date</th>
                <th className="table-cell-header">Total</th>
                <th className="table-cell-header">Payment</th>
                <th className="table-cell-header">Status</th>
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
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="table-cell font-medium">
                    ${order.totalPrice.toFixed(2)}
                  </td>
                  <td className="table-cell">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {order.isPaid ? 'Paid' : 'Pending'}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center">
                      {getOrderStatusIcon(order)}
                      <span className="ml-1.5">{getOrderStatus(order)}</span>
                    </div>
                  </td>
                  <td className="table-cell text-right">
                    <Link
                      to={`/order/${order.id}`}
                      className="text-indigo-600 hover:text-indigo-900 inline-flex items-center"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;