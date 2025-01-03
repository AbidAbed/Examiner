import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const StudentExamsAPI = createApi({
    reducerPath: "/student/exams",
    baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_BACKEND_URL }),
    endpoints(builder) {
        return {
            getExams: builder.query({
                query: (data) => {
                    return {
                        method: 'GET',
                        url: "/student/exams",
                        params: { page: data.page },
                        headers: { 'authentication': data.token }
                    }
                }
            }),
            getLiveExams: builder.query({
                query: (data) => {
                    return {
                        method: "GET",
                        url: "/student/exams/live",
                        headers: { 'authentication': data.token }
                    }
                }
            }),
            enrollExam: builder.mutation({
                query: (data) => {
                    return {
                        method: "POST",
                        headers: { 'authentication': data.token },
                        url: "/student/room/exam/enroll",
                        body: { ...data.body }
                    }
                }
            }),
            postStartExam: builder.mutation({
                query: (data) => {
                    return {
                        method: "POST",
                        headers: { 'authentication': data.token },
                        url: "/student/room/exam/start",
                        body: { ...data.body }
                    }
                }
            }),
            getExamQuestions: builder.query({
                query: (data) => {
                    return {
                        method: "GET",
                        url: "/student/room/exam/questions",
                        headers: { 'authentication': data.token },
                    }
                }
            }),
            postSubmitExam: builder.mutation({
                query: (data) => {
                    return {
                        method: "POST",
                        headers: { 'authentication': data.token },
                        url: "/student/room/exam/submit",
                        body: { ...data.body }
                    }
                }
            })
        }
    }
})

const {
    useGetExamsQuery,
    useLazyGetExamsQuery,
    useGetLiveExamsQuery,
    useLazyGetExamQuestionsQuery,
    useEnrollExamMutation,
    usePostStartExamMutation,
    useGetExamQuestionsQuery,
    usePostSubmitExamMutation
} = StudentExamsAPI
export {
    StudentExamsAPI,
    useGetExamsQuery,
    useGetLiveExamsQuery,
    useLazyGetExamsQuery,
    useLazyGetExamQuestionsQuery,
    useEnrollExamMutation,
    usePostStartExamMutation,
    useGetExamQuestionsQuery,
    usePostSubmitExamMutation
}