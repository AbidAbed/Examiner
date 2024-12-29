import { createSlice } from "@reduxjs/toolkit";

const instructorSlice = createSlice({
    name: "instructor",
    initialState: {},
    reducers: {
        changeInstructor(state, action) {
            return { ...action.payload }
        }
    }
})

const { changeInstructor } = instructorSlice.actions

export {
    changeInstructor,
    instructorSlice
}