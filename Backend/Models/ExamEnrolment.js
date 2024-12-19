const mongoose = require('mongoose')

const ExamEnrolmentSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Student' },
    examId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Exam" },
    status: {
        type: String,
        enum: ['pending', 'approved', 'denied'], // Define allowed values
        required: true, // Ensure the field is required
        default: 'pending' // Set a default value if applicable
    },
})



ExamEnrolmentSchema.virtual('exam', {
    ref: 'Exam',
    localField: 'examId',
    foreignField: '_id',
    justOne: true,
});


ExamEnrolmentSchema.virtual('student', {
    ref: 'Student',
    localField: 'studentId',
    foreignField: '_id',
    justOne: true,
});
ExamEnrolmentSchema.set('toObject', { virtuals: true });
ExamEnrolmentSchema.set('toJSON', { virtuals: true });
const ExamEnrolmentModel = mongoose.model('ExamEnrolment', ExamEnrolmentSchema)

module.exports = ExamEnrolmentModel