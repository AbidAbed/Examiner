import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

const TestBankApi = createApi({
    reducerPath: "/testbank",
    baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_BACKEND_URL }),
    endpoints(builder) {
        return {
            getTestBankQuestions: builder.query({
                query: (data) => {
                    return {
                        method: "GET",
                        url: "/instructor/testbank/questions",
                        params: { page: data.page },
                        headers: { 'authentication': data.token }
                    }
                }
            }),
            addTestBankQuestion: builder.mutation({
                query: (data) => {
                    return {
                        method: "POST",
                        headers: { 'authentication': data.token },
                        url: "/instructor/testbank/question",
                        body: { ...data.question }
                    }
                }
            }),
            generateAiQuestion: builder.mutation({
                query: (data) => {
                    return {
                        method: "POST",
                        headers: { 'authentication': data.token },
                        url: "/instructor/testbank/ai/question",
                        body: { prompt: data.prompt }
                    }
                }
            }),
            addBulkTestBankQuestions: builder.mutation({
                query: (data) => {
                    return {
                        method: "POST",
                        headers: { 'authentication': data.token },
                        url: "/instructor/testbank/questions",
                        body: { questions: [...data.questions] }
                    }
                }
            }),
            editTestBankQuestion: builder.mutation({
                query: (data) => {
                    return {
                        method: "PUT",
                        url: "/instructor/testbank/question",
                        headers: { 'authentication': data.token },
                        body: { ...data.question }
                    }
                }
            }),
            deleteTestBankQuestion: builder.mutation({
                query: (data) => {
                    return {
                        method: "DELETE",
                        headers: { 'authentication': data.token },
                        url: "/instructor/testbank/question",
                        body: { testBankQuestionId: data.testBankQuestionId }
                    }
                }
            })
        }
    }
})

const { useLazyGetTestBankQuestionsQuery,
    useAddTestBankQuestionMutation,
    useGenerateAiQuestionMutation,
    useAddBulkTestBankQuestionsMutation,
    useDeleteTestBankQuestionMutation,
    useEditTestBankQuestionMutation
} = TestBankApi

export {
    TestBankApi,
    useLazyGetTestBankQuestionsQuery,
    useAddTestBankQuestionMutation,
    useGenerateAiQuestionMutation,
    useAddBulkTestBankQuestionsMutation,
    useDeleteTestBankQuestionMutation,
    useEditTestBankQuestionMutation
}