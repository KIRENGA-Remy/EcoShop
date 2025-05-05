import { useState, useEffect } from 'react';
import { authApi } from '../api';
import { useAuthStore } from '../store/authStore';
import Loader from '../components/ui/Loader';
import Message from '../components/ui/Message';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const { user, login } = useAuthStore();
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      setSuccess(false);
      
      const { data } = await authApi.updateProfile({
        username,
        email,
        password: password ? password : undefined,
      });
      
      // Update user in store
      login(data);
      
      setSuccess(true);
      setPassword('');
      setConfirmPassword('');
      toast.success('Profile updated successfully');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto page-transition">
      <h1 className="text-3xl font-bold mb-6">User Profile</h1>
      
      {error && <Message variant="error">{error}</Message>}
      {success && <Message variant="success">Profile updated successfully</Message>}
      
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
              placeholder="Leave blank to keep current password"
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
              placeholder="Leave blank to keep current password"
            />
          </div>
          
          <button
            type="submit"
            className="btn btn-primary w-full py-3 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? <Loader /> : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;