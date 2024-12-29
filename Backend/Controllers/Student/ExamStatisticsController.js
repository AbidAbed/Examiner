const StudentModel = require("../../Models/Student");

async function getStudentExamsStatisticsOverView(request, response) {
    try {
        const foundStudent = await StudentModel.findById(request.user._id).populate({
            path: "takenExamsStatistics"
        })
        const overviewStatistics = { totalExams: 0, avgScore: 0, avgPassPercentage: 0 }
        if (foundStudent.takenExamsStatistics.length !== 0) {
            overviewStatistics.totalExams = foundStudent.takenExamsStatistics.length
            overviewStatistics.avgScore = foundStudent.takenExamsStatistics.reduce((prevTakenExamStatistics,
                currTakenExamStatistics) => prevTakenExamStatistics + currTakenExamStatistics.score, 0) / foundStudent.takenExamsStatistics.length
            overviewStatistics.avgPassPercentage = foundStudent.takenExamsStatistics
                .filter((takenExamStatistics) => takenExamStatistics.isPassed).length / foundStudent.takenExamsStatistics.length

        }

        response.status(200).send(overviewStatistics)
    } catch (error) {
        response.status(500).send()
        console.log(error);
    }
}

module.exports = { getStudentExamsStatisticsOverView }