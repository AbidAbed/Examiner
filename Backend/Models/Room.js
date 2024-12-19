const mongoose = require('mongoose')

const RoomSchema = new mongoose.Schema({
    instructorId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true, ref: 'Instructor' },
    roomInvitaionCode: { type: String, required: true },
    examsIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exam' }],
    roomEnrolmentsIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'RoomEnrolment' }],
})


RoomSchema.virtual('instructor', {
    ref: 'Instructor',
    localField: 'instructorId',
    foreignField: '_id',
    justOne: true,
});


RoomSchema.virtual('exams', {
    ref: 'Exam',
    localField: 'examsIds',
    foreignField: '_id',
    justOne: false,
});


RoomSchema.virtual('roomEnrolments', {
    ref: 'RoomEnrolment',
    localField: 'roomEnrolmentsIds',
    foreignField: '_id',
    justOne: false,
});

RoomSchema.set('toObject', { virtuals: true });
RoomSchema.set('toJSON', { virtuals: true });

const RoomModel = mongoose.model('Room', RoomSchema)
module.exports = RoomModel