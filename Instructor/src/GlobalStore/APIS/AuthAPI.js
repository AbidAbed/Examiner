import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const AuthAPI = createApi({
    reducerPath: "/auth",
    baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_BACKEND_URL }),
    endpoints(builder) {
        return {
            postAuth: builder.mutation({
                query: (token) => {
                    return {
                        method: "POST",
                        url: "/user/auth",
                        headers: { "authentication": token }
                    };
                },
            }),
            postLogin: builder.mutation({
                query: (loginData) => {
                    return {
                        method: "POST",
                        body: { ...loginData },
                        url: "/user/login",
                    };
                },
            }),
            postSignup: builder.mutation({
                query: (signupData) => {
                    return {
                        method: "POST",
                        url: "/user/signup",
                        body: { ...signupData }
                    };
                },
            }),
            postForgetPassword: builder.mutation({
                query: (forgetPasswordData) => {
                    return {
                        method: "POST",
                        url: "/user/forget-password",
                        body: { ...forgetPasswordData }
                    };
                },
            }),
        };
    },
});


const {
    usePostAuthMutation,
    usePostLoginMutation,
    usePostSignupMutation,
    usePostForgetPasswordMutation
} = AuthAPI;


export {
    usePostAuthMutation,
    usePostLoginMutation,
    usePostSignupMutation,
    usePostForgetPasswordMutation,
    AuthAPI,
}