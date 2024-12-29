import { createSlice } from "@reduxjs/toolkit";

const studentSlice = createSlice({
    name: "instructor",
    initialState: {},
    reducers: {
        changeStudent(state, action) {
            return { ...action.payload }
        }
    }
})

const { changeStudent } = studentSlice.actions

export {
    changeStudent,
    studentSlice
}