import { createSlice } from "@reduxjs/toolkit";

const examsStatisticsSlice = createSlice({
    name: "examsStatistics",
    initialState: { overview: {}, examsTakersStatistics: [] },
    reducers: {
        changeOverview(state, action) {
            return { ...state, overview: { ...action.payload } }
        },
        addExamsTakersStatistics(state, action) {
            const currentExamsTakersStatistics = [...state.examsTakersStatistics]
            let cleanedExamsTakersStatisticsFromDupes = []
            if (currentExamsTakersStatistics.length !== 0)
                cleanedExamsTakersStatisticsFromDupes = currentExamsTakersStatistics.filter((curExamTakersStat) =>
                    !action.payload.find((addedExamTakersState) =>
                        addedExamTakersState._id === curExamTakersStat._id))
            return { ...state, examsTakersStatistics: [...cleanedExamsTakersStatisticsFromDupes, ...action.payload] }
        },
    }
})

const {
    changeOverview,
    addExamsTakersStatistics
} = examsStatisticsSlice.actions

export {
    examsStatisticsSlice,
    changeOverview,
    addExamsTakersStatistics

}