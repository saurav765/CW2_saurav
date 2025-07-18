const route = require("express").Router();
const {createUsers,loginUsers} = require("../controller/usercontroller")
const fileUpload = require('../middleware/multer')
route.post('/createuser',fileUpload("image"),createUsers);
route.post("/loginuser",loginUsers);
module.exports=route;