const StudentModel = require("../../Models/Student");
const RoomModel = require("../../Models/Room");
const ExamEnrolmentModel = require("../../Models/ExamEnrolment")
const ExamModel = require("../../Models/Exam")
const ExamStatisticsModel = require("../../Models/ExamStatistics")

const { default: mongoose, mongo } = require("mongoose");
const ExamTakerStatisticsModel = require("../../Models/ExamTakerStatistics");
const AnswerModel = require("../../Models/Answer");

async function getStudentExams(request, response) {
    try {
        if (!request.query.page)
            request.query.page = 1
        const foundExams = await StudentModel.findById(request.user._id).populate({
            path: "examEnrolments",
            options: {
                skip: (request.query.page - 1) * Number(process.env.PAGE_SIZE),
                limit: Number(process.env.PAGE_SIZE),
            },
            match: { status: "approved" },
            populate: {
                path: 'exam',
                match: { status: { $ne: "disabled" } },
                options: {
                    select: "-numberOfQuestions -examStatisticsId -examTakerStatisticsIds -questionsIds -examEnrolmentsIds -numberOfPages",
                    sort: { scheduledTime: -1 },
                },
                populate: {
                    path: "instructor",
                    options: {
                        select: "-testBankId"
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
        if (foundExams !== null)
            return response.status(200).send(foundExams.examEnrolments)
        else
            return response.status(400).send()

    } catch (error) {
        response.status(500).send()
        console.log(error);
    }
}

async function getStudentLiveExams(request, response) {
    try {
        // if (!request.query.page)
        //     request.query.page = 1
        const foundExams = await StudentModel.findById(request.user._id).populate({
            path: "examEnrolments",
            match: { status: "approved" },
            populate: {
                path: "exam",
                match: {
                    status: { $ne: "disabled" },
                    scheduledTime: { $gte: Date.now() },
                },
                options: {
                    select: '-examTakerStatisticsIds -questionsIds -examEnrolmentsIds -numberOfQuestions -numberOfPages -examStatisticsId',
                    // skip: (request.query.page - 1) * Number(process.env.PAGE_SIZE),
                    // limit: Number(process.env.PAGE_SIZE),
                    sort: { scheduledTime: -1 },
                },
                populate: {
                    path: "instructor",
                    options: {
                        select: "-testBankId"
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
        console.log(foundExams);

        if (foundExams !== null)
            return response.status(200).send(foundExams.examEnrolments)
        else return response.status(400).send()
    } catch (error) {
        response.status(500).send()
        console.log(error);
    }
}

async function enrollExam(request, response) {
    try {
        const foundRoom = await RoomModel.findById(new mongoose.Types.ObjectId(request.body.roomId)).populate({
            path: "roomEnrolments",
            match: { _id: { $in: request.user.roomsEnrolmentsIds } }
        })

        if (foundRoom.roomEnrolments.length === 0 || foundRoom.roomEnrolments[0].toObject().status !== "approved")
            return response.status(400).send()

        await foundRoom.populate({
            path: "exams",
            match: { _id: new mongoose.Types.ObjectId(request.body.examId) },
            populate: {
                path: "examEnrolments",
                match: { _id: { $in: request.user.examsEnrolmentsIds } }
            }
        })


        if (foundRoom.exams.length === 0)
            return response.status(400).send()


        if (foundRoom.exams[0].examEnrolments.length !== 0 ||
            foundRoom.exams[0].enrolmentStatus === "closed" ||
            (foundRoom.exams[0].scheduledTime < Date.now() && foundRoom.exams[0].scheduledTime + foundRoom.exams[0].duration * 60 * 1000 < Date.now()))
            return response.status(400).send()


        const createdExamEnrollment = await ExamEnrolmentModel.create({
            examId: foundRoom.exams[0]._id,
            studentId: request.user._id,
            status: 'pending'
        })

        const updatedExam = await ExamModel.findByIdAndUpdate(foundRoom.exams[0]._id, {
            $push: { examEnrolmentsIds: createdExamEnrollment._id },
        })

        const updatedStudent = await StudentModel.findByIdAndUpdate(request.user._id, {
            $push: { examsEnrolmentsIds: createdExamEnrollment._id },
        })


        const updatedExamStatistics = await ExamStatisticsModel.findOneAndUpdate({
            examId: foundRoom.exams[0]._id,
        }, { $inc: { totalRegistered: 1 } }, { returnDocument: 'after' })

        const foundUpdatedExam = await ExamModel.findById(foundRoom.exams[0]._id)
            .select("-numberOfQuestions -examStatisticsId -examTakerStatisticsIds -questionsIds -numberOfPages")
            .populate({
                path: "examEnrolments",
                match: { _id: createdExamEnrollment.toObject()._id }
            })

        if (updatedExamStatistics !== null && updatedStudent !== null && updatedExam !== null)
            return response.status(200).send(foundUpdatedExam)
        else
            return response.status(400).send()

    } catch (error) {
        response.status(500).send()
        console.log(error);
    }
}

async function startExam(request, response) {
    try {
        const foundRoom = await RoomModel.findById(request.body.roomId).populate({
            path: "roomEnrolments",
            match: { _id: { $in: request.user.roomsEnrolmentsIds }, status: 'approved' }
        })

        if (foundRoom.roomEnrolments.length === 0 || (request.user.startedExamId && request.user.startedExamId !== null))
            return response.status(400).send()


        const foundTaker = await ExamTakerStatisticsModel.findOne({
            studentId: request.user._id,
            endingTime: undefined,
            roomId: foundRoom.toObject()._id
        })
        if (foundTaker !== null)
            return response.status(400).send()

        await foundRoom.populate({
            path: "exams",
            match: { _id: request.body.examId },
            populate: {
                path: "examEnrolments",
                match: { _id: { $in: request.user.examsEnrolmentsIds }, status: 'approved' }
            }
        })


        if (foundRoom.exams.length === 0 ||
            foundRoom.exams[0].examEnrolments.length === 0 ||
            foundRoom.exams[0].scheduledTime > Date.now() ||
            (foundRoom.exams[0].scheduledTime < Date.now() &&
                foundRoom.exams[0].scheduledTime + foundRoom.exams[0].duration * 60 * 1000 < Date.now())
        )
            return response.status(400).send()

        const takerExamStatistics = await ExamTakerStatisticsModel.create({
            startingTime: Date.now(),
            studentId: request.user._id,
            examId: foundRoom.exams[0]._id,
            roomId: foundRoom.toObject()._id
        })

        await StudentModel.findByIdAndUpdate(request.user._id, {
            startedExamId: foundRoom.exams[0].toObject()._id,
            $push: { takenExamsStatisticsIds: takerExamStatistics.toObject()._id }
        })

        await ExamModel.findByIdAndUpdate(foundRoom.exams[0].toObject()._id, {
            $push: { examTakerStatisticsIds: takerExamStatistics.toObject()._id }
        })

        await ExamStatisticsModel.findByIdAndUpdate(foundRoom.exams[0].examStatisticsId, {
            $push: { examTakersStatisticsIds: takerExamStatistics.toObject()._id },
            $inc: { totalParticipants: 1 }
        })

        setTimeout(() => {

            StudentModel.updateOne({ _id: request.user._id, startedExamId: null }).then().catch()

        }, ((foundRoom.exams[0].duration + 5) * 60 * 1000))

        response.status(200).send()

    } catch (error) {
        response.status(500).send()
        console.log(error);
    }

}

async function getStudentExamQuestions(request, response) {
    try {

        const fExam = await ExamModel.findById(request.user.startedExamId).populate('instructor')
        if (fExam === null)
            return response.status(400).send()
        const foundRoom = await RoomModel.findById(fExam.instructor.toObject().roomId).populate({
            path: "roomEnrolments",
            match: { _id: { $in: request.user.roomsEnrolmentsIds }, status: 'approved' }
        })

        if (foundRoom.roomEnrolments.length === 0)
            return response.status(400).send()


        await foundRoom.populate({
            path: "exams",
            match: { _id: request.user.startedExamId },
            options: {
                select: "-examTakerStatisticsIds -examStatisticsId -rating"
            },
            populate: {
                path: "examEnrolments",
                match: { _id: { $in: request.user.examsEnrolmentsIds }, status: 'approved' }
            }
        })


        if (
            (request.user.startedExamId.toString() !== foundRoom.exams[0].toObject()._id.toString()) ||
            foundRoom.exams[0].examEnrolments.length === 0 ||
            foundRoom.exams[0].scheduledTime > Date.now() ||
            (foundRoom.exams[0].scheduledTime < Date.now() &&
                foundRoom.exams[0].scheduledTime + foundRoom.exams[0].duration * 60 * 1000 < Date.now())
        )
            return response.status(400).send()


        if (!request.user.startedExamId || request.user.startedExamId === null)
            return response.status(400).send()


        const foundExam = await ExamModel.findById(foundRoom.exams[0]._id).populate({
            path: "question",
            options: {
                sort: { page: 1 },
                select: '-isAiGenerated -isTestBank',
            }
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
        const noAnswerQuestions = foundExam.question
            .filter((question) => question.type === "short-answer" || question.type === "essay")
            .map((question) => {
                return {
                    ...question.toObject(),
                    answers: []
                }
            })



        const withAnswerQuestions = foundExam.question.filter((question) => question.type !== "short-answer" && question.type !== "essay")

        const questions = withAnswerQuestions.map(async (question) => {
            return {
                ...question.toObject(),
                answers: await AnswerModel.find({ questionId: question.toObject()._id }).select("-isCorrect")
            }
        })

        const resolvbedQuestions = []

        for (let i = 0; i < questions.length; i += 1) {
            resolvbedQuestions.push(await questions[i])
        }

        if (foundExam !== null)
            return response.status(200).send({
                ...foundExam.toObject(),
                question: [...resolvbedQuestions, ...noAnswerQuestions],
                instructor: foundExam.instructor
            })

    } catch (error) {
        console.log(error);
        response.status(500).send()
    }
}

async function submitExam(request, response) {
    try {
        const fExam = await ExamModel.findById(request.user.startedExamId).populate('instructor')
        const foundRoom = await RoomModel.findById(fExam.instructor.toObject().roomId).populate({
            path: "roomEnrolments",
            match: { _id: { $in: request.user.roomsEnrolmentsIds }, status: 'approved' }
        })

        if (foundRoom.roomEnrolments.length === 0)
            return response.status(400).send()


        await foundRoom.populate({
            path: "exams",
            match: { _id: request.user.startedExamId },
            populate: {
                path: "examEnrolments",
                match: { _id: { $in: request.user.examsEnrolmentsIds }, status: 'approved' }
            }
        })


        if (
            (request.user.startedExamId.toString() !== foundRoom.exams[0].toObject()._id.toString()) ||
            foundRoom.exams[0].examEnrolments.length === 0 ||
            foundRoom.exams[0].scheduledTime > Date.now() ||
            (foundRoom.exams[0].scheduledTime < Date.now() &&
                foundRoom.exams[0].scheduledTime + foundRoom.exams[0].duration * 60 * 1000 < Date.now())
        )
            return response.status(400).send()


        if (!request.user.startedExamId || request.user.startedExamId === null)
            return response.status(400).send()

        const foundExam = await ExamModel.findById(foundRoom.exams[0]._id).populate({
            path: "question",
            options: {
                sort: { page: 1 },
            }
        })

        const questions = foundExam.question.map(async (question) => {
            return {
                ...question.toObject(),
                answers: await AnswerModel.find({ questionId: question.toObject()._id })
            }
        })

        const resolvbedQuestions = []

        for (let i = 0; i < questions.length; i += 1) {
            resolvbedQuestions.push(await questions[i])
        }
        let studentScore = 0

        const studentCorrected = resolvbedQuestions.reduce((prevQuestion, curQuestion) => {
            const foundStudentAnswer = request.body.questions.find((toBeFoundQuestion) =>
                toBeFoundQuestion._id === curQuestion._id.toString())

            const correctAnswer = curQuestion.answers.find((answer) => answer._doc.isCorrect)

            switch (curQuestion.type) {
                case "multiple-choice-single-answer":
                    if (foundStudentAnswer && foundStudentAnswer.choosenAnswer.toLowerCase() === correctAnswer.text.toLowerCase()) {
                        studentScore += curQuestion.points
                        return { ...prevQuestion, correct: [...prevQuestion.correct, { ...curQuestion, choosenAnswer: foundStudentAnswer.choosenAnswer }] }
                    } else
                        return { ...prevQuestion, wrong: [...prevQuestion.wrong, { ...curQuestion, choosenAnswer: foundStudentAnswer ? foundStudentAnswer.choosenAnswer : "" }] }

                case "true/false":
                    if (foundStudentAnswer && foundStudentAnswer.choosenAnswer.toLowerCase() === correctAnswer.text.toLowerCase()) {
                        studentScore += curQuestion.points
                        return { ...prevQuestion, correct: [...prevQuestion.correct, { ...curQuestion, choosenAnswer: foundStudentAnswer.choosenAnswer }] }
                    } else
                        return { ...prevQuestion, wrong: [...prevQuestion.wrong, { ...curQuestion, choosenAnswer: foundStudentAnswer ? foundStudentAnswer.choosenAnswer : "" }] }

                case "short-answer":
                    if (foundStudentAnswer && foundStudentAnswer.choosenAnswer.toLowerCase() === correctAnswer.text.toLowerCase()) {
                        studentScore += curQuestion.points
                        return { ...prevQuestion, correct: [...prevQuestion.correct, { ...curQuestion, choosenAnswer: foundStudentAnswer.choosenAnswer }] }
                    } else
                        return { ...prevQuestion, wrong: [...prevQuestion.wrong, { ...curQuestion, choosenAnswer: foundStudentAnswer ? foundStudentAnswer.choosenAnswer : "" }] }
                case "multiple-choice-multiple-answer":
                    let correctMCMAAnswer = 0
                    let wrongMCMAAnswers = 0
                    if (!foundStudentAnswer)
                        wrongMCMAAnswers += curQuestion.answers.length
                    else
                        curQuestion.answers.map((answer) => {
                            const foundAnswer = foundStudentAnswer.choosenAnswer.split("-").find((chosnAnswer) => chosnAnswer === answer.text)
                            if (foundAnswer) {
                                if (answer.isCorrect)
                                    correctMCMAAnswer += 1
                                else
                                    wrongMCMAAnswers += 1
                            } else {
                                if (answer.isCorrect)
                                    wrongMCMAAnswers += 1
                                else
                                    correctMCMAAnswer += 1
                            }
                        })

                    studentScore += (curQuestion.points / (correctMCMAAnswer + wrongMCMAAnswers)) * correctMCMAAnswer
                    return { ...prevQuestion, correct: [...prevQuestion.correct, { ...curQuestion, choosenAnswer: foundStudentAnswer ? foundStudentAnswer.choosenAnswer : "" }] }
            }

        }, { correct: [], wrong: [] })


        const studentAnswers = [...studentCorrected.correct, ...studentCorrected.wrong].map((studAnswer) => {
            const reconstructedStudAnswers = studAnswer.answers.map((ans) => {
                return {
                    _id: ans._doc._id,
                    questionId: ans._doc.questionId,
                    text: ans._doc.text,
                    isCorrect: ans._doc.isCorrect,
                }
            })
            return {
                _id: studAnswer._id,
                text: studAnswer.text,
                type: studAnswer.type,
                order: studAnswer.order,
                page: studAnswer.page,
                points: studAnswer.points,
                answers: reconstructedStudAnswers,
                choosenAnswer: studAnswer.choosenAnswer
            }
        })

        await foundExam.populate({
            path: "examTakerStatistics",
            match: { _id: { $in: request.user.takenExamsStatisticsIds } }
        })

        await foundExam.populate("examStatistics")

        if (foundExam.examTakerStatistics === 0)
            return response.status(400).send()

        studentScore = Math.ceil(studentScore)
        const updatedExamTakerStatistics = await ExamTakerStatisticsModel.findByIdAndUpdate(
            foundExam.examTakerStatistics.toObject()._id, {
            score: Math.ceil(studentScore),
            correctAnswers: studentCorrected.correct.length,
            wrongAnswers: studentCorrected.wrong.length,
            endingTime: Date.now(),
            timeTaken: Date.now() - foundExam.examTakerStatistics.toObject().startingTime,
            isPassed: studentScore >= foundExam.toObject().passScore ? true : false,
            choosenAnswers: studentAnswers
        }, { returnDocument: 'after' })


        await ExamStatisticsModel.findByIdAndUpdate(foundExam.toObject().examStatisticsId, {
            averageScore: Math.ceil((foundExam.examStatistics.toObject().averageScore + studentScore) / foundExam.examStatistics.toObject().totalParticipants),
            $inc: { totalPassedStudents: studentScore >= foundExam.toObject().passScore ? 1 : 0 },
            lowestScore: Math.min(foundExam.examStatistics.toObject().lowestScore, studentScore),
            highestScore: Math.max(foundExam.examStatistics.toObject().highestScore, studentScore),
            averageTimeTaken: Math.ceil((foundExam.examStatistics.toObject().averageTimeTaken + Date.now() - foundExam.examTakerStatistics.toObject().startingTime) / foundExam.examStatistics.toObject().totalParticipants)
        })

        await StudentModel.updateOne({ _id: request.user._id, startedExamId: null })

        if (foundExam.toObject().showMark && foundExam.toObject().allowReview)
            return response.status(200).send(updatedExamTakerStatistics)
        else if (foundExam.toObject().showMark)
            return response.status(200).send({
                _id: updatedExamTakerStatistics.toObject()._id,
                roomId: updatedExamTakerStatistics.toObject().roomId,
                examId: updatedExamTakerStatistics.toObject().examId,
                score: studentScore
            })
        else if (foundExam.toObject().allowReview)
            return response.status(200).send({ ...updatedExamTakerStatistics.toObject(), score: studentScore })
        else
            return response.status(200).send({
                _id: updatedExamTakerStatistics.toObject()._id,
                roomId: updatedExamTakerStatistics.toObject().roomId,
                examId: updatedExamTakerStatistics.toObject().examId
            })

    } catch (error) {
        console.log(error);
        response.status(500).send()
    }
}
module.exports = { getStudentExams, getStudentLiveExams, enrollExam, startExam, getStudentExamQuestions, submitExam }