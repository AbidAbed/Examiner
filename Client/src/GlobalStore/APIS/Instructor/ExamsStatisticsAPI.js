import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const ExamsStatisticsApi = createApi({
    reducerPath: '/instructor/exams/Statistics',
    baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_BACKEND_URL }),
    endpoints(builder) {
        return {
            getOverAllStatistics: builder.query({
                query: (data) => {
                    return {
                        method: 'GET',
                        url: "/instructor/exams/statistics",
                        headers: { 'authentication': data.token }
                    }
                }
            }),
            getExamTakersStatistics: builder.query({
                query: (data) => {
                    return {
                        method: "GET",
                        headers: { 'authentication': data.token },
                        params: { examId: data.examId, page: data.page },
                        url: "/instructor/exam/statistics/takers"
                    }
                }
            }),
            getExamStatistics: builder.query({
                query: (data) => {
                    return {
                        method: "GET",
                        params: { examId: data.examId },
                        headers: { 'authentication': data.token },
                        url: "/instructor/exam/statistics"
                    }
                }
            })
        }
    }
})

const { useGetOverAllStatisticsQuery,
    useLazyGetExamTakersStatisticsQuery,
    useLazyGetExamStatisticsQuery
} = ExamsStatisticsApi

export {
    ExamsStatisticsApi,
    useGetOverAllStatisticsQuery,
    useLazyGetExamTakersStatisticsQuery,
    useLazyGetExamStatisticsQuery
}