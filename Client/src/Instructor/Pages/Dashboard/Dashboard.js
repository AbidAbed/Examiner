import { useEffect, useState } from "react"

import "./Dashboard.css"
import { useDispatch, useSelector } from "react-redux"
import Loading from "../../../Shared-Components/Loading/Loading"
import { Link, useNavigate } from "react-router"
function Dashboard() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const config = useSelector((state) => state.config)
    const examsStatistics = useSelector((state) => state.examsStatistics)
    const instructorExams = useSelector((state) => state.instructorExams)

    const [selectedExam, setSelectedExam] = useState(null)

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

    return <div className="main_page_content">
        <div className="container">
            <div className="section region">
                <h2>Exams</h2>
                <div className="cards">
                    {instructorExams.exams.length === 0 ? "No exams to show" :
                        instructorExams.exams.slice(0, process.env.REACT_APP_PAGE_SIZE).map((exam) =>
                            <div className="card" key={exam._id}>
                                <h5>{exam.name}</h5>
                                <div className="card_buttons">
                                    <button className="button show-details" data-exam="python" onClick={() => setSelectedExam(exam)}>Show Details</button>
                                    <button onClick={() => navigate(`/instructor/exam/edit/${exam._id}`)} className="button edit">Edit</button>
                                </div>
                            </div>)}

                    <Link to="/instructor/create-exam">
                        <div className="card">
                            <h5><span>+</span></h5>
                            <button className="button">Create New Exam</button>
                        </div>
                    </Link>
                </div>
                <Link className="show_all" to="/instructor/exam-manager">Show All</Link>

            </div>

            {selectedExam !== null &&
                <div id="drawer" className={`drawer ${selectedExam !== null ? "open" : ""}`}>
                    <span className="close" id="closePopup" onClick={() => setSelectedExam(null)}>&times;</span>
                    <h1>Exam Info</h1>
                    <form id="examForm" >
                        <div className="examName">
                            <label for="examName">Exam name:</label>
                            <input type="text" id="examName" name="examName" placeholder={selectedExam.name} disabled />
                        </div>
                        <div className="examDate">
                            <label for="examDate">Exam date:</label>
                            <input type="date" id="examDate" name="examDate" value={(new Date(selectedExam.scheduledTime)).toISOString().split("T")[0]} disabled />
                        </div>

                        <div className="examTime">
                            <label for="examTime">Exam time:</label>
                            <input type="time" id="examTime" name="examTime" value={`${String((new Date(selectedExam.scheduledTime)).getHours()).padStart(2, '0')}:${String((new Date(selectedExam.scheduledTime)).getMinutes()).padStart(2, '0')}`} disabled />
                        </div>

                        <div className="examDuration">
                            <label for="examDuration">Exam Duration: {`(Hours : Minutes)`}</label>
                            <input type="text" id="examDuration" name="examDuration" placeholder={`${String(convertMilSecondsToDayHourM(selectedExam.duration * 60 * 1000).hours).padStart(2, '0')}:${String(convertMilSecondsToDayHourM(selectedExam.duration * 60 * 1000).minutes).padStart(2, '0')}`} disabled />
                        </div>

                        <div className="examDiscription">
                            <label for="examDescription">Exam description:</label>
                            <textarea id="examDescription" name="examDescription" placeholder={selectedExam.description} disabled></textarea>
                        </div>

                        <div className="options">
                            <label>More options:</label>
                            <div className="checkbox-group">
                                <label><input type="checkbox" name="showMark" checked={selectedExam.showMark} disabled />&nbsp; Show mark </label>
                                <label><input type="checkbox" name="allowComments" checked={selectedExam.allowReview} disabled /> &nbsp; Allow review</label>
                                <label style={{ color: selectedExam.status === 'finished' ? 'red' : 'green' }}>
                                    <input type="checkbox" name="allowComments" checked={selectedExam.allowReview} disabled /> &nbsp;{selectedExam.status}</label>

                            </div>
                        </div>

                    </form>


                </div>
            }
            <div className="second_part ">
                <div className="section region">
                    <h2>Exams Status</h2>
                    <table className="status_table">
                        <thead>
                            <tr>
                                <th>Metric</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Number of exams</td>
                                <td>{examsStatistics.overview.totalExams}</td>
                            </tr>
                            <tr>
                                <td>Number of students</td>
                                <td>{examsStatistics.overview.totalRegistered}</td>
                            </tr>
                            <tr>
                                <td>Average pass percentage</td>
                                <td>{examsStatistics.overview.totalPassingStudents / examsStatistics.overview.totalParticipants === 0 ? 1 : examsStatistics.overview.totalParticipants}%</td>
                            </tr>
                            <tr>
                                <td>Average rating</td>
                                <td>{examsStatistics.overview.averageRating}/5</td>
                            </tr>
                        </tbody>
                    </table>
                    <Link className="show_all" to="/instructor/exam-analysis">Show All</Link>
                </div>



                <div className="ongoing-section region">
                    <h2>Ongoing Exams</h2>
                    <table className="ongoing-exams-table">
                        <thead>
                            <tr>
                                <th>Exam Name</th>
                                <th>Remaining Time </th>
                            </tr>
                        </thead>
                        <tbody>
                            {instructorExams.liveExams.length === 0 ? <tr><td>No upcoming exams</td></tr> :
                                instructorExams.liveExams.map((liveExam) => <tr>
                                    <td>{liveExam.name}</td>
                                    <td>{convertMilSecondsToDayHourM(liveExam.scheduledTime - Date.now()).days} days {convertMilSecondsToDayHourM(liveExam.scheduledTime - Date.now()).hours} hours {convertMilSecondsToDayHourM(liveExam.scheduledTime - Date.now()).minutes} minutes</td>
                                </tr>)}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    </div>


}
export default Dashboard