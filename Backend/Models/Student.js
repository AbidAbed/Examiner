const mongoose = require('mongoose')

const StudentSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true, ref: 'User' }, // Custom _id field
    roomsEnrolmentsIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'RoomEnrolment' }],
    examsEnrolmentsIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ExamEnrolment' }],
    takenExamsStatisticsIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ExamTakerStatistics' }],
    startedExamId: { type: mongoose.Schema.Types.ObjectId, index: { expires: 0 }, ref: 'Exam' }
});


StudentSchema.virtual('user', {
    ref: 'User',
    localField: '_id',
    foreignField: '_id',
    justOne: true,
});


StudentSchema.virtual('roomsEnrolments', {
    ref: 'RoomEnrolment',
    localField: 'roomsEnrolmentsIds',
    foreignField: '_id',
    justOne: false,
});


StudentSchema.virtual('examEnrolments', {
    ref: 'ExamEnrolment',
    localField: 'examsEnrolmentsIds',
    foreignField: '_id',
    justOne: false,
});

StudentSchema.virtual('takenExamsStatistics', {
    ref: 'ExamTakerStatistics',
    localField: 'takenExamsStatisticsIds',
    foreignField: '_id',
    justOne: false,
});


StudentSchema.virtual('exam', {
    ref: 'Exam',
    localField: 'startedExamId',
    foreignField: '_id',
    justOne: true,
});

StudentSchema.set('toObject', { virtuals: true });
StudentSchema.set('toJSON', { virtuals: true });
const StudentModel = mongoose.model("Student", StudentSchema)

module.exports = StudentModel