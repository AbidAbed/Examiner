const { Router } = require('express')
const { getStudentExamsValidator } = require("../../Validators/Student/ExamValidator")
const { getStudentExams, getStudentLiveExams } = require("../../Controllers/Student/ExamController")

const ExamRoute = Router()

ExamRoute.get("/exams", getStudentExamsValidator, getStudentExams)
ExamRoute.get("/exams/live", getStudentLiveExams)

module.exports = ExamRoute 