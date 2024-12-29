const { Router } = require('express')
const { getInstructorRoomValidator, changeRoomEnrollmentStatusValidator } = require("../../Validators/Instructor/RoomValidator")
const { getInstructorRoom, getRoomEnrolments, changeRoomEnrollmentStatus } = require("../../Controllers/Instructor/RoomController")
const RoomRoute = Router()

RoomRoute.get("/room", getInstructorRoomValidator, getInstructorRoom)
RoomRoute.get("/room/enrolments", getRoomEnrolments)
RoomRoute.put("/room/enrolments", changeRoomEnrollmentStatus, changeRoomEnrollmentStatusValidator)

module.exports = RoomRoute 