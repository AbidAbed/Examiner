import { createSlice } from "@reduxjs/toolkit";

const examsStatisticsSlice = createSlice({
    name: "examsStatistics",
    initialState: { overview: {}, examsStatistics: [], examsTakersStatistics: [] },
    reducers: {
        changeOverview(state, action) {
            return { ...state, overview: { ...action.payload } }
        },
        addExamStatistics(state, action) {
            const currentExamsStatistics = [...state.examsStatistics]
            let cleanedExamsStatisticsFromDupes = []
            if (currentExamsStatistics.length !== 0)
                cleanedExamsStatisticsFromDupes = currentExamsStatistics.filter((curExamStat) =>
                    !action.payload.find((addedExamState) =>
                        addedExamState._id === curExamStat._id))
            return { ...state, examsStatistics: [...cleanedExamsStatisticsFromDupes, ...action.payload] }
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

const { changeOverview,
    addExamStatistics,
    addExamsTakersStatistics
} = examsStatisticsSlice.actions

export {
    examsStatisticsSlice,
    changeOverview,
    addExamStatistics,
    addExamsTakersStatistics

}