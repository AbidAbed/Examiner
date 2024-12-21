import { useEffect, useState } from "react";
import "./exam_details.css"
import "./manager_shared.css"
import { Link, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux"
import { addExamsTakersStatistics, addExamStatistics, changeExam, useLazyGetExamStatisticsQuery, useLazyGetExamTakersStatisticsQuery } from "../../../GlobalStore/GlobalStore";
import { toast } from "react-toastify"

function ExamDetails() {
    const { examId } = useParams()
    const instructorExams = useSelector((state) => state.instructorExams)
    const examsStatistics = useSelector((state) => state.examsStatistics)
    const config = useSelector((state) => state.config)



    const dispatch = useDispatch()

    const [selectedTab, setSelectedTab] = useState("General Information")

    const [selectedExam, setSelectedExam] = useState({
        ...instructorExams.exams.find((exam) => exam._id === examId),
        statistics: examsStatistics.examsStatistics.find((examStatistics) => examStatistics.examId === examId),
        takersStatistics: [...examsStatistics.examsTakersStatistics].filter((examTaker) => examTaker.examId === examId)
    })
    const [isLoadingMoreAvailable, setIsLoadingMoreAvailable] = useState(true)

    const [page, setPage] = useState(1)

    const [getExamTakersStatistics, getExamTakersStatisticsResponse] = useLazyGetExamTakersStatisticsQuery()
    const [getExamStatistics, getExamStatisticsResponse] = useLazyGetExamStatisticsQuery()


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


    useEffect(() => {
        if (!selectedExam.statistics?._id)
            getExamStatistics({ token: config.token, examId: examId })
    }, [])

    useEffect(() => {
        getExamTakersStatistics({ page: page, token: config.token, examId: examId })
    }, [page])

    useEffect(() => {
        if (!getExamTakersStatisticsResponse.isLoading && !getExamTakersStatisticsResponse.isUninitialized) {
            if (getExamTakersStatisticsResponse.isError) {
                toast.error("Error loading students")
            } else {
                if (getExamTakersStatisticsResponse.data.length === 0) {
                    dispatch(changeExam({ ...selectedExam, isTakersLoaded: true }))
                    setIsLoadingMoreAvailable(false)
                } else {
                    dispatch(addExamsTakersStatistics(getExamTakersStatisticsResponse.data))
                }
            }
        }
    }, [getExamTakersStatisticsResponse])


    useEffect(() => {
        if (!getExamStatisticsResponse.isLoading && !getExamStatisticsResponse.isUninitialized) {
            if (getExamStatisticsResponse.isError) {
                toast.error("Error loading exam statistics")
            } else {
                dispatch(addExamStatistics([getExamStatisticsResponse.data]))
            }
        }
    }, [getExamStatisticsResponse])

    return <div className="exam-details-main">


        <div class="breadcrumb">
            <Link to="/instructor/exam-manager">Exam Manager </Link>&nbsp; / {selectedTab}
        </div>

        <div className="edit_exam">
            <a href="../../create_exam/create_exam.html"> <button>Edit Exam</button></a>
        </div>

        <div className="tabs-container">
            <div className="tabs">
                <div className={`tab-link ${selectedTab === "General Information" ? "active" : ""}`} onClick={() => setSelectedTab("General Information")}>General Information</div>
                <div className={`tab-link ${selectedTab === "Exam Status" ? "active" : ""}`} onClick={() => setSelectedTab("Exam Status")}>Exam Status </div>
                <div className={`tab-link ${selectedTab === "Exam Students" ? "active" : ""}`} onClick={() => setSelectedTab("Exam Students")}>Exam Students</div>
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
                            <td><span id="examStatus">{selectedExam.status}</span></td>
                        </tr>
                        <tr>
                            <td><strong>Start Date {"(Time UTC)"}:</strong></td>
                            <td><span id="startDate">{(new Date(selectedExam.scheduledTime)).toISOString().split("T")[0]} {(new Date(selectedExam.scheduledTime)).getUTCHours()}:{(new Date(selectedExam.scheduledTime)).getUTCMinutes()}</span></td>
                        </tr>
                        <tr>
                            <td><strong>End Date {"(Time UTC)"}:</strong></td>
                            <td><span id="endDate">{(new Date(selectedExam.scheduledTime + selectedExam.duration * 60 * 1000)).toISOString().split("T")[0]} {(new Date(selectedExam.scheduledTime + selectedExam.duration * 60 * 1000)).getUTCHours()}:{(new Date(selectedExam.scheduledTime + selectedExam.duration * 60 * 1000)).getUTCMinutes()}</span></td>
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
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>

                            {selectedExam.takersStatistics.slice((page - 1) * process.env.REACT_APP_PAGE_SIZE,
                                (page - 1) * process.env.REACT_APP_PAGE_SIZE + process.env.REACT_APP_PAGE_SIZE).length === 0 ?
                                <div style={{ color: 'gray', display: 'flex', justifyContent: 'center', padding: "10px" }}>No students were enrolled</div> :
                                selectedExam.takersStatistics.slice((page - 1) * process.env.REACT_APP_PAGE_SIZE,
                                    (page - 1) * process.env.REACT_APP_PAGE_SIZE + process.env.REACT_APP_PAGE_SIZE).map((examTaker) =>
                                        <tr className="student-row" data-student-id="1">
                                            <td>John Doe</td>
                                            <td>0215858</td>
                                            <td>2024-12-01 09:00</td>
                                            <td>2024-12-01 10:00</td>
                                            <td>Finished</td>
                                            <td>85</td>
                                            <td>20</td>
                                            <td><a href="student_details/student.html"><button className="view-details-btn">View More</button></a></td>
                                        </tr>
                                    )}


                        </tbody>
                    </table>

                    <div className="page-navigation">
                        <button id="prevPage" className="button" style={{ backgroundColor: page - 1 === 0 ? 'gray' : "" }}
                            disabled={page - 1 === 0 ? true : false} onClick={() => setPage(page - 1)}>Make Previous</button>
                        <button id="nextPage" className="button"
                            style={{ backgroundColor: selectedExam.takersStatistics.length / process.env.REACT_APP_PAGE_SIZE < page && !isLoadingMoreAvailable ? "gray" : "" }}
                            disabled={selectedExam.takersStatistics.length / process.env.REACT_APP_PAGE_SIZE < page && !isLoadingMoreAvailable ? true : false} onClick={() => setPage(page + 1)}>Make Next</button>
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
                                <td>{selectedExam.statistics.averageScore}%</td>
                            </tr>
                            <tr>
                                <td><strong>Highest Score:</strong></td>
                                <td>{selectedExam.statistics.highestScore}%</td>
                            </tr>
                            <tr>
                                <td><strong>Lowest Score:</strong></td>
                                <td>{selectedExam.statistics.lowestScore}%</td>
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
                            <tr>
                                <td><strong>Student Name:</strong></td>
                                <td>John Doe</td>
                                <td><strong>Score:</strong></td>
                                <td>98%</td>
                            </tr>
                            <tr>
                                <td><strong>Student Name:</strong></td>
                                <td>Jane Smith</td>
                                <td><strong>Score:</strong></td>
                                <td>95%</td>
                            </tr>
                        </table>
                    </div>


                    <div className="stat-section">
                        <h4>Pass/Fail Rate</h4>
                        <div className="pass-fail-chart">

                            <canvas id="passFailChart"></canvas>
                        </div>
                    </div>

                    <div className="stat-section">
                        <h4>Score Distribution</h4>
                        <div className="score-distribution-chart">
                            <canvas id="passFailChart" height="200" style={{ display: "block", boxSizing: "border-box", height: "200px", width: " 200px" }} width="200"></canvas>
                        </div>
                    </div>
                </div>}


                {/*********** TODO REVIEW EXAM  *********/}

                {selectedTab === "Review" && <div id="review" className="tab-pane active">
                    <div className="custom-review-tab-container">


                        <div className="custom-review-tab-bar">
                            <ul>
                                <li className="custom-review-tab-link active" data-tab="custom-review-page1">Page 1</li>
                                <li className="custom-review-tab-link" data-tab="custom-review-page2">Page 2</li>
                                <li className="custom-review-tab-link" data-tab="custom-review-page3">Page 3</li>
                                <li className="custom-review-tab-link" data-tab="custom-review-page4">Page 4</li>
                            </ul>
                        </div>

                        <div className="custom-review-tab-content-container">

                            <div id="custom-review-page1" className="custom-review-page-content active">
                                <div className="question true_false" data-id="1">
                                    <div className="question_content">
                                        <p><span className="question_number">1 &#41;&nbsp;</span> this question true or false?</p>
                                        <span className="points">5 Points</span>

                                    </div>
                                    <label><input type="radio" name="tf" value="true" /> True</label>
                                    <label><input type="radio" name="tf" value="false" /> False</label>
                                </div>
                                <div className="question mcq" data-id="2">
                                    <div className="question_content">
                                        <p><span className="question_number">2 &#41;&nbsp;</span>This is the mcq question?</p>
                                        <span className="points">1 Point</span>

                                    </div>
                                    <label><input type="radio" name="choice" value="choice1" /> choice1</label>
                                    <label><input type="radio" name="choice" value="choice2" /> choice2</label>
                                    <label><input type="radio" name="choice" value="choice3" /> choice3</label>
                                    <label><input type="radio" name="choice" value="choice4" /> choice4</label>
                                </div>

                                <div className="question short_answer" data-id="3">
                                    <div className="question_content">
                                        <p><span className="question_number">3 &#41;&nbsp;</span>This is the short answer question?</p>
                                        <span className="points">2 Points</span>

                                    </div>
                                    <label><input type="text" name="shAn" value="" placeholder="Enter your answer" /></label>
                                </div>

                                <div className="question checkbox" data-id="4">
                                    <div className="question_content">
                                        <p><span className="question_number">4 &#41;&nbsp;</span>This is the checkbox question?</p>
                                        <span className="points">4 Points</span>

                                    </div>
                                    <label><input type="checkbox" name="choice" value="choice1" /> choice1</label>
                                    <label><input type="checkbox" name="choice" value="choice2" /> choice2</label>
                                    <label><input type="checkbox" name="choice" value="choice3" /> choice3</label>
                                    <label><input type="checkbox" name="choice" value="choice4" /> choice4</label>
                                </div>
                                <div className="navigate_buttons">
                                    <button className="custom-review-btn-prev" onclick="navigateCustomReviewPage('previous')">Previous</button>
                                    <button className="custom-review-btn-next" onclick="navigateCustomReviewPage('next')">Next</button>
                                </div>
                            </div>

                            <div id="custom-review-page2" className="custom-review-page-content">


                                <div className="question short_answer" data-id="3">
                                    <div className="question_content">
                                        <p><span className="question_number">3 &#41;&nbsp;</span>This is the short answer question?</p>
                                        <span className="points">2 Points</span>

                                    </div>
                                    <label><input type="text" name="shAn" value="" placeholder="Enter your answer" /></label>
                                </div>

                                <div className="question checkbox" data-id="4">
                                    <div className="question_content">
                                        <p><span className="question_number">4 &#41;&nbsp;</span>This is the checkbox question?</p>
                                        <span className="points">4 Points</span>

                                    </div>
                                    <label><input type="checkbox" name="choice" value="choice1" /> choice1</label>
                                    <label><input type="checkbox" name="choice" value="choice2" /> choice2</label>
                                    <label><input type="checkbox" name="choice" value="choice3" /> choice3</label>
                                    <label><input type="checkbox" name="choice" value="choice4" /> choice4</label>
                                </div>
                                <div className="navigate_buttons">
                                    <button className="custom-review-btn-prev" onclick="navigateCustomReviewPage('previous')">Previous</button>
                                    <button className="custom-review-btn-next" onclick="navigateCustomReviewPage('next')">Next</button>
                                </div>
                            </div>
                            <div id="custom-review-page3" className="custom-review-page-content">
                                <div className="question true_false" data-id="1">
                                    <div className="question_content">
                                        <p><span className="question_number">1 &#41;&nbsp;</span> this question true or false?</p>
                                        <span className="points">5 Points</span>

                                    </div>
                                    <label><input type="radio" name="tf" value="true" /> True</label>
                                    <label><input type="radio" name="tf" value="false" /> False</label>
                                </div>
                                <div className="question mcq" data-id="2">
                                    <div className="question_content">
                                        <p><span className="question_number">2 &#41;&nbsp;</span>This is the mcq question?</p>
                                        <span className="points">1 Point</span>

                                    </div>
                                    <label><input type="radio" name="choice" value="choice1" /> choice1</label>
                                    <label><input type="radio" name="choice" value="choice2" /> choice2</label>
                                    <label><input type="radio" name="choice" value="choice3" /> choice3</label>
                                    <label><input type="radio" name="choice" value="choice4" /> choice4</label>
                                </div>


                                <div className="navigate_buttons">
                                    <button className="custom-review-btn-prev" onclick="navigateCustomReviewPage('previous')">Previous</button>
                                    <button className="custom-review-btn-next" onclick="navigateCustomReviewPage('next')">Next</button>
                                </div>
                            </div>
                            <div id="custom-review-page4" className="custom-review-page-content">

                                <div className="question mcq" data-id="2">
                                    <div className="question_content">
                                        <p><span className="question_number">2 &#41;&nbsp;</span>This is the mcq question?</p>
                                        <span className="points">1 Point</span>

                                    </div>
                                    <label><input type="radio" name="choice" value="choice1" /> choice1</label>
                                    <label><input type="radio" name="choice" value="choice2" /> choice2</label>
                                    <label><input type="radio" name="choice" value="choice3" /> choice3</label>
                                    <label><input type="radio" name="choice" value="choice4" /> choice4</label>
                                </div>

                                <div className="question short_answer" data-id="3">
                                    <div className="question_content">
                                        <p><span className="question_number">3 &#41;&nbsp;</span>This is the short answer question?</p>
                                        <span className="points">2 Points</span>

                                    </div>
                                    <label><input type="text" name="shAn" value="" placeholder="Enter your answer" /></label>
                                </div>

                                <div className="question checkbox" data-id="4">
                                    <div className="question_content">
                                        <p><span className="question_number">4 &#41;&nbsp;</span>This is the checkbox question?</p>
                                        <span className="points">4 Points</span>

                                    </div>
                                    <label><input type="checkbox" name="choice" value="choice1" /> choice1</label>
                                    <label><input type="checkbox" name="choice" value="choice2" /> choice2</label>
                                    <label><input type="checkbox" name="choice" value="choice3" /> choice3</label>
                                    <label><input type="checkbox" name="choice" value="choice4" /> choice4</label>
                                </div>
                                <div className="navigate_buttons">
                                    <button className="custom-review-btn-prev" onclick="navigateCustomReviewPage('previous')">Previous</button>
                                    <button className="custom-review-btn-next" onclick="navigateCustomReviewPage('next')">Next</button>
                                </div>
                            </div>




                        </div>





                    </div>

                </div>}

            </div>
        </div>
    </div>
}
export default ExamDetails