const mongoose = require('mongoose')
const TestBankAnswerSchema = new mongoose.Schema({
    testBankQuestionId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "TestBankQuestion" },
    text: { type: String, required: true },
    isCorrect: { type: mongoose.Schema.Types.Boolean, required: true }
})

TestBankAnswerSchema.virtual('testBankQuestion', {
    ref: 'TestBankQuestion',
    localField: 'testBankQuestionId',
    foreignField: '_id',
    justOne: true,
});

TestBankAnswerSchema.set('toObject', { virtuals: true });
TestBankAnswerSchema.set('toJSON', { virtuals: true });

const TestBankAnswerModel = mongoose.model("TestBankAnswer", TestBankAnswerSchema)

module.exports = TestBankAnswerModel
