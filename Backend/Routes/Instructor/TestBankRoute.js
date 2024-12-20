const { Router } = require('express')
const { addTestBankQuestionValidator, getTestBankQuestionsValidator } = require('../../Validators/Instructor/TestBankValidator')
const { addTestBankQuestion, getTestBankQuestions } = require('../../Controllers/Instructor/TestBankController')

const TestBankRoute = Router()

TestBankRoute.post("/testbank/question", addTestBankQuestionValidator, addTestBankQuestion)
TestBankRoute.get("/testbank/questions", getTestBankQuestionsValidator, getTestBankQuestions)

module.exports = TestBankRoute 