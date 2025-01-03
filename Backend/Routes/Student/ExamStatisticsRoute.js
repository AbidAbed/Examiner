const { Router } = require('express')
const { getStudentExamsStatisticsOverViewValidator, getExamTakerStatisticsValidator } = require('../../Validators/Student/ExamStatisticsValidator')
const { getStudentExamsStatisticsOverView, getExamTakerStatistics } = require('../../Controllers/Student/ExamStatisticsController')

const ExamStatisticsRoute = Router()

ExamStatisticsRoute.get("/exams/statistics", getStudentExamsStatisticsOverViewValidator, getStudentExamsStatisticsOverView)
ExamStatisticsRoute.get("/exam/taker-statistics", getExamTakerStatisticsValidator, getExamTakerStatistics)

module.exports = { ExamStatisticsRoute }