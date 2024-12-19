import { useEffect, useRef, useState } from "react"
import "./exam_manager.css"

import { useDispatch, useSelector } from "react-redux"

import { Link } from "react-router"
import { addExams, changeIsExamsTotalyLoaded, useLazyGetExamsQuery } from "../../../GlobalStore/GlobalStore"
import { toast } from "react-toastify"
import { RotatingLines } from "react-loader-spinner"

function ExamManager({ scrollRef }) {
    const instructorExams = useSelector((state) => state.instructorExams)
    const config = useSelector((state) => state.config)

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

    console.log(page, isLoadMoreAvailable);


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
            <h2>Exams</h2>
            <div className="cards" style={{ alignItems: 'center' }} ref={examsListRef}>

                {instructorExams.exams.length === 0 ? <div>No exams were created</div> : instructorExams.exams.map((exam) =>
                    <Link to={`/instructor/exam-manager/exam-details/${exam._id}`}>
                        <div className="card" style={{ height: "250px" }}>
                            <h3>{exam.name}</h3>
                            <p className="description">{exam.description}</p>
                            <div className="card_info">
                                <p>Questions: {exam.numberOfQuestions}</p>
                                <p>Time: {exam.duration} minutes</p>
                            </div>
                        </div>
                    </Link>)}

                {getExamsResponse.isLoading && <div style={{ display: 'flex', justifyContent: 'center', }}>
                    <RotatingLines
                        visible={true}
                        height="50"
                        width="50"
                        color="grey"
                        strokeWidth="5"
                        animationDuration="0.75"
                        ariaLabel="rotating-lines-loading"
                    />
                </div>}

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