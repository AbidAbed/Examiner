const mongoose = require('mongoose')
const TestBankSchema = new mongoose.Schema({
    instructorId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Instructor" },
    questionsIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TestBankQuestion' }]
})

TestBankSchema.virtual('instructor', {
    localField: 'instructorId',
    foreignField: '_id',
    justOne: true,
    ref: "Instructor"
})

TestBankSchema.virtual('testBankQuestions', {
    localField: 'questionsIds',
    foreignField: '_id',
    justOne: false,
    ref: "TestBankQuestion"
})

TestBankSchema.set('toObject', { virtuals: true });
TestBankSchema.set('toJSON', { virtuals: true });
const TestBankModel = mongoose.model('TestBank', TestBankSchema)

module.exports = TestBankModel