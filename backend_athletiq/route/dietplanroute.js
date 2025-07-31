const express = require('express');
const router = express.Router();
const {
  createDietPlan,
  assignDietPlanToUser,
  getUserDietPlan,
} = require('../controller/dietPlancontroller');

const authGuard = require('../middleware/authguard');
const isAdmin = require('../middleware/isAdmin');

router.post('/create', authGuard, isAdmin, createDietPlan);
router.post('/assign', authGuard, isAdmin, assignDietPlanToUser);
router.get('/my-plan', authGuard, getUserDietPlan);

module.exports = router;
