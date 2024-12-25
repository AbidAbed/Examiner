const QuestionModel = require('../../Models/Question')
const AnswerModel = require("../../Models/Answer")
const TestBankQuestionModel = require("../../Models/TestBankQuestion")
const ExamModel = require("../../Models/Exam")
const { default: mongoose } = require('mongoose')
const ExamStatisticsModel = require('../../Models/ExamStatistics')
const RoomModel = require('../../Models/Room')
const ExamTakerStatisticsModel = require("../../Models/ExamTakerStatistics")

const { options } = require('../../Routes/Instructor/ExamStatisticsRoute')


async function getInstructorExamStatistics(request, response) {
    try {
        const foundExam = await ExamModel.findById(request.query.examId).populate({
            path: "examStatistics",
            options: {
                select: "-examTakersStatisticsIds"
            }
        })

        if (foundExam === null) {
            response.status(400).send()
            return
        }
        if (foundExam.toObject().instructorId.toString() !== request.user._id.toString()) {
            response.status(401).send()
            return
        }

        response.status(200).send(foundExam.examStatistics.toJSON())

    } catch (error) {
        response.status(500).send()
        console.log(error);
    }
}

async function getInstructorExamTakersStatistics(request, response) {
    try {
        if (!request.query.page)
            request.query.page = 1

        const foundExam = await ExamModel.findById(request.query.examId).populate({
            path: "examStatistics",
            populate: {
                path: "examTakerStatistics",
                options: {
                    skip: (request.query.page - 1) * Number(process.env.PAGE_SIZE),
                    limit: Number(process.env.PAGE_SIZE)
                },
                populate: {
                    path: "student",
                    options: {
                        select: "-roomsEnrolmentsIds -examsEnrolmentsIds -takenExamsStatisticsIds"
                    },
                    populate: {
                        path: "user",
                        options: {
                            select: "-password -role"
                        }
                    }
                }
            }
        })

        if (foundExam === null) {
            response.status(400).send()
            return
        }
        if (foundExam.toObject().instructorId.toString() !== request.user._id.toString()) {
            response.status(401).send()
            return
        }

        response.status(200).send(foundExam.examStatistics.examTakerStatistics)

    } catch (error) {
        response.status(500).send()
        console.log(error);
    }
}

async function getInstructorExamsStatistics(request, response) {
    try {
        const foundRoom = await RoomModel.findById(request.user.roomId)
            .populate({
                path: 'exams',
                populate: {
                    path: 'examStatistics'
                },
                options: {
                    select: '-examTakerStatisticsIds -questionsIds',
                },

            })

        const responseObj = {
            totalExams: foundRoom.toObject().examsIds.length,
            totalRegistered: foundRoom.exams.reduce((prevExam, curExam) =>
                prevExam + curExam.examStatistics.toObject().totalRegistered, 0),

            totalParticipants: foundRoom.exams.reduce((prevExam, curExam) =>
                prevExam + curExam.examStatistics.toObject().totalParticipants, 0),

            totalPassingStudents:
                foundRoom.exams.reduce((prevExam, curExam) =>
                    prevExam + curExam.examStatistics.toObject().totalPassedStudents, 0),

            averageRating: foundRoom.exams.length !== 0 ?
                foundRoom.exams.reduce((prevExam, curExam) => prevExam + curExam.rating, 0) / foundRoom.exams.length : 0
        }

        if (foundRoom !== null) {
            response.status(200).send(responseObj)
            return
        }

        // .populate('exams').populate('ExamStatistics')
    } catch (error) {
        response.status(500).send()
        console.log(error);
    }
}

module.exports = {
    getInstructorExamStatistics,
    getInstructorExamTakersStatistics,
    getInstructorExamsStatistics
}