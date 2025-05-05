import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userApi, orderApi, productsApi } from '../../api';
import { Users, Package, ShoppingBag, DollarSign } from 'lucide-react';
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

//   interface Stats {
//     totalUsers: number;
//     pendingOrders: number;
//     totalProducts: number;
//     totalSales: number;
//   }

const DashboardPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [usersRes, ordersRes, productsRes] = await Promise.all([
          userApi.getAll(),
          orderApi.getAll(),
          productsApi.getAll()
        ]);
        
        setUsers(usersRes.data);
        setOrders(ordersRes.data);
        setProducts(productsRes.data.products);
        setLoading(false);
      } catch (err) {
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Calculate statistics
  const totalSales = orders.reduce((acc, order) => {
    if (order.isPaid) {
      return acc + order.totalPrice;
    }
    return acc;
  }, 0);
  
  const pendingOrders = orders.filter((order) => !order.isDelivered).length;
  
  const topSellingProducts = products
    .sort((a, b) => (b.countInStock < a.countInStock ? -1 : 1))
    .slice(0, 5);

  return (
    <div className="page-transition">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="error">{error}</Message>
      ) : (
        <>
          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-indigo-100 text-indigo-500 mr-4">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Total Users</p>
                  <p className="text-2xl font-bold">{users.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-emerald-100 text-emerald-500 mr-4">
                  <Package className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Pending Orders</p>
                  <p className="text-2xl font-bold">{pendingOrders}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-amber-100 text-amber-500 mr-4">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Total Products</p>
                  <p className="text-2xl font-bold">{products.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-rose-100 text-rose-500 mr-4">
                  <DollarSign className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Total Sales</p>
                  <p className="text-2xl font-bold">${totalSales.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recent orders */}
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Recent Orders</h2>
                <Link to="/admin/orders" className="text-indigo-600 hover:text-indigo-800">
                  View All
                </Link>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="table">
                <thead className="table-header">
                  <tr>
                    <th className="table-cell-header">Order ID</th>
                    <th className="table-cell-header">Date</th>
                    <th className="table-cell-header">Customer</th>
                    <th className="table-cell-header">Total</th>
                    <th className="table-cell-header">Paid</th>
                    <th className="table-cell-header">Delivered</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order.id} className="table-row">
                      <td className="table-cell font-medium text-gray-900">
                        <Link to={`/order/${order.id}`} className="text-indigo-600 hover:text-indigo-800">
                          {order.id.substring(0, 8)}...
                        </Link>
                      </td>
                      <td className="table-cell">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="table-cell">
                        {order.user?.username || 'Unknown'}
                      </td>
                      <td className="table-cell font-medium">
                        ${order.totalPrice.toFixed(2)}
                      </td>
                      <td className="table-cell">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                          {order.isPaid ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="table-cell">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.isDelivered ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                          {order.isDelivered ? 'Yes' : 'No'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Top selling products */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Top Products</h2>
                <Link to="/admin/products" className="text-indigo-600 hover:text-indigo-800">
                  View All
                </Link>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="table">
                <thead className="table-header">
                  <tr>
                    <th className="table-cell-header">Product</th>
                    <th className="table-cell-header">Price</th>
                    <th className="table-cell-header">Category</th>
                    <th className="table-cell-header">In Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {topSellingProducts.map((product) => (
                    <tr key={product.id} className="table-row">
                      <td className="table-cell">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          </div>
                          <div className="ml-4">
                            <Link to={`/product/${product.id}`} className="text-indigo-600 hover:text-indigo-800">
                              {product.name}
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td className="table-cell font-medium">
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="table-cell">
                        {product.category}
                      </td>
                      <td className="table-cell">
                        <span className={product.countInStock > 0 ? 'text-emerald-600' : 'text-rose-600'}>
                          {product.countInStock > 0 ? product.countInStock : 'Out of stock'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;