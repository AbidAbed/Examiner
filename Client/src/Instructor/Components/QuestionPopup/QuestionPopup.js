import { useEffect, useState } from "react"
import "./QuestionPopup.css"

function QuestionPopup({ handleAddQuestion, questionOrder, pageNumber, isQuestionPopupVisable, setIsQuestionPopupVisable, editedQuestion }) {

    const [createdQuestion, setCreatedQuestion] = useState(editedQuestion !== undefined ? { ...editedQuestion } : {
        type: "",
        points: 1,
        order: questionOrder,
        pageNumber: pageNumber,
        text: "",
        isTestBank: false,
        isAiGenerated: false,
        answers: [{ text: "True", isCorrect: true },
        { text: "false", isCorrect: false }]
    })

    useEffect(() => {
        switch (createdQuestion.type) {
            case "multiple-choice-multiple-answer":
                setCreatedQuestion({
                    type: "multiple-choice-multiple-answer",
                    points: 1,
                    order: questionOrder,
                    pageNumber: pageNumber,
                    text: "",
                    isTestBank: false,
                    isAiGenerated: false,
                    answers: [{ text: "default", isCorrect: true }]
                })
                break
            case "multiple-choice-single-answer":
                setCreatedQuestion({
                    type: "multiple-choice-single-answer",
                    points: 1,
                    order: questionOrder,
                    pageNumber: pageNumber,
                    text: "",
                    isTestBank: false,
                    isAiGenerated: false,
                    answers: [{ text: "default", isCorrect: true }]
                })
                break
            case "true/false":
                setCreatedQuestion({
                    type: "true/false",
                    points: 1,
                    order: questionOrder,
                    pageNumber: pageNumber,
                    text: "",
                    isTestBank: false,
                    isAiGenerated: false,
                    answers: [{ text: "True", isCorrect: true }, { text: "false", isCorrect: false }]
                })
                break
            case "short-answer":
                setCreatedQuestion({
                    type: "short-answer",
                    points: 1,
                    order: questionOrder,
                    pageNumber: pageNumber,
                    text: "",
                    isTestBank: false,
                    isAiGenerated: false,
                    answers: [{ text: "default", isCorrect: true }]
                })
                break
        }
    }, [createdQuestion.type])

    return <form onSubmit={(e) => {
        e.preventDefault()
        handleAddQuestion(e, createdQuestion)
        setIsQuestionPopupVisable(false)
    }}>
        <div id="questionPopup" className="popup" style={isQuestionPopupVisable ? { display: 'flex', justifyContent: 'center', alignItems: 'center' } : { display: "none" }}>
            <div className="popup-content">
                <span className="close" id="closePopup" onClick={(e) => {
                    e.preventDefault()
                    setIsQuestionPopupVisable(false)
                    setCreatedQuestion({ ...createdQuestion, type: "" })
                }}>&times;</span>
                <h5>Create a New Question</h5>

                <label htmlFor="questionType" style={{ display: "inline", marginTop: "10px" }}>Select Question
                    Type:</label>
                <select id="questionType" onChange={(e) => {
                    e.preventDefault()
                    setCreatedQuestion({ ...createdQuestion, type: e.target.value })
                }} value={createdQuestion.type}>
                    <option value="">Select...</option>
                    <option value="multiple-choice-single-answer">Multiple Choice</option>
                    <option value="true/false">True/False</option>
                    <option value="short-answer">Short Answer</option>
                    <option value="multiple-choice-multiple-answer">CheckBoxes</option>
                </select>

                {createdQuestion.type === "multiple-choice-single-answer" &&
                    <div id="mcqFields" key="mcqFields" className="question-fields" style={{ display: 'flex' }}>
                        <div className="question_points">
                            <label>Question Points&nbsp;</label>
                            <input type="number" min={1} placeholder="Enter the points"
                                value={createdQuestion.points} onChange={(e) => {
                                    e.preventDefault()
                                    setCreatedQuestion({ ...createdQuestion, points: e.target.value })
                                }} required className="question" />
                        </div>
                        <div className="question_order">
                            <label>Question Order&nbsp;</label>
                            <input type="number" min={1} disabled={true} placeholder="The order of the Question in this page" required
                                value={createdQuestion.order} onChange={(e) => {
                                    e.preventDefault()
                                    setCreatedQuestion({ ...createdQuestion, order: e.target.value })
                                }} className="question" />
                        </div>
                        <div>
                            <label>Question:&nbsp;</label>
                            <input type="text" placeholder="Enter your question"
                                value={createdQuestion.text} onChange={(e) => {
                                    e.preventDefault()
                                    setCreatedQuestion({ ...createdQuestion, text: e.target.value })
                                }}
                                required className="question" />
                        </div>
                        <div>
                            <label>Options:</label>
                            <div>
                                {createdQuestion.answers.map((answer, index) =>
                                    <input type="text" key={index} value={answer.text} placeholder={`Option ${index + 1}`}
                                        required onChange={(e) => {
                                            e.preventDefault()
                                            setCreatedQuestion({
                                                ...createdQuestion, answers: createdQuestion.answers.reduce((prevAnswer, currAnswer, curAnswerIndex) => {
                                                    if (curAnswerIndex === index)
                                                        return [...prevAnswer, { ...answer, text: e.target.value }]
                                                    else
                                                        return [...prevAnswer, currAnswer]
                                                }, [])
                                            })
                                        }} />)}
                            </div>
                            <div>
                                <button className="add-answer-btn"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        setCreatedQuestion({ ...createdQuestion, answers: [...createdQuestion.answers, { text: "", isCorrect: false }] })
                                    }}>
                                    Add Answer</button>

                                <button
                                    disabled={createdQuestion.answers.length <= 1} className="delete-answer-btn"
                                    style={createdQuestion.answers.length <= 1 ? { backgroundColor: 'gray' } : {}}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        setCreatedQuestion({
                                            ...createdQuestion, answers: [...createdQuestion.answers.slice(0, createdQuestion.answers.length - 1)].map((answer, index) => {
                                                if (index === 0)
                                                    return { ...answer, isCorrect: true }
                                                else
                                                    return { ...answer, isCorrect: false }
                                            })
                                        })
                                    }}>
                                    Remove Answer</button> </div>
                        </div>
                        <div>
                            <label>Correct Answer:</label>
                            <input type="number" min={1} max={createdQuestion.answers.length}
                                value={createdQuestion.answers.indexOf(createdQuestion.answers.find((answer) => answer.isCorrect)) + 1}

                                onChange={(e) => {
                                    e.preventDefault()
                                    if (e.target.value <= createdQuestion.answers.length)
                                        setCreatedQuestion({
                                            ...createdQuestion, answers: createdQuestion.answers.map((answer, index) => {
                                                if (index === e.target.value - 1)
                                                    return { ...answer, isCorrect: true }
                                                else
                                                    return { ...answer, isCorrect: false }
                                            })
                                        })
                                }}
                                placeholder="Enter correct option number" required />
                        </div>
                    </div>}


                {createdQuestion.type === "true/false" &&
                    <div id="trueFalseFields" key="trueFalseFields" class="question-fields" style={{ display: 'flex' }}>
                        <div className="question_points">
                            <label>Question Points&nbsp;</label>
                            <input type="number" min={1} placeholder="Enter the points"
                                value={createdQuestion.points} onChange={(e) => {
                                    e.preventDefault()
                                    setCreatedQuestion({ ...createdQuestion, points: e.target.value })
                                }} required className="question" />
                        </div>
                        <div className="question_order">
                            <label>Question Order&nbsp;</label>
                            <input disabled={true} type="number" min={1} placeholder="The order of the Question in this page" required
                                value={createdQuestion.order} onChange={(e) => {
                                    e.preventDefault()
                                    setCreatedQuestion({ ...createdQuestion, order: e.target.value })
                                }} className="question" />
                        </div>

                        <div>
                            <label>Question:</label>
                            <input type="text" placeholder="Enter your statement"
                                value={createdQuestion.text} onChange={(e) => setCreatedQuestion({ ...createdQuestion, text: e.target.value })}
                                required class="question" />

                            <label>Correct Answer:</label>
                            <select required onChange={(e) => {

                                if (Number(e.target.value))
                                    setCreatedQuestion({ ...createdQuestion, answers: [{ text: 'True', isCorrect: true }, { text: 'False', isCorrect: false }] })
                                else
                                    setCreatedQuestion({ ...createdQuestion, answers: [{ text: 'True', isCorrect: false }, { text: 'False', isCorrect: true }] })
                            }}>
                                <option value={1} onSelect={(e) => {
                                }}>True</option>
                                <option value={0} onSelect={(e) => {
                                }}>False</option>
                            </select>
                        </div>
                    </div>}


                {createdQuestion.type === 'short-answer' &&
                    <div id="shortAnswerFields" key="shortAnswerFields" className="question-fields" style={{ display: "flex" }}>
                        <div className="question_points">
                            <label>Question Points&nbsp;</label>
                            <input disabled={true} type="number" min={1} placeholder="Enter the points"
                                value={createdQuestion.points} onChange={(e) => {
                                    e.preventDefault()
                                    setCreatedQuestion({ ...createdQuestion, points: e.target.value })
                                }} required className="question" />
                        </div>
                        <div className="question_order">
                            <label>Question Order&nbsp;</label>
                            <input type="number" min={1} disabled={true} placeholder="The order of the Question in this page" required
                                value={createdQuestion.order} onChange={(e) => {
                                    e.preventDefault()
                                    setCreatedQuestion({ ...createdQuestion, order: e.target.value })
                                }} className="question" />
                        </div>

                        <label>Question:</label>
                        <input type="text" placeholder="Enter your question"
                            value={createdQuestion.text} onChange={(e) => {
                                e.preventDefault()
                                setCreatedQuestion({ ...createdQuestion, text: e.target.value })
                            }}

                            required className="question" />
                        <label>Correct Answer:</label>
                        <input type="text"
                            value={createdQuestion.answers[0].text} onChange={(e) => {
                                e.preventDefault()
                                setCreatedQuestion({ ...createdQuestion, answers: [{ text: e.target.value, isCorrect: true }] })
                            }}
                            required
                            placeholder="Enter correct answer" />
                    </div>}



                {createdQuestion.type === 'multiple-choice-multiple-answer' &&
                    <div id="checkBoxesFields" key="checkBoxesFields" className="question-fields" style={{ display: "flex" }}>
                        <div className="question_points">
                            <label>Question Points&nbsp;</label>
                            <input disabled={true} type="number" min={1} placeholder="Enter the points"
                                value={createdQuestion.points} onChange={(e) => {
                                    e.preventDefault()
                                    setCreatedQuestion({ ...createdQuestion, points: e.target.value })
                                }} required className="question" />
                        </div>
                        <div className="question_order">
                            <label>Question Order&nbsp;</label>
                            <input type="number" min={1} disabled={true} placeholder="The order of the Question in this page" required
                                value={createdQuestion.order} onChange={(e) => {
                                    e.preventDefault()
                                    setCreatedQuestion({ ...createdQuestion, order: e.target.value })
                                }} className="question" />
                        </div>
                        <div>
                            <label>Question:&nbsp;</label>
                            <input type="text" placeholder="Enter your question"
                                value={createdQuestion.text} onChange={(e) => {
                                    e.preventDefault()
                                    setCreatedQuestion({ ...createdQuestion, text: e.target.value })
                                }}
                                required className="question" />
                        </div>

                        <label>Options:</label>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: "1fr 1fr",
                            gap: "6px"
                        }}>
                            {createdQuestion.answers.map((answer, index) =>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <input type="checkbox" checked={answer.isCorrect}
                                        onChange={() => {
                                            setCreatedQuestion({
                                                ...createdQuestion, answers: createdQuestion.answers.map((curAnswer, currIndex) => {
                                                    if (index === currIndex)
                                                        return { ...answer, isCorrect: !answer.isCorrect }
                                                    else
                                                        return curAnswer
                                                })
                                            })
                                        }}
                                    />
                                    <input required type="text" value={answer.text} placeholder={`Option ${index + 1}`}
                                        onChange={(e) => {
                                            // e.preventDefault()
                                            setCreatedQuestion({
                                                ...createdQuestion, answers: createdQuestion.answers.reduce((prevAnswer, currAnswer, curAnswerIndex) => {
                                                    if (curAnswerIndex === index)
                                                        return [...prevAnswer, { ...answer, text: e.target.value }]
                                                    else
                                                        return [...prevAnswer, currAnswer]
                                                }, [])
                                            })
                                        }} />
                                </div>
                            )}
                        </div>
                        <div>
                            <button className="add-answer-btn"
                                onClick={(e) => {
                                    e.preventDefault()
                                    setCreatedQuestion({ ...createdQuestion, answers: [...createdQuestion.answers, { text: "", isCorrect: false }] })
                                }}>
                                Add Answer</button>

                            <button
                                disabled={createdQuestion.answers.length <= 1} className="delete-answer-btn"
                                style={createdQuestion.answers.length <= 1 ? { backgroundColor: 'gray' } : {}}
                                onClick={(e) => {
                                    e.preventDefault()
                                    setCreatedQuestion({
                                        ...createdQuestion, answers: [...createdQuestion.answers.slice(0, createdQuestion.answers.length - 1)].map((answer, index) => {
                                            if (index === 0)
                                                return { ...answer, isCorrect: true }
                                            else
                                                return { ...answer, isCorrect: false }
                                        })
                                    })
                                }}>
                                Remove Answer</button> </div>
                    </div>}


                {createdQuestion.type !== "" &&
                    <button type="submit" className="button" id="saveQuestionButton" style={{ display: "flex" }}>Save
                        Question</button>}


            </div>
        </div>
    </form>
}

export default QuestionPopup