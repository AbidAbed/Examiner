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
                        url: "/student/exams/statistics",
                        headers: { 'authentication': data.token }
                    }
                }
            }),
            getExamTakerStatistics: builder.query({
                query: (data) => {
                    return {
                        method: "GET",
                        url: "/student/exam/taker-statistics",
                        params: { ...data.params },
                        headers: { 'authentication': data.token }

                    }
                }
            })
        }
    }
})

const {
    useGetOverAllStatisticsQuery,
    useLazyGetExamTakerStatisticsQuery
} = ExamsStatisticsApi

export {
    ExamsStatisticsApi,
    useGetOverAllStatisticsQuery,
    useLazyGetExamTakerStatisticsQuery
}