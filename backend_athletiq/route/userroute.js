const route = require("express").Router();
const {createUsers,loginUsers, updateUsersBySelf, deleteUsers,assignTrainerToMember} = require("../controller/usercontroller");
const isAdmin = require("../middleware/isAdmin");
const authGuard = require("../middleware/authguard")
const fileUpload = require('../middleware/multer')
route.post('/createuser',fileUpload("image"),createUsers);
route.post("/loginuser",loginUsers);
route.delete('/deleteuser/:id',authGuard,isAdmin,deleteUsers);
route.post('/assign-trainer', authGuard, isAdmin, assignTrainerToMember);
route.put('/update-profile', authGuard, fileUpload('image'), updateUsersBySelf);
module.exports=route;