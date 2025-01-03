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
    addLiveExams,
    deleteExam,
    updateExam
} from "./Slices/ExamsSlice"


import {
    examsStatisticsSlice,
    changeOverview,
    addExamStatistics,
    addExamsTakersStatistics
} from "./Slices/ExamsStatistics"

import {
    testBankSlice,
    addTestBankQuestions,
    deleteTestBankQuestion,
    editTestBankQuestion
} from "./Slices/TestBankSlice"


import {
    roomSlice,
    changeRoom,
    addRoomEnrolments,
    changeRoomEnrolmentsStatus
} from "./Slices/RoomSlice"








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
    useLazyGetExamsQuery,
    useLazyGetExamQuestionsQuery,
    useDeleteExamMutation,
    usePutUpdateExamMutation,
    useLazyGetExamEnrollmentsQuery,
    useChangeExamEnrollmentsMutation
} from "./APIS/ExamsAPI"


import {
    ExamsStatisticsApi,
    useGetOverAllStatisticsQuery,
    useLazyGetExamTakersStatisticsQuery,
    useLazyGetExamStatisticsQuery
} from "./APIS/ExamsStatisticsAPI"

import {
    TestBankApi,
    useLazyGetTestBankQuestionsQuery,
    useAddTestBankQuestionMutation,
    useGenerateAiQuestionMutation,
    useAddBulkTestBankQuestionsMutation,
    useDeleteTestBankQuestionMutation,
    useEditTestBankQuestionMutation
} from "./APIS/TestBankAPI"



import {
    RoomApi,
    useGetInstructorRoomQuery,
    useLazyGetRoomEnrolmentsQuery,
    useChangeRoomEnrollmentsMutation
} from "./APIS/RoomAPI"





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
        [RoomApi.reducerPath]: RoomApi.reducer,

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
    deleteExam,
    updateExam,
    changeRoomEnrolmentsStatus,
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
    useEditTestBankQuestionMutation,
    useLazyGetExamQuestionsQuery,
    useDeleteExamMutation,
    usePutUpdateExamMutation,
    useChangeRoomEnrollmentsMutation,
    useLazyGetExamEnrollmentsQuery,
    useChangeExamEnrollmentsMutation
}