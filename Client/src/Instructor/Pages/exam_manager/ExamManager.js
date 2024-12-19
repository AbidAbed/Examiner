import { useSelector } from "react-redux"
import "./exam_manager.css"
import { Link } from "react-router"

function ExamManager() {

    const instructorExams = useSelector((state) => state.instructorExams)

    return <div className="main_page_content">
        <div className="section region">
            <h2>Exams</h2>
            <div className="cards" style={{ alignItems: 'center' }}>

                {instructorExams.exams.length === 0 ? <div>No exams were created</div> : instructorExams.exams.map((exam) =>
                    <Link to={`/instructor/exam-manager/exam-details/${exam._id}`}>
                        <div className="card" style={{ height: "250px" }}>
                            <h3>Python Programming</h3>
                            <p className="description">Learn the basics of Python programming, including data structures, loops, and functions.</p>
                            <div className="card_info">
                                <p>Questions: 20</p>
                                <p>Time: 60 minutes</p>
                            </div>
                        </div>
                    </Link>)}

                <Link to="/instructor/create-exam">
                    <div className="card" style={{ height: "250px" }}>
                        <h5><span>+</span></h5>
                        <button className="button">Create New Exam</button>
                    </div>
                </Link>
            </div>
        </div>
    </div>
}
export default ExamManager