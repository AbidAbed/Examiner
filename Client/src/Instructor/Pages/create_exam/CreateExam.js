import { Link } from "react-router"
import "./create_exam.css"
import { useEffect, useState } from "react"
import QuestionsPanel from "./Question_Panel/question_panel"
import { toast } from "react-toastify"
import { usePostCreateExamMutation } from "../../../GlobalStore/GlobalStore"
import { useDispatch, useSelector } from "react-redux"
import Loading from "../../../Shared-Components/Loading/Loading"
function CreateExam() {
    const dispatch = useDispatch()

    const config = useSelector((state) => state.config)

    const [questionPanelShow, setQuestionPanelShow] = useState(false)
    const [examName, setExamName] = useState("")
    const [examDate, setExamDate] = useState("")
    const [examTime, setExamTime] = useState("")
    const [examDuration, setExamDuration] = useState(20)
    const [examDescription, setExamDescription] = useState("")
    const [showMark, setShowMark] = useState(false)
    const [allowReview, setAllowReview] = useState(false)
    const [questions, setQuestions] = useState([])
    const [passingScore, setPassingScore] = useState(1)
    const [enrolmentStatus, setEnrolmentStatus] = useState(true)
    const [examStatus, setExamStatus] = useState(true)

    const [postCreateExam, postCreateExamResponse] = usePostCreateExamMutation()

    function resetExam(e) {
        e.preventDefault()
        setQuestions([])
        setAllowReview(false)
        setShowMark(false)
        setExamDescription("")
        setExamDuration(20)
        setExamTime("")
        setExamDate("")
        setExamName("")
        setPassingScore(1)
        setEnrolmentStatus(true)
        setExamStatus(true)
    }

    function handleCreateExam(e) {
        e.preventDefault()
        if (questions.length === 0) {
            toast.error("You must create at least one page", { delay: 7 })
            return
        }
        else
            for (let i = 0; i < questions.length; i += 1) {
                if (questions[i].questions.length === 0) {
                    toast.error("No exam page is allowed to be empty", { delay: 7 })
                    return
                }
            }
        const examDateUnix = new Date(examDate)
        examDateUnix.setUTCHours(Number(examTime.split(":")[0]))
        examDateUnix.setMinutes(examTime.split(":")[1])
        const scheduledTime = examDateUnix.getTime()

        const structuredQuestions = questions.reduce((prevQuestionPage, curQuestionPage, index) => {
            const reStructuredQuestionArr = curQuestionPage.questions.map((question, index) => {
                const reStructuredQuestion = {
                    text: question.text,
                    type: question.type,
                    isTestBank: question.isTestBank,
                    isAiGenerated: question.isAiGenerated,
                    order: index + 1,
                    page: question.pageNumber,
                    points: question.points,
                    answers: question.answers
                }

                if (question.isTestBank)
                    reStructuredQuestion._id = question._id
                return reStructuredQuestion
            })
            return [...prevQuestionPage, ...reStructuredQuestionArr]
        }, [])

        postCreateExam({
            token: config.token,
            exam: {
                name: examName,
                description: examDescription,
                duration: examDuration,
                scheduledTime: scheduledTime,
                numberOfQuestions: structuredQuestions.length,
                passScore: passingScore,
                allowReview: allowReview,
                showMark: showMark,
                numberOfPages: 1,
                enrolmentStatus: enrolmentStatus ? "open" : "closed",
                questions: structuredQuestions,
                status: examStatus ? "scheduled" : "finished"
            }
        })
    }

    useEffect(() => {
        if (!postCreateExamResponse.isUninitialized && !postCreateExamResponse.isLoading) {
            if (postCreateExamResponse.isError) {
                toast.error("Error creating exam , check back later", { delay: 7 })
            } else {
                toast.success("Exam created successfully")
            }
        }
    }, [postCreateExamResponse])

    return <>{questionPanelShow ? <QuestionsPanel questions={questions} setQuestions={setQuestions} setQuestionPanelShow={setQuestionPanelShow} />
        : <div className="main_page_content">
            {postCreateExamResponse.isLoading && <Loading />}
            <div className="container">
                <div className="create_exam region">
                    <h1>Exam Info</h1>
                    <form className="" onSubmit={handleCreateExam}>

                        <div className="examName">
                            <label htmlFor="examName">Exam name:</label>
                            <input type="text" id="examName" name="examName" placeholder="Enter exam name"
                                value={examName} onChange={(e) => setExamName(e.target.value)} required />
                        </div>
                        <div className="examDate">
                            <label htmlFor="examDate">Exam date:</label>
                            <input type="date" id="examDate" name="examDate"
                                value={examDate} onChange={(e) => setExamDate(e.target.value)} required
                            />
                        </div>

                        <div className="examTime">
                            <label htmlFor="examTime">Exam time:</label>
                            <input type="time" id="examTime" name="examTime"
                                value={examTime} onChange={(e) => setExamTime(e.target.value)} required
                            />
                        </div>

                        <div className="examDuration">
                            <label htmlFor="examDuration">Exam Duration:</label>
                            <input type="number" id="examDuration" name="examDuration" placeholder="Duration in minutes"
                                value={examDuration} onChange={(e) => setExamDuration(e.target.value)} required min={20}
                            />
                        </div>

                        <div className="examDuration">
                            <label htmlFor="examDuration">Exam passing socre:</label>
                            <input type="number" id="examDuration" name="examDuration" placeholder="Duration in minutes"
                                value={passingScore} onChange={(e) => setPassingScore(e.target.value)} required min={1}
                            />
                        </div>

                        <div className="examDiscription">
                            <label htmlFor="examDescription">Exam description:</label>
                            <textarea id="examDescription" name="examDescription" placeholder="Enter description"
                                value={examDescription} onChange={(e) => setExamDescription(e.target.value)} required
                            ></textarea>
                        </div>
                        <div className="options">
                            <label>More options:</label>
                            <div className="checkbox-group">
                                <label><input type="checkbox" name="showMark" checked={showMark} onChange={() => setShowMark(!showMark)} />&nbsp;Show mark</label>
                                <label><input type="checkbox" name="allowComments" checked={allowReview} onChange={() => setAllowReview(!allowReview)} />&nbsp;Allow review</label>
                                <label style={{ color: enrolmentStatus ? "green" : 'red' }} ><input type="checkbox" name="allowComments" checked={enrolmentStatus} onChange={() => setEnrolmentStatus(!enrolmentStatus)} /> &nbsp;{enrolmentStatus ? "Open" : "Closed"}</label>
                                <label style={{ color: examStatus ? "orange" : 'red' }} ><input type="checkbox" name="allowComments" checked={examStatus} onChange={() => setExamStatus(!examStatus)} /> &nbsp;{examStatus ? "Scheduled" : "Finished"}</label>

                            </div>
                        </div>


                        <div className="buttons">
                            <div>
                                <button type="submit" className="button" >Create Exam</button>
                                <button type="button" className="button" style={{ backgroundColor: "var(--gray-color)", padding: 0 }} onClick={() => setQuestionPanelShow(true)}>  Question Panel</button>
                            </div>
                            <div>
                                <button type="reset" className="button" style={{ backgroundColor: "#f3de21" }} onClick={resetExam}>Reset</button>
                            </div>
                        </div>

                    </form>
                </div>

            </div>
        </div>
    }</>

}
export default CreateExam