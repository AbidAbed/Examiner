const { Router } = require('express')
const AuthInstructorOnly = require("../../Middlewares/AuthInstructorOnly")
const authToken = require('../../Middlewares/AuthMiddleware')


const ExamRoute = require('./ExamRoute')
const TestBankRoute = require('./TestBankRoute')
const ExamStatisticsRoute = require('./ExamStatisticsRoute')
const RoomRoute = require('./RoomRoute')

const InstructorRouter = Router()

InstructorRouter.use("/instructor", authToken, AuthInstructorOnly, ExamRoute)
InstructorRouter.use("/instructor", authToken, AuthInstructorOnly, TestBankRoute)
InstructorRouter.use("/instructor", authToken, AuthInstructorOnly, ExamStatisticsRoute)
InstructorRouter.use("/instructor", authToken, AuthInstructorOnly, RoomRoute)

module.exports = InstructorRouter 