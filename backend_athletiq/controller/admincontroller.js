const bcrypt = require('bcrypt');
const User = require('../model/user');

const createUser = async (req, res) => {
  try {
    const { username, email, password, membershipPlan, role, trainerId } = req.body;
    if (!username || !email || !password || !membershipPlan) {
      return res.status(400).json({ success: false, message: "Required fields missing" });
    }

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Username already taken" });
    }
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ success: false, message: "Email already in use" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      membershipPlan,
      role: role || 'user',
      trainerId: trainerId || null,
      image: req.files?.length ? req.files[0].path : null,
    });

    return res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error creating user", error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    return res.status(200).json({ success: true, users });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error fetching users", error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error fetching user", error: error.message });
  }
};

const updateUserById = async (req, res) => {
  try {
    const { username, email, membershipPlan, role, trainerId } = req.body;

    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Check username and email uniqueness if changed
    if (username && username !== user.username) {
      const usernameExists = await User.findOne({ where: { username } });
      if (usernameExists) return res.status(400).json({ success: false, message: "Username already taken" });
    }
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ where: { email } });
      if (emailExists) return res.status(400).json({ success: false, message: "Email already in use" });
    }

    // Update fields except password
    user.username = username || user.username;
    user.email = email || user.email;
    user.membershipPlan = membershipPlan || user.membershipPlan;
    user.role = role || user.role;
    user.trainerId = trainerId !== undefined ? trainerId : user.trainerId;
    if (req.files?.length) {
      user.image = req.files[0].path;
    }

    await user.save();
    // Exclude password from response
    const { password, ...userData } = user.toJSON();

    return res.status(200).json({ success: true, message: "User updated", user: userData });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error updating user", error: error.message });
  }
};

const deleteUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    await user.destroy();
    return res.status(200).json({ success: true, message: "User deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error deleting user", error: error.message });
  }
};



const updateAdminProfile = async (req, res) => {
  try {
    const adminId = req.user.id; // from auth middleware
    const { username, email, password } = req.body;
    const image = req.files?.length ? req.files[0].path : null;

    const admin = await User.findByPk(adminId);
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied." });
    }

    // Check username uniqueness if changed
    if (username && username !== admin.username) {
      const usernameExists = await User.findOne({ where: { username } });
      if (usernameExists) {
        return res.status(400).json({ success: false, message: "Username already taken" });
      }
    }

    // Check email uniqueness if changed
    if (email && email !== admin.email) {
      const emailExists = await User.findOne({ where: { email } });
      if (emailExists) {
        return res.status(400).json({ success: false, message: "Email already in use" });
      }
    }

    // Hash password if provided
    let hashedPassword;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    const updatedData = {
      ...(username && { username }),
      ...(email && { email }),
      ...(hashedPassword && { password: hashedPassword }),
      ...(image && { image }),
    };

    await User.update(updatedData, { where: { id: adminId } });

    const updatedAdmin = await User.findByPk(adminId, {
      attributes: ['id', 'username', 'email', 'image', 'role'],
    });

    return res.status(200).json({ success: true, message: "Profile updated successfully", admin: updatedAdmin });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error updating profile", error: error.message || error });
  }
};



module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
    updateAdminProfile,
};
