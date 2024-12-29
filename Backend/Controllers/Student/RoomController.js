const { default: mongoose } = require("mongoose");
const RoomModel = require("../../Models/Room");
const RoomEnrolmentModel = require("../../Models/RoomEnrolment");
const StudentModel = require("../../Models/Student");

async function getStudentRooms(request, response) {
    try {
        if (!request.query.page)
            request.query.page = 1
        const foundStudent = await StudentModel.findById(request.user._id).populate({
            path: "roomsEnrolments",
            options: {
                select: "-takenExamsStatisticsIds -examsEnrolmentsIds",
                skip: (request.query.page - 1) * Number(process.env.PAGE_SIZE),
                limit: Number(process.env.PAGE_SIZE),
            },
            populate: {
                path: "room",
                options: {
                    select: "-roomEnrolmentsIds -examsIds",
                },
                populate: {
                    path: "instructor",
                    options: {
                        select: "-testBankId"
                    },
                    populate: {
                        path: "user",
                        options: {
                            select: "-password -role"
                        }
                    }
                }
            }
        })

        if (foundStudent !== null)
            return response.status(200).send(foundStudent.roomsEnrolments)
        else
            return response.status(400).send()

    } catch (error) {
        response.status(500).send()
        console.log(error);
    }
}

async function enrollStudentRoom(request, response) {
    try {
        const foundRoom = await RoomModel.findOne({ roomInvitaionCode: request.body.roomInvitationCode })
        if (foundRoom === null)
            return response.status(404).send()

        if (foundRoom.toObject().roomEnrolmentsIds.find((roomEnrollmentId) => request.user.roomsEnrolmentsIds.find((studentRoomEnrollmentId) => studentRoomEnrollmentId.toString() === roomEnrollmentId.toString())))
            return response.status(400).send()

        const createdRoomEnrollment = await RoomEnrolmentModel.create({
            instructorId: foundRoom.toObject().instructorId,
            roomId: foundRoom.toObject()._id,
            status: "pending",
            studentId: request.user._id
        })

        const updatedRoom = await RoomModel.findByIdAndUpdate(foundRoom.toObject()._id, {
            $push: { roomEnrolmentsIds: createdRoomEnrollment.toObject()._id }
        }, { returnDocument: 'after' }).select("-roomEnrolmentsIds -examsIds").populate({
            path: "instructor",
            options: {
                select: "-testBankId"
            },
            populate: {
                path: "user",
                select: "-role -password"
            }
        })

        const updatedStudent = await StudentModel.findByIdAndUpdate(request.user._id, {
            $push: { roomsEnrolmentsIds: createdRoomEnrollment.toObject()._id }
        }, { returnDocument: 'after' })

        if (createdRoomEnrollment !== null && updatedRoom !== null && updatedStudent !== null)
            return response.status(200).send({
                ...createdRoomEnrollment.toObject(),
                room: updatedRoom,
            })
        else
            return response.status(400).send()

    } catch (error) {
        response.status(500).send()
        console.log(error);
    }
}

async function getRoomExams(request, response) {
    try {
        if (!request.query.page)
            request.query.page = 1
        const foundRoom = await RoomModel.findById(request.query.roomId).populate({
            path: "roomEnrolments",
            match: { status: 'approved' }
        })

        if (foundRoom === null)
            return response.status(400).send()


        const isStudentAllowed = foundRoom.roomEnrolments.find((roomEnrolment) => request.user.roomsEnrolmentsIds.find((studentRoomEnrolment) =>
            studentRoomEnrolment.toString() === roomEnrolment._id.toString()))
        console.log(isStudentAllowed);
        
        if (!isStudentAllowed)
            return response.status(400).send()

        await foundRoom.populate({
            path: "exams",
            options: {
                skip: (request.query.page - 1) * Number(process.env.PAGE_SIZE),
                limit: Number(process.env.PAGE_SIZE),
                sort: { scheduledTime: -1 },
                select: "-numberOfQuestions -examStatisticsId -examTakerStatisticsIds -questionsIds -numberOfPages",
            },
            populate: {
                path: "examEnrolments",
                match: { _id: { $in: request.user.roomsEnrolmentsIds } }
            }
        })

        response.status(200).send(foundRoom.exams)
    } catch (error) {
        response.status(500).send()
        console.log(error);
    }
}
module.exports = { getStudentRooms, enrollStudentRoom, getRoomExams }