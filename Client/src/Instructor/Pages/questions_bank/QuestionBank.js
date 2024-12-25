import { useEffect, useRef, useState } from "react";
import {
    addTestBankQuestions,
    changeIsTestBankQuestionsTotalyLoaded,
    deleteTestBankQuestion,
    editTestBankQuestion,
    useAddBulkTestBankQuestionsMutation,
    useAddTestBankQuestionMutation,
    useDeleteTestBankQuestionMutation,
    useEditTestBankQuestionMutation,
    useLazyGetTestBankQuestionsQuery
} from "../../../GlobalStore/GlobalStore";
import { toast } from 'react-toastify'
import Loading from "../../../Shared-Components/Loading/Loading"
import QuestionPopup from "../../Components/QuestionPopup/QuestionPopup"

import "./question_bank.css"
import { useDispatch, useSelector } from "react-redux";
import AiGenerateQuestions from "../../Components/AiGenerateQuestions/AiGenerateQuestions";
function QuestionBank() {
    const [page, setPage] = useState(1)
    const [isQuestionPopupVisable, setIsQuestionPopupVisable] = useState(false)
    const [editedQuestion, setEditedQuestion] = useState(null)
    const [isEditQuestionPopupVisable, setIsEditQuestionPopupVisable] = useState(false)
    const [aiGeneratingPopup, setAiGeneratingPopup] = useState(false)
    const [deleteQuestionPopup, setIsDeleteQuestionPopup] = useState(null)

    const dispatch = useDispatch()
    const testBankQuestions = useSelector((state) => state.testBank)
    const config = useSelector((state) => state.config)


    console.log(testBankQuestions);

    const [getTestBankQuestionsTrigger, getTestBankQuestionsResponse] = useLazyGetTestBankQuestionsQuery()
    const [postAddTestBankQuestion, postAddTestBankQuestionResponse] = useAddTestBankQuestionMutation()
    const [postAddBulkTestBankQuestions, postAddBulkTestBankQuestionsResponse] = useAddBulkTestBankQuestionsMutation()
    const [deleteTestBankQuestionMute, deleteTestBankQuestionResponse] = useDeleteTestBankQuestionMutation()
    const [editTestBankQuestionMute, editTestBankQuestionResponse] = useEditTestBankQuestionMutation()


    useEffect(() => {
        if (!deleteTestBankQuestionResponse.isLoading && !deleteTestBankQuestionResponse.isUninitialized) {
            if (deleteTestBankQuestionResponse.isError) {
                toast.error("Error deleting test bank question")
            } else {
                toast.success("Deleted successfully")
                dispatch(deleteTestBankQuestion(deleteTestBankQuestionResponse.originalArgs.testBankQuestionId))
            }
        }
    }, [deleteTestBankQuestionResponse])

    useEffect(() => {
        if (!editTestBankQuestionResponse.isLoading && !editTestBankQuestionResponse.isUninitialized) {
            if (editTestBankQuestionResponse.isError) {
                toast.error("Error updating test bank question")
            } else {
                toast.success("Edits saved successfully")
                dispatch(editTestBankQuestion(editTestBankQuestionResponse.data))
            }
        }
    }, [editTestBankQuestionResponse])

    useEffect(() => {
        if (!getTestBankQuestionsResponse.isLoading && !getTestBankQuestionsResponse.isUninitialized) {
            if (getTestBankQuestionsResponse.isError) {
                toast.error("Error loading test bank")
            } else {
                if (getTestBankQuestionsResponse.data.length === 0)
                    dispatch(changeIsTestBankQuestionsTotalyLoaded(true))
                else
                    dispatch(addTestBankQuestions(getTestBankQuestionsResponse.data))
            }
        }
    }, [getTestBankQuestionsResponse])

    useEffect(() => {
        if (!config.isTestBankQuestionsTotalyLoaded)
            getTestBankQuestionsTrigger({ page: page, token: config.token })
        else
            getTestBankQuestionsResponse.data = []
    }, [])

    useEffect(() => {
        if (!config.isTestBankQuestionsTotalyLoaded) {
            if (page !== 1 && (page > testBankQuestions.length / Number(process.env.REACT_APP_PAGE_SIZE)) && getTestBankQuestionsResponse?.data?.length !== 0) {
                getTestBankQuestionsTrigger({ page: page, token: config.token })
            }
        }
        else
            getTestBankQuestionsResponse.data = []

    }, [page])

    useEffect(() => {
        if (!postAddTestBankQuestionResponse.isUninitialized && !postAddTestBankQuestionResponse.isLoading) {
            if (postAddTestBankQuestionResponse.isError) {
                toast.error("Error adding question", { delay: 7 })
            } else {
                toast.success("Added to test bank successfully")
                dispatch(addTestBankQuestions([postAddTestBankQuestionResponse.data]))
            }
        }
    }, [postAddTestBankQuestionResponse])

    useEffect(() => {
        if (!postAddBulkTestBankQuestionsResponse.isUninitialized && !postAddBulkTestBankQuestionsResponse.isLoading) {
            if (postAddBulkTestBankQuestionsResponse.isError) {
                toast.error("Error adding questions", { delay: 7 })
            } else {
                toast.success("Added to test bank successfully")
                dispatch(addTestBankQuestions(postAddBulkTestBankQuestionsResponse.data))
            }
        }
    }, [postAddBulkTestBankQuestionsResponse])



    function handleNextPage(e) {
        e.preventDefault()
        if (!((page > testBankQuestions.length / Number(process.env.REACT_APP_PAGE_SIZE)) && getTestBankQuestionsResponse?.data?.length === 0))
            setPage(page + 1)
    }

    function handlePrevPage(e) {
        e.preventDefault()
        if (page - 1 !== 0)
            setPage(page - 1)
    }

    function saveEditedQuestion(e, question, index) {
        editTestBankQuestionMute({
            token: config.token, question: {
                _id: question._id,
                text: question.text,
                type: question.type,
                isAiGenerated: false,
                answers: question.answers.map((answer) => { return { text: answer.text, isCorrect: answer.isCorrect } })
            }
        })
    }

    function editQuestionSetup(e, question, index) {
        setEditedQuestion({ ...question, order: index + 1 })
        setIsEditQuestionPopupVisable(true)
    }

    function deleteQuestion(e, question, index) {
        e.preventDefault()
        deleteTestBankQuestionMute({ token: config.token, testBankQuestionId: question._id })
    }

    function addQuestion(e, question) {
        postAddTestBankQuestion({
            token: config.token, question: {
                text: question.text,
                type: question.type,
                isAiGenerated: question.isAiGenerated,
                answers: question.answers
            }
        })
    }

    function handleAddAiQuestions(questions) {
        postAddBulkTestBankQuestions({ token: config.token, questions: questions })
    }

    return <div className="main_page_content">
        {(postAddTestBankQuestionResponse.isLoading ||
            getTestBankQuestionsResponse.isLoading ||
            editTestBankQuestionResponse.isLoading ||
            deleteTestBankQuestionResponse.isLoading) && <Loading />}
        <div className="container">
            <div className="page-navigation" style={{ display: 'flex', flexDirection: 'row', padding: '4px', justifyContent: 'space-between' }}>
                <button className="add-answer-btn" style={{ display: 'flex' }} onClick={() => setIsQuestionPopupVisable(true)}>Add manual question</button>
                <button className="add-answer-btn" style={{ display: 'flex' }} onClick={() => setAiGeneratingPopup(true)}>Add AI question</button>
            </div>

            {deleteQuestionPopup !== null &&
                <div className="poup-signout-parent" style={{ backgroundColor: "transparent" }}>
                    <div className="poup-signout" >
                        <div>Are you sure ?</div>
                        <div className="confirmation">
                            <div className="add-answer-btn" onClick={(e) => {
                                deleteQuestion(e, deleteQuestionPopup, deleteQuestionPopup.index)
                                setIsDeleteQuestionPopup(null)
                            }}>Delete</div>
                            <div className="delete-answer-btn" onClick={() => setIsDeleteQuestionPopup(null)}>Cancel</div>
                        </div>
                    </div>
                </div>}

            {isQuestionPopupVisable && <QuestionPopup handleAddQuestion={addQuestion}
                isQuestionPopupVisable={isQuestionPopupVisable} setIsQuestionPopupVisable={setIsQuestionPopupVisable}
                questionOrder={testBankQuestions.length + 1}
            />}


            {isEditQuestionPopupVisable && <QuestionPopup editedQuestion={editedQuestion} handleAddQuestion={saveEditedQuestion}
                isQuestionPopupVisable={isEditQuestionPopupVisable} setIsQuestionPopupVisable={setIsEditQuestionPopupVisable}
                questionOrder={editedQuestion.order}
            />}

            {aiGeneratingPopup && <AiGenerateQuestions isPopupVisable={aiGeneratingPopup} setIsPopupVisable={setAiGeneratingPopup} handleAddQuestions={handleAddAiQuestions} />}

            {testBankQuestions.slice((page - 1) * Number(process.env.REACT_APP_PAGE_SIZE), (page - 1) * Number(process.env.REACT_APP_PAGE_SIZE) + Number(process.env.REACT_APP_PAGE_SIZE)).length === 0 ?
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'gray' }}> Test bank page is empty </div>
                : testBankQuestions.slice((page - 1) * Number(process.env.REACT_APP_PAGE_SIZE), (page - 1) * Number(process.env.REACT_APP_PAGE_SIZE) + Number(process.env.REACT_APP_PAGE_SIZE))
                    .map((question, index) => {
                        switch (question.type) {
                            case "multiple-choice-single-answer":
                                return <div key={question.type + "-" + index} draggableId={question.type + "-" + index} index={index} >
                                    <div className="question mcq" >
                                        <div className="question_content">
                                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                                <span>{index + 1 + (page - 1) * Number(process.env.REACT_APP_PAGE_SIZE)}{") "}{question.text}</span>

                                            </div>
                                            <span className="edit_delete">
                                                <h5 style={{ color: question.isAiGenerated ? "blue" : "green" }}>{question.isAiGenerated ? "AI" : "Manual"}&nbsp;</h5>
                                                <button className="edit_button" onClick={(e) => editQuestionSetup(e, question, index)}>⚙️</button>
                                                <button className="delete_button" onClick={(e) => setIsDeleteQuestionPopup({ ...question, index: index })}>❌</button>
                                            </span>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                            {question.answers.map((answer) =>
                                                <label style={{ backgroundColor: answer.isCorrect ? 'green' : 'red ' }}>
                                                    <input type="radio" disabled={true} name={answer.text} />&nbsp;{answer.text}</label>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            case "true/false":
                                return <div key={question.type + "-" + index} draggableId={question.type + "-" + index} index={index} >
                                    <div className="question true_false" >
                                        <div className="question_content">
                                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                                <span>{index + 1 + (page - 1) * Number(process.env.REACT_APP_PAGE_SIZE)}{") "}{question.text}</span>

                                            </div>
                                            <span className="edit_delete">
                                                <h5 style={{ color: question.isAiGenerated ? "blue" : "green" }}>{question.isAiGenerated ? "AI" : "Manual"}&nbsp;</h5>

                                                <button className="edit_button" onClick={(e) => editQuestionSetup(e, question, index)}>⚙️</button>
                                                <button className="delete_button" onClick={(e) => setIsDeleteQuestionPopup({ ...question, index: index })}>❌</button>
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                            {question.answers.map((answer) =>
                                                <label style={{ backgroundColor: answer.isCorrect ? 'green' : 'red ' }}>
                                                    <input disabled={true} type="radio" name={answer.text} value={answer.text} />&nbsp;{answer.text}</label>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            case "short-answer":
                                return <div key={question.type + "-" + index} draggableId={question.type + "-" + index} index={index} >
                                    <div className="question short_answer">
                                        <div className="question_content">
                                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                                <span>{index + 1 + (page - 1) * Number(process.env.REACT_APP_PAGE_SIZE)}{") "}{question.text}</span>

                                            </div>
                                            <span className="edit_delete">
                                                <h5 style={{ color: question.isAiGenerated ? "blue" : "green" }}>{question.isAiGenerated ? "AI" : "Manual"}&nbsp;</h5>

                                                <button className="edit_button" onClick={(e) => editQuestionSetup(e, question, index)}>⚙️</button>
                                                <button className="delete_button" onClick={(e) => setIsDeleteQuestionPopup({ ...question, index: index })}>❌</button>
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                            {question.answers.map((answer) =>
                                                <label><textarea disabled={true} type="text" name="shAn" value="" placeholder={answer.text} /></label>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            case "multiple-choice-multiple-answer":
                                return <div key={question.type + "-" + index} draggableId={question.type + "-" + index} index={index} >

                                    <div className="question checkbox">
                                        <div className="question_content">
                                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                                <span>{index + 1 + (page - 1) * Number(process.env.REACT_APP_PAGE_SIZE)}{") "}{question.text}</span>

                                            </div>
                                            <span className="edit_delete">
                                                <h5 style={{ color: question.isAiGenerated ? "blue" : "green" }}>{question.isAiGenerated ? "AI" : "Manual"}&nbsp;</h5>

                                                <button className="edit_button" onClick={(e) => editQuestionSetup(e, question, index)}>⚙️</button>
                                                <button className="delete_button" onClick={(e) => setIsDeleteQuestionPopup({ ...question, index: index })}>❌</button>
                                            </span>
                                        </div>


                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                            {question.answers.map((answer) =>
                                                <div style={{ backgroundColor: answer.isCorrect ? 'green' : 'red ', padding: '3px' }}>
                                                    <input disabled={true} type="checkbox" name={answer.text} value={answer.text} />
                                                    <label style={{ paddingLeft: '4px' }}>&nbsp;{answer.text}</label>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                        }
                    })}

            <div className="page-navigation">
                <button id="prevPage" className="button" style={{ backgroundColor: page - 1 === 0 ? 'gray' : "" }}
                    disabled={page - 1 === 0 ? true : false} onClick={handlePrevPage}>Make Previous</button>
                <button id="nextPage" className="button"
                    style={{ backgroundColor: (page > testBankQuestions.length / Number(process.env.REACT_APP_PAGE_SIZE)) && getTestBankQuestionsResponse?.data?.length === 0 ? "gray" : "" }}
                    disabled={(page - 1 >= testBankQuestions.length / Number(process.env.REACT_APP_PAGE_SIZE)) && getTestBankQuestionsResponse?.data?.length === 0 ? true : false} onClick={handleNextPage}>Make Next</button>
            </div>
        </div>

    </div>
}
export default QuestionBank