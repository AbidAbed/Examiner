import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const ExamsStatistics = createApi({
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
            })
        }
    }
})

const { useGetOverAllStatisticsQuery } = ExamsStatistics

export {
    ExamsStatistics,
    useGetOverAllStatisticsQuery
}