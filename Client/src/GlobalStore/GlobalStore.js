import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from '@reduxjs/toolkit/query';

/**  ************** SLIECES ************** */
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
    changeLiveExams,
    changeExam,
    addLiveExams
} from "./Slices/Instructor/ExamsSlice"


import {
    examsStatisticsSlice,
    changeOverview,
    addExamStatistics,
    addExamsTakersStatistics
} from "./Slices/Instructor/ExamsStatistics"

import {
    testBankSlice,
    addTestBankQuestions,
    deleteTestBankQuestion,
    editTestBankQuestion
} from "./Slices/Instructor/TestBankSlice"


import {
    roomSlice,
    changeRoom,
    addRoomEnrolments
} from "./Slices/Instructor/RoomSlice"







/**  ************** APIS ************** */

import {
    AuthAPI,
    usePostAuthMutation,
    usePostLoginMutation,
    usePostSignupMutation,
    usePostForgetPasswordMutation,
} from "./APIS/AuthAPI"



import {
    InstructorExamsAPI,
    useGetExamsQuery,
    useGetLiveExamsQuery,
    usePostCreateExamMutation,
    useLazyGetExamsQuery
} from "./APIS/Instructor/ExamsAPI"


import {
    ExamsStatisticsApi,
    useGetOverAllStatisticsQuery,
    useLazyGetExamTakersStatisticsQuery,
    useLazyGetExamStatisticsQuery
} from "./APIS/Instructor/ExamsStatisticsAPI"

import {
    TestBankApi,
    useLazyGetTestBankQuestionsQuery,
    useAddTestBankQuestionMutation,
    useGenerateAiQuestionMutation,
    useAddBulkTestBankQuestionsMutation,
    useDeleteTestBankQuestionMutation,
    useEditTestBankQuestionMutation
} from "./APIS/Instructor/TestBankAPI"



import {
    RoomApi,
    useGetInstructorRoomQuery,
    useLazyGetRoomEnrolmentsQuery
} from "./APIS/Instructor/RoomAPI"




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
    addExamStatistics,
    addExamsTakersStatistics,
    changeExam,
    addLiveExams,
    deleteTestBankQuestion,
    editTestBankQuestion,
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
    useLazyGetRoomEnrolmentsQuery,
    useLazyGetExamTakersStatisticsQuery,
    useLazyGetExamStatisticsQuery,
    useGenerateAiQuestionMutation,
    useAddBulkTestBankQuestionsMutation,
    useDeleteTestBankQuestionMutation,
    useEditTestBankQuestionMutation
}