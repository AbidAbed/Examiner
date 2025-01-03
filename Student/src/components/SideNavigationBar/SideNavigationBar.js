import { Link, useLocation } from "react-router"
// import "./SideNavigationBar.css"
function SideNavigationBar() {
    const location = useLocation();

    return <div className="sidebar">
        <Link to="/student/dashboard">
            <div className="logo">
                <img src={`${process.env.REACT_APP_PUBLIC_URL}/students_photos/exam.png`} alt="Logo" />
                <h1>EXAMINER</h1>
            </div>
        </Link>

        <ul>
            <Link to="/student/dashboard">
                <li className={location.pathname === "/student/dashboard" ? 'active' : ""}>
                    <img src={`${process.env.REACT_APP_PUBLIC_URL}/students_photos/dashboard.png`} alt="Dashboard Icon" />
                    Dashboard
                </li>
            </Link>
            <Link to="/student/enroll-exam">
                <li className={location.pathname === "/student/enroll-exam" ? 'active' : ""}>
                    <img src={`${process.env.REACT_APP_PUBLIC_URL}/students_photos/edit.png`} alt="Enroll Exam Icon" />
                    Enroll Exam
                </li>
            </Link>
            <Link to="/student/exams-review">
                <li className={location.pathname === "/student/exams-review" ? 'active' : ""}>
                    <img src={`${process.env.REACT_APP_PUBLIC_URL}/students_photos/paper.png`} alt="Exams Review Icon" />
                    Exams Review
                </li>
            </Link>
            {/* TODO  */}

            {/* <Link to="/student/exams-analysis">
                <li className={location.pathname === "/student/exams-analysis" ? 'active' : ""}>
                    <img src={`${process.env.REACT_APP_PUBLIC_URL}/students_photos/data.png`} alt="Exams Analysis Icon" />
                    Exams Analysis
                </li>
            </Link> */}
        </ul>

    </div>
}
export default SideNavigationBar