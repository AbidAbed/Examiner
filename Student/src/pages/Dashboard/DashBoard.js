import { useEffect, useState } from "react"

import "./Dashboard.css"
import { useDispatch, useSelector } from "react-redux"
import Loading from "../../Shared-Components/Loading/Loading"
import { Link, useNavigate } from "react-router"
import { changeStudent, usePostStartExamMutation } from "../../GlobalStore/GlobalStore"
import { toast } from "react-toastify"

const userTimezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;

function Dashboard() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const config = useSelector((state) => state.config)
    const examsStatistics = useSelector((state) => state.examsStatistics)
    const studentExams = useSelector((state) => state.studentExams)
    const student = useSelector((state) => state.student)

    const [startExam, setStartExam] = useState(null)
    const [selectedExam, setSelectedExam] = useState(null)


    const [postStartExam, postStartExamResponse] = usePostStartExamMutation()

    function convertMilSecondsToDayHourM(mSeconds) {
        const seconds = mSeconds / 1000;
        const minutes = seconds / 60;
        const hours = minutes / 60;
        const days = hours / 24;

        return {
            days: Math.floor(days) < 0 ? 0 : Math.floor(days),
            hours: Math.floor(hours % 24) < 0 ? 0 : Math.floor(hours % 24),
            minutes: Math.floor(minutes % 60) < 0 ? 0 : Math.floor(minutes % 60)
        };
    }

    function handleStartExam(e) {
        e.preventDefault()
        postStartExam({ token: config.token, body: { examId: startExam.exam._id, roomId: startExam.exam.instructor.roomId } })
    }

    useEffect(() => {
        if (!postStartExamResponse.isLoading && !postStartExamResponse.isUninitialized) {
            if (postStartExamResponse.isError) {
                toast.error("Error starting exam ")
            } else {
                dispatch(changeStudent({ ...student, startedExamId: startExam.exam._id }))
                navigate(`/student/taking-exam/${startExam.exam._id}`)
            }
        }
    }, [postStartExamResponse])


    return <div className="main_page_content">
        <div className="container">
            {(postStartExamResponse.isLoading) && <Loading />}
            <div className="section region">
                <h2> My Exams</h2>
                <div className="cards">
                    {studentExams.exams.length === 0 ? "No exams to show" :
                        studentExams.exams.slice(0, process.env.REACT_APP_PAGE_SIZE).map((exam) =>
                            <div className="card">
                                <h4>{exam.exam.name}</h4>
                                <p className="description">Instructor {exam.exam.instructor.user.username}</p>
                                <p className="duration">{(new Date(exam.exam.scheduledTime)).toDateString()}</p>

                                <p className="status" style={{
                                    color: exam.exam.scheduledTime > Date.now() ?
                                        "#3382a6" :
                                        exam.exam.scheduledTime <= Date.now() && exam.exam.scheduledTime + exam.exam.duration * 60 * 1000 > Date.now() ?
                                            "green" : "red"
                                }}>{exam.exam.scheduledTime > Date.now() ?
                                    "Available" :
                                    exam.exam.scheduledTime <= Date.now() && exam.exam.scheduledTime + exam.exam.duration * 60 * 1000 > Date.now() ?
                                        student.takenExamsStatistics.find((takenExamStatiId) => exam.exam._id === takenExamStatiId.examId) ? "Atempted (Ongoing)" : "Ongoing" : "Finished"}</p>
                                <div className="card_buttons" style={{ display: 'flex', flexDirection: 'row', gap: '5px' }}>
                                    <button className="button show-details" data-exam="python" onClick={(e) => setSelectedExam(exam)}>Show Details</button>
                                    {exam.exam.scheduledTime > Date.now() ?
                                        "" :
                                        exam.exam.scheduledTime <= Date.now()
                                            && exam.exam.scheduledTime + exam.exam.duration * 60 * 1000 > Date.now() ?
                                            student.takenExamsStatistics.find((takenExamStatiId) => exam.exam._id === takenExamStatiId.examId) ? "" : <button className="button Start_Exam" id="openPopup" onClick={() => setStartExam(exam)} style={{ backgroundColor: "green" }}>Start Exam</button>
                                            : <Link to={`/student/exams-review/exam-details/${exam.exam.instructor.roomId}/${exam.exam._id}`}><button disabled={!exam.exam.allowReview} className="button Start_Exam">Review Exam</button></Link>}
                                </div>
                            </div>)}


                    {startExam !== null && <div className="popup-overlay active" id="popupOverlay">
                        <div className="popup-window" >
                            <span className="close" id="closePopup" onClick={() => setStartExam(null)}>×</span>
                            <h2>Start Exam</h2>
                            <p>Are you sure you want to start the exam? Once the exam begins, the timer will start, and you must complete it within the allotted time. Ensure you are ready before proceeding.</p>
                            <div>
                                <button className="button" id="cancelButton" onClick={() => setStartExam(null)}>Cancel</button>
                                <button className="button confirm_exam" style={{ backgroundColor: "green" }} onClick={(e) => handleStartExam(e)}>Attempt Now</button>
                            </div>
                        </div>
                    </div>}

                    <Link to="/student/enroll-exam">
                        <div className="card">
                            <h5><span>+</span></h5>
                            <button className="button">Enroll New Exam</button>
                        </div>
                    </Link>
                </div>
                <Link className="show_all" to="/student/enroll-exam">Show All</Link>

            </div>

            {selectedExam !== null &&
                <div id="drawer" className={`drawer ${selectedExam !== null ? "open" : ""}`}>
                    <span className="close" id="closePopup" onClick={() => setSelectedExam(null)}>&times;</span>
                    <h1>Exam Info</h1>
                    <form id="examForm" >
                        <div className="examName">
                            <label for="examName">Exam name:</label>
                            <input type="text" id="examName" name="examName" placeholder={selectedExam.exam.name} disabled />
                        </div>
                        <div className="examDate">
                            <label for="examDate">Exam date:</label>
                            <input type="date" id="examDate" name="examDate" value={(new Date(selectedExam.exam.scheduledTime)).toISOString().split("T")[0]} disabled />
                        </div>

                        <div className="examTime">
                            <label for="examTime">Exam time:</label>
                            <input type="time" id="examTime" name="examTime" value={`${String((new Date(selectedExam.exam.scheduledTime)).getHours()).padStart(2, '0')}:${String((new Date(selectedExam.exam.scheduledTime)).getMinutes()).padStart(2, '0')}`} disabled />
                        </div>

                        <div className="examDuration">
                            <label for="examDuration">Exam Duration: {`(Hours Minutes)`}</label>
                            <input type="text" id="examDuration" name="examDuration" placeholder={`${String(convertMilSecondsToDayHourM(selectedExam.exam.duration * 60 * 1000).hours).padStart(2, '0')}:${String(convertMilSecondsToDayHourM(selectedExam.exam.duration * 60 * 1000).minutes).padStart(2, '0')}`} disabled />
                        </div>

                        <div className="examDiscription">
                            <label for="examDescription">Exam description:</label>
                            <textarea id="examDescription" name="examDescription" placeholder={selectedExam.exam.description} disabled></textarea>
                        </div>

                        <div className="options">
                            <label>More options:</label>
                            <div className="checkbox-group">
                                <label><input type="checkbox" name="showMark" checked={selectedExam.exam.showMark} disabled />&nbsp; Show mark </label>
                                <label><input type="checkbox" name="allowComments" checked={selectedExam.exam.allowReview} disabled /> &nbsp; Allow review</label>
                                <label style={{
                                    color: selectedExam.exam.scheduledTime > Date.now() ?
                                        "#3382a6" :
                                        selectedExam.exam.scheduledTime <= Date.now() && selectedExam.exam.scheduledTime + selectedExam.exam.duration * 60 * 1000 > Date.now() ?
                                            "green" : "red"
                                }}>
                                    <input type="checkbox" name="allowComments" checked={selectedExam.exam.allowReview} disabled /> &nbsp;
                                    {selectedExam.exam.scheduledTime > Date.now() ?
                                        "Available" :
                                        selectedExam.exam.scheduledTime <= Date.now() && selectedExam.exam.scheduledTime + selectedExam.exam.duration * 60 * 1000 > Date.now() ?
                                            "Ongoing" : "Finished"}</label>

                            </div>
                        </div>

                    </form>


                </div>
            }
            <div className="second_part" >
                <div className="section region">
                    <h2>Exams Status</h2>
                    <table className="status_table" >
                        <thead >
                            <tr>
                                <th style={{ color: 'black', backgroundColor: "#f4f4f4" }}>Metric</th>
                                <th style={{ color: 'black', backgroundColor: "#f4f4f4" }}>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Number of exams</td>
                                <td>{examsStatistics.overview.totalExams}</td>
                            </tr>
                            <tr>
                                <td>Average pass percentage</td>
                                <td>{Math.ceil(examsStatistics.overview.avgPassPercentage * 100)}%</td>
                            </tr>
                            <tr>
                                <td>Average score</td>
                                <td>{examsStatistics.overview.avgScore}</td>
                            </tr>
                        </tbody>
                    </table>
                    <Link className="show_all" to="/instructor/exam-analysis">Show All</Link>
                </div>



                <div className="ongoing-section region">
                    <h2>Upcoming Exams</h2>
                    <table className="ongoing-exams-table">
                        <thead>
                            <tr>
                                <th>Exam Name</th>
                                <th>Remaining Time </th>
                            </tr>
                        </thead>
                        <tbody>
                            {studentExams.liveExams.filter((liveExam) => liveExam.exam !== null).length === 0 ? <tr><td>No upcoming exams</td></tr> :
                                studentExams.liveExams.filter((liveExam) => liveExam.exam !== null).map((liveExam) => <tr>
                                    <td>{liveExam.exam.name}</td>
                                    <td>{convertMilSecondsToDayHourM(liveExam.exam.scheduledTime - Date.now()).days} days {convertMilSecondsToDayHourM(liveExam.exam.scheduledTime - Date.now()).hours} hours {convertMilSecondsToDayHourM(liveExam.exam.scheduledTime - Date.now()).minutes} minutes</td>
                                </tr>)}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    </div>


}
export default Dashboard