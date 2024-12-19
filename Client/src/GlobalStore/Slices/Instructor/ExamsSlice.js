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
        }
    }
})

const { changeExams, addExams, changeLiveExams } = instructorExamsSlice.actions

export {
    instructorExamsSlice,
    changeExams,
    addExams,
    changeLiveExams
}