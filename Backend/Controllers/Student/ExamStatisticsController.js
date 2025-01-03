const { default: mongoose } = require("mongoose");
const ExamModel = require("../../Models/Exam");
const ExamTakerStatisticsModel = require("../../Models/ExamTakerStatistics");
const RoomModel = require("../../Models/Room");
const StudentModel = require("../../Models/Student");
const AnswerModel = require("../../Models/Answer");

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

async function getExamTakerStatistics(request, response) {
    try {
        const foundRoom = await RoomModel.findById(new mongoose.Types.ObjectId(request.query.roomId)).populate({
            path: "roomEnrolments",
            match: { _id: { $in: request.user.roomsEnrolmentsIds }, status: 'approved' }
        })


        if (foundRoom === null || foundRoom.roomEnrolments.length === 0 || (request.user.startedExamId && request.user.startedExamId !== null))
            return response.status(400).send()


        const foundTaker = await ExamTakerStatisticsModel.findOne({
            studentId: request.user._id,
            examId: new mongoose.Types.ObjectId(request.query.examId),
            roomId: foundRoom.toObject()._id
        })
        if (foundTaker === null)
            return response.status(400).send()


        await foundRoom.populate({
            path: "exams",
            match: { _id: new mongoose.Types.ObjectId(request.query.examId) },
            populate: {
                path: "examEnrolments",
                match: { _id: { $in: request.user.examsEnrolmentsIds }, status: 'approved' }
            }
        })



        if (foundRoom.exams.length === 0 ||
            foundRoom.exams[0].examEnrolments.length === 0 ||
            foundRoom.exams[0].scheduledTime > Date.now() ||
            (foundRoom.exams[0].scheduledTime < Date.now() &&
                foundRoom.exams[0].scheduledTime + foundRoom.exams[0].duration * 60 * 1000 > Date.now())
        )
            return response.status(400).send()


        const foundExam = await ExamModel.findById(foundRoom.exams[0].toObject()._id)
            .select("-examStatisticsId -rating -examEnrolmentsIds")
            .populate({
                path: "examTakerStatistics",
                match: { _id: { $in: request.user.takenExamsStatisticsIds } },
            })

        await foundExam.populate({
            path: "instructor",
            options: {
                select: "-testBankId"
            },
            populate: {
                path: 'user',
                select: "-role -password"
            }
        })


        if (foundExam.examTakerStatistics === null)
            return response.status(400).send()

        if (foundExam.toObject().allowReview)
            return response.status(200).send({
                ...foundRoom.exams[0].examEnrolments[0].toObject(),
                exam: {

                    ...foundExam.toObject(),
                    instructor: foundExam.instructor,
                    question: foundExam.examTakerStatistics.toObject().choosenAnswers,
                    examTakerStatistics: {
                        ...foundExam.examTakerStatistics.toObject()
                    }
                }
            })
        else if (foundExam.toObject().showMark)
            return response.status(200).send({
                ...foundRoom.exams[0].examEnrolments[0].toObject(),
                exam: {
                    ...foundExam.toObject(),
                    instructor: foundExam.instructor,
                    questionsIds: [],
                    question: [],
                    examTakerStatistics: {
                        _id: foundExam.examTakerStatistics.toObject()._id,
                        roomId: foundExam.examTakerStatistics.toObject().roomId,
                        examId: foundExam.examTakerStatistics.toObject().examId,
                        score: foundExam.examTakerStatistics.toObject().score
                    }
                }
            })
        else
            return response.status(200).send({
                ...foundRoom.exams[0].examEnrolments[0].toObject(),
                exam: {
                    ...foundExam.toObject(),
                    instructor: foundExam.instructor,
                    questionsIds: [],
                    question: [],
                    examTakerStatistics: {
                        _id: foundExam.examTakerStatistics.toObject()._id,
                        roomId: foundExam.examTakerStatistics.toObject().roomId,
                        examId: foundExam.examTakerStatistics.toObject().examId,
                    }
                }
            })
    } catch (error) {
        console.log(error);
        response.status(500).send()
    }
}

module.exports = { getStudentExamsStatisticsOverView, getExamTakerStatistics }