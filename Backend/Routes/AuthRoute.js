const { Router } = require('express')
const { loginUserValidator, signupUserValidator, authUserValidator, forgetPasswordValidator } = require('../Validators/AuthValidator')
const { loginUser, signupUser, authUser, forgetPassword } = require('../Controllers/AuthController')
const authToken = require('../Middlewares/AuthMiddleware')
const AuthRouter = Router()

AuthRouter.post("/user/signup", signupUserValidator, signupUser)
AuthRouter.post("/user/login", loginUserValidator, loginUser)
AuthRouter.post("/user/auth", authUserValidator, authToken, authUser)
AuthRouter.post("/user/forget-password", forgetPasswordValidator, forgetPassword)
module.exports = AuthRouter 