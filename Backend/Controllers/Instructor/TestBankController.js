const TestBankQuestionModel = require("../../Models/TestBankQuestion");
const TestBankAnswerModel = require("../../Models/TestBankAnswer");
const TestBankModel = require("../../Models/TestBank")

const { default: mongoose } = require("mongoose");

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

/* ********** TODO IMPLEMENT AI INTEGRATION*/
async function generateQuestionsByAi(request, response) {
    try {

    } catch (error) {
        console.log(error);
        response.status(500).send()
    }
}
module.exports = { addTestBankQuestion, getTestBankQuestions }