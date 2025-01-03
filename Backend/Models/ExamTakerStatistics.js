const mongoose = require('mongoose')

const ExamTakerStatisticsSchema = new mongoose.Schema({
    startingTime: { type: mongoose.Schema.Types.Number, required: true },
    endingTime: { type: mongoose.Schema.Types.Number },
    timeTaken: { type: mongoose.Schema.Types.Number },
    correctAnswers: { type: mongoose.Schema.Types.Number },
    score: { type: mongoose.Schema.Types.Number },
    isPassed: { type: mongoose.Schema.Types.Boolean, default: false },
    wrongAnswers: { type: mongoose.Schema.Types.Number },
    choosenAnswers: [{
        _id: { type: mongoose.Schema.Types.ObjectId },
        text: { type: String },
        type: { type: String },
        order: { type: mongoose.Schema.Types.Number },
        page: { type: mongoose.Schema.Types.Number },
        points: { type: mongoose.Schema.Types.Number },
        answers: [{
            _id: { type: mongoose.Schema.Types.ObjectId },
            questionId: { type: mongoose.Schema.Types.ObjectId },
            text: { type: String },
            isCorrect: { type: mongoose.Schema.Types.Boolean },
        }],
        choosenAnswer: { type: String }
    },],
    examId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Exam' },
    studentId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Student' },
    roomId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Room' }
})

ExamTakerStatisticsSchema.virtual('exam', {
    ref: 'Exam',
    localField: 'examId',
    foreignField: '_id',
    justOne: true,
});


ExamTakerStatisticsSchema.virtual('room', {
    ref: 'Room',
    localField: 'roomId',
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


// ExamTakerStatisticsSchema.virtual('answers', {
//     ref: 'Answer',
//     localField: 'choosenAnswers.chosenAnswerId',
//     foreignField: '_id',
//     justOne: true
// });



ExamTakerStatisticsSchema.set('toObject', { virtuals: true });
ExamTakerStatisticsSchema.set('toJSON', { virtuals: true });

const ExamTakerStatisticsModel = mongoose.model('ExamTakerStatistics', ExamTakerStatisticsSchema)

module.exports = ExamTakerStatisticsModel