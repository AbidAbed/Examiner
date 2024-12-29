const { default: mongoose } = require("mongoose");
const RoomModel = require("../../Models/Room");
const RoomEnrolmentModel = require("../../Models/RoomEnrolment");
const RoomEnrolment = require("../../Models/RoomEnrolment");
const ExamEnrolmentModel = require("../../Models/ExamEnrolment");
const ExamModel = require("../../Models/Exam")
const ExamStatisticsModel = require('../../Models/ExamStatistics')

async function getInstructorRoom(request, response) {
    try {
        const foundRoom = await RoomModel.findById(request.user.roomId).select("-examsIds -roomEnrolmentsIds")
        if (foundRoom === null) {
            response.status(400).send()
            return
        }

        response.status(200).send(foundRoom.toJSON())
    } catch (error) {
        response.status(500).send()
        console.log(error);
    }
}

async function getRoomEnrolments(request, response) {
    try {
        if (!request.query.page)
            request.query.page = 1

        const foundRoom = await RoomModel.findById(request.user.roomId).select("-examsIds").populate({
            path: "roomEnrolments",
            options: {
                limit: Number(process.env.PAGE_SIZE),
                skip: (request.query.page - 1) * Number(process.env.PAGE_SIZE),
                select: "-instructorId"
            },
            populate: {
                path: "student",
                options: {
                    select: "-takenExamsStatisticsIds -examsEnrolmentsIds"
                },
                populate: {
                    path: "user",
                    options: {
                        select: "-password -role"
                    }
                }
            }
        })

        if (foundRoom === null) {
            response.status(500).send()
            return
        }

        response.status(200).send(foundRoom.roomEnrolments)
    } catch (error) {
        response.status(500).send()
        console.log(error);
    }
}

async function changeRoomEnrollmentStatus(request, response) {
    try {
        const foundRoom = await RoomModel.findById(request.user.roomId)

        const updatedRoomEnrollments = []

        for (let i = 0; i < request.body.roomEnrollments.length; i += 1) {

            //Logically each student would have less exams VS than an instructor having
            //An Exam with multiple students

            //Registered students for an exam logically is much more than the number of 
            //student's exams

            const foundRoomEnrollment = await RoomEnrolmentModel.findById(
                new mongoose.Types.ObjectId(request.body.roomEnrollments[i].roomEnrollmentId))
                .populate({
                    path: "student",
                    populate: {
                        path: "examEnrolments",
                        match: { examId: { $in: foundRoom.toObject().examsIds } }
                    }
                })
            const updatedRoomEnrollment = await RoomEnrolmentModel.findByIdAndUpdate(new mongoose.Types.ObjectId(request.body.roomEnrollments[i].roomEnrollmentId),
                { status: request.body.roomEnrollments[i].status }, { returnDocument: 'after' })


            let studentExamsEnrollments = []

            if ((request.body.roomEnrollments[i].status === "denied" || request.body.roomEnrollments[i].status === "kicked")
                && foundRoomEnrollment.student.examEnrolments.length !== 0)
                studentExamsEnrollments = await Promise.all(foundRoomEnrollment.student.examEnrolments.map((examEnrolment) =>
                    ExamEnrolmentModel.findByIdAndUpdate(examEnrolment.toObject()._id,
                        { status: request.body.roomEnrollments[i].status }, { returnDocument: 'after' })))


            updatedRoomEnrollments.push({ roomEnrolment: updatedRoomEnrollment.toObject(), examEnrolments: studentExamsEnrollments })
        }

        if (updatedRoomEnrollments.length !== 0)
            return response.status(200).send(updatedRoomEnrollments)
        else
            return response.status(400).send()
    } catch (error) {
        response.status(500).send()
        console.log(error);
    }
}

module.exports = {
    getInstructorRoom,
    getRoomEnrolments,
    changeRoomEnrollmentStatus
}