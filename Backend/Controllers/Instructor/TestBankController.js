const TestBankQuestionModel = require("../../Models/TestBankQuestion");
const TestBankAnswerModel = require("../../Models/TestBankAnswer");
const TestBankModel = require("../../Models/TestBank")
const axios = require('axios');

const { default: mongoose } = require("mongoose");
const { text } = require("body-parser");

async function addTestBankQuestion(request, response) {
    try {
        const createdTestBankQuestion = await TestBankQuestionModel.create({
            isAiGenerated: request.body.isAiGenerated,
            text: request.body.text,
            type: request.body.type,
            testBankId: request.user.testBankId
        })
        const createdTestBankAnswers = await Promise.all(request.body.answers.map((answer) => {
            return TestBankAnswerModel.create({
                isCorrect: answer.isCorrect,
                testBankQuestionId: new mongoose.Types.ObjectId(createdTestBankQuestion.toObject()._id),
                text: answer.text
            })
        }))

        const createdTestBankAnswersIds = createdTestBankAnswers.map((testBankAnswer) => testBankAnswer._doc._id)
        const updatedTestBankQuestion = await TestBankQuestionModel.findByIdAndUpdate(createdTestBankQuestion._doc._id, {
            $push: { answersIds: [...createdTestBankAnswersIds] }
        }, { returnDocument: 'after' })


        const updatedTestBank = await TestBankModel.findByIdAndUpdate(request.user.testBankId, { $push: { questionsIds: createdTestBankQuestion._doc._id } }, { returnDocument: 'after' })

        if (createdTestBankQuestion !== null && createdTestBankAnswers && createdTestBankAnswers.length !== 0 && updatedTestBank !== null) {
            const createdTestBankAnswersJson = createdTestBankAnswers.map((createdTestBankAnswer) => createdTestBankAnswer.toJSON())
            response.status(200).send({ ...updatedTestBankQuestion.toJSON(), answers: createdTestBankAnswersJson })
            return
        }

        response.status(400).send()
    } catch (error) {
        console.log(error);
        response.status(500).send()
    }
}

async function getTestBankQuestions(request, response) {
    try {
        console.log(request.query.page);

        if (!request.query.page)
            request.query.page = 1

        const testBank = await TestBankModel.findById(request.user.testBankId).populate({
            path: "testBankQuestions",
            options: {
                skip: (request.query.page - 1) * Number(process.env.PAGE_SIZE),
                limit: Number(process.env.PAGE_SIZE)
            },
            populate: {
                path: "answers"
            }
        })

        if (testBank !== null) {
            response.status(200).send(testBank.testBankQuestions)
            return
        } else {
            response.status(400).send()
        }
    } catch (error) {
        console.log(error);
        response.status(500).send()
    }

}

async function addBulkTestBankQuestions(request, response) {
    try {
        const createdTestBankQuestions = []
        for (let i = 0; i < request.body.questions.length; i += 1) {
            const createdTestBankQuestion = await TestBankQuestionModel.create({
                isAiGenerated: request.body.questions[i].isAiGenerated,
                text: request.body.questions[i].text,
                type: request.body.questions[i].type,
                testBankId: request.user.testBankId
            })
            const createdTestBankAnswers = await Promise.all(request.body.questions[i].answers.map((answer) => {
                return TestBankAnswerModel.create({
                    isCorrect: answer.isCorrect,
                    testBankQuestionId: new mongoose.Types.ObjectId(createdTestBankQuestion.toObject()._id),
                    text: answer.text
                })
            }))

            const createdTestBankAnswersIds = createdTestBankAnswers.map((testBankAnswer) => testBankAnswer._doc._id)
            const updatedTestBankQuestion = await TestBankQuestionModel.findByIdAndUpdate(createdTestBankQuestion._doc._id, {
                $push: { answersIds: [...createdTestBankAnswersIds] }
            }, { returnDocument: 'after' })


            const updatedTestBank = await TestBankModel.findByIdAndUpdate(request.user.testBankId, { $push: { questionsIds: createdTestBankQuestion._doc._id } }, { returnDocument: 'after' })
            if (createdTestBankQuestion !== null && createdTestBankAnswers && createdTestBankAnswers.length !== 0 && updatedTestBank !== null) {
                const createdTestBankAnswersJson = createdTestBankAnswers.map((createdTestBankAnswer) => createdTestBankAnswer.toJSON())
                createdTestBankQuestions.push({ ...updatedTestBankQuestion.toJSON(), answers: createdTestBankAnswersJson })
            }
            else {
                response.status(400).send()
                return
            }
        }
        response.status(200).send(createdTestBankQuestions)
    }
    catch (error) {
        response.status(500).send()
        console.log(error);
    }

}

async function generateQuestionsByAi(request, response) {
    try {
        const aiResponse = await axios.post(process.env.AI_MODEL_DOMAIN, {
            input: request.body.prompt
        })
        const questions = Object.entries(aiResponse.data[0].questions).reduce((prevGenQuestion, curGenQuestion, index) => {
            const reConstructedQuestion = {
                text: curGenQuestion[1],
                type: "multiple-choice-single-answer",
                isAiGenerated: true,
                answers: [
                    ...aiResponse.data[0].distractors[curGenQuestion[0]].Sense2Vec.map((answer) => { return { text: answer, isCorrect: false } }),
                    ...aiResponse.data[0].distractors[curGenQuestion[0]].WordNet.map((answer) => { return { text: answer, isCorrect: false } }),
                    { text: curGenQuestion[0], isCorrect: true }
                ]
            }
            return [...prevGenQuestion, { ...reConstructedQuestion }]
        }, [])


        response.status(200).send(questions)
    } catch (error) {
        console.log(error);
        response.status(500).send()
    }
}

async function deleteTestBankQuestion(request, response) {
    try {
        const deletedTestBankQuestion = await TestBankQuestionModel.findByIdAndDelete(request.body.testBankQuestionId, { returnDocument: 'after' })
        const deletedTestBankQuestionsAnswers = await TestBankAnswerModel.deleteMany({
            testBankQuestionId: new mongoose.Types.ObjectId(request.body.testBankQuestionId)
        })
        response.status(200).send()
    } catch (error) {
        response.status(500).send()
        console.log(error);
    }
}

async function editTestBankQuestion(request, response) {
    try {
        const { answers, ...question } = request.body
        const editedTestBankQuestion = await TestBankQuestionModel.findByIdAndUpdate(question._id, {
            answersIds: [],
            isAiGenerated: question.isAiGenerated,
            text: question.text,
            type: question.type
        }, { returnDocument: 'after' })

        if (editedTestBankQuestion === null)
            return response.status(400).send()
        await TestBankAnswerModel.deleteMany({ testBankQuestionId: new mongoose.Types.ObjectId(editedTestBankQuestion.toObject()._id) })

        const createdAnswers = await Promise.all(answers.map((answer) => {
            return TestBankAnswerModel.create({
                text: answer.text,
                isCorrect: answer.isCorrect,
                testBankQuestionId: editedTestBankQuestion.toObject()._id
            })
        }))

        const createdAnswersIds = createdAnswers.map((createdAnswer) => createdAnswer._doc._id)

        const editedTestBankQuestionWithAnswers = await TestBankQuestionModel.findByIdAndUpdate(question._id,
            { $push: { answersIds: createdAnswersIds } },
            { returnDocument: 'after' })


        if (editedTestBankQuestionWithAnswers !== null && editedTestBankQuestion !== null && createdAnswers.length !== 0) {
            response.status(200).send({ ...editedTestBankQuestionWithAnswers.toJSON(), answers: createdAnswers })
            return
        }

        response.status(400).send()

    } catch (error) {
        response.status(500).send()
        console.log(error);
    }
}

module.exports = {
    addTestBankQuestion,
    getTestBankQuestions,
    generateQuestionsByAi,
    addBulkTestBankQuestions,
    editTestBankQuestion,
    deleteTestBankQuestion,
}