const { Router } = require('express')
const { getInstructorRoomValidator } = require("../../Validators/Instructor/RoomValidator")
const { getInstructorRoom, getRoomEnrolments } = require("../../Controllers/Instructor/RoomController")
const RoomRoute = Router()

RoomRoute.get("/room", getInstructorRoomValidator, getInstructorRoom)
RoomRoute.get("/room/enrolments", getRoomEnrolments)

module.exports = RoomRoute 