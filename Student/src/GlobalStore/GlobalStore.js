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
    changeIsRoomEnrolmentsLoaded,
    changeIsRoomsLoaded
} from "./Slices/ConfigSlice"

import {
    userSlice,
    changeUser
} from "./Slices/UserSlice"


import {
    studentExamsSlice,
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
    addExamsTakersStatistics
} from "./Slices/ExamsStatistics"


import {
    roomSlice,
    changeRooms,
    addRooms
} from "./Slices/RoomSlice"


import {
    changeStudent,
    studentSlice
} from "./Slices/StudentSlice"




/**  ************** APIS ************** */

import {
    AuthAPI,
    usePostAuthMutation,
    usePostLoginMutation,
    usePostSignupMutation,
    usePostForgetPasswordMutation,
} from "./APIS/AuthAPI"



import {
    StudentExamsAPI,
    useGetExamsQuery,
    useGetLiveExamsQuery,
    useLazyGetExamsQuery,
    useLazyGetExamQuestionsQuery,
    useEnrollExamMutation,
    usePostStartExamMutation,
    usePostSubmitExamMutation,
    useGetExamQuestionsQuery
} from "./APIS/ExamsAPI"


import {
    ExamsStatisticsApi,
    useGetOverAllStatisticsQuery,
    useLazyGetExamTakerStatisticsQuery
} from "./APIS/ExamsStatisticsAPI"




import {
    RoomApi,
    useLazyGetRoomsQuery,
    useEnrollRoomMutation,
    useLazyGetRoomExamsQuery
} from "./APIS/RoomAPI"





const GlobalStore = configureStore({
    reducer: {
        config: configSlice.reducer,
        user: userSlice.reducer,
        studentExams: studentExamsSlice.reducer,
        examsStatistics: examsStatisticsSlice.reducer,
        rooms: roomSlice.reducer,
        student: studentSlice.reducer,
        [AuthAPI.reducerPath]: AuthAPI.reducer,
        [StudentExamsAPI.reducerPath]: StudentExamsAPI.reducer,
        [ExamsStatisticsApi.reducerPath]: ExamsStatisticsApi.reducer,
        [RoomApi.reducerPath]: RoomApi.reducer,

    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware()
            .concat(AuthAPI.middleware)
            .concat(StudentExamsAPI.middleware)
            .concat(ExamsStatisticsApi.middleware)
            .concat(RoomApi.middleware)
})

setupListeners(GlobalStore.dispatch);

export {
    GlobalStore,
    changeIsLoggedIn,
    changeRole,
    changeToken,
    changeUser,
    changeStudent,
    changeExams,
    changeOverview,
    addExams,
    changeLiveExams,
    changeIsTestBankQuestionsTotalyLoaded,
    changeIsExamsTotalyLoaded,
    changeRooms,
    addRooms,
    changeIsRoomEnrolmentsLoaded,
    addExamsTakersStatistics,
    changeExam,
    addLiveExams,
    deleteExam,
    updateExam,
    changeIsRoomsLoaded,
    usePostAuthMutation,
    usePostLoginMutation,
    usePostSignupMutation,
    usePostForgetPasswordMutation,
    useGetExamsQuery,
    useGetOverAllStatisticsQuery,
    useGetLiveExamsQuery,
    useLazyGetExamsQuery,
    useLazyGetRoomsQuery,
    useLazyGetExamQuestionsQuery,
    useEnrollRoomMutation,
    useLazyGetRoomExamsQuery,
    useEnrollExamMutation,
    usePostStartExamMutation,
    usePostSubmitExamMutation,
    useGetExamQuestionsQuery,
    useLazyGetExamTakerStatisticsQuery
}