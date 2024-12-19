import { createSlice } from "@reduxjs/toolkit";

const examsStatisticsSlice = createSlice({
    name: "examsStatistics",
    initialState: { overview: {}, examsStatistics: [] },
    reducers: {
        changeOverview(state, action) {
            return { ...state, overview: { ...action.payload } }
        }
    }
})

const { changeOverview } = examsStatisticsSlice.actions

export {
    examsStatisticsSlice,
    changeOverview
}