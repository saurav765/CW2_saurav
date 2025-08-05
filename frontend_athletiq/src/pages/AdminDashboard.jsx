import React, { useState, useEffect } from 'react';
import { 
  Dumbbell, Activity, Trophy, Calendar, User, Clock, Shield, Users, 
  Plus, Edit, Trash2, Eye, UserPlus, Search, Filter, X, Save, 
  Mail, Phone, MapPin, Target
} from 'lucide-react';
import api from '../api/api';

const AdminDashboard = ({ user, token, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'user', 'trainer', 'diet', 'workout', 'membership'
  const [editingItem, setEditingItem] = useState(null);
  const [membershipPlans, setMembershipPlans] = useState([]);
  const [dietPlans, setDietPlans] = useState([]);
  const [workoutSchedules, setWorkoutSchedules] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    switch (activeTab) {
      case 'users':
        fetchUsers();
        break;
      case 'trainers':
        fetchTrainers();
        break;
      default:
        break;
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
      const result = await api.trainer.getAllTrainers(token);
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
        const result = await api.admin.deleteUserById(userId, token);
        if (result.success) {
          fetchUsers();
        }
      } catch (err) {
        console.error('Failed to delete user:', err);
      }
    }
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setEditingItem(null);
    setSelectedUser(null);
  };

  const handleSave = async (data) => {
    try {
      setLoading(true);
      let result;
      
      if (modalType === 'user') {
        if (editingItem) {
          // Update existing user
          result = await api.admin.updateUserById(editingItem.id, data, token);
        } else {
          // Create new user
          result = await api.admin.createUser(data, token);
        }
      } else if (modalType === 'trainer') {
        if (editingItem) {
          // Update existing trainer
          result = await api.trainer.updateTrainerById(editingItem.id, data, token);
        } else {
          // Create new trainer
          result = await api.trainer.createTrainer(data, token);
        }
      }
      
      if (result.success) {
        // Refresh the data
        if (modalType === 'user') {
          fetchUsers();
        } else if (modalType === 'trainer') {
          fetchTrainers();
        }
        closeModal();
      } else {
        console.error('Failed to save:', result.message);
      }
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTrainers = trainers.filter(trainer => 
    trainer.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trainer.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <span className="text-gray-700">Welcome, {user.username}</span>
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
                  { id: 'overview', label: 'Overview', icon: Activity },
                  { id: 'users', label: 'Users', icon: Users },
                  { id: 'trainers', label: 'Trainers', icon: User },
                  { id: 'attendance', label: 'Attendance', icon: Calendar },
                  { id: 'memberships', label: 'Memberships', icon: Trophy },
                  { id: 'diet-plans', label: 'Diet Plans', icon: Target },
                  { id: 'workouts', label: 'Workouts', icon: Dumbbell }
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
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-blue-50 rounded-lg p-6">
                      <div className="flex items-center">
                        <Users className="h-8 w-8 text-blue-600" />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-blue-600">Total Users</p>
                          <p className="text-2xl font-bold text-blue-900">{users.length}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 rounded-lg p-6">
                      <div className="flex items-center">
                        <User className="h-8 w-8 text-green-600" />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-green-600">Total Trainers</p>
                          <p className="text-2xl font-bold text-green-900">{trainers.length}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-purple-50 rounded-lg p-6">
                      <div className="flex items-center">
                        <Calendar className="h-8 w-8 text-purple-600" />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-purple-600">Today's Attendance</p>
                          <p className="text-2xl font-bold text-purple-900">0%</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 rounded-lg p-6">
                      <div className="flex items-center">
                        <Trophy className="h-8 w-8 text-yellow-600" />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-yellow-600">Active Plans</p>
                          <p className="text-2xl font-bold text-yellow-900">1</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                      <div className="space-y-3">
                        <button 
                          onClick={() => openModal('user')}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          Add New User
                        </button>
                        <button 
                          onClick={() => openModal('trainer')}
                          className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Trainer
                        </button>
                        <button 
                          onClick={() => openModal('diet')}
                          className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
                        >
                          <Target className="h-4 w-4 mr-2" />
                          Create Diet Plan
                        </button>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                          New user registered: John Doe
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                          Trainer assigned to member
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                          Diet plan created
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Users Tab */}
              {activeTab === 'users' && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Users Management</h2>
                    <div className="flex space-x-3">
                      <div className="relative">
                        <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search users..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <button 
                        onClick={() => openModal('user')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add User
                      </button>
                    </div>
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
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trainer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredUsers.map((user) => (
                            <tr key={user.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                    <User className="h-6 w-6 text-gray-500" />
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">{user.username}</div>
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
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {user.trainerId ? 'Assigned' : 'Not Assigned'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                  onClick={() => openModal('user', user)}
                                  className="text-blue-600 hover:text-blue-900 mr-4"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <Trash2 className="h-4 w-4" />
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

              {/* Trainers Tab */}
              {activeTab === 'trainers' && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Trainers Management</h2>
                    <button 
                      onClick={() => openModal('trainer')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Trainer
                    </button>
                  </div>
                  
                  {loading ? (
                    <div className="text-center py-8">Loading...</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredTrainers.map((trainer) => (
                        <div key={trainer.id} className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow">
                          <div className="flex items-center mb-4">
                            <div className="h-12 w-12 rounded-full bg-blue-200 flex items-center justify-center">
                              <User className="h-8 w-8 text-blue-600" />
                            </div>
                            <div className="ml-3">
                              <h3 className="text-lg font-medium text-gray-900">{trainer.fullName}</h3>
                              <p className="text-sm text-gray-500">{trainer.specialization}</p>
                            </div>
                          </div>
                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 mr-2" />
                              {trainer.email}
                            </div>
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-2" />
                              {trainer.phone}
                            </div>
                          </div>
                          <div className="mt-4 flex space-x-2">
                            <button 
                              onClick={() => openModal('trainer', trainer)}
                              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium"
                            >
                              Edit
                            </button>
                            <button className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                              View Members
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Attendance Tab */}
              {activeTab === 'attendance' && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Attendance Management</h2>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                      Mark Attendance
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Today's Attendance</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Present</span>
                          <span className="text-sm font-medium text-green-600">6 members</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Absent</span>
                          <span className="text-sm font-medium text-red-600">0 members</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Attendance Rate</span>
                          <span className="text-sm font-medium text-blue-600">0%</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Weekly Overview</h3>
                      <div className="space-y-2">
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => (
                          <div key={day} className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">{day}</span>
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${Math.random() * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Memberships Tab */}
              {activeTab === 'memberships' && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Membership Plans</h2>
                    <button 
                      onClick={() => openModal('membership')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Plan
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {['Basic', 'Premium', 'VIP'].map((plan, index) => (
                      <div key={plan} className="bg-white border rounded-lg p-6 hover:shadow-lg transition-shadow">
                        <div className="text-center">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{plan}</h3>
                          <p className="text-3xl font-bold text-blue-600 mb-4">
                            ${[29, 59, 99][index]}<span className="text-sm text-gray-500">/month</span>
                          </p>
                          <ul className="space-y-2 text-sm text-gray-600 mb-6">
                            <li>✓ Gym Access</li>
                            <li>✓ Group Classes</li>
                            {index > 0 && <li>✓ Personal Training</li>}
                            {index > 1 && <li>✓ Nutrition Consultation</li>}
                          </ul>
                          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                            Edit Plan
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Diet Plans Tab */}
              {activeTab === 'diet-plans' && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Diet Plans Management</h2>
                    <button 
                      onClick={() => openModal('diet')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Diet Plan
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">Weight Loss Plan</h3>
                          <p className="text-sm text-gray-600 mt-1">Low-calorie diet for weight management</p>
                          <div className="flex items-center mt-2">
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                              1500 calories/day
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">Muscle Gain Plan</h3>
                          <p className="text-sm text-gray-600 mt-1">High-protein diet for muscle building</p>
                          <div className="flex items-center mt-2">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                              2500 calories/day
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Workouts Tab */}
              {activeTab === 'workouts' && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Workout Schedules</h2>
                    <button 
                      onClick={() => openModal('workout')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Schedule
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Monday - Chest & Triceps</h3>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>• Bench Press - 3 sets x 10 reps</p>
                        <p>• Incline Dumbbell Press - 3 sets x 12 reps</p>
                        <p>• Tricep Dips - 3 sets x 15 reps</p>
                        <p>• Push-ups - 2 sets x 20 reps</p>
                      </div>
                      <div className="mt-4 flex space-x-2">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm">
                          Edit
                        </button>
                        <button className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-3 py-1 rounded text-sm">
                          Assign
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <Modal
          type={modalType}
          item={editingItem}
          onClose={closeModal}
          onSave={handleSave}
          trainers={trainers}
          users={users}
        />
      )}
    </div>
  );
};

// Modal Component
const Modal = ({ type, item, onClose, onSave, trainers, users }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (item) {
      // Map the backend field names to frontend field names
      if (type === 'user') {
        setFormData({
          username: item.username || '',
          email: item.email || '',
          password: '',
          membershipPlan: item.membershipPlan || 'Basic',
          role: item.role || 'user',
          trainerId: item.trainerId || '',
          image: null
        });
      } else {
        setFormData(item);
      }
    } else {
      // Initialize empty form based on type
      switch (type) {
        case 'user':
          setFormData({
            username: '',
            email: '',
            password: '',
            membershipPlan: 'Basic',
            role: 'user',
            trainerId: '',
            image: null
          });
          break;
        case 'trainer':
          setFormData({
            fullName: '',
            specialization: '',
            phone: '',
            email: ''
          });
          break;
        case 'diet':
          setFormData({
            title: '',
            description: '',
            calories: '',
            meals: ''
          });
          break;
        case 'workout':
          setFormData({
            workoutDay: '',
            workoutDetails: '',
            userId: ''
          });
          break;
        case 'membership':
          setFormData({
            planName: '',
            price: '',
            durationInDays: '',
            description: ''
          });
          break;
        default:
          setFormData({});
      }
    }
  }, [item, type]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const getModalTitle = () => {
    const action = item ? 'Edit' : 'Add';
    switch (type) {
      case 'user': return `${action} User`;
      case 'trainer': return `${action} Trainer`;
      case 'diet': return `${action} Diet Plan`;
      case 'workout': return `${action} Workout Schedule`;
      case 'membership': return `${action} Membership Plan`;
      default: return 'Modal';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">{getModalTitle()}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          {type === 'user' && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              {!item && (
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required={!item}
                  />
                </div>
              )}
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Membership Plan</label>
                <select
                  name="membershipPlan"
                  value={formData.membershipPlan || 'Basic'}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Basic">Basic</option>
                  <option value="Premium">Premium</option>
                  <option value="VIP">VIP</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Role</label>
                <select
                  name="role"
                  value={formData.role || 'user'}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Trainer (Optional)</label>
                <select
                  name="trainerId"
                  value={formData.trainerId || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">No Trainer</option>
                  {trainers.map(trainer => (
                    <option key={trainer.id} value={trainer.id}>{trainer.fullName}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">Profile Image</label>
                <input
                  type="file"
                  name="image"
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  accept="image/*"
                />
              </div>
            </>
          )}

          {type === 'trainer' && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Specialization</label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Weight Training, Cardio, Yoga"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </>
          )}

          {type === 'diet' && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Plan Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Calories per Day</label>
                <input
                  type="number"
                  name="calories"
                  value={formData.calories || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">Meal Plan</label>
                <textarea
                  name="meals"
                  value={formData.meals || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  placeholder="Breakfast: ..., Lunch: ..., Dinner: ..."
                />
              </div>
            </>
          )}

          {type === 'workout' && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Workout Day</label>
                <select
                  name="workoutDay"
                  value={formData.workoutDay || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Day</option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Sunday">Sunday</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Assign to User</label>
                <select
                  name="userId"
                  value={formData.userId || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select User</option>
                  {users.map(user => (
                                            <option key={user.id} value={user.id}>{user.username}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">Workout Details</label>
                <textarea
                  name="workoutDetails"
                  value={formData.workoutDetails || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="5"
                  placeholder="Exercise 1: 3 sets x 10 reps&#10;Exercise 2: 3 sets x 12 reps&#10;..."
                  required
                />
              </div>
            </>
          )}

          {type === 'membership' && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Plan Name</label>
                <input
                  type="text"
                  name="planName"
                  value={formData.planName || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Price ($)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  step="0.01"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Duration (Days)</label>
                <input
                  type="number"
                  name="durationInDays"
                  value={formData.durationInDays || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
              </div>
            </>
          )}
          
          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
            >
              {item ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded-md transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard; 
