import { useEffect, useState } from "react"
import "./room_details.css"
import { Link } from "react-router"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import { addRoomEnrolments, changeIsRoomEnrolmentsLoaded, useLazyGetRoomEnrolmentsQuery } from "../../../GlobalStore/GlobalStore"

function Room() {
    const [selectedTab, setSelectedTab] = useState("Room Overview")
    const [page, setPage] = useState(1)


    const user = useSelector((state) => state.user)
    const examsStatistics = useSelector((state) => state.examsStatistics)
    const config = useSelector((state) => state.config)
    const room = useSelector((state) => state.room)

    const dispatch = useDispatch()

    const [isLoadingMoreAvailable, setIsLoadingMoreAvailable] = useState(!config.isRoomEnrolmentsLoaded)

    const [getRoomEnrolments, getRoomEnrolmentsResponse] = useLazyGetRoomEnrolmentsQuery()

    useEffect(() => {
        if (isLoadingMoreAvailable)
            getRoomEnrolments({ page: page, token: config.token })
    }, [page, isLoadingMoreAvailable])

    useEffect(() => {
        if (!getRoomEnrolmentsResponse.isLoading && !getRoomEnrolmentsResponse.isUninitialized) {
            if (getRoomEnrolmentsResponse.isError) {
                toast.error("Error loading room enrolments", { delay: 7 })
            } else {
                if (getRoomEnrolmentsResponse.data.length === 0) {
                    dispatch(changeIsRoomEnrolmentsLoaded(true))
                    setIsLoadingMoreAvailable(false)
                }
                else
                    dispatch(addRoomEnrolments(getRoomEnrolmentsResponse.data))
            }
        }

    }, [getRoomEnrolmentsResponse])


    return <div className="room-page-content">
        <div class="breadcrumb">
            <Link to="/instructor/dashboard">Dashboard&nbsp;/</Link>&nbsp;Room Manager&nbsp;/&nbsp;{selectedTab}
        </div>

        <div id="roomInfo" className="region-content">
            <div className="tabs">
                <div className={`tab-link-room ${selectedTab === "Room Overview" && "active-tab-room"}`} onClick={() => setSelectedTab("Room Overview")}>Room Overview</div>
                <div className={`tab-link-room ${selectedTab === "Student Requests" && "active-tab-room"}`} onClick={() => setSelectedTab("Student Requests")}>Student Requests</div>
            </div>


            {selectedTab === "Room Overview" && <div id="roomOverview" className={`tab-content-room ${selectedTab === "Room Overview" && "active-tab-room"}`}>
                <div className="room-details">
                    <h3>Room Overview</h3>
                    <table>
                        <tr>
                            <td><strong>Room Name:</strong></td>
                            <td>{user.username}'s room</td>
                        </tr>
                        <tr>
                            <td><strong>Room Type:</strong></td>
                            <td>Public</td>
                        </tr>
                        <tr>
                            <td><strong>Exams:</strong></td>
                            <td>{examsStatistics.overview.totalExams}</td>
                        </tr>
                        <tr>
                            <td><strong>Students:</strong></td>
                            <td>{examsStatistics.overview.totalRegistered}</td>
                        </tr>
                        <tr>
                            <td><strong>Room Invitation Code:</strong></td>
                            <td style={{ position: "relative", display: 'flex', alignItems: 'center' }}>
                                <span id="roomId">{room.room.roomInvitaionCode.slice(0,10)}...</span>
                                <img src={process.env.REACT_APP_PUBLIC_URL + "/clipboard.png"} alt="Copy Room ID" height="20px" width="20px" onClick={() => {
                                    navigator.clipboard.writeText(room.room.roomInvitaionCode)
                                    toast.success("Copied to clipboard")
                                }} style={{ cursor: "pointer" }} />
                            </td>
                        </tr>
                    </table>
                </div>
            </div>}

            {selectedTab === "Student Requests" && <div id="studentRequests" className={`tab-content-room ${selectedTab === "Student Requests" && "active-tab-room"}`}>

                <div className="student-requests" style={{
                    display: 'flex',
                    flexDirection: "column",
                    gap: '3px',
                }}>
                    <h3>Student Requests</h3>

                    {room.roomEnrolments.slice((page - 1) * process.env.REACT_APP_PAGE_SIZE,
                        (page - 1) * process.env.REACT_APP_PAGE_SIZE + process.env.REACT_APP_PAGE_SIZE).length !== 0 && <div style={{
                            display: 'flex', flexDirection: "row", alignItems: 'center', gap: '7px',
                        }}>
                            <div className="button-room accept-all" >Accept All</div>
                            <div className="button-room reject-all">Reject All</div>
                        </div>}

                    <table className="student-list-table">
                        <thead>
                            <tr>
                                <th>Student Name</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>

                            {room.roomEnrolments.slice((page - 1) * process.env.REACT_APP_PAGE_SIZE,
                                (page - 1) * process.env.REACT_APP_PAGE_SIZE + process.env.REACT_APP_PAGE_SIZE).length === 0 ?
                                <div style={{ color: 'gray', display: 'flex', justifyContent: 'center', padding: "10px" }}>No students were enrolled</div> :
                                room.roomEnrolments.slice((page - 1) * process.env.REACT_APP_PAGE_SIZE,
                                    (page - 1) * process.env.REACT_APP_PAGE_SIZE + process.env.REACT_APP_PAGE_SIZE).map((roomEnrolment) =>
                                        <tr>
                                            <td>John Doe</td>
                                            <td>Pending</td>
                                            <td>
                                                <div style={{
                                                    display: 'flex', flexDirection: "row", alignItems: 'center', gap: '7px'
                                                }}>
                                                    <button className="button-room accept-btn" >Accept</button>
                                                    <button className="button-room reject-btn" >Reject</button>
                                                </div></td>
                                        </tr>)}
                        </tbody>
                    </table>
                </div>

                <div className="page-navigation">
                    <button id="prevPage" className="button" style={{ backgroundColor: page - 1 === 0 ? 'gray' : "" }}
                        disabled={page - 1 === 0 ? true : false} onClick={() => setPage(page - 1)}>Make Previous</button>
                    <button id="nextPage" className="button"
                        style={{ backgroundColor: room.roomEnrolments.length / process.env.REACT_APP_PAGE_SIZE < page && !isLoadingMoreAvailable ? "gray" : "" }}
                        disabled={room.roomEnrolments.length / process.env.REACT_APP_PAGE_SIZE < page && !isLoadingMoreAvailable ? true : false} onClick={() => setPage(page + 1)}>Make Next</button>
                </div>
            </div>}

        </div>
    </div >
}
export default Room