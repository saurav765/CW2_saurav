const User = require("../model/user")
const bcrypt = require('bcrypt');
require ("dotenv").config();
const jwt = require("jsonwebtoken");``

const createUsers = async (req, res) => {
    console.log(req.body)

    console.log(req.files?.length ? req.files[0].path : null)

    try {
        const { userName, email, password } = req.body;
        if (!userName || !email || !password) {
            return res.json({ success: false, message: "please enter all fields!!" })
        }
        const image = req.files?.length ? req.files[0].path : null;
        const userExist = await User.findOne({ where: { username: userName } });
        if (userExist) {
            return res.json({ success: false, message: "User already exists, use different username " })
        }
        const emailExist = await User.findOne({ where: { email: email } });
        if (emailExist) {
            return res.json({ success: false, message: "User already exists, use different email " })
        }
        const salt = await bcrypt.genSalt(10);
        const newpassword = await bcrypt.hash(password, salt)
        const newuser = await User.create({
            username: userName, email, password: newpassword, image
        });
        return res.status(201).json({ success: true, newuser, message: "User created !!" });
    } catch (error) {
        return res.status(400).json({ error: error });
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
module.exports ={
    loginUsers,createUsers
}