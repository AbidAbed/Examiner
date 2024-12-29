import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: 'user',
    initialState: {},
    reducers: {
        changeUser(state, action) {
            return { ...action.payload }
        }
    }
})

const { changeUser } = userSlice.actions
export {
    changeUser,
    userSlice
}