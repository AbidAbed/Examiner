const { Router } = require('express')
const { addTestBankQuestionValidator, getTestBankQuestionsValidator, generateQuestionsByAiValidator, addBulkTestBankQuestionsValidator, deleteTestBankQuestionValidator, editTestBankQuestionValidator } = require('../../Validators/Instructor/TestBankValidator')
const { addTestBankQuestion, getTestBankQuestions, generateQuestionsByAi, addBulkTestBankQuestions, deleteTestBankQuestion, editTestBankQuestion } = require('../../Controllers/Instructor/TestBankController')

const TestBankRoute = Router()

TestBankRoute.post("/testbank/question", addTestBankQuestionValidator, addTestBankQuestion)
TestBankRoute.delete("/testbank/question", deleteTestBankQuestionValidator, deleteTestBankQuestion)
TestBankRoute.put("/testbank/question", editTestBankQuestionValidator, editTestBankQuestion)

TestBankRoute.post("/testbank/questions", addBulkTestBankQuestionsValidator, addBulkTestBankQuestions)
TestBankRoute.get("/testbank/questions", getTestBankQuestionsValidator, getTestBankQuestions)
TestBankRoute.post("/testbank/ai/question", generateQuestionsByAiValidator, generateQuestionsByAi)

module.exports = TestBankRoute 