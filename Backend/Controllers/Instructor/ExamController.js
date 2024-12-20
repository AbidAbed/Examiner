const QuestionModel = require('../../Models/Question')
const AnswerModel = require("../../Models/Answer")
const TestBankQuestionModel = require("../../Models/TestBankQuestion")
const ExamModel = require("../../Models/Exam")
const { default: mongoose } = require('mongoose')
const ExamStatisticsModel = require('../../Models/ExamStatistics')
const RoomModel = require('../../Models/Room')

async function createExamByInstructor(request, response) {
    try {
        let createdQuestions = []
        let examPoints = 0

        for (let i = 0; i < request.body.questions.length; i += 1) {
            examPoints += request.body.questions[i].points

            if (request.body.questions[i].isTestBanK) {
                const testBankQuestion = await TestBankQuestionModel.findById(request.body.questions[i]._id)

                const createdTestBankQuestion = await QuestionModel.create({
                    type: testBankQuestion._doc.type,
                    order: request.body.questions[i].order,
                    page: request.body.questions[i].page,
                    points: request.body.questions[i].points,
                    text: testBankQuestion._doc.text
                })

                createdQuestions.push(createdTestBankQuestion.toObject())
            } else {
                const createdNonTestBankQuestion = await QuestionModel.create({
                    type: request.body.questions[i].type,
                    order: request.body.questions[i].order,
                    page: request.body.questions[i].page,
                    points: request.body.questions[i].points,
                    text: request.body.questions[i].text
                })


                for (let j = 0; j < request.body.questions[i].answers.length; j += 1) {
                    const createdNonTestBankAnswer = await AnswerModel.create({
                        questionId: createdNonTestBankQuestion._doc._id,
                        text: request.body.questions[i].answers[j].text,
                        isCorrect: request.body.questions[i].answers[j].isCorrect,
                    })
                }

                createdQuestions.push(createdNonTestBankQuestion.toObject())
            }
        }

        const createdQuestionsIds = createdQuestions.map((createdQuestion) => new mongoose.Types.ObjectId(createdQuestion._id))

        const createdExam = await ExamModel.create({
            name: request.body.name,
            description: request.body.description,
            allowReview: request.body.allowReview,
            duration: request.body.duration,
            fullScore: examPoints,
            passScore: request.body.passScore,
            numberOfQuestions: createdQuestions.length,
            showMark: request.body.showMark,
            status: request.body.status,
            scheduledTime: request.body.scheduledTime,
            questionsIds: createdQuestionsIds,
            numberOfPages: request.body.numberOfPages,
            enrolmentStatus: request.body.enrolmentStatus,
            instructorId: new mongoose.Types.ObjectId(request.user._id)
        })


        const examStatistics = await ExamStatisticsModel.create({
            examId: new mongoose.Types.ObjectId(createdExam.toObject()._id)
        })

        const foundCreatedExam = await ExamModel.findByIdAndUpdate(createdExam.toObject()._id,
            { examStatisticsId: examStatistics.toObject()._id }, { returnDocument: 'after' })
            .select("-examTakerStatisticsIds").select("-questionsIds").select("-examEnrolmentsIds")


        const foundExamStatistics = await ExamStatisticsModel.findById(examStatistics.toObject()._id).select("-examTakersStatisticsIds")

        await RoomModel.findByIdAndUpdate(request.user.roomId,
            { $push: { examsIds: foundCreatedExam.toObject()._id } })

        if (examStatistics !== null && foundCreatedExam !== null) {
            response.status(200).send({ exam: { ...foundCreatedExam.toJSON() }, examStatistics: { ...foundExamStatistics.toJSON() } })
            return
        }
        response.status(400).send()
    } catch (error) {
        console.log(error);
        response.status(500).send()
    }
}

async function getInstructorExams(request, response) {
    try {
        if (!request.query.page)
            request.query.page = 1

        const foundRoom = await RoomModel.findById(request.user.roomId)
            .populate({
                path: 'exams',
                options: {
                    select: '-examTakerStatisticsIds -questionsIds -examEnrolmentsIds',
                    skip: (request.query.page - 1) * Number(process.env.PAGE_SIZE),
                    limit: Number(process.env.PAGE_SIZE)
                }
            });

        if (foundRoom !== null) {
            response.status(200).send([...foundRoom.exams])
            return
        }

        response.status(400).send()
    } catch (error) {
        response.status(500).send()
        console.log(error);
    }
}
async function getLiveExams(request, response) {
    try {
        const foundRoom = await RoomModel.findById(request.user.roomId).populate({
            path: 'exams',
            select: "-examTakerStatisticsIds -questionsIds -examEnrolmentsIds"
        })

        console.log(foundRoom.exams);

        const liveExams = foundRoom.exams.filter((exam) => exam.toObject().scheduledTime + exam.toObject().duration * 60 * 1000 > Date.now())
        const deadExams = foundRoom.exams.filter((exam) => exam.toObject().scheduledTime + exam.toObject().duration * 60 * 1000 <= Date.now() && exam.toObject().status !== 'finished')

        if (foundRoom !== null)
            response.status(200).send([...liveExams])
        else
            response.status(400).send()

        await Promise.all(deadExams.map((deadExam) => ExamModel.findByIdAndUpdate(deadExam.toObject()._id, { status: "finished", enrolmentStatus: 'closed' }),))
    } catch (error) {
        response.status(500).send()
        console.log(error);
    }
}

module.exports = {
    createExamByInstructor,
    getInstructorExams,
    getLiveExams,
}