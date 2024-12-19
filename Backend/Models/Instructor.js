const mongoose = require('mongoose')

const InstructorSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true, ref: 'User' },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
    testBankId: { type: mongoose.Schema.Types.ObjectId, ref: 'TestBank' }
})

InstructorSchema.virtual('user', {
    ref: 'User',
    localField: '_id',
    foreignField: '_id',
    justOne: true,
});


InstructorSchema.virtual('room', {
    ref: 'Room',
    localField: 'roomId',
    foreignField: '_id',
    justOne: true,
});


InstructorSchema.virtual('testBank', {
    ref: 'TestBank',
    localField: 'testBankId',
    foreignField: '_id',
    justOne: true,
});

InstructorSchema.set('toObject', { virtuals: true });
InstructorSchema.set('toJSON', { virtuals: true });
const InstructorModel = mongoose.model("Instructor", InstructorSchema)

module.exports = InstructorModel