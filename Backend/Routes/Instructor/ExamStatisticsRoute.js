const { Router } = require('express')
const { getInstructorExamsStatistics, getExamStatistics, getInstructorExamStatistics, getInstructorExamTakersStatistics } = require('../../Controllers/Instructor/ExamStatisticsController')
const { getInstructorExamStatisticsValidator, getInstructorExamTakersStatisticsValidator } = require("../../Validators/Instructor/ExamStatisticsValidator")
const ExamStatisticsRoute = Router()

ExamStatisticsRoute.get("/exams/statistics", getInstructorExamsStatistics)
ExamStatisticsRoute.get("/exam/statistics", getInstructorExamStatisticsValidator, getInstructorExamStatistics)
ExamStatisticsRoute.get("/exam/statistics/takers", getInstructorExamTakersStatisticsValidator, getInstructorExamTakersStatistics)

module.exports = ExamStatisticsRoute 