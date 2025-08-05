// User Dashboard Component
import React, { useState, useEffect } from 'react';
import { Dumbbell, Activity, Trophy, Calendar, User, Clock } from 'lucide-react';
import api from '../api/api'; // Adjust the path if needed
const UserDashboard = ({ user, token, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dietPlan, setDietPlan] = useState(null);
  const [workoutSchedule, setWorkoutSchedule] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'diet') {
      fetchDietPlan();
    } else if (activeTab === 'workout') {
      fetchWorkoutSchedule();
    }
  }, [activeTab]);

  console.log("user---->>>>",user.username);
  

  const fetchDietPlan = async () => {
    setLoading(true);
    try {
      const result = await api.user.getDietPlan(token);
      if (result.success) {
        setDietPlan(result.dietPlan);
      }
    } catch (err) {
      console.error('Failed to fetch diet plan:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkoutSchedule = async () => {
    setLoading(true);
    try {
      const result = await api.user.getWorkoutSchedule(user.id, token);
      if (result.success) {
        setWorkoutSchedule(result.schedules);
      }
    } catch (err) {
      console.error('Failed to fetch workout schedule:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* User Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex  justify-between items-center h-16">
            <div className="flex items-center">
              <Dumbbell className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">AthletiQ Dashboard</span>
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
                  { id: 'diet', label: 'Diet Plan', icon: Trophy },
                  { id: 'workout', label: 'Workout Schedule', icon: Calendar },
                  { id: 'profile', label: 'Profile', icon: User }
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
              {activeTab === 'overview' && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center">
                        <Trophy className="h-8 w-8 text-blue-600" />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-blue-600">Membership</p>
                          <p className="text-lg font-bold text-blue-900">{user.membershipPlan || 'Basic'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center">
                        <Calendar className="h-8 w-8 text-green-600" />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-green-600">This Month</p>
                          <p className="text-lg font-bold text-green-900">0 Workout</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="flex items-center">
                        <Activity className="h-8 w-8 text-purple-600" />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-purple-600">Streak</p>
                          <p className="text-lg font-bold text-purple-900">0 Day</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button 
                        onClick={() => setActiveTab('workout')}
                        className="bg-white p-4 rounded-md shadow-sm hover:shadow-md transition-shadow text-left"
                      >
                        <Calendar className="h-6 w-6 text-blue-600 mb-2" />
                        <p className="font-medium">View Workout Schedule</p>
                        <p className="text-sm text-gray-600">Check your daily workouts</p>
                      </button>
                      
                      <button 
                        onClick={() => setActiveTab('diet')}
                        className="bg-white p-4 rounded-md shadow-sm hover:shadow-md transition-shadow text-left"
                      >
                        <Trophy className="h-6 w-6 text-green-600 mb-2" />
                        <p className="font-medium">View Diet Plan</p>
                        <p className="text-sm text-gray-600">Check your nutrition plan</p>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'diet' && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">My Diet Plan</h2>
                  
                  {loading ? (
                    <div className="text-center py-8">Loading diet plan...</div>
                  ) : dietPlan ? (
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{dietPlan.title}</h3>
                        <p className="text-gray-600 mb-4">{dietPlan.description}</p>
                        <div className="flex items-center">
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                            {dietPlan.calories} calories/day
                          </span>
                        </div>
                      </div>
                      
                      {dietPlan.meals && (
                        <div className="bg-white border rounded-lg p-6">
                          <h4 className="text-lg font-medium text-gray-900 mb-4">Meal Plan</h4>
                          <div className="prose text-gray-600">
                            {typeof dietPlan.meals === 'string' ? (
                              <p>{dietPlan.meals}</p>
                            ) : (
                              <pre className="whitespace-pre-wrap">{JSON.stringify(dietPlan.meals, null, 2)}</pre>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No diet plan assigned yet.</p>
                      <p className="text-sm text-gray-500">Contact your trainer to get a personalized diet plan.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'workout' && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Workout Schedule</h2>
                  
                  {loading ? (
                    <div className="text-center py-8">Loading workout schedule...</div>
                  ) : workoutSchedule.length > 0 ? (
                    <div className="space-y-4">
                      {workoutSchedule.map((schedule) => (
                        <div key={schedule.id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-medium text-gray-900">{schedule.workoutDay}</h3>
                            <Clock className="h-5 w-5 text-gray-400" />
                          </div>
                          <p className="text-gray-600">{schedule.workoutDetails}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No workout schedule available.</p>
                      <p className="text-sm text-gray-500">Contact your trainer to get a workout schedule.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'profile' && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h2>
                  
                  <div className="max-w-md">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <p className="mt-1 text-sm text-gray-900">{user.username}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Membership Plan</label>
                        <p className="mt-1 text-sm text-gray-900">{user.membershipPlan || 'Basic'}</p>
                      </div>
                      
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                        Edit Profile
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UserDashboard;