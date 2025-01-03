import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { Link, useNavigate } from "react-router"
import { addExams, changeIsExamsTotalyLoaded, useLazyGetExamsQuery } from "../../GlobalStore/GlobalStore"
import { useDispatch } from "react-redux"
import { toast } from "react-toastify"
import Loading from "../../Shared-Components/Loading/Loading"

function ExamsReview() {
    const exams = useSelector((state) => state.studentExams.exams)
    const config = useSelector((state) => state.config)
    const student = useSelector((state) => state.student)

    const [page, setPage] = useState(1)
    const [isLoadMoreAvailable, setIsLoadMoreAvailable] = useState(!config.isExamsTotalyLoaded)

    const [getExams, getExamsResponse] = useLazyGetExamsQuery()

    const examsListRef = useRef()
    const dispatch = useDispatch()


    useEffect(() => {
        if (!getExamsResponse.isLoading && !getExamsResponse.isUninitialized) {
            if (getExamsResponse.isError) {
                toast.error("Error loading exams")
            } else {
                if (getExamsResponse.data.length === 0) {
                    setIsLoadMoreAvailable(false)
                    dispatch(changeIsExamsTotalyLoaded(true))
                }
                else
                    dispatch(addExams(getExamsResponse.data))
            }
        }
    }, [getExamsResponse])

    useEffect(() => {
        if ((window.scrollY + window.innerHeight >= document.documentElement.scrollHeight) && (isLoadMoreAvailable)) {
            setPage(page + 1)
            getExams({ token: config.token, page: page + 1 })
        }
    }, [])

    useEffect(() => {
        const handleScroll = () => {
            if ((window.scrollY + window.innerHeight >= document.documentElement.scrollHeight) && (isLoadMoreAvailable)) {
                setPage(page + 1)
                getExams({ token: config.token, page: page + 1 })
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isLoadMoreAvailable, page]);


    return <div className="main_page_content">
        <div className="section region">
            {(getExamsResponse.isLoading) && <Loading />}
            <h2>Exams</h2>
            <div className="cards" ref={examsListRef}>
                {exams.length === 0 ? <div>No exams were enrolled</div> : exams.map((exam) =>
                    <Link to={`/student/exams-review/exam-details/${exam.exam.instructor.roomId}/${exam.exam._id}`}>
                        <div className="card">
                            <h3>{exam.exam.name}</h3>
                            <p className="description">Instructor {exam.exam.instructor.user.username}</p>
                            <p className="duration">{(new Date(exam.exam.scheduledTime)).toDateString()}</p>
                            <p className="status">{exam.status !== "approved" ? exam.status : exam.exam.scheduledTime > Date.now() ?
                                "Available" :
                                exam.exam.scheduledTime <= Date.now() && exam.exam.scheduledTime + exam.exam.duration * 60 * 1000 > Date.now() ?
                                    student.takenExamsStatistics.find((takenExamStatiId) => exam.exam._id === takenExamStatiId.examId) ? "Atempted (Ongoing)" : "Ongoing" : "Finished"}</p>
                        </div>
                    </Link>)}
                <Link to="/student/enroll-exam">
                    <div className="card">
                        <h5><span>+</span></h5>
                        <button className="button">Enroll New Exam</button>
                    </div>
                </Link>
            </div>
        </div>
    </div>
}
export default ExamsReview