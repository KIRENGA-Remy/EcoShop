import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authApi } from '../api';
import { useAuthStore } from '../store/authStore';
import { LogIn } from 'lucide-react';
import Loader from '../components/ui/Loader';
import Message from '../components/ui/Message';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirect = location.search ? location.search.split('=')[1] : '/';

  useEffect(() => {
    if (user) {
      navigate(redirect);
    }
  }, [user, navigate, redirect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      
      const { data } = await authApi.login(email, password);
      
      login(data);
      navigate(redirect);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto page-transition">
      <h1 className="text-3xl font-bold mb-6 text-center">Sign In</h1>
      
      {error && <Message variant="error">{error}</Message>}
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button
            type="submit"
            className="btn btn-primary w-full py-3 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <Loader />
            ) : (
              <>
                <LogIn className="h-5 w-5 mr-2" />
                Sign In
              </>
            )}
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <p>
            New customer?{' '}
            <Link
              to={redirect ? `/register?redirect=${redirect}` : '/register'}
              className="text-indigo-600 hover:text-indigo-800"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;