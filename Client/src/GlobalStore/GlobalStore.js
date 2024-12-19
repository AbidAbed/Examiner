import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from '@reduxjs/toolkit/query';
import {
    configSlice,
    changeIsLoggedIn,
    changeRole,
    changeToken
} from "./Slices/ConfigSlice"

import {
    AuthAPI,
    usePostAuthMutation,
    usePostLoginMutation,
    usePostSignupMutation,
    usePostForgetPasswordMutation,
} from "./APIS/AuthAPI"

import {
    userSlice,
    changeUser
} from "./Slices/UserSlice"

import {
    instructorSlice,
    changeInstructor,

} from "./Slices/InstructorSlice"

import {
    instructorExamsSlice,
    changeExams,
    addExams,
    changeLiveExams
} from "./Slices/Instructor/ExamsSlice"


import {
    examsStatisticsSlice,
    changeOverview
} from "./Slices/Instructor/ExamsStatistics"

import {
    InstructorExamsAPI,
    useGetExamsQuery,
    useGetLiveExamsQuery,
    usePostCreateExamMutation
} from "./APIS/Instructor/ExamsAPI"


import {
    ExamsStatistics,
    useGetOverAllStatisticsQuery
} from "./APIS/Instructor/ExamsStatistics"

import {
    TestBankApi,
    useGetTestBankQuestionsQuery,
    useAddTestBankQuestionMutation
} from "./APIS/Instructor/TestBankAPI"

const GlobalStore = configureStore({
    reducer: {
        config: configSlice.reducer,
        user: userSlice.reducer,
        instructor: instructorSlice.reducer,
        instructorExams: instructorExamsSlice.reducer,
        examsStatistics: examsStatisticsSlice.reducer,
        [AuthAPI.reducerPath]: AuthAPI.reducer,
        [TestBankApi.reducerPath]: TestBankApi.reducer,
        [InstructorExamsAPI.reducerPath]: InstructorExamsAPI.reducer,
        [ExamsStatistics.reducerPath]: ExamsStatistics.reducer
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware()
            .concat(AuthAPI.middleware)
            .concat(InstructorExamsAPI.middleware)
            .concat(ExamsStatistics.middleware)
            .concat(TestBankApi.middleware)
})

setupListeners(GlobalStore.dispatch);

export {
    GlobalStore,
    changeIsLoggedIn,
    changeRole,
    changeToken,
    changeUser,
    changeInstructor,
    changeExams,
    changeOverview,
    addExams,
    changeLiveExams,
    usePostAuthMutation,
    usePostLoginMutation,
    usePostSignupMutation,
    usePostForgetPasswordMutation,
    useGetExamsQuery,
    useGetOverAllStatisticsQuery,
    useGetLiveExamsQuery,
    usePostCreateExamMutation,
    useGetTestBankQuestionsQuery,
    useAddTestBankQuestionMutation

}