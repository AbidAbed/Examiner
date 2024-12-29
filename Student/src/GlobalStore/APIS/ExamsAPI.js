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
            getExamQuestions: builder.query({
                query: (data) => {
                    return {
                        method: "GET",
                        headers: { 'authentication': data.token },
                        url: "/student/exam/questions",
                        params: { examId: data.examId }
                    }
                }
            }),
        }
    }
})

const {
    useGetExamsQuery,
    useLazyGetExamsQuery,
    useGetLiveExamsQuery,
    useLazyGetExamQuestionsQuery,
} = StudentExamsAPI
export {
    StudentExamsAPI,
    useGetExamsQuery,
    useGetLiveExamsQuery,
    useLazyGetExamsQuery,
    useLazyGetExamQuestionsQuery,
}