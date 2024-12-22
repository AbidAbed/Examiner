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
            })
        }
    }
})

const { useLazyGetTestBankQuestionsQuery,
    useAddTestBankQuestionMutation,
    useGenerateAiQuestionMutation,
    useAddBulkTestBankQuestionsMutation
} = TestBankApi

export {
    TestBankApi,
    useLazyGetTestBankQuestionsQuery,
    useAddTestBankQuestionMutation,
    useGenerateAiQuestionMutation,
    useAddBulkTestBankQuestionsMutation
}