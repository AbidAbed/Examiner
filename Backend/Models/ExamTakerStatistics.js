const mongoose = require('mongoose')

const ExamTakerStatisticsSchema = new mongoose.Schema({
    startingTime: { type: mongoose.Schema.Types.Number },
    endingTime: { type: mongoose.Schema.Types.Number },
    timeTaken: { type: mongoose.Schema.Types.Number },
    correctAnswers: { type: mongoose.Schema.Types.Number },
    score: { type: mongoose.Schema.Types.Number },
    wrongAnswers: { type: mongoose.Schema.Types.Number, required: true },
    choosenAnswers: [{
        questionId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Question' },
        chosenAnswerId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Answer' },
    }],
    examId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Exam' },
    studentId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Student' },
})

ExamTakerStatisticsSchema.virtual('exam', {
    ref: 'Exam',
    localField: 'examId',
    foreignField: '_id',
    justOne: true,
});

ExamTakerStatisticsSchema.virtual('student', {
    ref: 'Student',
    localField: 'studentId',
    foreignField: '_id',
    justOne: true,
});


ExamTakerStatisticsSchema.virtual('questions', {
    ref: 'Question',
    localField: 'choosenAnswers.questionId',
    foreignField: '_id',
    justOne: true,
});


ExamTakerStatisticsSchema.virtual('answers', {
    ref: 'Answer',
    localField: 'choosenAnswers.chosenAnswerId',
    foreignField: '_id',
    justOne: true
});



ExamTakerStatisticsSchema.set('toObject', { virtuals: true });
ExamTakerStatisticsSchema.set('toJSON', { virtuals: true });

const ExamTakerStatisticsModel = mongoose.model('ExamTakerStatistics', ExamTakerStatisticsSchema)

module.exports = ExamTakerStatisticsModel