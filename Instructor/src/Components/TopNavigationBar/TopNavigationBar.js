import { useEffect, useState } from "react"
import Loading from "../../Shared-Components/Loading/Loading"
import { useDispatch, useSelector } from 'react-redux'
import { changeIsLoggedIn, changeRole, changeToken, changeUser } from "../../GlobalStore/GlobalStore"
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import "./TopNavigationBar.css"

function TopNavigationBar() {

  const [isDropdownVisible, setIsDropdownVisible] = useState(false)

  const [isPopupVisable, setIsPopupVisable] = useState(false)

  const [isLoading, setIsLoading] = useState(false)

  const dispatch = useDispatch()

  const navigate = useNavigate()

  const user = useSelector((state) => state.user)

  function detectPressingOut(event) {
    const dropdown = document.getElementById("dropdownMenu");
    const userLink = document.getElementById("userLink");

    if (dropdown && userLink) {
      if (!userLink.contains(event.target) && !dropdown.contains(event.target)) {
        setIsDropdownVisible(false)
      }
    }
  }

  useEffect(() => {
    const handleOutsideClick = (event) => detectPressingOut(event);

    // Add event listener
    document.addEventListener("click", handleOutsideClick);

    // Clean up event listener on unmount or dependency change
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isDropdownVisible]);

  function handleSignOut() {
    setIsLoading(true)
    setIsPopupVisable(false)
  }

  useEffect(() => {
    if (isLoading) {
      toast.success("Logged out successfully", { delay: 3 })
      setTimeout(() => {
        localStorage.setItem("token", "")
        dispatch(changeIsLoggedIn(false))
        dispatch(changeToken(""))
        dispatch(changeRole('student'))
        dispatch(changeUser({}))
        setIsLoading(false)
      }, 6000)
    }
  }, [isLoading])

  return <div className="Top-Bar">
    {isLoading && <Loading />}


    {isPopupVisable &&
      <div className="poup-signout-parent">
        <div className="poup-signout">
          <div>Are you sure ?</div>
          <div className="confirmation">
            <div className="signout-btn" style={{ padding: "5px" }} onClick={handleSignOut}>Signout</div>
            <div className="cancel-btn" style={{ padding: "5px" }} onClick={() => setIsPopupVisable(false)}>Cancel</div>
          </div>
        </div>
      </div>}


    <nav className="navbar">
      <div className="search">
        <input type="text" placeholder="Search..." />
      </div>
    </nav>
    <div className="user_info" onClick={() => setIsDropdownVisible(true)}>
      <div className="user_info_link" id="userLink" style={{ gap: '5px' }}>
        <img src={`${process.env.REACT_APP_PUBLIC_URL}/instructor_photos/user.png`} alt="photo" height="30px" width="30px" />
        <div>
          <p className="user_info_text">{user.username}</p>
          <p className="user_info_text">Instructor</p>
        </div>
      </div>

      <div className={`dropdown ${isDropdownVisible ? "show" : ""}`} id="dropdownMenu" >
        <ul>
          <a id="signOutBtn" className="signOutBtn" onClick={() => setIsPopupVisable(true)}><li>Sign Out</li></a>
        </ul>
      </div>
    </div>
  </div>
}
export default TopNavigationBar