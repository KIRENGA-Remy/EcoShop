import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import Message from '../components/ui/Message';

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity } = useCartStore();
  const { user } = useAuthStore();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleRemoveFromCart = (id: string) => {
    removeFromCart(id);
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    updateQuantity(id, quantity);
  };

  const handleCheckout = () => {
    if (!user) {
      navigate('/login?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  // Calculate cart totals
  const itemsPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxRate = 0.15;
  const taxPrice = itemsPrice * taxRate;
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  return (
    <div className="page-transition">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-8">
          <ShoppingBag className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <Message>Your cart is empty</Message>
          <Link to="/" className="btn btn-primary mt-4 inline-block">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <li key={item.productId} className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:w-20 sm:h-20 mb-4 sm:mb-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      <div className="flex-1 sm:ml-6">
                        <div className="flex flex-col sm:flex-row sm:justify-between mb-4">
                          <div>
                            <Link
                              to={`/product/${item.productId}`}
                              className="text-lg font-medium text-gray-900 hover:text-indigo-600"
                            >
                              {item.name}
                            </Link>
                            <p className="mt-1 text-sm text-gray-500">
                              ${item.price.toFixed(2)} / each
                            </p>
                          </div>
                          <div className="flex items-center mt-4 sm:mt-0">
                            <select
                              value={item.quantity}
                              onChange={(e) =>
                                handleQuantityChange(
                                  item.productId,
                                  Number(e.target.value)
                                )
                              }
                              className="form-input mr-4 w-16"
                            >
                              {[...Array(Math.min(item.countInStock, 10)).keys()].map((x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => handleRemoveFromCart(item.productId)}
                              className="text-rose-500 hover:text-rose-700"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                        <p className="text-md font-semibold">
                          Subtotal: ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-2 border-b pb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${itemsPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${shippingPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${taxPrice.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-between font-bold text-lg py-4">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <button
                onClick={handleCheckout}
                className="btn btn-primary w-full py-3 flex items-center justify-center"
              >
                Proceed to Checkout <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;