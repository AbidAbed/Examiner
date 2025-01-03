const { Router } = require('express')
const { getStudentExamsValidator, enrollExamValidator, startExamValidator, submitExamValidator } = require("../../Validators/Student/ExamValidator")
const { getStudentExams, getStudentLiveExams, enrollExam, startExam, getStudentExamQuestions, submitExam } = require("../../Controllers/Student/ExamController")

const ExamRoute = Router()

ExamRoute.get("/exams", getStudentExamsValidator, getStudentExams)
ExamRoute.get("/exams/live", getStudentLiveExams)
ExamRoute.post("/room/exam/enroll", enrollExamValidator, enrollExam)
ExamRoute.post("/room/exam/start", startExamValidator, startExam)
ExamRoute.get("/room/exam/questions", getStudentExamQuestions)
ExamRoute.post("/room/exam/submit", submitExamValidator, submitExam)
module.exports = ExamRoute 