const User = require('../model/user');
const Trainer = require('../model/trainer');
const DietPlan = require('../model/dietplan'); // ✅ NEW
const WorkoutSchedule = require('../model/workoutschedule');

// Trainer-User relationship
Trainer.hasMany(User, { foreignKey: 'trainerId', as: 'members' });
User.belongsTo(Trainer, { foreignKey: 'trainerId', as: 'trainer' });

// DietPlan-User relationship ✅ NEW
User.belongsTo(DietPlan, { foreignKey: 'dietPlanId', as: 'dietPlan' });
DietPlan.hasMany(User, { foreignKey: 'dietPlanId', as: 'users' });

User.hasMany(WorkoutSchedule, { foreignKey: "userId", as: "workoutSchedules" });
WorkoutSchedule.belongsTo(User, { foreignKey: "userId", as: "user" });


module.exports = { User, Trainer, DietPlan, WorkoutSchedule };
