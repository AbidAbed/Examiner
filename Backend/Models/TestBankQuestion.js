const mongoose = require('mongoose')

const TestBankQuestionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    isAiGenerated: { type: mongoose.Schema.Types.Boolean, required: true },
    type: {
        type: String,
        enum: ['multiple-choice-single-answer', 'multiple-choice-multiple-answer', 'true/false', 'short-answer', 'essay'], // Define allowed values
        required: true, // Ensure the field is required
    },
    testBankId: { type: mongoose.Schema.Types.ObjectId, ref: 'TestBank' },
    answersIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TestBankAnswer' }]
})

TestBankQuestionSchema.virtual('testBank', {
    localField: 'testBankId',
    foreignField: '_id',
    justOne: true,
    ref: "TestBank"
})

TestBankQuestionSchema.virtual('answers', {
    localField: 'answersIds',
    foreignField: '_id',
    justOne: false,
    ref: "TestBankAnswer"
})

TestBankQuestionSchema.set('toObject', { virtuals: true });
TestBankQuestionSchema.set('toJSON', { virtuals: true });

const TestBankQuestionModel = mongoose.model('TestBankQuestion', TestBankQuestionSchema)
module.exports = TestBankQuestionModel