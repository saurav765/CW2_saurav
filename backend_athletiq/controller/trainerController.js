// controllers/trainerController.js
const Trainer = require('../model/trainer');

exports.createTrainer = async (req, res) => {
  try {
    const { fullName, specialization, phone, email } = req.body;
    const newTrainer = await Trainer.create({ fullName, specialization, phone, email });
    return res.status(201).json({ success: true, trainer: newTrainer });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to create trainer", error: err });
  }
};

exports.getAllTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.findAll();
    return res.status(200).json({ success: true, trainers });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to get trainers", error: err });
  }
};


// module.exports = {
//   createTrainer,getAllTrainers}