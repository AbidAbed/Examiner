import { createSlice } from "@reduxjs/toolkit";

const configSlice = createSlice({
    name: "config",
    initialState: {
        isLoggedIn: false, token: "", role: "student",
        isTestBankQuestionsTotalyLoaded: false,
        isExamsTotalyLoaded: false,
        isRoomEnrolmentsLoaded: false,
        isRoomsLoaded: false
    },
    reducers: {
        changeIsLoggedIn(state, action) {
            return { ...state, isLoggedIn: action.payload }
        },

        changeToken(state, action) {
            return { ...state, token: action.payload }
        },

        changeRole(state, action) {
            return { ...state, role: action.payload }
        },
        changeIsTestBankQuestionsTotalyLoaded(state, action) {
            return { ...state, isTestBankQuestionsTotalyLoaded: action.payload }
        },
        changeIsExamsTotalyLoaded(state, action) {
            return { ...state, isExamsTotalyLoaded: action.payload }
        },
        changeIsRoomEnrolmentsLoaded(state, action) {
            return { ...state, isExamsTotalyLoaded: action.payload }
        },
        changeIsRoomsLoaded(state, action) {
            return { ...state, isRoomsLoaded: action.payload }
        }
    }
})

const {
    changeIsLoggedIn,
    changeToken,
    changeRole,
    changeIsTestBankQuestionsTotalyLoaded,
    changeIsExamsTotalyLoaded,
    changeIsRoomEnrolmentsLoaded,
    changeIsRoomsLoaded
} = configSlice.actions
export {
    configSlice,
    changeIsLoggedIn,
    changeToken,
    changeRole,
    changeIsTestBankQuestionsTotalyLoaded,
    changeIsExamsTotalyLoaded,
    changeIsRoomEnrolmentsLoaded,
    changeIsRoomsLoaded
}