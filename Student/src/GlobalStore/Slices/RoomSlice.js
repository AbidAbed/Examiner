import { createSlice } from "@reduxjs/toolkit"

const roomSlice = createSlice({
    name: "room",
    initialState: [],
    reducers: {
        changeRooms(state, action) {
            return [...action.payload]
        },
        addRooms(state, action) {
            const currentRooms = [...state]
            let cleanedRoomsFromDupes = []
            if (currentRooms.length !== 0)
                cleanedRoomsFromDupes = currentRooms.filter((curRoom) =>
                    !action.payload.find((addedRoom) =>
                        addedRoom._id === curRoom._id))
            return [...cleanedRoomsFromDupes, ...action.payload]
        }
    }
})

const { changeRooms, addRooms } = roomSlice.actions

export {
    roomSlice,
    changeRooms,
    addRooms
}