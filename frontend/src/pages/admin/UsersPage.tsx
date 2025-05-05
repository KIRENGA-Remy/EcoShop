import { useState, useEffect } from 'react';
import { userApi } from '../../api';
import { User, CheckCircle, Trash2 } from 'lucide-react';
import Loader from '../../components/ui/Loader';
import Message from '../../components/ui/Message';
import { toast } from 'react-toastify';
import { useAuthStore } from '../../store/authStore';

interface User {
    id: string;
    username: string;
    email: string;
    isAdmin: boolean
  }

const UsersPage = () => {
  const { user: currentUser } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await userApi.getAll();
      setUsers(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load users');
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (id === currentUser?.id) {
      toast.error('You cannot delete your own account');
      return;
    }

    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        setDeleteLoading(true);
        await userApi.delete(id);
        fetchUsers();
        toast.success('User deleted');
      } catch (err) {
        toast.error('Failed to delete user');
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  return (
    <div className="page-transition">
      <h1 className="text-3xl font-bold mb-6">Users</h1>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="error">{error}</Message>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-cell-header">ID</th>
                  <th className="table-cell-header">Username</th>
                  <th className="table-cell-header">Email</th>
                  <th className="table-cell-header">Admin</th>
                  <th className="table-cell-header">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="table-row">
                    <td className="table-cell text-gray-500">
                      {user.id.substring(0, 8)}...
                    </td>
                    <td className="table-cell font-medium text-gray-900">
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-gray-400 mr-2" />
                        {user.username}
                        {user.id === currentUser?.id && (
                          <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-indigo-100 text-indigo-800">
                            You
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="table-cell">{user?.email}</td>
                    <td className="table-cell">
                      {user?.isAdmin ? (
                        <CheckCircle className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <div className="h-5 w-5"></div>
                      )}
                    </td>
                    <td className="table-cell">
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className={`text-rose-600 hover:text-rose-900 ${user.id === currentUser?.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={deleteLoading || user.id === currentUser?.id}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
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

export default UsersPage;