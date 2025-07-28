const express = require('express');
const router = express.Router();
const { createUser, getAllUsers, getUserById, updateUserById, deleteUserById, updateAdminProfile } = require('../controller/admincontroller'); // assuming these functions are defined in adminController
const authGuard = require('../middleware/authguard'); // protects routes
const isAdmin = require('../middleware/isAdmin'); // admin-only access
const fileUpload = require('../middleware/multer'); // for image upload

// Create user (admin only)
router.post('/create', authGuard, isAdmin, fileUpload('image'), createUser);

// Get all users (admin only)
router.get('/getusers', authGuard, isAdmin, getAllUsers);

// Get user by ID (admin only)
router.get('/:id', authGuard, isAdmin, getUserById);

// Update user by ID (admin only, no password update)
router.put('/:id', authGuard, isAdmin, fileUpload('image'), updateUserById);

// Delete user by ID (admin only)
router.delete('/:id', authGuard, isAdmin, deleteUserById);

// Update admin profile (admin only)
router.put('/update-profile', authGuard, isAdmin, fileUpload('image'),updateAdminProfile);
module.exports = router;
