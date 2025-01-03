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

        await foundExam.populate({
            path: "examStatistics",
            populate: {
                path: "examTakerStatistics",
                options: {
                    sort: { score: -1 },
                    limit: 3
                },
                populate: {
                    path: 'student',
                    options: {
                        select: "-takenExamsStatisticsIds -examsEnrolmentsIds -roomsEnrolmentsIds -startedExamId"
                    },
                    populate: {
                        path: "user",
                        select: "-password -role"
                    }
                }
            }
        })

        const passedStudents = await ExamTakerStatisticsModel.countDocuments({
            isPassed: true,
            examId: foundExam.toObject()._id
        });

        const failedStudents = await ExamTakerStatisticsModel.countDocuments({
            isPassed: false,
            examId: foundExam.toObject()._id
        });


        const quarterScores = await ExamTakerStatisticsModel.countDocuments({
            score: { $gte: 0, $lt: foundExam.toObject().fullScore / 4 },
            examId: foundExam.toObject()._id
        });

        const halfScores = await ExamTakerStatisticsModel.countDocuments({
            score: { $gte: foundExam.toObject().fullScore / 4, $lt: foundExam.toObject().fullScore / 2 },
            examId: foundExam.toObject()._id
        });

        const oneThirdScores = await ExamTakerStatisticsModel.countDocuments({
            score: { $gte: foundExam.toObject().fullScore / 2, $lt: foundExam.toObject().fullScore / 3 },
            examId: foundExam.toObject()._id
        });

        const fullScores = await ExamTakerStatisticsModel.countDocuments({
            score: { $gte: foundExam.toObject().fullScore / 3, $lt: foundExam.toObject().fullScore },
            examId: foundExam.toObject()._id
        });

        if (foundExam === null) {
            response.status(400).send()
            return
        }
        if (foundExam.toObject().instructorId.toString() !== request.user._id.toString()) {
            response.status(401).send()
            return
        }

        response.status(200).send({
            ...foundExam.toObject(),
            examStatistics: foundExam.examStatistics,
            overAll: {
                passedStudents: passedStudents,
                failedStudents: failedStudents,
                quarterScores,
                halfScores,
                oneThirdScores,
                fullScores
            }
        })

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