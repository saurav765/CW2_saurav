const User = require("../model/user")
const Trainer = require("../model/trainer");
const bcrypt = require('bcrypt');
require ("dotenv").config();
const jwt = require("jsonwebtoken");``
const createUsers = async (req, res) => {
    try {
        const { userName, email, password, membershipPlan } = req.body;
        if (!userName || !email || !password || !membershipPlan) {
            return res.json({ success: false, message: "Please fill all required fields: username, email, password, and membership plan." });
        }
        const image = req.files?.length ? req.files[0].path : null;
        const userExist = await User.findOne({ where: { username: userName } });
        if (userExist) {
            return res.json({ success: false, message: "Username already taken. Please choose a different one." });
        }
        const emailExist = await User.findOne({ where: { email: email } });
        if (emailExist) {
            return res.json({ success: false, message: "Email already registered. Please use a different email." });
        }
        const salt = await bcrypt.genSalt(10);
        const newpassword = await bcrypt.hash(password, salt);
        const newuser = await User.create({
            username: userName,
            email,
            password: newpassword,
            image,
            membershipPlan
        });
        return res.status(201).json({ success: true, newuser, message: "User created successfully!" });
    } catch (error) {
        return res.status(400).json({ success: false, error: error.message || error });
    }
};


const loginUsers= async (req,res) => {
    console.log(req.body)
    try{
        const {email,password} = req.body;
        const user = await User.findOne({where:{email:email}});
        
        if(!user) {
            return res.status(404).json({success:false,message:'User not found!!!'});
            
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch) {
            return res.status(401).json({success:false, message:'invalid credentials'})
        }
        const token=jwt.sign(
            {id:user.id,email:user.email,role:user.role},
            process.env.JWT_TOKEN,
            {expiresIn:'6h'}
        );
        console.log(token)
        return res.status(200).json({
            success:true,message:"Login successful",token,user:{
                id:user.id,
                username:user.username,
                email:user.email
            }
        });
    } catch (error) {
        res.status(400).json({error:error});
    }
};

const deleteUsers=async(req,res)=>{
try{
const{id}=req.params;
const user=await User.findByPk(id);
if(!user){
return res.status(404).json({success:false,message:"Member not found."});
}
await user.destroy();
return res.status(200).json({success:true,message:"Member deleted successfully."});
}catch(error){
return res.status(500).json({success:false,message:"Error deleting member",error});
}
};

const updateUsersBySelf = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, password } = req.body;
    const image = req.files?.length ? req.files[0].path : null;

    const userExist = await User.findByPk(userId);
    if (!userExist) {
      return res.status(404).json({ success: false, message: "User doesn't exist" });
    }

    // Check username uniqueness if changed
    if (username && username !== userExist.username) {
      const usernameExists = await User.findOne({ where: { username } });
      if (usernameExists) {
        return res.status(400).json({ success: false, message: "Username already taken" });
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
      ...(hashedPassword && { password: hashedPassword }),
      ...(image && { image }),
    };

    await User.update(updatedData, { where: { id: userId } });

    const updatedUser = await User.findByPk(userId, { attributes: ['id', 'username', 'email', 'image', 'role', 'membershipPlan'] });

    return res.status(200).json({ success: true, message: "User updated successfully", user: updatedUser });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error updating user", error: error.message || error });
  }
};
const findUserById=async(req,res) => {
    const userId=req.params.id;
    try{
        const userExist=await User.findOne({where : {id:userId}})
        if (userExist) {
            console.log("User")
            return res.json({message:"userExist"})
        } else {
            return res.json({message: "User not found"})
        }
    } catch(error) {
        return res.status(400).json({error: error});
    }
}

const assignTrainerToMember = async (req, res) => {
  try {
    const { memberId, trainerId } = req.body;

    // Check if member exists
    const member = await User.findByPk(memberId);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    // Check if trainer exists
    const trainer = await Trainer.findByPk(trainerId);
    if (!trainer) {
      return res.status(404).json({ success: false, message: 'Trainer not found' });
    }

    // Assign trainerId to user
    member.trainerId = trainerId;
    await member.save();

    return res.status(200).json({ success: true, message: 'Trainer assigned to member', member });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error assigning trainer', error });
  }
};

module.exports ={
    loginUsers,createUsers,updateUsersBySelf,findUserById,deleteUsers,assignTrainerToMember
}