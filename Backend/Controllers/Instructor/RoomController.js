const RoomModel = require("../../Models/Room");
const RoomEnrolment = require("../../Models/RoomEnrolment")

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
module.exports = {
    getInstructorRoom,
    getRoomEnrolments
}