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
            }),
            changeRoomEnrollments: builder.mutation({
                query: (data) => {
                    return {
                        method: "PUT",
                        url: '/instructor/room/enrolments',
                        headers: { 'authentication': data.token },
                        body: { roomEnrollments: data.roomEnrollments }
                    }
                }
            })
        }
    }
})

const { useGetInstructorRoomQuery,
    useLazyGetRoomEnrolmentsQuery,
    useChangeRoomEnrollmentsMutation
} = RoomApi

export {
    RoomApi,
    useGetInstructorRoomQuery,
    useLazyGetRoomEnrolmentsQuery,
    useChangeRoomEnrollmentsMutation
}
