import { createSlice } from "@reduxjs/toolkit";

const configSlice = createSlice({
    name: "config",
    initialState: { isLoggedIn: false, token: "", role: "student" },
    reducers: {
        changeIsLoggedIn(state, action) {
            return { ...state, isLoggedIn: action.payload }
        },

        changeToken(state, action) {
            return { ...state, token: action.payload }
        },

        changeRole(state, action) {
            return { ...state, role: action.payload }
        }
    }
})

const { changeIsLoggedIn, changeToken, changeRole } = configSlice.actions
export {
    configSlice,
    changeIsLoggedIn,
    changeToken,
    changeRole
}