import { Link, useParams } from "react-router"
import "./RoomExams.css"
import { useEnrollExamMutation, useLazyGetRoomExamsQuery } from "../../../GlobalStore/GlobalStore"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import Loading from "../../../Shared-Components/Loading/Loading"
import { useSelector } from "react-redux"

const userTimezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;

function RoomExams() {
    const config = useSelector((state) => state.config)

    const { roomId } = useParams()
    const [roomExams, setRoomExams] = useState([])
    const [page, setPage] = useState(1)

    const [getRoomExams, getRoomExamsResponse] = useLazyGetRoomExamsQuery()
    const [enrollExam, enrollExamResponse] = useEnrollExamMutation()
    const [isMoreExamsAvailable, setIsMoreExamsAvailable] = useState(true)

    console.log(roomExams);

    useEffect(() => {
        getRoomExams({
            token: config.token, query: {
                page: page,
                roomId: roomId
            }
        })
    }, [page])

    useEffect(() => {
        if (!getRoomExamsResponse.isLoading && !getRoomExamsResponse.isUninitialized) {
            if (getRoomExamsResponse.isError) {
                toast.error("Error loading exams")
            } else {
                if (getRoomExamsResponse.data.length === 0) {
                    setIsMoreExamsAvailable(false)
                    setRoomExams([])
                }
                else {
                    setIsMoreExamsAvailable(true)
                    setRoomExams(getRoomExamsResponse.data)
                }
            }
        }
    }, [getRoomExamsResponse])

    useEffect(() => {
        if (!enrollExamResponse.isLoading && !enrollExamResponse.isUninitialized) {
            if (enrollExamResponse.isError) {
                toast.error("Error enrolling exam")
            } else {
                toast.success("Requested successfully")
                const updatedRoomExams = [...roomExams].reduce((prevRoomExam, curRoomExam) => {
                    if (curRoomExam._id === enrollExamResponse.data._id)
                        return [...prevRoomExam, { ...enrollExamResponse.data }]
                    else
                        return [...prevRoomExam, curRoomExam]
                }, [])
                setRoomExams(updatedRoomExams)
            }
        }
    }, [enrollExamResponse])

    function handleEnrollExam(e, roomExam) {

        enrollExam({ token: config.token, body: { roomId: roomId, examId: roomExam._id } })
    }
    return <div className="exam-details-main">
        <div className="container">
            {(getRoomExamsResponse.isLoading) && <Loading />}
            <div className="breadcrumb">
                <Link to="/student/enroll-exam">Enroll Exam </Link>&nbsp; /&nbsp;List Of Exams
            </div>
            <div className="table">
                <table className="status_table">
                    <thead>
                        <tr>
                            <th>Exam Name</th>
                            <th>Exam Date</th>
                            <th>Exam time</th>
                            <th>Exam Duration</th>
                            <th>Exam Enrollment Status</th>
                            <th>Exam Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roomExams.length === 0 ? <div style={{ display: 'flex', justifyContent: 'center', color: 'gray', padding: '10px' }}>No exams to view</div> :
                            roomExams.map((roomExam) => <tr>
                                <td data-label="Exam Name">{roomExam.name}</td>
                                <td data-label="Exam Date">{(new Date(roomExam.scheduledTime)).toISOString().split("T")[0]}</td>
                                <td data-label="Exam Time">{String((new Date(roomExam.scheduledTime)).getHours()).padStart(2, '0')}:{String((new Date(roomExam.scheduledTime)).getMinutes()).padStart(2, '0')}</td>
                                <td data-label="Exam Duration">{roomExam.duration} Minutes</td>
                                <td data-label="Exam Enrollment Status" className={roomExam.enrolmentStatus === "closed" ? "finished" : "ongoing"}>{roomExam.enrolmentStatus}</td>
                                <td data-label="Exam Status" style={{
                                    color: roomExam.scheduledTime > Date.now() ?
                                        "#3382a6" :
                                        roomExam.scheduledTime <= Date.now() && roomExam.scheduledTime + roomExam.duration * 60 * 1000 > Date.now() ?
                                            "green" : "red"
                                }}>
                                    {roomExam.scheduledTime > Date.now() ?
                                        "Available" :
                                        roomExam.scheduledTime <= Date.now() && roomExam.scheduledTime + roomExam.duration * 60 * 1000 > Date.now() ?
                                            "Ongoin" : "Finished"}</td>

                                <td data-label="Action" style={{
                                    color: roomExam.examEnrolments.length === 0 && roomExam.enrolmentStatus === "open" && !(roomExam.scheduledTime <= Date.now() && roomExam.scheduledTime + roomExam.duration * 60 * 1000 <= Date.now()) ? "" :
                                        roomExam.examEnrolments.length === 0 ? "red" : roomExam.examEnrolments[0].status === "approved" ? "green" : roomExam.examEnrolments[0].status === "pending" ? "orange" : "red"
                                }}>
                                    {roomExam.examEnrolments.length === 0 && roomExam.enrolmentStatus === "open" &&
                                        !(roomExam.scheduledTime <= Date.now() && roomExam.scheduledTime + roomExam.duration * 60 * 1000 <= Date.now())
                                        ?
                                        <button class="request" onClick={(e) => handleEnrollExam(e, roomExam)}>Request</button> :
                                        roomExam.examEnrolments.length === 0 ? "CLOSED" : roomExam.examEnrolments[0].status}</td>
                            </tr>)}
                    </tbody>

                </table>
            </div>
            <div className="page-navigation" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>

                <button id="prevPage" className="button" style={{ backgroundColor: page - 1 === 0 ? 'gray' : "" }}
                    disabled={page - 1 === 0 ? true : false} onClick={() => setPage(page - 1)}>Make Previous</button>
                <button id="nextPage" className="button"
                    style={{ backgroundColor: !isMoreExamsAvailable ? "gray" : "" }}
                    disabled={!isMoreExamsAvailable ? true : false} onClick={() => setPage(page + 1)}>Make Next</button>
            </div>
        </div>
    </div>
}
export default RoomExams