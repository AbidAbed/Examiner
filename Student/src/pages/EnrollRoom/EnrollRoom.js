import { useDispatch } from "react-redux"
import "./EnrollRoom.css"
import { addRooms, useEnrollRoomMutation, useLazyGetRoomsQuery } from "../../GlobalStore/GlobalStore"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import Loading from "../../Shared-Components/Loading/Loading"
import { useSelector } from "react-redux"
import { Link } from "react-router"
function EnrollRoom() {

    const dispatch = useDispatch()
    const config = useSelector((state) => state.config)
    const rooms = useSelector((state) => state.rooms)



    const [page, setPage] = useState(0)
    const [isLoadMoreAvailable, setIsLoadMoreAvailable] = useState(true)
    const [isEnrollRoomPopupVisable, setIsEnrollRoomPopupVisable] = useState(false)
    const [roomInvitationCode, setRoomInvitationCode] = useState("")

    const [enrollRoom, enrollRoomResponse] = useEnrollRoomMutation()
    const [getRooms, getRoomsResponose] = useLazyGetRoomsQuery()


    useEffect(() => {
        if (!getRoomsResponose.isLoading && !getRoomsResponose.isUninitialized) {
            if (getRoomsResponose.isError) {
                toast.error("Error loading your rooms")
            } else {
                if (getRoomsResponose.data.length === 0)
                    setIsLoadMoreAvailable(false)
                else
                    dispatch(addRooms(getRoomsResponose.data))                
            }
        }
    }, [getRoomsResponose])

    useEffect(() => {
        if (!enrollRoomResponse.isLoading && !enrollRoomResponse.isUninitialized) {
            if (enrollRoomResponse.isError) {
                toast.error("Error check your invite code")
            } else {
                toast.success("Room requested , waiting confirmation")
                dispatch(addRooms([enrollRoomResponse.data]))

            }
        }
    }, [enrollRoomResponse])
    useEffect(() => {
        const handleScroll = () => {
            if ((window.scrollY + window.innerHeight >= document.documentElement.scrollHeight) && (isLoadMoreAvailable)) {
                setPage(page + 1)
                getRooms({ token: config.token, page: page + 1 })
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isLoadMoreAvailable, page]);


    useEffect(() => {
        if ((window.scrollY + window.innerHeight >= document.documentElement.scrollHeight) && (isLoadMoreAvailable)) {
            setPage(page + 1)
            getRooms({ token: config.token, page: page + 1 })
        }
    }, [])

    console.log(rooms);
    

    function handleEnrollNewRoom(e) {
        e.preventDefault()
        setRoomInvitationCode("")
        setIsEnrollRoomPopupVisable(false)
        enrollRoom({ token: config.token, roomInvitationCode: roomInvitationCode })
    }
    return <div className="main_page_content">
        {(getRoomsResponose.isLoading || enrollRoomResponse.isLoading) && <Loading />}

        <div className="container">
            <div className="section region">
                <h2>Available Rooms</h2>

                <div className="cards">
                    {rooms.length === 0 ? <div>No rooms were enrolled</div> : rooms.map((room) =>
                        <Link to={room.status === "approved" ? `/student/room/exams/${room.room._id}` : "#"} >
                            <div className="card">
                                <h2>{room.room.instructor.user.username}'s Room</h2>
                                <p className="description">Instructor {room.room.instructor.user.username}</p>
                                <p className="type">{room.room.instructor.user.email}</p>
                                <p style={{
                                    color: room.status === "approved" ?
                                        "green" :
                                        room.status === "pending" ?
                                            "var(--main-color)" : "red"
                                }}>{room.status}</p>
                                <span className="copy-icon" id="copyButton" title="Copy to clipboard" onClick={(e) => {
                                    e.preventDefault()
                                    navigator.clipboard.writeText(room.room.roomInvitaionCode)
                                    toast.success("Copied to clipboard")
                                }}>📋</span>
                            </div>
                        </Link>)}


                    <div className="card">
                        <h5><span>+</span></h5>
                        <button className="button" onClick={() => setIsEnrollRoomPopupVisable(true)}>Enroll New Room</button>
                    </div>

                    {isEnrollRoomPopupVisable && <div id="createRoomPopup" className="popup-modal" style={{ display: 'flex' }}>
                        <div className="popup-content">
                            <span className="close" onClick={() => setIsEnrollRoomPopupVisable(false)}>&times;</span>
                            <h2>Enroll New Room</h2>
                            <form id="createRoomForm" style={{ alignItems: "normal" }}>
                                <label for="roomLink">Room Invitation Link</label>
                                <input type="text" id="roomLink" name="roomLink" required placeholder="ID" value={roomInvitationCode} onChange={(e) => setRoomInvitationCode(e.target.value)} />


                                <div className="popup-buttons">
                                    <button type="button" className="cancel-btn" style={{ borderRadius: "0px" }} onClick={() => setIsEnrollRoomPopupVisable(false)}>Cancel</button>
                                    <button type="submit" className="create-btn" onClick={handleEnrollNewRoom}>Enroll</button>
                                </div>
                            </form>
                        </div>
                    </div>}




                </div>

            </div>
        </div>
    </div >
}
export default EnrollRoom