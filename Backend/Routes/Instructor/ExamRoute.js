const { Router } = require('express')
const { createExamByInstructorValidator, getInstructorExamsValidator, getExamQuestionsValidator, deleteExamQuestionsValidator, updateExamByInstructorValidator, changeEnrolledExamValidator, getExamEnrollmentsValidator } = require('../../Validators/Instructor/ExamValidator')
const { createExamByInstructor, getInstructorExams, getLiveExams, getExamQuestions, deleteExam, editExam, changeEnrolledExam, getExamEnrollments } = require('../../Controllers/Instructor/ExamController')

const ExamRoute = Router()

ExamRoute.post("/exam", createExamByInstructorValidator, createExamByInstructor)
ExamRoute.delete("/exam", deleteExamQuestionsValidator, deleteExam)
ExamRoute.put("/exam", updateExamByInstructorValidator, editExam)
ExamRoute.put("/room/exam/enroll", changeEnrolledExamValidator, changeEnrolledExam)
ExamRoute.get("/exam/questions", getExamQuestionsValidator, getExamQuestions)
ExamRoute.get("/exams", getInstructorExamsValidator, getInstructorExams)
ExamRoute.get("/exams/live", getLiveExams)
ExamRoute.get("/exam/enrollments", getExamEnrollmentsValidator, getExamEnrollments)

module.exports = ExamRoute 