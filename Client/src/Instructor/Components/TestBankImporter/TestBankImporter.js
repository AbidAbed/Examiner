import { useEffect, useState } from "react"
import { RotatingLines } from "react-loader-spinner"
import { useDispatch, useSelector } from "react-redux"
import { addTestBankQuestions, changeIsTestBankQuestionsTotalyLoaded, useLazyGetTestBankQuestionsQuery } from "../../../GlobalStore/GlobalStore"
import { toast } from "react-toastify"

function TestBankImporter({ isPopupVisable, setIsPopupVisable, handleAddQuestions }) {
    const [addedQuestions, setAddedQuestions] = useState([])
    const [page, setPage] = useState(1)


    const config = useSelector((state) => state.config)
    const testBankQuestions = useSelector((state) => state.testBank)

    const dispatch = useDispatch()

    const [getTestBankQuestionsTrigger, getTestBankQuestionsResponse] = useLazyGetTestBankQuestionsQuery()

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

    function addQuestion(e, question, index) {
        e.preventDefault()
        setAddedQuestions([...addedQuestions, question])
    }

    function removeQuestion(e, question, index) {
        e.preventDefault()
        setAddedQuestions([...addedQuestions].filter((addedQuestion) => JSON.stringify(addedQuestion) !== JSON.stringify(question)))
    }

    function setupHandleAddQuestions(e) {
        e.preventDefault()
        handleAddQuestions(addedQuestions)
        setIsPopupVisable(false)
        setAddedQuestions([])
        setPage(1)
    }

    return <div id="questionPopup" className="popup-question" style={isPopupVisable ? { display: 'flex', justifyContent: 'center', alignItems: 'center' } : { display: "none" }}>
        <div className="popup-question-content">
            <span className="close" id="closePopup" onClick={(e) => {
                e.preventDefault()
                setIsPopupVisable(false)
            }}>&times;</span>

            <h2>Import test bank questions</h2>

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
                                                <span>{index + 1}{") "}{question.text}</span>

                                            </div>
                                            <span className="edit_delete">
                                                <h5 style={{ color: question.isAiGenerated ? "blue" : "green" }}>{question.isAiGenerated ? "AI" : "Manual"}&nbsp;</h5>
                                                {addedQuestions.find((addedQuestion) => JSON.stringify(addedQuestion) === JSON.stringify(question)) ?
                                                    <button className="delete-answer-btn" onClick={(e) => removeQuestion(e, question, index)}>remove</button>
                                                    : <button className="add-answer-btn" onClick={(e) => addQuestion(e, question, index)}>add</button>}
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
                                                <span>{index + 1}{") "}{question.text}</span>

                                            </div>
                                            <span className="edit_delete">
                                                <h5 style={{ color: question.isAiGenerated ? "blue" : "green" }}>{question.isAiGenerated ? "AI" : "Manual"}&nbsp;</h5>
                                                {addedQuestions.find((addedQuestion) => JSON.stringify(addedQuestion) === JSON.stringify(question)) ?
                                                    <button className="delete-answer-btn" onClick={(e) => removeQuestion(e, question, index)}>remove</button>
                                                    : <button className="add-answer-btn" onClick={(e) => addQuestion(e, question, index)}>add</button>}
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
                                                <span>{index + 1}{") "}{question.text}</span>

                                            </div>
                                            <span className="edit_delete">
                                                <h5 style={{ color: question.isAiGenerated ? "blue" : "green" }}>{question.isAiGenerated ? "AI" : "Manual"}&nbsp;</h5>

                                                {addedQuestions.find((addedQuestion) => JSON.stringify(addedQuestion) === JSON.stringify(question)) ?
                                                    <button className="delete-answer-btn" onClick={(e) => removeQuestion(e, question, index)}>remove</button>
                                                    : <button className="add-answer-btn" onClick={(e) => addQuestion(e, question, index)}>add</button>}
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
                                                <span>{index + 1}{") "}{question.text}</span>

                                            </div>
                                            <span className="edit_delete">
                                                <h5 style={{ color: question.isAiGenerated ? "blue" : "green" }}>{question.isAiGenerated ? "AI" : "Manual"}&nbsp;</h5>

                                                {addedQuestions.find((addedQuestion) => JSON.stringify(addedQuestion) === JSON.stringify(question)) ?
                                                    <button className="delete-answer-btn" onClick={(e) => removeQuestion(e, question, index)}>remove</button>
                                                    : <button className="add-answer-btn" onClick={(e) => addQuestion(e, question, index)}>add</button>}
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
            <div>


                <div className="page-navigation">
                    <button id="prevPage" className="button" style={{ backgroundColor: page - 1 === 0 ? 'gray' : "" }}
                        disabled={page - 1 === 0 ? true : false} onClick={handlePrevPage}>Make Previous</button>
                    <button id="nextPage" className="button"
                        style={{ backgroundColor: (page > testBankQuestions.length / Number(process.env.REACT_APP_PAGE_SIZE)) && getTestBankQuestionsResponse?.data?.length === 0 ? "gray" : "" }}
                        disabled={(page > testBankQuestions.length / Number(process.env.REACT_APP_PAGE_SIZE)) && getTestBankQuestionsResponse?.data?.length === 0 ? true : false} onClick={handleNextPage}>Make Next</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', padding: '5px' }}>
                    <button disabled={getTestBankQuestionsResponse.isLoading || addedQuestions.length === 0}
                        style={{ backgroundColor: getTestBankQuestionsResponse.isLoading || addedQuestions.length === 0 ? "gray" : "", display: "flex" }}
                        type="submit" className="button" id="saveQuestionButton" onClick={setupHandleAddQuestions}>  Add selected questions</button>
                </div>
                {getTestBankQuestionsResponse.isLoading && <div style={{ display: 'flex', justifyContent: 'center', }}>
                    <RotatingLines
                        visible={true}
                        height="50"
                        width="50"
                        color="grey"
                        strokeWidth="5"
                        animationDuration="0.75"
                        ariaLabel="rotating-lines-loading"
                    />
                </div>}
            </div>
        </div>
    </div>
}
export default TestBankImporter