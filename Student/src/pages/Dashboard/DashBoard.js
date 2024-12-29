import { useEffect, useState } from "react"

import "./Dashboard.css"
import { useDispatch, useSelector } from "react-redux"
import Loading from "../../Shared-Components/Loading/Loading"
import { Link, useNavigate } from "react-router"
function Dashboard() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const config = useSelector((state) => state.config)
    const examsStatistics = useSelector((state) => state.examsStatistics)
    const studentExams = useSelector((state) => state.studentExams)

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
                    {studentExams.exams.length === 0 ? "No exams to show" :
                        studentExams.exams.slice(0, process.env.REACT_APP_PAGE_SIZE).map((exam) =>
                            <div className="card" key={exam._id}>
                                <h5>{exam.name}</h5>
                                <div className="card_buttons">
                                    <button className="button show-details" data-exam="python" onClick={() => setSelectedExam(exam)}>Show Details</button>
                                    <button onClick={() => navigate(`/instructor/exam/edit/${exam._id}`)} className="button edit">Edit</button>
                                </div>
                            </div>)}

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
                                <td>Average pass percentage</td>
                                <td>{examsStatistics.overview.avgPassPercentage}%</td>
                            </tr>
                            <tr>
                                <td>Average score</td>
                                <td>{examsStatistics.overview.avgScore}%</td>
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
                            {studentExams.liveExams.length === 0 ? <tr><td>No upcoming exams</td></tr> :
                                studentExams.liveExams.map((liveExam) => <tr>
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




// import "./Dashboard.css"
// function Dashboard() {
//     return <div class="main_page_content">
//         <div class="container">
//             <div class="section region">
//                 <h2> My Exams</h2>
//                 <div class="cards">
//                     <div class="card">
//                         <h4>Python programming</h4>
//                         <p class="description">DR.Ansay Khoury</p>
//                         <p class="duration">19 / Nov</p>
//                         <p class="status">Available</p>
//                         <div class="card_buttons">
//                             <button class="button show-details" data-exam="python">Show Details</button>
//                             <button class="button Start_Exam" id="openPopup" style={{ backgroundColor: "green" }}>Start Exam</button>


//                             <div class="popup-overlay" id="popupOverlay">
//                                 <div class="popup-window">
//                                     <span class="close" id="closePopup">×</span>
//                                     <h2>Start Exam</h2>
//                                     <p>Are you sure you want to start the exam? Once the exam begins, the timer will start, and you must complete it within the allotted time. Ensure you are ready before proceeding.</p>
//                                     <div>
//                                         <button class="button" id="cancelButton">Cancel</button>
//                                         <a href="taking_exam/taking_exam.html"><button class="button confirm_exam"
//                                             style={{ "background-color": "green" }}>Attempt Exam Now</button></a>
//                                     </div>
//                                 </div>
//                             </div>



//                         </div>
//                     </div>

//                     <div class="card">
//                         <h4>Advanced algorithms</h4>
//                         <p class="description">DR.Sharenaz Haj Baddar</p>
//                         <p class="duration">23 / Des</p>
//                         <p class="status">Finished</p>
//                         <div class="card_buttons">
//                             <button class="button show-details" data-exam="algorithms">Show Details</button>
//                             <a href="../exams_review/exam_details/exam_details.html"><button class="button Start_Exam">Review Exam</button></a>

//                         </div>
//                     </div>

//                     <div class="card">
//                         <h4>Image Processing</h4>
//                         <p class="description">DR.Huda Karajeh</p>
//                         <p class="duration">5 / Oct</p>
//                         <p class="status">Ongoing</p>
//                         <div class="card_buttons">
//                             <button class="button show-details" data-exam="database">Show Details</button>

//                         </div>
//                     </div>
//                     <a href="../new_exam/new_exam.html">
//                         <div class="card">
//                             <h4><span>+</span></h4>
//                             <button class="button">Enroll New Exam</button>
//                         </div>
//                     </a>
//                 </div>
//                 <a class="show_all" href="../exams_review/exams_review.html">Show All</a>

//             </div>
//             <div class="second_part ">
//                 <div class="section region">
//                     <h2>Exams Status</h2>
//                     <table class="status_table">
//                         <thead>
//                             <tr>
//                                 <th>Metric</th>
//                                 <th>Value</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             <tr>
//                                 <td>Number of exams</td>
//                                 <td>3</td>
//                             </tr>
//                             <tr>
//                                 <td>Average pass percentage</td>
//                                 <td>70%</td>
//                             </tr>
//                             <tr>
//                                 <td>Average rating</td>
//                                 <td>3.5/5</td>
//                             </tr>
//                         </tbody>
//                     </table>
//                     <a class="show_all" href="../exams_analysis/exam_analysis.html">Show All</a>
//                 </div>
//                 <div id="drawer" class="drawer">
//                     <span class="close" id="closePopupDrawer">×</span>
//                     <h1>Exam Info</h1>
//                     <form id="examForm" action="" method="get">
//                         <div class="examName">
//                             <label for="examName">Exam name:</label>
//                             <input type="text" id="examName" name="examName" placeholder="Exam name" />
//                         </div>
//                         <div class="roomName">
//                             <label for="roomName">Room name:</label>
//                             <input type="text" id="roomName" name="roomName" placeholder="Room name" />
//                         </div>
//                         <div class="examDate">
//                             <label for="examDate">Exam date:</label>
//                             <input type="date" id="examDate" name="examDate" />
//                         </div>

//                         <div class="examTime">
//                             <label for="examTime">Exam time:</label>
//                             <input type="time" id="examTime" name="examTime" />
//                         </div>

//                         <div class="examDuration">
//                             <label for="examDuration">Exam Duration:</label>
//                             <input type="time" id="examDuration" name="examDuration" />
//                         </div>

//                         <div class="examConstraints">
//                             <label for="examConstraints">Exam constraints:</label>
//                             <textarea id="examConstraints" name="examConstraints" placeholder="Constraints"></textarea>
//                         </div>

//                         <div class="examDiscription">
//                             <label for="examDescription">Exam description:</label>
//                             <textarea id="examDescription" name="examDescription" placeholder="Description"></textarea>
//                         </div>

//                         <div class="options">
//                             <label>Exam options:</label>
//                             <div class="checkbox-group">
//                                 <label><input type="checkbox" name="showMark" checked />&nbsp; Show mark </label>
//                                 <label><input type="checkbox" name="allowComments" /> &nbsp; Allow comments</label>
//                                 <label><input type="checkbox" name="oneWayOrTwoWay" checked /> &nbsp; One way or two ways</label>
//                             </div>
//                         </div>



//                     </form>


//                 </div>

//                 <div class="ongoing-section region">
//                     <h2>Ongoing Exams</h2>
//                     <table class="ongoing-exams-table">
//                         <thead>
//                             <tr>
//                                 <th>Exam Name</th>
//                                 <th>Remaining Time</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             <tr>
//                                 <td>Python</td>
//                                 <td>2 days 3 hours</td>
//                             </tr>
//                             <tr>
//                                 <td>Math</td>
//                                 <td>1 day 14 hours</td>
//                             </tr>
//                             <tr>
//                                 <td>Science</td>
//                                 <td>15 hours</td>
//                             </tr>
//                         </tbody>
//                     </table>
//                 </div>

//             </div>

//         </div>

//     </div>
// }
// export default Dashboard