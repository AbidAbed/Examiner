import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const InstructorExamsAPI = createApi({
    reducerPath: "/instructor/exams",
    baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_BACKEND_URL }),
    endpoints(builder) {
        return {
            getExams: builder.query({
                query: (data) => {
                    return {
                        method: 'GET',
                        url: "/instructor/exams",
                        params: { page: data.page },
                        headers: { 'authentication': data.token }
                    }
                }
            }),
            getLiveExams: builder.query({
                query: (data) => {
                    return {
                        method: "GET",
                        url: "/instructor/exams/live",
                        headers: { 'authentication': data.token }
                    }
                }
            }),
            postCreateExam: builder.mutation({
                query: (data) => {
                    return {
                        method: "POST",
                        url: "/instructor/exam",
                        headers: { 'authentication': data.token },
                        body: { ...data.exam } 
                    }
                }
            })
        }
    }
})

const { useGetExamsQuery,
    useGetLiveExamsQuery,
    usePostCreateExamMutation } = InstructorExamsAPI
export {
    InstructorExamsAPI,
    useGetExamsQuery,
    useGetLiveExamsQuery,
    usePostCreateExamMutation
}