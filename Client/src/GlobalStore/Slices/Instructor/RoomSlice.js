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
        }
    }
})

const { changeRoom, addRoomEnrolments } = roomSlice.actions

export {
    roomSlice,
    changeRoom,
    addRoomEnrolments
}