import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { ArrowLeft } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/users/${id}`);
        setUsers(users.filter(u => u._id !== id));
      } catch (err) {
        alert('Failed to delete user');
      }
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back navigation button */}
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-primary mb-6 transition group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition duration-200" />
          <span>Back to Dashboard</span>
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-8">Manage Users</h1>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-500 text-sm text-left">
                <tr>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">Loading users...</td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50/50 transition">
                      <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                      <td className="px-6 py-4 text-gray-600">{user.email}</td>
                      <td className="px-6 py-4 text-gray-600 capitalize">{user.role}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.isActive === false ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                          {user.isActive === false ? 'Inactive' : 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {user.role !== 'admin' && (
                          <button onClick={() => handleDelete(user._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition text-sm">
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
