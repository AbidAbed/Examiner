import { useEffect, useState } from "react"
import { useGenerateAiQuestionMutation } from "../../GlobalStore/GlobalStore"
import { toast } from "react-toastify"
import { useSelector } from "react-redux"
import { RotatingLines } from "react-loader-spinner"

function AiGenerateQuestions({ isPopupVisable, setIsPopupVisable, handleAddQuestions }) {
    const [generatedQuestions, setGeneratedQuestions] = useState([])
    const [addedQuestions, setAddedQuestions] = useState([])

    const [prompt, setPrompt] = useState("")


    const config = useSelector((state) => state.config)

    const [postGenerateAiQuestions, postGenerateAiQuestionsResponse] = useGenerateAiQuestionMutation()

    useEffect(() => {
        if (!postGenerateAiQuestionsResponse.isLoading && !postGenerateAiQuestionsResponse.isUninitialized) {
            if (postGenerateAiQuestionsResponse.isError) {
                toast.error("Error generating questions")
            } else {
                setGeneratedQuestions([...postGenerateAiQuestionsResponse.data])
            }
        }
    }, [postGenerateAiQuestionsResponse])


    function handleGenerate(e) {
        e.preventDefault()
        setGeneratedQuestions([])
        postGenerateAiQuestions({ prompt: prompt, token: config.token })
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
    }
    return <div id="questionPopup" className="popup-question" style={isPopupVisable ? { display: 'flex', justifyContent: 'center', alignItems: 'center' } : { display: "none" }}>
        <div className="popup-question-content">
            <span className="close" id="closePopup" onClick={(e) => {
                e.preventDefault()
                setIsPopupVisable(false)
            }}>&times;</span>

            <h2>Enter content to generate questions for</h2>
            <textarea placeholder="Amman is the capital city for jordan" disabled={postGenerateAiQuestionsResponse.isLoading} value={prompt} onChange={(e) => setPrompt(e.target.value)}>
            </textarea>

            {generatedQuestions.length === 0 ?
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'gray', padding: '5px' }}> No generated questions </div>
                : generatedQuestions.map((question, index) => {
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
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', padding: '5px' }}>
                    <button disabled={postGenerateAiQuestionsResponse.isLoading} style={{ backgroundColor: postGenerateAiQuestionsResponse.isLoading ? "gray" : "", display: "flex" }} type="submit" className="button" id="saveQuestionButton" onClick={handleGenerate}>  Generate Questions</button>
                    <button disabled={postGenerateAiQuestionsResponse.isLoading || addedQuestions.length === 0} style={{ backgroundColor: postGenerateAiQuestionsResponse.isLoading || addedQuestions.length === 0 ? "gray" : "", display: "flex" }} type="submit" className="button" id="saveQuestionButton" onClick={setupHandleAddQuestions}>  Add to testbank</button>

                </div>
                {postGenerateAiQuestionsResponse.isLoading && <div style={{ display: 'flex', justifyContent: 'center', }}>
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
export default AiGenerateQuestions