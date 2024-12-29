import { createSlice } from "@reduxjs/toolkit"

const roomSlice = createSlice({
    name: "room",
    initialState: { room: {}, roomEnrolments: [] },
    reducers: {
        changeRoom(state, action) {
            return { ...state, room: { ...action.payload } }
        },
        addRoomEnrolments(state, action) {
            const currentRoomEnrolments = [...state.roomEnrolments]
            let cleanedRoomEnrolmentsFromDupes = []
            if (currentRoomEnrolments.length !== 0)
                cleanedRoomEnrolmentsFromDupes = currentRoomEnrolments.filter((curRoomEnrolment) =>
                    !action.payload.find((addedRoomEnrolment) =>
                        addedRoomEnrolment._id === curRoomEnrolment._id))
            return { ...state, roomEnrolments: [...cleanedRoomEnrolmentsFromDupes, ...action.payload] }
        },
        changeRoomEnrolmentsStatus(state, action) {
            const updatedRoomEnrollments = [...state.roomEnrolments].reduce((prevRoomEnrollment, curRoomEnrolment) => {
                const isUpdated = action.payload.find((updatedRoomEnrollment) => updatedRoomEnrollment.roomEnrollmentId === curRoomEnrolment._id)
                if (isUpdated)
                    return [...prevRoomEnrollment, { ...curRoomEnrolment, status: isUpdated.status }]
                else
                    return [...prevRoomEnrollment, curRoomEnrolment]
            }, [])

            return { ...state, roomEnrolments: updatedRoomEnrollments }
        }
    }
})

const { changeRoom, addRoomEnrolments, changeRoomEnrolmentsStatus } = roomSlice.actions

export {
    roomSlice,
    changeRoom,
    addRoomEnrolments,
    changeRoomEnrolmentsStatus
}