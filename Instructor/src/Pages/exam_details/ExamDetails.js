import { useEffect, useState } from "react";
import "./exam_details.css"
import "./manager_shared.css"
import { Link, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux"
import { addExamsTakersStatistics, addExamStatistics, changeExam, useChangeExamEnrollmentsMutation, useLazyGetExamEnrollmentsQuery, useLazyGetExamQuestionsQuery, useLazyGetExamStatisticsQuery, useLazyGetExamTakersStatisticsQuery } from "../../GlobalStore/GlobalStore";
import { toast } from "react-toastify"
import Loading from "../../Shared-Components/Loading/Loading";
import { PieChart } from "@mui/x-charts";

const userTimezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;

function ExamDetails() {
    const { examId } = useParams()
    const instructorExams = useSelector((state) => state.instructorExams)
    const examsStatistics = useSelector((state) => state.examsStatistics)
    const config = useSelector((state) => state.config)



    const dispatch = useDispatch()

    const [selectedTab, setSelectedTab] = useState("General Information")
    const [selectedExam, setSelectedExam] = useState({
        ...instructorExams.exams.find((exam) => exam._id === examId),
        statistics: examsStatistics.examsStatistics.find((examStatistics) => examStatistics.examId === examId)
    })
    const [takersStatistics, setTakersStatistics] = useState([])
    const [pages, setPages] = useState({})
    const [selectedPage, setSelectedPage] = useState(1)

    const [isLoadingMoreAvailable, setIsLoadingMoreAvailable] = useState(true)
    const [page, setPage] = useState(1)
    const [examEnrollments, setExamEnrollments] = useState([])
    const [isMoreEnrollmentsAvailable, setIsMoreEnrollmentsAvailable] = useState(true)
    const [examsEnrollmentsPage, setExamsEnrollmentsPage] = useState(1)

    const [getExamTakersStatistics, getExamTakersStatisticsResponse] = useLazyGetExamTakersStatisticsQuery()
    const [getExamStatistics, getExamStatisticsResponse] = useLazyGetExamStatisticsQuery()
    const [getExamsEnrollments, getExamsEnrollmentsResponse] = useLazyGetExamEnrollmentsQuery()
    const [changeExamEnrollments, changeExamEnrollmentsResponse] = useChangeExamEnrollmentsMutation()
    const [getExamQuestions, getExamQuestionsResponse] = useLazyGetExamQuestionsQuery()


    useEffect(() => {
        getExamStatistics({ token: config.token, examId: examId })
        getExamQuestions({ token: config.token, examId: examId })
    }, [])
    useEffect(() => {
        getExamsEnrollments({ token: config.token, query: { examId: examId, page: examsEnrollmentsPage } })
    }, [examsEnrollmentsPage])
    useEffect(() => {
        getExamTakersStatistics({ page: page, token: config.token, examId: examId })
    }, [page])

    useEffect(() => {
        if (!getExamTakersStatisticsResponse.isLoading && !getExamTakersStatisticsResponse.isUninitialized) {
            if (getExamTakersStatisticsResponse.isError) {
                toast.error("Error loading students")
            } else {
                if (getExamTakersStatisticsResponse.data.length === 0) {
                    setIsLoadingMoreAvailable(false)
                    setTakersStatistics([])
                } else {
                    setIsLoadingMoreAvailable(true)
                    setTakersStatistics(getExamTakersStatisticsResponse.data)
                }
            }
        }
    }, [getExamTakersStatisticsResponse])


    useEffect(() => {
        if (!getExamStatisticsResponse.isLoading && !getExamStatisticsResponse.isUninitialized) {
            if (getExamStatisticsResponse.isError) {
                toast.error("Error loading exam statistics")
            } else {
                setSelectedExam({
                    ...selectedExam, statistics: {
                        ...getExamStatisticsResponse.data.examStatistics,
                        ...getExamStatisticsResponse.data.overAll
                    }
                })
            }
        }
    }, [getExamStatisticsResponse])


    useEffect(() => {
        if (!getExamsEnrollmentsResponse.isLoading && !getExamsEnrollmentsResponse.isUninitialized) {
            if (getExamsEnrollmentsResponse.isError) {
                toast.error("Error loading students enrollments")
            } else {
                if (getExamsEnrollmentsResponse.data.length === 0)
                    setIsMoreEnrollmentsAvailable(false)
                else
                    setIsMoreEnrollmentsAvailable(true)
                setExamEnrollments(getExamsEnrollmentsResponse.data)
            }
        }
    }, [getExamsEnrollmentsResponse])


    useEffect(() => {
        if (!changeExamEnrollmentsResponse.isLoading && !changeExamEnrollmentsResponse.isUninitialized) {
            if (changeExamEnrollmentsResponse.isError) {
                toast.error("Error updating students")
            } else {
                toast.success("Updated successfully")
                const updatedExamsEnrollments = [...examEnrollments].reduce((prevExamEnrollment, curExamEnrollment) => {
                    const foundUpdatedExamEnrollment = changeExamEnrollmentsResponse.data.find((uExamEnrol) => uExamEnrol._id === curExamEnrollment._id)
                    if (foundUpdatedExamEnrollment)
                        return [...prevExamEnrollment, { ...foundUpdatedExamEnrollment }]
                    else
                        return [...prevExamEnrollment, curExamEnrollment]
                }, [])

                setExamEnrollments(updatedExamsEnrollments)
            }
        }
    }, [changeExamEnrollmentsResponse])


    useEffect(() => {
        if (!getExamQuestionsResponse.isLoading && !getExamQuestionsResponse.isUninitialized) {
            if (getExamQuestionsResponse.isError) {
                toast.error("Error loading exam questions")
            } else {
                let reconstructedExams = getExamQuestionsResponse.data.reduce((preQuestion, curQuestion, index) => {
                    if (preQuestion[curQuestion.page]) {
                        return {
                            ...preQuestion, [curQuestion.page]: [...preQuestion[curQuestion.page], {
                                ...curQuestion,
                                // isAnswered: false,
                                // choosenAnswer: "",
                                // isFlagged: false,
                            }].sort((a, b) => a.order - b.order)
                        }
                    }
                    else return {
                        ...preQuestion, [curQuestion.page]: [{
                            ...curQuestion,
                            // isAnswered: false,
                            // choosenAnswer: "",
                            // isFlagged: false,
                        }].sort((a, b) => a.order - b.order)
                    }
                }, {})
                let overAllCount = 1

                reconstructedExams = Object.entries(reconstructedExams).reduce((prevExam, curExam) => {
                    prevExam[curExam[0]] = curExam[1].map((question) => { return { ...question, overAllCount: overAllCount++ } })
                    return prevExam
                }, {})

                setPages(reconstructedExams)

            }
        }
    }, [getExamQuestionsResponse])

    function changeExamEnrollment(e, examEnrollment, status) {
        let examEnrollmentsUpdated = []

        switch (status) {
            case "Accept All":
                examEnrollmentsUpdated = examEnrollments.reduce((prevExamE, currExamE) => {
                    if (currExamE.status === "pending")
                        return [...prevExamE, {
                            examEnrollmentId: currExamE._id,
                            status: "approved"
                        }]
                    else
                        return prevExamE
                }, [])
                break;
            case "Reject All":
                examEnrollmentsUpdated = examEnrollments.reduce((prevExamE, currExamE) => {
                    if (currExamE.status === "pending")
                        return [...prevExamE, {
                            examEnrollmentId: currExamE._id,
                            status: "denied"
                        }]
                    else
                        return prevExamE
                }, [])
                break
            case "denied":
                examEnrollmentsUpdated = [{
                    examEnrollmentId: examEnrollment._id,
                    status: "denied"
                }]
                break
            case "approved":
                examEnrollmentsUpdated = [{
                    examEnrollmentId: examEnrollment._id,
                    status: "approved"
                }]
                break
            case "kicked":
                examEnrollmentsUpdated = [{
                    examEnrollmentId: examEnrollment._id,
                    status: "kicked"
                }]
                break
        }

        changeExamEnrollments({
            token: config.token, body: {
                examId: examId,
                examEnrollments: examEnrollmentsUpdated
            }
        })
    }

    function convertMilSecondsToDayHourM(mSeconds) {
        const seconds = mSeconds / 1000;
        const minutes = seconds / 60;
        const hours = minutes / 60;
        const days = hours / 24;

        return {
            days: Math.floor(days),
            hours: Math.floor(hours % 24),
            minutes: Math.floor(minutes % 60)
        };
    }
    return <div className="exam-details-main">
        {(getExamStatisticsResponse.isLoading ||
            getExamTakersStatisticsResponse.isLoading ||
            getExamsEnrollmentsResponse.isLoading || getExamQuestionsResponse.isLoading) && <Loading />}

        <div class="breadcrumb">
            <Link to="/instructor/exam-manager">Exam Manager </Link>&nbsp; / {selectedTab}
        </div>

        <div className="edit_exam">
            <Link to={`/instructor/exam/edit/${selectedExam._id}`}> <button>Edit Exam</button></Link>
        </div>

        <div className="tabs-container">
            <div className="tabs">
                <div className={`tab-link ${selectedTab === "General Information" ? "active" : ""}`} onClick={() => setSelectedTab("General Information")}>General Information</div>
                <div className={`tab-link ${selectedTab === "Exam Status" ? "active" : ""}`} onClick={() => setSelectedTab("Exam Status")}>Exam Status </div>
                <div className={`tab-link ${selectedTab === "Exam Students" ? "active" : ""}`} onClick={() => setSelectedTab("Exam Students")}>Exam Students</div>
                <div className={`tab-link ${selectedTab === "Exam Students Enrollments" ? "active" : ""}`} onClick={() => setSelectedTab("Exam Students Enrollments")}>Exam Students Enrollments</div>
                <div className={`tab-link ${selectedTab === "Exam Statistics" ? "active" : ""}`} onClick={() => setSelectedTab("Exam Statistics")}>Exam Statistics</div>
                <div className={`tab-link ${selectedTab === "Review" ? "active" : ""}`} onClick={() => setSelectedTab("Review")}>Review</div>
            </div>

            <div className="tab-content">

                {selectedTab === "General Information" && <div id="generalInfo" className="tab-pane active">

                    <table className="exam-details-table">
                        <tbody>
                            <tr>
                                <td><strong>Exam Name:</strong></td>
                                <td>{selectedExam.name}</td>
                            </tr>
                            <tr>
                                <td><strong>Exam Date:</strong></td>
                                <td>{(new Date(selectedExam.scheduledTime)).toISOString().split("T")[0]}</td>
                            </tr>
                            <tr>
                                <td><strong>Exam Duration:</strong></td>
                                <td>{selectedExam.duration} minutes</td>
                            </tr>

                            <tr>
                                <td><strong>Exam Description:</strong></td>
                                <td>{selectedExam.description}</td>
                            </tr>

                            <tr>
                                <td><strong>Show Marks:</strong></td>
                                <td>{selectedExam.showMark ? "Yes" : "No"}</td>
                            </tr>

                            <tr>
                                <td><strong>Number of Questions:</strong></td>
                                <td>{selectedExam.numberOfQuestions}</td>
                            </tr>

                            <tr>
                                <td><strong>Review of Exam:</strong></td>
                                <td>{selectedExam.allowReview ? "Available after submission" : "Not Available"}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>}

                {selectedTab === "Exam Status" && <div id="examStatus" className="tab-pane active">

                    <table className="exam-status-table">
                        <tr>
                            <td><strong>Status:</strong></td>
                            <td><span id="examStatus" style={{
                                color: selectedExam.scheduledTime > Date.now() ?
                                    "#3382a6" :
                                    selectedExam.scheduledTime <= Date.now() && selectedExam.scheduledTime + selectedExam.duration * 60 * 1000 > Date.now() ?
                                        "green" : "red"
                            }}>{selectedExam.scheduledTime > Date.now() ?
                                "Available" :
                                selectedExam.scheduledTime <= Date.now() && selectedExam.scheduledTime + selectedExam.duration * 60 * 1000 > Date.now() ?
                                    "Ongoing" : "Finished"}</span></td>
                        </tr>
                        <tr>
                            <td><strong>Start Date :</strong></td>
                            <td><span id="startDate">{(new Date(selectedExam.scheduledTime)).toISOString().split("T")[0]} {(new Date(selectedExam.scheduledTime)).getHours()}:{(new Date(selectedExam.scheduledTime)).getMinutes()}</span></td>
                        </tr>
                        <tr>
                            <td><strong>End Date :</strong></td>
                            <td><span id="endDate">{(new Date(selectedExam.scheduledTime + selectedExam.duration * 60 * 1000)).toISOString().split("T")[0]} {(new Date(selectedExam.scheduledTime + selectedExam.duration * 60 * 1000)).getHours()}:{(new Date(selectedExam.scheduledTime + selectedExam.duration * 60 * 1000)).getMinutes()}</span></td>
                        </tr>
                        <tr>
                            <td><strong>Time Remaining:</strong></td>
                            {selectedExam.scheduledTime - Date.now() > 0 ?
                                <td><span id="timeRemaining">{convertMilSecondsToDayHourM(selectedExam.scheduledTime - Date.now()).days}
                                    {" "} days {convertMilSecondsToDayHourM(selectedExam.scheduledTime - Date.now()).hours}
                                    {" "} hours {convertMilSecondsToDayHourM(selectedExam.scheduledTime - Date.now()).minutes} minutes</span></td> :
                                <td><span id="timeRemaining"> Exam is finisehd</span></td>}

                        </tr>
                        <tr>
                            <td><strong>Enrollment Status:</strong></td>
                            <td><span id="enrollmentStatus">{selectedExam.enrolmentStatus}</span></td>
                        </tr>
                    </table>
                </div>}

                {selectedTab === "Exam Students" && <div id="studentMarks" className="tab-pane active">
                    <div className="print_marks">
                        <button>Print Marks</button>
                    </div>

                    <table className="exam-details-table student-marks-table">

                        <thead>
                            <tr>
                                <th>Student Name</th>
                                <th>Student ID</th>
                                <th>Start Hour</th>
                                <th>End Hour</th>
                                <th>Status</th>
                                <th>Mark</th>
                                <th>Correct Answers</th>
                                <th>Wrong Answers</th>
                                {/* <th>Actions</th> */}
                            </tr>
                        </thead>
                        <tbody>

                            {takersStatistics.length === 0 ?
                                <div style={{ color: 'gray', display: 'flex', justifyContent: 'center', padding: "10px" }}>No students were participated</div> :
                                takersStatistics.map((examTaker) =>
                                    <tr className="student-row" data-student-id="1">
                                        <td>{examTaker.student.user.username}</td>
                                        <td>{examTaker.student._id}</td>
                                        <td>{(new Date(examTaker.startingTime)).toISOString().split("T")[0]}{" "}{(new Date(examTaker.startingTime)).getHours()}:{(new Date(examTaker.startingTime)).getMinutes()}</td>
                                        {examTaker.endingTime === null ? <td>-</td> :
                                            <td>{(new Date(examTaker.endingTime)).toISOString().split("T")[0]}{" "}{(new Date(examTaker.endingTime)).getHours()}:{(new Date(examTaker.endingTime)).getMinutes()}</td>}
                                        {examTaker.endingTime === null ? <td>Attempting</td> : <td>Finished</td>}
                                        {examTaker.endingTime === null ? <td>-</td> : <td>{examTaker.score}</td>}
                                        {examTaker.endingTime === null ? <td>-</td> : <td>{examTaker.correctAnswers}</td>}
                                        {examTaker.endingTime === null ? <td>-</td> : <td>{examTaker.wrongAnswers}</td>}
                                        {/* <td><a href="student_details/student.html"><button className="view-details-btn">View More</button></a></td> */}
                                    </tr>
                                )}


                        </tbody>
                    </table>

                    <div className="page-navigation">
                        <button id="prevPage" className="button" style={{ backgroundColor: page - 1 === 0 ? 'gray' : "" }}
                            disabled={page - 1 === 0 ? true : false} onClick={() => setPage(page - 1)}>Make Previous</button>
                        <button id="nextPage" className="button"
                            style={{ backgroundColor: !isLoadingMoreAvailable ? "gray" : "" }}
                            disabled={!isLoadingMoreAvailable ? true : false} onClick={() => setPage(page + 1)}>Make Next</button>
                    </div>

                </div>}

                {selectedTab === "Exam Students Enrollments" && <div id="studentRequests" className={`tab-content-room ${selectedTab === "Exam Students Enrollments" && "active-tab-room"}`}>

                    <div className="student-requests" style={{
                        display: 'flex',
                        flexDirection: "column",
                        gap: '3px',
                    }}>
                        <h3>Student Requests</h3>

                        {examEnrollments.length !== 0 && examEnrollments.find((examEnrollment) => examEnrollment.status === "pending") && <div style={{
                            display: 'flex', flexDirection: "row", alignItems: 'center', gap: '7px',
                        }}>
                            <div className="button-room accept-all" onClick={(e) => changeExamEnrollment(e, examEnrollments, "Accept All")}>Accept All</div>
                            <div className="button-room reject-all" onClick={(e) => changeExamEnrollment(e, examEnrollments, "Reject All")}>Reject All</div>
                        </div>}

                        <table className="student-list-table">
                            <thead>
                                <tr>
                                    <th>Student Name</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>

                                {examEnrollments.length === 0 ?
                                    <div style={{ color: 'gray', display: 'flex', justifyContent: 'center', padding: "10px" }}>No students were enrolled</div> :
                                    examEnrollments.map((examEnrollment) =>
                                        <tr>
                                            <td>{examEnrollment.student.user.username}</td>
                                            <td>{examEnrollment.status}</td>
                                            <td>
                                                <div style={{
                                                    display: 'flex', flexDirection: "row", alignItems: 'center', gap: '7px'
                                                }}>
                                                    {examEnrollment.status === "pending" && <>
                                                        <button className="button-room accept-btn" onClick={(e) => changeExamEnrollment(e, examEnrollment, "approved")}>Accept</button>
                                                        <button className="button-room reject-btn" onClick={(e) => changeExamEnrollment(e, examEnrollment, "denied")}>Reject</button>
                                                    </>}

                                                    {examEnrollment.status === "approved" && <>
                                                        <button class="remove-btn" onClick={(e) => changeExamEnrollment(e, examEnrollment, "kicked")}>Remove</button>
                                                    </>}

                                                    {(examEnrollment.status === "kicked" || examEnrollment.status === "denied") && <>
                                                        <button class="button-room remove-btn" style={{ backgroundColor: 'orange' }} onClick={(e) => changeExamEnrollment(e, examEnrollment, "approved")}>Re-enroll</button>
                                                    </>}
                                                </div></td>
                                        </tr>)}
                            </tbody>
                        </table>
                    </div>

                    <div className="page-navigation">
                        <button id="prevPage" className="button" style={{ backgroundColor: examsEnrollmentsPage - 1 === 0 ? 'gray' : "" }}
                            disabled={examsEnrollmentsPage - 1 === 0 ? true : false} onClick={() => setExamsEnrollmentsPage(examsEnrollmentsPage - 1)}>Make Previous</button>
                        <button id="nextPage" className="button"
                            style={{ backgroundColor: !isMoreEnrollmentsAvailable ? "gray" : "" }}
                            disabled={!isMoreEnrollmentsAvailable ? true : false} onClick={() => setExamsEnrollmentsPage(examsEnrollmentsPage + 1)}>Make Next</button>
                    </div>
                </div>}

                {selectedTab === "Exam Statistics" && <div id="examStats" className="tab-pane active">
                    <div className="stat-section">
                        <h4>Overall Performance</h4>
                        <table className="exam-statistics-table">
                            <tr>
                                <td><strong>Total Students:</strong></td>
                                <td>{selectedExam.statistics.totalRegistered}</td>
                            </tr>
                            <tr>
                                <td><strong>Average Score:</strong></td>
                                <td>{selectedExam.statistics.averageScore}</td>
                            </tr>
                            <tr>
                                <td><strong>Highest Score:</strong></td>
                                <td>{selectedExam.statistics.highestScore}</td>
                            </tr>
                            <tr>
                                <td><strong>Lowest Score:</strong></td>
                                <td>{selectedExam.statistics.lowestScore}</td>
                            </tr>
                        </table>
                    </div>

                    {/*********** TODO API FOR QUESTIONS WISE STATISTICS *********/}

                    {/* <div className="stat-section">
                        <h4>Question-wise Performance</h4>
                        <table className="exam-statistics-table">
                            <tr>
                                <td><strong>Question 1:</strong></td>
                                <td>80% Correct</td>
                            </tr>
                            <tr>
                                <td><strong>Question 2:</strong></td>
                                <td>65% Correct</td>
                            </tr>
                            <tr>
                                <td><strong>Question 3:</strong></td>
                                <td>90% Correct</td>
                            </tr>
                        </table>
                    </div> */}


                    {/*********** TODO STATISTICS *********/}
                    <div className="stat-section">
                        <h4>Top Performers</h4>
                        <table className="exam-statistics-table">
                            {selectedExam.statistics.examTakerStatistics.map((examTakerStatistics) => <tr>
                                <td><strong>Student Name:</strong></td>
                                <td>{examTakerStatistics.student.user.username}</td>
                                <td><strong>Score:</strong></td>
                                <td>{examTakerStatistics.score} / {selectedExam.fullScore}</td>
                            </tr>)}
                        </table>
                    </div>


                    <div className="stat-section">
                        <h4>Pass/Fail Rate</h4>
                        <div className="pass-fail-chart">
                            <PieChart
                                series={[
                                    {
                                        data: [
                                            { id: 0, value: selectedExam.statistics.passedStudents, label: 'Passed' },
                                            { id: 1, value: selectedExam.statistics.failedStudents, label: 'Failed', color: 'red' },
                                        ],
                                    },
                                ]}
                                width={400}
                                height={200}
                            />
                        </div>
                    </div>

                    <div className="stat-section">
                        <h4>Score Distribution</h4>
                        <div className="score-distribution-chart">
                            <PieChart
                                series={[
                                    {
                                        data: [
                                            { id: 0, value: selectedExam.statistics.quarterScores, label: `0-${(selectedExam.fullScore / 4).toFixed(2)}` },
                                            { id: 1, value: selectedExam.statistics.halfScores, label: `${(selectedExam.fullScore / 4).toFixed(2)}-${(selectedExam.fullScore / 2).toFixed(2)}` },
                                            { id: 2, value: selectedExam.statistics.oneThirdScores, label: `${(selectedExam.fullScore / 2).toFixed(2)}-${(selectedExam.fullScore / 3).toFixed(2)}` },
                                            { id: 3, value: selectedExam.statistics.fullScores, label: `${(selectedExam.fullScore / 3).toFixed(2)}-${(selectedExam.fullScore).toFixed(2)}` },
                                        ],
                                    },
                                ]}
                                width={400}
                                height={200}
                            />
                        </div>
                    </div>
                </div>}


                {selectedTab === "Review" && <div id="review" className="tab-pane active">
                    <div className="custom-review-tab-container">

                        <div id="manual_generator" className="generator" style={{ display: 'block' }}>

                            <div className="custom-review-tab-bar">
                                <ul>

                                    {Object.keys(pages).map((page, index) => <li key={index}
                                        className={`custom-review-tab-link ${selectedPage !== null && selectedPage === Number(page) ? "active" : ""}`}
                                        onClick={() => setSelectedPage(Number(page))}>Page {page}</li>)}
                                </ul>
                            </div>

                            <div className="custom-review-tab-content-container">

                                <div key={`questions-page-${selectedPage}`} className="custom-review-page-content active">
                                    <div>
                                        {console.log(pages, selectedPage)}
                                        {pages[selectedPage].map((question, index) => {
                                            switch (question.type) {
                                                case "multiple-choice-single-answer":
                                                    return <div key={question.type + "-" + question._id}>
                                                        <div className="question mcq" >
                                                            <div className="question_content">
                                                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                                                    <span>{question.order}{") "}{question.text}</span>
                                                                    <span className="points">{question.points} Point</span>
                                                                </div>
                                                            </div>
                                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                                                {question.answers.map((answer) =>
                                                                    <label >
                                                                        <input type="radio" disabled={true} name={answer.text} value={answer.text} />{answer.text}</label>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                case "true/false":
                                                    return <div key={question.type + "-" + question._id}>
                                                        <div className="question true_false">
                                                            <div className="question_content">
                                                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                                                    <span>{question.order}{") "}{question.text}</span>
                                                                    <span className="points">{question.points} Point</span>
                                                                </div>
                                                            </div>
                                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                                                {question.answers.map((answer) =>
                                                                    <label >
                                                                        <input disabled={true} type="radio" name={answer.text} value={answer.text} />{answer.text}</label>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                case "short-answer":
                                                    return <div key={question.type + "-" + question._id}  >
                                                        <div className="question short_answer">
                                                            <div className="question_content">
                                                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                                                    <span>{question.order}{") "}{question.text}</span>
                                                                    <span className="points">{question.points} Point</span>
                                                                </div>
                                                            </div>
                                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                                                {question.answers.map((answer) =>
                                                                    <label><textarea disabled={true} type="text" name="shAn" value="" /></label>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                case "multiple-choice-multiple-answer":
                                                    return <div key={question.type + "-" + question._id}  >
                                                        <div className="question checkbox">
                                                            <div className="question_content">
                                                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                                                    <span>{question.order}{") "}{question.text}</span>
                                                                    <span className="points">{question.points} Point</span>
                                                                </div>
                                                            </div>
                                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                                                {question.answers.map((answer) =>
                                                                    <div style={{ padding: '3px' }}>
                                                                        <input disabled={true} type="checkbox" name={answer.text} value={answer.text} />
                                                                        <label style={{ paddingLeft: '4px' }}>{answer.text}</label>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                            }
                                        })}
                                    </div>
                                </div>
                            </div>



                            <div className="navigate_buttons">
                                <button id="prevPage" className="custom-review-btn-prev"
                                    style={{ backgroundColor: selectedPage - 1 <= 0 ? "gray" : "" }}
                                    disabled={selectedPage - 1 <= 0}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        setSelectedPage(selectedPage - 1)
                                    }}>Make Previous</button>
                                <button id="nextPage" className="custom-review-btn-next"
                                    style={{ backgroundColor: selectedPage + 1 > selectedExam.numberOfPages ? "gray" : "" }}
                                    disabled={selectedPage + 1 > selectedExam.numberOfPages}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        setSelectedPage(selectedPage + 1)
                                    }}>Make Next</button>
                            </div>
                        </div>

                    </div >

                </div>}

            </div>
        </div>
    </div>
}
export default ExamDetails