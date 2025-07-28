// routes/trainerRoutes.js
const express = require('express');
const router = express.Router();
const { createTrainer, getAllTrainers } = require('../controller/trainerController');
const authGuard = require('../middleware/authguard'); // if using auth
const isAdmin = require('../middleware/isAdmin'); // if using admin check
router.post('/create', authGuard, isAdmin, createTrainer);
router.get('/get', authGuard, isAdmin, getAllTrainers);

module.exports = router;
