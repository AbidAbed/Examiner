import { Link, useParams } from "react-router"
import "./RoomExams.css"
import { useLazyGetRoomExamsQuery } from "../../../GlobalStore/GlobalStore"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import Loading from "../../../Shared-Components/Loading/Loading"
import { useSelector } from "react-redux"
function RoomExams() {
    const config = useSelector((state) => state.config)

    const { roomId } = useParams()
    const [roomExams, setRoomExams] = useState([])
    const [page, setPage] = useState(1)

    const [getRoomExams, getRoomExamsResponse] = useLazyGetRoomExamsQuery()
    const [isMoreExamsAvailable, setIsMoreExamsAvailable] = useState(true)

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
                                <td data-label="Exam Time">{(new Date(roomExam.scheduledTime)).toISOString().split("T")[1].split(".")[0]}</td>
                                <td data-label="Exam Duration">{roomExam.duration} Minutes</td>
                                <td data-label="Exam Status" className={roomExam.enrolmentStatus === "closed" ? "finished" : "ongoing"}>{roomExam.enrolmentStatus}</td>
                                <td data-label="Exam Status" className={roomExam.status === "finished" ? "finished" : "ongoing"}>{roomExam.status === "finished" ? "finished" : "ongoing"}</td>
                                {/* <button class="request">Request</button> */}
                                <td data-label="Action"></td>
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