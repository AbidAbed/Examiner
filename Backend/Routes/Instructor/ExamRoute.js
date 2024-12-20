const { Router } = require('express')
const { createExamByInstructorValidator, getInstructorExamsValidator } = require('../../Validators/Instructor/ExamValidator')
const { createExamByInstructor, getInstructorExams, getLiveExams } = require('../../Controllers/Instructor/ExamController')

const ExamRoute = Router()

ExamRoute.post("/exam", createExamByInstructorValidator, createExamByInstructor)
ExamRoute.get("/exams", getInstructorExamsValidator, getInstructorExams)
ExamRoute.get("/exams/live", getLiveExams)

module.exports = ExamRoute 