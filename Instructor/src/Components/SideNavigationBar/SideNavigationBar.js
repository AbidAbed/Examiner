import { Link, useLocation } from "react-router"
import "./SideNavigationBar.css"
function SideNavigationBar() {
    const location = useLocation();

    return <div className="sidebar">
        <Link to="/instructor/dashboard">
            <div className="logo">
                <img src={`${process.env.REACT_APP_PUBLIC_URL}/instructor_photos/exam.png`} alt="Logo" />
                <h1>EXAMINER</h1>
            </div>
        </Link>

        <ul>
            <Link to="/instructor/dashboard">
                <li className={location.pathname === "/instructor/dashboard" ? 'active' : ""}>
                    <img src={`${process.env.REACT_APP_PUBLIC_URL}/instructor_photos/dashboard.png`} alt="Dashboard Icon" />
                    Dashboard
                </li>
            </Link>
            {/* TODO  */}
            {/* <Link to="/instructor/exam-analysis">
                <li className={location.pathname === "/instructor/exam-analysis" ? 'active' : ""}>
                    <img src={`${process.env.REACT_APP_PUBLIC_URL}/instructor_photos/data.png`} alt="Analysis Icon" />
                    Exams Analysis
                </li>
            </Link> */}
            <Link to="/instructor/create-exam">
                <li className={location.pathname === "/instructor/create-exam" ? 'active' : ""}>
                    <img src={`${process.env.REACT_APP_PUBLIC_URL}/instructor_photos/edit.png`} alt="Create Exam Icon" />
                    Create Exam
                </li>
            </Link>
            <Link to="/instructor/question-bank">
                <li className={location.pathname === "/instructor/question-bank" ? 'active' : ""}>
                    <img src={`${process.env.REACT_APP_PUBLIC_URL}/instructor_photos/paper.png`} alt="Question Bank Icon" />
                    Question Bank
                </li>
            </Link>
            <Link to="/instructor/exam-manager">
                <li className={location.pathname === "/instructor/exam-manager" ? 'active' : ""}>
                    <img src={`${process.env.REACT_APP_PUBLIC_URL}/instructor_photos/settings.png`} alt="Settings Icon" />
                    Exam Manager
                </li>
            </Link>
            <Link to="/instructor/room">
                <li className={location.pathname === "/instructor/room" ? 'active' : ""}>
                    <img src={`${process.env.REACT_APP_PUBLIC_URL}/instructor_photos/add.png`} alt="Create Room Icon" />
                    Room Manager
                </li>
            </Link>
        </ul>

    </div>
}
export default SideNavigationBar