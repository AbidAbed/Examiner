import { Link, useNavigate, useParams } from "react-router"
import "./TakingExam.css"
import { useEffect, useState } from "react"
import { useGetExamQuestionsQuery, usePostSubmitExamMutation, addExamsTakersStatistics, changeStudent } from "../../../GlobalStore/GlobalStore"
import { useSelector } from "react-redux"
import { toast } from "react-toastify"
import Loading from "../../../Shared-Components/Loading/Loading"
import { useDispatch } from "react-redux"

function TakingExam() {
    const config = useSelector((state) => state.config)
    const student = useSelector((state) => state.student)

    const [exam, setExam] = useState(null)
    const [pages, setPages] = useState({})
    const [selectedPage, setSelectedPage] = useState(1)
    const { startedExamId } = useParams()

    const [remainingTime, setRemainingTime] = useState()
    const [isFinishExamPopupVisable, setIsFinishExamPopupVisable] = useState(false)

    const getExamQuestionsResponse = useGetExamQuestionsQuery({ token: config.token })
    const [postSubmitExam, postSubmitExamResponse] = usePostSubmitExamMutation()

    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        if (!getExamQuestionsResponse.isLoading && !getExamQuestionsResponse.isUninitialized) {
            if (getExamQuestionsResponse.isError) {
                toast.error("Error loading exam")
            } else {
                let reconstructedExams = getExamQuestionsResponse.data.question.reduce((preQuestion, curQuestion, index) => {
                    if (preQuestion[curQuestion.page]) {
                        return {
                            ...preQuestion, [curQuestion.page]: [...preQuestion[curQuestion.page], {
                                ...curQuestion,
                                isAnswered: false,
                                choosenAnswer: "",
                                isFlagged: false,
                            }].sort((a, b) => a.order - b.order)
                        }
                    }
                    else return {
                        ...preQuestion, [curQuestion.page]: [{
                            ...curQuestion,
                            isAnswered: false,
                            choosenAnswer: "",
                            isFlagged: false,
                        }].sort((a, b) => a.order - b.order)
                    }
                }, {})
                let overAllCount = 1
                
                reconstructedExams = Object.entries(reconstructedExams).reduce((prevExam, curExam) => {
                    prevExam[curExam[0]] = curExam[1].map((question) => { return { ...question, overAllCount: overAllCount++ } })
                    return prevExam
                }, {})

                setPages(reconstructedExams)
                setExam(getExamQuestionsResponse.data)
                setRemainingTime(getExamQuestionsResponse.data.scheduledTime + getExamQuestionsResponse.data.duration * 60 * 1000 - Date.now())
            }
        }
    }, [getExamQuestionsResponse])

    useEffect(() => {
        if (exam !== null) {
            if (remainingTime <= 0)
                handleSubmitExam()
            setTimeout(() => {
                setRemainingTime(exam.scheduledTime + exam.duration * 60 * 1000 - Date.now())
            }, 1000)
        }
    }, [remainingTime, exam])

    useEffect(() => {
        if (!postSubmitExamResponse.isLoading && !postSubmitExamResponse.isUninitialized) {
            if (postSubmitExamResponse.isError) {
                toast.error("Error submiting exam , you are late")
                navigate("/student/dashboard")
            } else {
                toast.success("Exam submited successfully")
                if (exam.allowReview || exam.showMark) {
                    dispatch(addExamsTakersStatistics([{ ...postSubmitExamResponse.data }]))
                }
                dispatch(changeStudent({
                    ...student, startedExamId: null,
                    takenExamsStatistics: [
                        ...student.takenExamsStatistics,
                        { ...postSubmitExamResponse.data }]
                }))
                if (!exam.allowReview && !exam.showMark)
                    navigate("/student/dashboard")

            }
        }
    }, [postSubmitExamResponse])

    function navigateToQuestionPage(e, question) {
        e.preventDefault()
        setSelectedPage(Number(question.page))
    }

    function convertMilSecondsToDayHourM(mSeconds) {
        const seconds = mSeconds / 1000;
        const minutes = seconds / 60;
        const hours = minutes / 60;
        const days = hours / 24;

        return {
            days: Math.floor(days) < 0 ? 0 : Math.floor(days),
            hours: Math.floor(hours % 24) < 0 ? 0 : Math.floor(hours % 24),
            minutes: Math.floor(minutes % 60) < 0 ? 0 : Math.floor(minutes % 60),
            seconds: Math.floor(seconds % 60) < 0 ? 0 : Math.floor(seconds % 60)
        };
    }

    function handleAnswer(e, question) {
        e.preventDefault()
        const lessOrderQuestion = pages[selectedPage].filter((oldQuestion) => oldQuestion.order < question.order)
        const moreOrderQuestion = pages[selectedPage].filter((oldQuestion) => oldQuestion.order > question.order)

        let updatedQuestion = { ...question }
        switch (question.type) {
            case "multiple-choice-single-answer":
                if (e.target.value === question.choosenAnswer) {
                    updatedQuestion.isAnswered = false
                    updatedQuestion.choosenAnswer = ""
                } else {
                    updatedQuestion.choosenAnswer = e.target.value
                    updatedQuestion.isAnswered = true
                }
                break;
            case "true/false":
                if (e.target.value === question.choosenAnswer) {
                    updatedQuestion.isAnswered = false
                    updatedQuestion.choosenAnswer = ""
                } else {
                    updatedQuestion.choosenAnswer = e.target.value
                    updatedQuestion.isAnswered = true
                }
                break
            case "short-answer":
                if (e.target.value.length === 0)
                    updatedQuestion.isAnswered = false
                else
                    updatedQuestion.isAnswered = true
                updatedQuestion.choosenAnswer = e.target.value

                break
            case "multiple-choice-multiple-answer":
                if (question.choosenAnswer.split("-").find((asn) => asn === e.target.value) !== undefined) {
                    updatedQuestion.choosenAnswer = question.choosenAnswer.split("-").reduce((prevAsn, curAsn, index) => {
                        if (curAsn !== e.target.value) {
                            if (index === 0)
                                return prevAsn + curAsn
                            else
                                return prevAsn + "-" + curAsn
                        } else
                            return prevAsn
                    }, "")
                } else {
                    updatedQuestion.choosenAnswer = updatedQuestion.choosenAnswer + "-" + e.target.value
                    updatedQuestion.isAnswered = true
                }
                if (question.choosenAnswer.split("-").length === 0)
                    updatedQuestion.isAnswered = false
                break
        }
        setPages({
            ...pages,
            [selectedPage]: [
                ...lessOrderQuestion,
                {
                    ...updatedQuestion,
                },
                ...moreOrderQuestion,
            ]
        })
    }

    function handleFlagQuestion(e, question, index) {
        const lessOrderQuestion = pages[selectedPage].filter((oldQuestion) => oldQuestion.order < question.order)
        const moreOrderQuestion = pages[selectedPage].filter((oldQuestion) => oldQuestion.order > question.order)
        setPages({
            ...pages,
            [selectedPage]: [
                ...lessOrderQuestion,
                {
                    ...question,
                    isFlagged: !question.isFlagged
                },
                ...moreOrderQuestion,
            ]
        })
    }

    function handleSubmitExam(e) {
        e?.preventDefault()
        const reconstructedQuestions = Object.entries(pages).reduce((prePagesQuestions, curPagesQuestions) => {
            const reconstructedQuestions = curPagesQuestions[1].map((reconstructedQuestion) => {
                return {
                    ...reconstructedQuestion,
                    page: curPagesQuestions[0]
                }
            })
            return [...prePagesQuestions, ...reconstructedQuestions]
        }, []).map((question) => {
            return { _id: question._id, choosenAnswer: question.choosenAnswer }
        })
        postSubmitExam({ token: config.token, body: { questions: reconstructedQuestions } })
        setIsFinishExamPopupVisable(false)
    }

    return <div className="exam-details-main">
        <div className="container">
            {(postSubmitExamResponse.isLoading || getExamQuestionsResponse.isLoading) && <Loading />}
            {exam === null ? <div>No Questions to load </div> : <>
                <div className="questions-exam-started-container">
                    <div className="question-grid">
                        {Object.entries(pages).reduce((prePagesQuestions, curPagesQuestions) => {
                            const reconstructedQuestions = curPagesQuestions[1].map((reconstructedQuestion) => {
                                return {
                                    ...reconstructedQuestion,
                                    page: curPagesQuestions[0]
                                }
                            })
                            return [...prePagesQuestions, ...reconstructedQuestions]
                        }, []).map((question) => <button className={`${question.page == selectedPage ? "current_page " : " "}${question.isFlagged ? "flagged " : " "}${question.isAnswered ? "answered " : " "}`}
                            onClick={(e) => navigateToQuestionPage(e, question)}
                        >{question.overAllCount}</button>)}
                    </div>


                    <div className="status-container">
                        <div className="status-item time-remaining">
                            <p>Time Remaining:</p>
                            <span>{convertMilSecondsToDayHourM(remainingTime).hours}:
                                {convertMilSecondsToDayHourM(remainingTime).minutes}:
                                {convertMilSecondsToDayHourM(remainingTime).seconds}
                            </span>
                        </div>
                        <div className="status-item answered">
                            <p>Answered Questions:</p>
                            <span>{Object.entries(pages).reduce((prePagesQuestions, curPagesQuestions) => {
                                const reconstructedQuestions = curPagesQuestions[1].map((reconstructedQuestion) => {
                                    return {
                                        ...reconstructedQuestion,
                                        page: prePagesQuestions[0]
                                    }
                                })
                                return [...prePagesQuestions, ...reconstructedQuestions]
                            }, []).reduce((prevQuestion, curQuestion) => prevQuestion + (curQuestion.isAnswered ? 1 : 0), 0)}</span>
                        </div>
                        <div className="status-item flagged">
                            <p>Flagged Questions:</p>
                            <span>{Object.entries(pages).reduce((prePagesQuestions, curPagesQuestions) => {
                                const reconstructedQuestions = curPagesQuestions[1].map((reconstructedQuestion) => {
                                    return {
                                        ...reconstructedQuestion,
                                        page: prePagesQuestions[0]
                                    }
                                })
                                return [...prePagesQuestions, ...reconstructedQuestions]
                            }, []).reduce((prevQuestion, curQuestion) => prevQuestion + (curQuestion.isFlagged ? 1 : 0), 0)}</span>
                        </div>
                        <div className="status-item remaining">
                            <p>Remaining Questions:</p>
                            <span>{Object.entries(pages).reduce((prePagesQuestions, curPagesQuestions) => {
                                const reconstructedQuestions = curPagesQuestions[1].map((reconstructedQuestion) => {
                                    return {
                                        ...reconstructedQuestion,
                                        page: prePagesQuestions[0]
                                    }
                                })
                                return [...prePagesQuestions, ...reconstructedQuestions]
                            }, []).reduce((prevQuestion, curQuestion) => prevQuestion + (curQuestion.isAnswered ? 0 : 1), 0)}</span>
                        </div>
                    </div>
                </div>



                <div className="questions_region">

                    {pages[selectedPage].map((question, index) => {
                        switch (question.type) {
                            case "multiple-choice-single-answer":
                                return <div key={question.type + "-" + index}  >
                                    <div
                                        className="question mcq" >
                                        <div className="question_content">
                                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flex: 0.99 }}>
                                                <span>{index + 1}{") "}{question.text}</span>
                                                <span className="points">{question.points} Point</span>

                                            </div>
                                            <span className="edit_delete" >
                                                <button className="delete_button" onClick={(e) => handleFlagQuestion(e, question, index)}>{question.isFlagged ? "🏳️" : "🚩"}</button>
                                            </span>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                            {question.answers.map((answer) =>
                                                <label >
                                                    <input type="radio"
                                                        checked={question.choosenAnswer === answer.text}
                                                        name={answer.text} onChange={(e) => handleAnswer(e, question)} value={answer.text} />{answer.text}</label>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            case "true/false":
                                return <div key={question.type + "-" + index}  >
                                    <div className="question true_false">
                                        <div className="question_content">
                                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flex: 0.99 }}>
                                                <span>{index + 1}{") "}{question.text}</span>
                                                <span className="points">{question.points} Point</span>
                                            </div>
                                            <span className="edit_delete">
                                                <button className="delete_button" onClick={(e) => handleFlagQuestion(e, question, index)}>{question.isFlagged ? "🏳️" : "🚩"}</button>
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                            {question.answers.map((answer) =>
                                                <label >
                                                    <input type="radio"
                                                        checked={question.choosenAnswer === answer.text}
                                                        name={answer.text} onChange={(e) => handleAnswer(e, question)} value={answer.text} />{answer.text}</label>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            case "short-answer":
                                return <div key={question.type + "-" + index}  >
                                    <div className="question short_answer">
                                        <div className="question_content">
                                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flex: 0.99 }}>
                                                <span>{index + 1}{") "}{question.text}</span>
                                                <span className="points">{question.points} Point</span>
                                            </div>
                                            <span className="edit_delete">
                                                <button className="delete_button" onClick={(e) => handleFlagQuestion(e, question, index)}>{question.isFlagged ? "🏳️" : "🚩"}</button>
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                            <label><textarea type="text" name="shAn" value={question.choosenAnswer} onChange={(e) => handleAnswer(e, question)} placeholder="Enter your answer" /></label>

                                        </div>
                                    </div>
                                </div>
                            case "multiple-choice-multiple-answer":
                                return <div key={question.type + "-" + index}  >
                                    <div className="question checkbox" >
                                        <div className="question_content">
                                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flex: 0.99 }}>

                                                <span>{index + 1}{") "}{question.text}</span>
                                                <span className="points">{question.points} Point</span>
                                            </div>
                                            <span className="edit_delete">
                                                <button className="delete_button" onClick={(e) => handleFlagQuestion(e, question, index)}>{question.isFlagged ? "🏳️" : "🚩"}</button>
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                            {question.answers.map((answer) =>
                                                <div >
                                                    <input type="checkbox" name={answer.text} onChange={(e) => handleAnswer(e, question)} value={answer.text}
                                                        checked={question.choosenAnswer.split("-").find((asn) => asn === answer.text) !== undefined}
                                                    />
                                                    <label style={{ paddingLeft: '4px' }}>{answer.text}</label>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                        }
                    })}
                </div>

                <div>
                    <div className="page_buttons">
                        <div className="navigate_buttons">
                            <button className="button" style={{ backgroundColor: selectedPage - 1 <= 0 ? 'gray' : "" }}
                                disabled={selectedPage - 1 <= 0} onClick={() => setSelectedPage(selectedPage - 1)}>Previous</button>
                            <button className="button"
                                style={{ backgroundColor: selectedPage + 1 > exam.numberOfPages ? 'gray' : "" }}
                                disabled={selectedPage + 1 > exam.numberOfPages} onClick={() => setSelectedPage(selectedPage + 1)}>Next</button>
                        </div>
                        <div className="finish_region">
                            <button className="button finish" id="openPopup" onClick={() => setIsFinishExamPopupVisable(true)}>Finish Exam </button>
                        </div>
                    </div>
                </div>

                {isFinishExamPopupVisable && <div className="popup-overlay" style={{ display: 'flex' }} id="popupOverlay">
                    <div className="popup-window">
                        <span className="close" id="closePopup" onClick={() => setIsFinishExamPopupVisable(false)}>×</span>
                        <h2>Finish Exam</h2>

                        <div className="status-container">
                            <div className="status-item answered">
                                <p>Answered Questions:</p>
                                <span>{Object.entries(pages).reduce((prePagesQuestions, curPagesQuestions) => {
                                    const reconstructedQuestions = curPagesQuestions[1].map((reconstructedQuestion) => {
                                        return {
                                            ...reconstructedQuestion,
                                            page: prePagesQuestions[0]
                                        }
                                    })
                                    return [...prePagesQuestions, ...reconstructedQuestions]
                                }, []).reduce((prevQuestion, curQuestion) => prevQuestion + (curQuestion.isAnswered ? 1 : 0), 0)}</span>
                            </div>
                            <div className="status-item flagged">
                                <p>Flagged Questions:</p>
                                <span>{Object.entries(pages).reduce((prePagesQuestions, curPagesQuestions) => {
                                    const reconstructedQuestions = curPagesQuestions[1].map((reconstructedQuestion) => {
                                        return {
                                            ...reconstructedQuestion,
                                            page: prePagesQuestions[0]
                                        }
                                    })
                                    return [...prePagesQuestions, ...reconstructedQuestions]
                                }, []).reduce((prevQuestion, curQuestion) => prevQuestion + (curQuestion.isFlagged ? 1 : 0), 0)}</span>
                            </div>
                            <div className="status-item remaining" style={{ width: '100%' }}>
                                <p>Remaining Questions:</p>
                                <span>{Object.entries(pages).reduce((prePagesQuestions, curPagesQuestions) => {
                                    const reconstructedQuestions = curPagesQuestions[1].map((reconstructedQuestion) => {
                                        return {
                                            ...reconstructedQuestion,
                                            page: prePagesQuestions[0]
                                        }
                                    })
                                    return [...prePagesQuestions, ...reconstructedQuestions]
                                }, []).reduce((prevQuestion, curQuestion) => prevQuestion + (curQuestion.isAnswered ? 0 : 1), 0)}</span>
                            </div>
                        </div>

                        <p>Are you sure you want to finish the exam? Once you submit, you will not be able to make any further changes to your answers. Ensure you have reviewed all your responses before proceeding.</p>

                        <div className="buttons_region">
                            <button className="button" id="cancelButton" onClick={() => setIsFinishExamPopupVisable(false)}>Cancel</button>
                            <button className="button confirm_exam"
                                onClick={handleSubmitExam}
                                style={{ backgroundColor: "green" }} id="confirm_exam">Finish All And Submit</button>
                        </div>

                    </div>
                </div>}

                {(exam.showMark || exam.allowReview) &&
                    !postSubmitExamResponse.isLoading &&
                    !postSubmitExamResponse.isUninitialized &&
                    !postSubmitExamResponse.isError && <div className="popup-overlay"
                        style={{ display: 'flex' }} id="popupOverlay1">

                        <div className="popup-window">
                            {exam.allowReview || exam.showMark ? <><h2>Your Result is</h2>
                                <p className="mark" style={{ color: postSubmitExamResponse.data.score >= exam.passScore ? "green" : "red" }}>{postSubmitExamResponse.data.score} / {exam.fullScore}</p>
                            </> : <><h2>Your Result will be available soon</h2>
                                <p className="mark" style={{ color: 'orange' }}>? / {exam.fullScore}</p>
                            </>}

                            <div className="buttons_region">
                                <Link to={`/student/exams-review/exam-details/${exam.instructor.roomId}/${exam._id}`}>
                                    <button disabled={!exam.allowReview}
                                        style={{ backgroundColor: exam.allowReview ? "" : "gray" }}
                                        className="button">Review Exam</button>
                                </Link>
                                {/* <button className="button" style={{ backgroundColor: "green" }} id="leaveComment">Leave A comment</button> */}
                                <Link to="/student/dashboard">
                                    <button className="button" id="cancelButton1" style={{ backgroundColor: "red" }}>Exit</button>
                                </Link>
                            </div>
                        </div>
                    </div>}

                {/**        TODO FEEDBACK       */}
                {/* <div className="popup-overlay" id="popupOverlay2">
                    <div className="popup-window">
                        <div className="comment-section">
                            <label for="comment">Add Your Comment:</label>
                            <textarea id="comment" name="comment" rows="4" cols="50" placeholder="Write your comments here..."></textarea>
                        </div>

                        <div className="rating-section">
                            <label for="rating">Rate This Exam:</label>
                            <div className="rating-options">
                                <input type="radio" id="rating1" name="rating" value="1" />
                                <label for="rating1">1</label>
                                <input type="radio" id="rating2" name="rating" value="2" />
                                <label for="rating2">2</label>
                                <input type="radio" id="rating3" name="rating" value="3" />
                                <label for="rating3">3</label>
                                <input type="radio" id="rating4" name="rating" value="4" />
                                <label for="rating4">4</label>
                                <input type="radio" id="rating5" name="rating" value="5" />
                                <label for="rating5">5</label>
                            </div>
                        </div>
                        <div className="buttons_region">
                            <a href="../my_exams.html"><button className="button" style={{ backgroundColor: "red" }} id="submitFeedback">Submit Feedback</button></a>
                        </div>
                    </div>
                </div>
                 */}
            </>}

        </div>
    </div >

}
export default TakingExam