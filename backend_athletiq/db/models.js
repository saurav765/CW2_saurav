const User = require('../model/user');
const Trainer = require('../model/trainer');

Trainer.hasMany(User, { foreignKey: 'trainerId', as: 'members' });
User.belongsTo(Trainer, { foreignKey: 'trainerId', as: 'trainer' });

module.exports = { User, Trainer };
