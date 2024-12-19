const mongoose = require('mongoose')

//  Not connecting questions with answers or testbank answer
//  Costs more, so  to calculate score for a student,
//  Must iterate thro all questions , for each question search
//  DB for answers with that question _id, if non
//  Then it's a test bank question, search in test bank questions
//  This way we make sure no way to know if a question is test bank or not
//  no way = non human mistakes + human mistakes , ain't no way

const QuestionSchema = new mongoose.Schema({
    examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam' },
    text: { type: String, required: true },
    type: {
        type: String,
        enum: ['multiple-choice-single-answer', 'multiple-choice-multiple-answer', 'true/false', 'short-answer', 'essay'], // Define allowed values
        required: true, // Ensure the field is required
    },
    order: { type: mongoose.Schema.Types.Number, required: true },
    page: { type: mongoose.Schema.Types.Number, required: true },
    points: { type: mongoose.Schema.Types.Number, required: true }
})


QuestionSchema.virtual('exam', {
    ref: 'Exam',
    localField: 'examId',
    foreignField: '_id',
    justOne: true,
});
QuestionSchema.set('toObject', { virtuals: true });
QuestionSchema.set('toJSON', { virtuals: true });

const QuestionModel = mongoose.model('Question', QuestionSchema)

module.exports = QuestionModel