import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

const RoomApi = createApi({
    reducerPath: "/room",
    baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_BACKEND_URL }),
    endpoints(builder) {
        return {
            getInstructorRoom: builder.query({
                query: (data) => {
                    return {
                        method: "GET",
                        url: "/instructor/room",
                        headers: { 'authentication': data.token }
                    }
                }
            }),
            getRoomEnrolments: builder.query({
                query: (data) => {
                    return {
                        method: "GET",
                        url: '/instructor/room/enrolments',
                        headers: { 'authentication': data.token },
                        params: { page: data.page }
                    }
                }
            })
        }
    }
})

const { useGetInstructorRoomQuery,
    useLazyGetRoomEnrolmentsQuery
} = RoomApi

export {
    RoomApi,
    useGetInstructorRoomQuery,
    useLazyGetRoomEnrolmentsQuery
}
