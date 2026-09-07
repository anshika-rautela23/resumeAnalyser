const express=require('express')
const authController=require('../controllers/auth.controllers')
const authRoutes=express.Router()
const authMiddleware=require('../middleware/auth.middleware')


authRoutes.post('/register', authController.userRegister)
authRoutes.post('/login', authController.loginController)
authRoutes.get('/logout', authController.logOutController)
authRoutes.get('/getme',authMiddleware.authUser,authController.getmeController)
module.exports=authRoutes 