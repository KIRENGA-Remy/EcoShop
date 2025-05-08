import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authApi } from '../api';
import { useAuthStore } from '../store/authStore';
import { UserPlus } from 'lucide-react';
import Loader from '../components/ui/Loader';
import Message from '../components/ui/Message';
import axios from 'axios';

const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useAuthStore();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const { data } = await authApi.register(username, email, password);
      
      login(data);
      navigate(redirect);
    } catch (err: any) {
        if (axios.isAxiosError(err)) {
          if (err.response) {
            setError(err.response.data?.message || 'Registration failed');
          } else if (err.request) {
            setError('No response from server. Please check your network.');
          } else {
            setError('Unexpected error occurred during registration.');
          }
        } else {
          setError('An unknown error occurred.');
        }
      } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto page-transition">
      <h1 className="text-3xl font-bold mb-6 text-center">Create Account</h1>
      
      {error && <Message variant="error">{error}</Message>}
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
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
              minLength={6}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="form-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
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
                <UserPlus className="h-5 w-5 mr-2" />
                Register
              </>
            )}
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <p>
            Already have an account?{' '}
            <Link
              to={redirect ? `/login?redirect=${redirect}` : '/login'}
              className="text-indigo-600 hover:text-indigo-800"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;