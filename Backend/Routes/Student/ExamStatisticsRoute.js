const { Router } = require('express')
const { getStudentExamsStatisticsOverViewValidator } = require('../../Validators/Student/ExamStatisticsValidator')
const { getStudentExamsStatisticsOverView } = require('../../Controllers/Student/ExamStatisticsController')

const ExamStatisticsRoute = Router()

ExamStatisticsRoute.get("/exams/statistics", getStudentExamsStatisticsOverViewValidator, getStudentExamsStatisticsOverView)

module.exports = { ExamStatisticsRoute }