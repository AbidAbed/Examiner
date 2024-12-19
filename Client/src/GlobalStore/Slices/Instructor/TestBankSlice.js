import { createSlice } from "@reduxjs/toolkit";

const testBankSlice = createSlice({
    name: 'testBank',
    initialState: [],
    reducers: {
        addTestBankQuestions(state, action) {
            const currentTestBankQuestions = [...state]
            let cleanedTestBankQuestionsFromDupes = []
            if (currentTestBankQuestions.length !== 0)
                cleanedTestBankQuestionsFromDupes = currentTestBankQuestions.filter((curTestBankQuestion) =>
                    !action.payload.find((addedTestBankQuestion) =>
                        addedTestBankQuestion._id === curTestBankQuestion._id))
            return [...cleanedTestBankQuestionsFromDupes, ...action.payload]
        }
    }
})

const { addTestBankQuestions } = testBankSlice.actions

export {
    testBankSlice,
    addTestBankQuestions
}