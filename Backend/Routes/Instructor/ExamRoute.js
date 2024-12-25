const { Router } = require('express')
const { createExamByInstructorValidator, getInstructorExamsValidator, getExamQuestionsValidator, deleteExamQuestionsValidator, updateExamByInstructorValidator } = require('../../Validators/Instructor/ExamValidator')
const { createExamByInstructor, getInstructorExams, getLiveExams, getExamQuestions, deleteExam, editExam } = require('../../Controllers/Instructor/ExamController')

const ExamRoute = Router()

ExamRoute.post("/exam", createExamByInstructorValidator, createExamByInstructor)
ExamRoute.delete("/exam", deleteExamQuestionsValidator, deleteExam)
ExamRoute.put("/exam", updateExamByInstructorValidator, editExam)

ExamRoute.get("/exam/questions", getExamQuestionsValidator, getExamQuestions)
ExamRoute.get("/exams", getInstructorExamsValidator, getInstructorExams)
ExamRoute.get("/exams/live", getLiveExams)

module.exports = ExamRoute 