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
        deleteExam(state, action) {
            const filteredExams = [...state.exams].filter((exam) => exam._id !== action.payload)
            const filteredLiveExams = [...state.liveExams].filter((exam) => exam._id !== action.payload)
            return { liveExams: filteredLiveExams, exams: filteredExams }
        },
        updateExam(state, action) {

            const filteredExams = [...state.exams].filter((exam) => exam._id !== action.payload._id)
            const filteredLiveExams = [...state.liveExams].filter((exam) => exam._id !== action.payload._id)
            const updatedExamIndex = [...state.exams].reduce((prevExam, curExam, index) => {
                if (curExam._id === action.payload._id)
                    return index
                else
                    return prevExam
            }, -1)

            if ([...state.liveExams].find((exam) => exam._id === action.payload._id)) {
                const updatedLiveExamIndex = [...state.liveExams].reduce((prevExam, curExam, index) => {
                    if (curExam._id === action.payload._id)
                        return index
                    else
                        return prevExam
                }, -1)

                return {
                    liveExams: Date.now() < action.payload.scheduledTime ?
                        [
                            ...filteredLiveExams.filter((exam, index) => index < updatedLiveExamIndex),
                            { ...action.payload },
                            ...filteredLiveExams.filter((exam, index) => index > updatedLiveExamIndex)]

                        : filteredLiveExams,
                    exams: [
                        ...filteredExams.filter((exam, index) => index < updatedExamIndex),
                        { ...action.payload },
                        ...filteredExams.filter((exam, index) => index > updatedExamIndex)]
                }

            } else {
                return {
                    liveExams: Date.now() < action.payload.scheduledTime ? [...filteredLiveExams, { ...action.payload }] : filteredLiveExams,
                    exams: [
                        ...filteredExams.filter((exam, index) => index < updatedExamIndex),
                        { ...action.payload },
                        ...filteredExams.filter((exam, index) => index > updatedExamIndex)]
                }
            }
        }
    }
})

const { changeExams,
    changeExam,
    addExams,
    changeLiveExams,
    addLiveExams,
    deleteExam,
    updateExam
} = instructorExamsSlice.actions

export {
    instructorExamsSlice,
    changeExams,
    addExams,
    changeLiveExams,
    changeExam,
    addLiveExams,
    deleteExam,
    updateExam
}