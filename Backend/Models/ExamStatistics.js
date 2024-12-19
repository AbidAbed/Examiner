const mongoose = require('mongoose')

const ExamStatisticsSchema = new mongoose.Schema({
    averageScore: { type: mongoose.Schema.Types.Number, default: 0 },
    highestScore: { type: mongoose.Schema.Types.Number, default: 0 },
    averageTimeTaken: { type: mongoose.Schema.Types.Number, default: 0 },
    lowestScore: { type: mongoose.Schema.Types.Number, default: 0 },
    totalParticipants: { type: mongoose.Schema.Types.Number, default: 0 },
    totalRegistered: { type: mongoose.Schema.Types.Number, default: 0 },
    examId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Exam" },
    examTakersStatisticsIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "ExamTakerStatistics" }],
    totalPassedStudents:{ type: mongoose.Schema.Types.Number, default: 0 }
})


ExamStatisticsSchema.virtual('exam', {
    ref: 'Exam',
    localField: 'examId',
    foreignField: '_id',
    justOne: true,
});


ExamStatisticsSchema.virtual('examTakerStatistics', {
    ref: 'ExamTakerStatistics',
    localField: 'examTakersStatisticsIds',
    foreignField: '_id',
    justOne: false,
});
ExamStatisticsSchema.set('toObject', { virtuals: true });
ExamStatisticsSchema.set('toJSON', { virtuals: true });

const ExamStatisticsModel = mongoose.model('ExamStatistics', ExamStatisticsSchema)
module.exports = ExamStatisticsModel
