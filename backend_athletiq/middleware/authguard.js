const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_TOKEN; 
const authGuard = (req,res,next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({success : false, message: "Authorization token missing"});
    }
    const token = authHeader.split(' ')[1];
    try{
        const decoded = jwt.verify(token,JWT_SECRET);
        req.user = decoded;
        next();
    }catch (error) {
        return res.status(401).json({success:false,message:'Invalid or expired token'});
    }
}
module.exports= authGuard;