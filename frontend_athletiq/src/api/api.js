
import { User, Dumbbell, Users, Calendar, MapPin, Phone, Mail, Menu, X, Shield, Activity, Trophy, Clock, Plus, Edit, Trash2, Eye, UserPlus, Search, Filter } from 'lucide-react';
import React, { useState, useEffect } from 'react';
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';



// Enhanced API Functions
const api = {
  // Auth APIs
  login: async (email, password) => {
    const response = await fetch(`${API_BASE}/user/loginuser`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return response.json();
  },

  register: async (userData) => {
    const formData = new FormData();
    Object.keys(userData).forEach(key => {
      if (key === 'image' && userData[key]) {
        formData.append('image', userData[key]);
      } else {
        formData.append(key, userData[key]);
      }
    });
    const response = await fetch(`${API_BASE}/user/createuser`, {
      method: 'POST',
      body: formData
    });
    return response.json();
  },

  // Admin APIs
  admin: {
    // User Management
    getAllUsers: async (token) => {
      const response = await fetch(`${API_BASE}/admin/getusers`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.json();
    },

    getUserById: async (id, token) => {
      const response = await fetch(`${API_BASE}/admin/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.json();
    },

    createUser: async (userData, token) => {
      const formData = new FormData();
      Object.keys(userData).forEach(key => {
        if (key === 'image' && userData[key]) {
          formData.append('image', userData[key]);
        } else {
          formData.append(key, userData[key]);
        }
      });
      const response = await fetch(`${API_BASE}/admin/create`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      return response.json();
    },

    updateUserById: async (id, userData, token) => {
      const formData = new FormData();
      Object.keys(userData).forEach(key => {
        if (key === 'image' && userData[key]) {
          formData.append('image', userData[key]);
        } else {
          formData.append(key, userData[key]);
        }
      });
      const response = await fetch(`${API_BASE}/admin/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      return response.json();
    },

    deleteUserById: async (id, token) => {
      const response = await fetch(`${API_BASE}/admin/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.json();
    },

    updateAdminProfile: async (userData, token) => {
      const formData = new FormData();
      Object.keys(userData).forEach(key => {
        if (key === 'image' && userData[key]) {
          formData.append('image', userData[key]);
        } else {
          formData.append(key, userData[key]);
        }
      });
      const response = await fetch(`${API_BASE}/admin/update-profile`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      return response.json();
    },

    // Trainer Management
    createTrainer: async (trainerData, token) => {
      const response = await fetch(`${API_BASE}/trainers/create`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(trainerData)
      });
      return response.json();
    },

    getAllTrainers: async (token) => {
      const response = await fetch(`${API_BASE}/trainers/get`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.json();
    },

    assignTrainerToMember: async (memberId, trainerId, token) => {
      const response = await fetch(`${API_BASE}/user/assign-trainer`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ memberId, trainerId })
      });
      return response.json();
    },

    // Attendance Management
    markAttendance: async (attendanceData, token) => {
      const response = await fetch(`${API_BASE}/attendance/mark`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(attendanceData)
      });
      return response.json();
    },

    getAttendanceHistory: async (userId, month, token) => {
      const response = await fetch(`${API_BASE}/attendance/history/${userId}?month=${month}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.json();
    },

    getMonthlyAttendanceSummary: async (month, token) => {
      const response = await fetch(`${API_BASE}/attendance/summary?month=${month}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.json();
    },

    // Membership Management
    createMembershipPlan: async (planData, token) => {
      const response = await fetch(`${API_BASE}/memberships/create`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(planData)
      });
      return response.json();
    },

    updateMembershipPlan: async (id, planData, token) => {
      const response = await fetch(`${API_BASE}/memberships/update/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(planData)
      });
      return response.json();
    },

    deleteMembershipPlan: async (id, token) => {
      const response = await fetch(`${API_BASE}/memberships/delete/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.json();
    },

    // Diet Plan Management
    createDietPlan: async (dietData, token) => {
      const response = await fetch(`${API_BASE}/dietplans/create`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(dietData)
      });
      return response.json();
    },

    assignDietPlanToUser: async (userId, dietPlanId, token) => {
      const response = await fetch(`${API_BASE}/dietplans/assign`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ userId, dietPlanId })
      });
      return response.json();
    },
     getUserDietPlan: async (userId, dietPlanId, token) => {
      const response = await fetch(`${API_BASE}/dietplans/my-plan`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ userId, dietPlanId })
      });
      return response.json();
    },

    // Workout Schedule Management
    createWorkoutSchedule: async (scheduleData, token) => {
      const response = await fetch(`${API_BASE}/workouts/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(scheduleData)
      });
      return response.json();
    }
  },

  // User APIs
  user: {
    updateUsersBySelf: async (userData, token) => {
      const formData = new FormData();
      Object.keys(userData).forEach(key => {
        if (key === 'image' && userData[key]) {
          formData.append('image', userData[key]);
        } else {
          formData.append(key, userData[key]);
        }
      });
      const response = await fetch(`${API_BASE}/user/update-profile`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      return response.json();
    },

    getUserDietPlan: async (token) => {
      const response = await fetch(`${API_BASE}/dietplans/my-plan`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.json();
    },

    getWorkoutSchedule: async (userId, token) => {
      const response = await fetch(`${API_BASE}/workouts/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.json();
    }
  }
};
export default api;