import { useEffect, useRef, useState } from "react";
import { addTestBankQuestions, useAddTestBankQuestionMutation, useLazyGetTestBankQuestionsQuery } from "../../../GlobalStore/GlobalStore";
import { toast } from 'react-toastify'
import Loading from "../../../Shared-Components/Loading/Loading"
import QuestionPopup from "../../Components/QuestionPopup/QuestionPopup"

import "./question_bank.css"
import { useDispatch, useSelector } from "react-redux";
function QuestionBank() {
    const [page, setPage] = useState(1)
    const [isQuestionPopupVisable, setIsQuestionPopupVisable] = useState(false)
    const [editedQuestion, setEditedQuestion] = useState(null)

    const dispatch = useDispatch()
    const testBankQuestions = useSelector((state) => state.testBank)
    const config = useSelector((state) => state.config)

    const [getTestBankQuestionsTrigger, getTestBankQuestionsResponse] = useLazyGetTestBankQuestionsQuery()
    const [postAddTestBankQuestion, postAddTestBankQuestionResponse] = useAddTestBankQuestionMutation()

    useEffect(() => {
        if (!getTestBankQuestionsResponse.isLoading && !getTestBankQuestionsResponse.isUninitialized) {
            if (getTestBankQuestionsResponse.isError) {
                toast.error("Error loading test bank")
            } else {
                dispatch(addTestBankQuestions(getTestBankQuestionsResponse.data))
            }
        }
    }, [getTestBankQuestionsResponse])

    useEffect(() => {
        getTestBankQuestionsTrigger({ page: page, token: config.token })
    }, [])

    useEffect(() => {
        if (page !== 1 && (page > testBankQuestions.length / Number(process.env.REACT_APP_PAGE_SIZE)) && getTestBankQuestionsResponse?.data?.length !== 0) {
            getTestBankQuestionsTrigger({ page: page, token: config.token })
        }
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

    function editQuestionSetup(e, question, index) {
        
    }

    function deleteQuestion(e, question, index) {

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

    return <div className="main_page_content">
        {(postAddTestBankQuestionResponse.isLoading || getTestBankQuestionsResponse.isLoading) && <Loading />}
        <div className="container">
            <div className="page-navigation" style={{ display: 'flex', flexDirection: 'row', padding: '4px', alignItems: 'center' }}>
                <button className="add-answer-btn" style={{ display: 'flex' }} onClick={() => setIsQuestionPopupVisable(true)}>Add question</button>
            </div>

            {isQuestionPopupVisable && <QuestionPopup editedQuestion={editedQuestion} handleAddQuestion={addQuestion}
                isQuestionPopupVisable={isQuestionPopupVisable} setIsQuestionPopupVisable={setIsQuestionPopupVisable}
                questionOrder={testBankQuestions.length + 1}
            />}

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
                                                <span className="points">{question.points} Point</span>
                                            </div>
                                            <span className="edit_delete">
                                                <button className="edit_button" onClick={(e) => editQuestionSetup(e, question, index)}>⚙️</button>
                                                <button className="delete_button" onClick={(e) => deleteQuestion(e, question, index)}>❌</button>
                                            </span>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                            {question.answers.map((answer) =>
                                                <label style={{ backgroundColor: answer.isCorrect ? 'green' : 'red ' }}>
                                                    <input type="radio" disabled={true} name={answer.text} value={answer.text} />{answer.text}</label>
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
                                                <span className="points">{question.points} Point</span>
                                            </div>
                                            <span className="edit_delete">
                                                <button className="edit_button" onClick={(e) => editQuestionSetup(e, question, index)}>⚙️</button>
                                                <button className="delete_button" onClick={(e) => deleteQuestion(e, question, index)}>❌</button>
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                            {question.answers.map((answer) =>
                                                <label style={{ backgroundColor: answer.isCorrect ? 'green' : 'red ' }}>
                                                    <input disabled={true} type="radio" name={answer.text} value={answer.text} />{answer.text}</label>
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
                                                <span className="points">{question.points} Point</span>
                                            </div>
                                            <span className="edit_delete">
                                                <button className="edit_button" onClick={(e) => editQuestionSetup(e, question, index)}>⚙️</button>
                                                <button className="delete_button" onClick={(e) => deleteQuestion(e, question, index)}>❌</button>
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
                                                <span className="points">{question.points} Point</span>
                                            </div>
                                            <span className="edit_delete">
                                                <button className="edit_button" onClick={(e) => editQuestionSetup(e, question, index)}>⚙️</button>
                                                <button className="delete_button" onClick={(e) => deleteQuestion(e, question, index)}>❌</button>
                                            </span>
                                        </div>


                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                            {question.answers.map((answer) =>
                                                <div style={{ backgroundColor: answer.isCorrect ? 'green' : 'red ', padding: '3px' }}>
                                                    <input disabled={true} type="checkbox" name={answer.text} value={answer.text} />
                                                    <label style={{ paddingLeft: '4px' }}>{answer.text}</label>
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
                    disabled={(page > testBankQuestions.length / Number(process.env.REACT_APP_PAGE_SIZE)) && getTestBankQuestionsResponse?.data?.length === 0 ? true : false} onClick={handleNextPage}>Make Next</button>
            </div>
        </div>

    </div>
}
export default QuestionBank