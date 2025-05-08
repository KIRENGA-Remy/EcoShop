import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, LogOut, Menu, X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();
  
  const { user, logout } = useAuthStore();
  const { cartItems } = useCartStore();
  
  const totalItems = cartItems.reduce((acc: any, item: any) => acc + item.quantity, 0);

  // Close mobile menu when navigating
  useEffect(() => {
    setIsOpen(false);
  }, [navigate]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search/${keyword}`);
      setKeyword('');
    } else {
      navigate('/');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-indigo-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <ShoppingCart className="h-7 w-7" />
            <span className="text-xl font-bold">EcoShop</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-64 py-1 px-3 rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
              <button type="submit" className="absolute right-2 top-1.5 text-gray-500">
                <Search className="h-4 w-4" />
              </button>
            </form>

            {/* Cart */}
            <Link to="/cart" className="relative">
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-1">
                  <User className="h-5 w-5" />
                  <span>{user.username}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Orders
                  </Link>
                  {user.is_admin && (
                    <Link
                      to="/admin/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="flex items-center space-x-1">
                <LogOut className="h-5 w-5" />
                <span>Sign In</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white focus:outline-none"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 animate-fadeIn">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full py-2 px-4 rounded text-gray-800"
                />
                <button type="submit" className="absolute right-3 top-2.5 text-gray-500">
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </form>
            <nav className="flex flex-col space-y-3">
              <Link to="/cart" className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <ShoppingCart className="h-5 w-5" />
                  <span>Cart</span>
                </span>
                {totalItems > 0 && (
                  <span className="bg-rose-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
              {user ? (
                <>
                  <Link to="/profile" className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Profile</span>
                  </Link>
                  <Link to="/orders" className="flex items-center space-x-2">
                    <ShoppingCart className="h-5 w-5" />
                    <span>Orders</span>
                  </Link>
                  {user.is_admin && (
                    <Link to="/admin/dashboard" className="flex items-center space-x-2">
                      <User className="h-5 w-5" />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-white"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link to="/login" className="flex items-center space-x-2">
                  <LogOut className="h-5 w-5" />
                  <span>Sign In</span>
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;