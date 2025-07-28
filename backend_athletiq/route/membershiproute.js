const route = require("express").Router();
const { createMembershipPlan, updateMembershipPlan, deleteMembershipPlan } = require("../controller/membershipcontroller");
const authGuard  = require("../middleware/authguard");
const isAdmin = require("../middleware/isAdmin");

route.post("/create", authGuard, isAdmin, createMembershipPlan);
route.put("/update/:id", authGuard, isAdmin, updateMembershipPlan);
route.delete("/delete/:id", authGuard, isAdmin, deleteMembershipPlan);
module.exports = route;
