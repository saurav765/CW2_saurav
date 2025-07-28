const MembershipPlan = require("../model/MembershipPlan");

const createMembershipPlan = async (req, res) => {
  try {
    const { planName, price, durationInDays, description } = req.body;

    if (!planName || !price || !durationInDays) {
      return res.status(400).json({ success: false, message: "All required fields must be filled." });
    }

    const existingPlan = await MembershipPlan.findOne({ where: { planName } });
    if (existingPlan) {
      return res.status(400).json({ success: false, message: "Plan with this name already exists." });
    }

    const plan = await MembershipPlan.create({ planName, price, durationInDays, description });
    res.status(201).json({ success: true, message: "Plan created successfully", plan });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating plan", error });
  }
};
const updateMembershipPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { planName, price, durationInDays, description } = req.body;

    const plan = await MembershipPlan.findByPk(id);
    if (!plan) {
      return res.status(404).json({ success: false, message: "Membership plan not found." });
    }

    plan.planName = planName || plan.planName;
    plan.price = price || plan.price;
    plan.durationInDays = durationInDays || plan.durationInDays;
    plan.description = description || plan.description;

    await plan.save();
    res.status(200).json({ success: true, message: "Plan updated", plan });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating plan", error });
  }
};
const deleteMembershipPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await MembershipPlan.findByPk(id);
    if (!plan) {
      return res.status(404).json({ success: false, message: "Membership plan not found." });
    }
    await plan.destroy();
    res.status(200).json({ success: true, message: "Membership plan deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting plan", error });
  }
};
module.exports={ createMembershipPlan,updateMembershipPlan,deleteMembershipPlan }