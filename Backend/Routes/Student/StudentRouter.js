const { Router } = require('express')
const AuthStudentOnly = require("../../Middlewares/AuthStudentOnly")
const authToken = require('../../Middlewares/AuthMiddleware')


const ExamRoute = require('./ExamRoute')
const { RoomRoute } = require('./RoomRoute')
const { ExamStatisticsRoute } = require('./ExamStatisticsRoute')

const StudentRouter = Router()

StudentRouter.use("/student", authToken, AuthStudentOnly, ExamRoute)
StudentRouter.use("/student", authToken, AuthStudentOnly, RoomRoute)
StudentRouter.use("/student", authToken, AuthStudentOnly, ExamStatisticsRoute)

module.exports = StudentRouter 