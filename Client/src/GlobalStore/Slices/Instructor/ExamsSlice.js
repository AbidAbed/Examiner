import { createSlice } from "@reduxjs/toolkit";

const instructorExamsSlice = createSlice({
    name: 'instructorExams',
    initialState: { liveExams: [], exams: [] },
    reducers: {
        changeExams(state, action) {
            return { ...state, exams: [...action.payload] }
        },
        addExams(state, action) {
            const currentExams = [...state.exams]
            let cleanedExamsFromDupes = []
            if (currentExams.length !== 0)
                cleanedExamsFromDupes = currentExams.filter((curExam) =>
                    !action.payload.find((addedExam) =>
                        addedExam._id === curExam._id))
            return { ...state, exams: [...cleanedExamsFromDupes, ...action.payload] }
        },
        changeLiveExams(state, action) {
            return { ...state, liveExams: [...action.payload] }
        },
        changeExam(state, action) {
            const newFilteredState = [...state.exams].filter((exam) => exam._id !== action.payload._id)
            return { ...state, exams: [...newFilteredState, { ...action.payload }] }
        },
        addLiveExams(state, action) {
            const currentLiveExams = [...state.liveExams]
            let cleanedLiveExamsFromDupes = []
            if (currentLiveExams.length !== 0)
                cleanedLiveExamsFromDupes = currentLiveExams.filter((curLiveExam) =>
                    !action.payload.find((addedLiveExam) =>
                        addedLiveExam._id === curLiveExam._id))
            return { ...state, liveExams: [...cleanedLiveExamsFromDupes, ...action.payload] }
        },
    }
})

const { changeExams,
    changeExam,
    addExams,
    changeLiveExams,
    addLiveExams
} = instructorExamsSlice.actions

export {
    instructorExamsSlice,
    changeExams,
    addExams,
    changeLiveExams,
    changeExam,
    addLiveExams
}