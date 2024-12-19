const mongoose = require('mongoose')
const AnswersSchema = new mongoose.Schema({
    questionId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Question" },
    text: { type: String, required: true },
    isCorrect: { type: mongoose.Schema.Types.Boolean, required: true },
})

AnswersSchema.virtual('question', {
    ref: 'Question',
    localField: 'questionId',
    foreignField: '_id',
    justOne: true,
});

AnswersSchema.set('toObject', { virtuals: true });
AnswersSchema.set('toJSON', { virtuals: true });

const AnswerModel = mongoose.model("Answer", AnswersSchema)

module.exports = AnswerModel
