const mongoose = require('mongoose')

const ExamSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: mongoose.Schema.Types.Number, required: true },
    scheduledTime: { type: mongoose.Schema.Types.Number, required: true },
    numberOfQuestions: { type: mongoose.Schema.Types.Number, required: true },
    passScore: { type: mongoose.Schema.Types.Number, required: true, default: 50 },
    fullScore: { type: mongoose.Schema.Types.Number, required: true },
    numberOfPages: { type: mongoose.Schema.Types.Number, required: true },
    allowReview: { type: mongoose.Schema.Types.Boolean, required: true, default: false },
    showMark: { type: mongoose.Schema.Types.Boolean, required: true, default: false },
    status: {
        type: String,
        enum: ['scheduled', 'finished', 'disabled'], // Define allowed values
        required: true, // Ensure the field is required
        default: 'scheduled' // Set a default value if applicable
    },
    enrolmentStatus: {
        type: String,
        enum: ['open', 'closed'], // Define allowed values
        required: true, // Ensure the field is required
        default: 'open' // Set a default value if applicable
    },
    examStatisticsId: { type: mongoose.Schema.Types.ObjectId, ref: 'ExamStatistics' },
    rating: { type: mongoose.Schema.Types.Number, default: 0 },
    examTakerStatisticsIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ExamTakerStatistics' }],
    questionsIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
    examEnrolmentsIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ExamEnrolment' }],
    instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Instructor' }

})

ExamSchema.virtual('question', {
    ref: 'Question',
    localField: 'questionsIds',
    foreignField: '_id',
    justOne: false,
});


ExamSchema.virtual('instructor', {
    ref: 'Instructor',
    localField: 'instructorId',
    foreignField: '_id',
    justOne: true,
});


ExamSchema.virtual('examEnrolments', {
    ref: 'ExamEnrolment',
    localField: 'examEnrolmentsIds',
    foreignField: '_id',
    justOne: false,
});


ExamSchema.virtual('examStatistics', {
    ref: 'ExamStatistics',
    localField: 'examStatisticsId',
    foreignField: '_id',
    justOne: true,
});


ExamSchema.virtual('examTakerStatistics', {
    ref: 'ExamTakerStatistics',
    localField: 'examTakerStatisticsIds',
    foreignField: '_id',
    justOne: true,
});


ExamSchema.set('toObject', { virtuals: true });
ExamSchema.set('toJSON', { virtuals: true });

const ExamModel = mongoose.model('Exam', ExamSchema)
module.exports = ExamModel 