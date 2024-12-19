import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router"
import LoggedInInstructor from "./Instructor/Components/LoggedInInstructor/LoggedInInstructor"
import ProtectedInstructorRoute from "./Shared-Components/ProtectedInstructorRoute"
import Login from "./Shared-Pages/Login/Login"
import Signup from "./Shared-Pages/Signup/Signup"
import ForgetPassword from "./Shared-Pages/Forget-password/ForgetPassword"
import Loading from "./Shared-Components/Loading/Loading"
import { changeInstructor, changeIsLoggedIn, changeRole, changeToken, changeUser, usePostAuthMutation } from "./GlobalStore/GlobalStore"
import { Slide, toast, ToastContainer } from "react-toastify"

function App() {
  const config = useSelector((state) => state.config)
  const [isLoading, setIsLoading] = useState(true)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [postAuth, postAuthResponse] = usePostAuthMutation()
  useEffect(() => {
    const token = localStorage.getItem("token")
    postAuth(token)
  }, [])

  useEffect(() => {
    if (!postAuthResponse.isLoading && !postAuthResponse.isUninitialized) {
      if (postAuthResponse.isError) {
        setTimeout(() => {
          toast.error("Session Ended please login", { delay: 1 })
          setIsLoading(false)
        }, 4000)
      } else {
        toast.success("Logged In", { delay: 2 })
        setTimeout(() => {
          setTimeout(() => {
            setIsLoading(false)

            if (postAuthResponse.data.user.role === 'student') {
              dispatch(changeRole('student'))
              // navigate('/student/dashboard')
            } else if (postAuthResponse.data.user.role === 'instructor') {
              dispatch(changeRole('instructor'))
              const { user, ...instructorObj } = postAuthResponse.data
              dispatch(changeInstructor(instructorObj))
              navigate('/instructor/dashboard')
            }

            dispatch(changeIsLoggedIn(true))
            dispatch(changeToken(localStorage.getItem("token")))
            dispatch(changeUser(postAuthResponse.data.user))
          }, 7000)
        }, 7000)
      }
    }
  }, [postAuthResponse])

  return <>
    {isLoading && <Loading />}
    <ToastContainer  transition={Slide} />
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forget-password" element={<ForgetPassword />} />

      <Route path="/instructor" element={<ProtectedInstructorRoute />}>
        <Route path="*" element={<LoggedInInstructor />} />
      </Route>
    </Routes>
    {/* <Route path="/student/dashboard" element={<ProtectedInstructorRoute />}>
          <Route path="" element={<LoggedInInstructor />} />
        </Route> */}

  </>
}
export default App