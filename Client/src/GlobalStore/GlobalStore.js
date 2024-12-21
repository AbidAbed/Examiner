import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from '@reduxjs/toolkit/query';
import {
    configSlice,
    changeIsLoggedIn,
    changeRole,
    changeToken,
    changeIsTestBankQuestionsTotalyLoaded,
    changeIsExamsTotalyLoaded,
    changeIsRoomEnrolmentsLoaded
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
    usePostCreateExamMutation,
    useLazyGetExamsQuery
} from "./APIS/Instructor/ExamsAPI"


import {
    ExamsStatisticsApi,
    useGetOverAllStatisticsQuery
} from "./APIS/Instructor/ExamsStatistics"

import {
    TestBankApi,
    useLazyGetTestBankQuestionsQuery,
    useAddTestBankQuestionMutation
} from "./APIS/Instructor/TestBankAPI"

import {
    testBankSlice,
    addTestBankQuestions
} from "./Slices/Instructor/TestBankSlice"

import {
    RoomApi,
    useGetInstructorRoomQuery,
    useLazyGetRoomEnrolmentsQuery
} from "./APIS/Instructor/RoomAPI"


import {
    roomSlice,
    changeRoom,
    addRoomEnrolments
} from "./Slices/Instructor/RoomSlice"

const GlobalStore = configureStore({
    reducer: {
        config: configSlice.reducer,
        user: userSlice.reducer,
        instructor: instructorSlice.reducer,
        instructorExams: instructorExamsSlice.reducer,
        examsStatistics: examsStatisticsSlice.reducer,
        testBank: testBankSlice.reducer,
        room: roomSlice.reducer,
        [AuthAPI.reducerPath]: AuthAPI.reducer,
        [TestBankApi.reducerPath]: TestBankApi.reducer,
        [InstructorExamsAPI.reducerPath]: InstructorExamsAPI.reducer,
        [ExamsStatisticsApi.reducerPath]: ExamsStatisticsApi.reducer,
        [RoomApi.reducerPath]: RoomApi.reducer
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware()
            .concat(AuthAPI.middleware)
            .concat(InstructorExamsAPI.middleware)
            .concat(ExamsStatisticsApi.middleware)
            .concat(TestBankApi.middleware)
            .concat(RoomApi.middleware)
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
    addTestBankQuestions,
    changeIsTestBankQuestionsTotalyLoaded,
    changeIsExamsTotalyLoaded,
    changeRoom,
    addRoomEnrolments,
    changeIsRoomEnrolmentsLoaded,
    usePostAuthMutation,
    usePostLoginMutation,
    usePostSignupMutation,
    usePostForgetPasswordMutation,
    useGetExamsQuery,
    useGetOverAllStatisticsQuery,
    useGetLiveExamsQuery,
    usePostCreateExamMutation,
    useLazyGetTestBankQuestionsQuery,
    useAddTestBankQuestionMutation,
    useLazyGetExamsQuery,
    useGetInstructorRoomQuery,
    useLazyGetRoomEnrolmentsQuery
}