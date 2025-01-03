const { Router } = require('express')
const { getStudentRooms, enrollStudentRoom, getRoomExams } = require('../../Controllers/Student/RoomController')
const { getStudentRoomsValidator, enrollRoomStudentValidator, getRoomExamsValidator } = require("../../Validators/Student/RoomValidator")
const RoomRoute = Router()

RoomRoute.get("/rooms", getStudentRoomsValidator, getStudentRooms)
RoomRoute.post("/room/enroll", enrollRoomStudentValidator, enrollStudentRoom)
RoomRoute.get("/room/exams", getRoomExamsValidator, getRoomExams)


module.exports = { RoomRoute }