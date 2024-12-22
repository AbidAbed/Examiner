const { Router } = require('express')
const { addTestBankQuestionValidator, getTestBankQuestionsValidator, generateQuestionsByAiValidator, addBulkTestBankQuestionsValidator } = require('../../Validators/Instructor/TestBankValidator')
const { addTestBankQuestion, getTestBankQuestions, generateQuestionsByAi, addBulkTestBankQuestions } = require('../../Controllers/Instructor/TestBankController')

const TestBankRoute = Router()

TestBankRoute.post("/testbank/question", addTestBankQuestionValidator, addTestBankQuestion)
TestBankRoute.post("/testbank/questions", addBulkTestBankQuestionsValidator, addBulkTestBankQuestions)
TestBankRoute.get("/testbank/questions", getTestBankQuestionsValidator, getTestBankQuestions)
TestBankRoute.post("/testbank/ai/question", generateQuestionsByAiValidator, generateQuestionsByAi)

module.exports = TestBankRoute 