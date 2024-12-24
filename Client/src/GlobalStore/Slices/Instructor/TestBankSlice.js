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
        },
        deleteTestBankQuestion(state, action) {
            return [...state].filter((testBankQuestion) => testBankQuestion._id !== action.payload)
        },
        editTestBankQuestion(state, action) {
            const filteredTestBankQuestions = [...state].reduce((prevTestBankQuestion, curTestBankQuestion, index) => {
                if (curTestBankQuestion._id !== action.payload._id)
                    prevTestBankQuestion = [...prevTestBankQuestion, curTestBankQuestion]
                else
                    prevTestBankQuestion = [...prevTestBankQuestion, { ...action.payload }]

                return prevTestBankQuestion
            }, [])
            return filteredTestBankQuestions
        }
    }
})

const { addTestBankQuestions,
    deleteTestBankQuestion,
    editTestBankQuestion
} = testBankSlice.actions

export {
    testBankSlice,
    addTestBankQuestions,
    deleteTestBankQuestion,
    editTestBankQuestion
}