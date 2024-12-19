const mongoose = require('mongoose')
const RoomEnrolmentSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Student' },
    instructorId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Instructor' },
    status: {
        type: String,
        enum: ['pending', 'approved', 'denied', 'kicked'], // Define allowed values
        required: true, // Ensure the field is required
        default: 'pending' // Set a default value if applicable
    },
    roomId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Room' }
})


RoomEnrolmentSchema.virtual('instructor', {
    ref: 'Instructor',
    localField: 'instructorId',
    foreignField: '_id',
    justOne: true,
});



RoomEnrolmentSchema.virtual('student', {
    ref: 'StudentId',
    localField: 'studentId',
    foreignField: '_id',
    justOne: true,
});


RoomEnrolmentSchema.virtual('room', {
    ref: 'Room',
    localField: 'roomId',
    foreignField: '_id',
    justOne: true,
});


RoomEnrolmentSchema.set('toObject', { virtuals: true });
RoomEnrolmentSchema.set('toJSON', { virtuals: true });

const RoomModel = mongoose.model('RoomEnrolment', RoomEnrolmentSchema)

module.exports = RoomModel 