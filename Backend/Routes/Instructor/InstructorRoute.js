const { Router } = require('express')
const { createExamByInstructorValidator, getInstructorExamsValidator } = require('../../Validators/Instructor/ExamValidator')
const { createExamByInstructor, getInstructorExams, getInstructorExamsStatistics, getLiveExams } = require('../../Controllers/Instructor/ExamController')
const AuthInstructorOnly = require("../../Middlewares/AuthInstructorOnly")
const authToken = require('../../Middlewares/AuthMiddleware')
const { addTestBankQuestionValidator, getTestBankQuestionsValidator } = require('../../Validators/Instructor/TestBankValidator')
const { addTestBankQuestion, getTestBankQuestions } = require('../../Controllers/Instructor/TestBankController')

const InstructorRouter = Router()

InstructorRouter.post("/instructor/exam", authToken, AuthInstructorOnly, createExamByInstructorValidator, createExamByInstructor)
InstructorRouter.post("/instructor/testbank/question", authToken, AuthInstructorOnly, addTestBankQuestionValidator, addTestBankQuestion)
InstructorRouter.get("/instructor/testbank/questions", authToken, AuthInstructorOnly, getTestBankQuestionsValidator, getTestBankQuestions)
InstructorRouter.get("/instructor/exams", authToken, AuthInstructorOnly, getInstructorExamsValidator, getInstructorExams)
InstructorRouter.get("/instructor/exams/Statistics", authToken, AuthInstructorOnly, getInstructorExamsStatistics)
InstructorRouter.get("/instructor/exams/live", authToken, AuthInstructorOnly, getLiveExams)

module.exports = InstructorRouter 