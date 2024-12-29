import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

const RoomApi = createApi({
    reducerPath: "/room",
    baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_BACKEND_URL }),
    endpoints(builder) {
        return {
            getRooms: builder.query({
                query: (data) => {
                    return {
                        method: "GET",
                        url: "/student/rooms",
                        headers: { 'authentication': data.token },
                        params: { page: data.page }
                    }
                }
            }),
            enrollRoom: builder.mutation({
                query: (data) => {
                    return {
                        method: "POST",
                        url: '/student/room/enroll',
                        headers: { 'authentication': data.token },
                        body: { roomInvitationCode: data.roomInvitationCode }
                    }
                }
            }),
            getRoomExams: builder.query({
                query: (data) => {
                    return {
                        method: "GET",
                        url: "/student/room/exams",
                        headers: { 'authentication': data.token },
                        params: { ...data.query }
                    }
                }
            })
        }
    }
})

const {
    useLazyGetRoomsQuery,
    useEnrollRoomMutation,
    useLazyGetRoomExamsQuery
} = RoomApi

export {
    RoomApi,
    useLazyGetRoomsQuery,
    useEnrollRoomMutation,
    useLazyGetRoomExamsQuery
}
