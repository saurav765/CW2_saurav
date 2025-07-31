import React, { useState, useEffect } from 'react';
import { Dumbbell, Activity, Trophy, Calendar, User, Clock, Shield, Users } from 'lucide-react';
import api from '../api/api'; // Adjust the path if needed
const AdminDashboard = ({ user, token, onLogout }) => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'trainers') {
      fetchTrainers();
    }
  }, [activeTab]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const result = await api.admin.getAllUsers(token);
      if (result.success) {
        setUsers(result.users);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrainers = async () => {
    setLoading(true);
    try {
      const result = await api.admin.getAllTrainers(token);
      if (result.success) {
        setTrainers(result.trainers);
      }
    } catch (err) {
      console.error('Failed to fetch trainers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const result = await api.admin.deleteUser(userId, token);
        if (result.success) {
          fetchUsers();
        }
      } catch (err) {
        console.error('Failed to delete user:', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Admin Panel</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user.userName}</span>
              <button
                onClick={onLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <div className="bg-white rounded-lg shadow p-6">
              <nav className="space-y-2">
                {[
                  { id: 'users', label: 'Users', icon: Users },
                  { id: 'trainers', label: 'Trainers', icon: User },
                  { id: 'attendance', label: 'Attendance', icon: Calendar },
                  { id: 'memberships', label: 'Memberships', icon: Trophy }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center px-3 py-2 text-left rounded-md transition-colors ${
                      activeTab === item.id 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow">
              {activeTab === 'users' && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Users Management</h2>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                      Add User
                    </button>
                  </div>
                  
                  {loading ? (
                    <div className="text-center py-8">Loading...</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Membership</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {users.map((user) => (
                            <tr key={user.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                    <User className="h-6 w-6 text-gray-500" />
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">{user.userName}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.membershipPlan}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                                }`}>
                                  {user.role}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="text-red-600 hover:text-red-900 ml-4"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'trainers' && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Trainers Management</h2>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                      Add Trainer
                    </button>
                  </div>
                  
                  {loading ? (
                    <div className="text-center py-8">Loading...</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {trainers.map((trainer) => (
                        <div key={trainer.id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center mb-3">
                            <div className="h-12 w-12 rounded-full bg-blue-200 flex items-center justify-center">
                              <User className="h-8 w-8 text-blue-600" />
                            </div>
                            <div className="ml-3">
                              <h3 className="text-lg font-medium text-gray-900">{trainer.fullName}</h3>
                              <p className="text-sm text-gray-500">{trainer.specialization}</p>
                            </div>
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p>📧 {trainer.email}</p>
                            <p>📱 {trainer.phone}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'attendance' && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Attendance Management</h2>
                  <p className="text-gray-600">Attendance tracking features coming soon...</p>
                </div>
              )}

              {activeTab === 'memberships' && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Membership Plans</h2>
                  <p className="text-gray-600">Membership management features coming soon...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminDashboard;