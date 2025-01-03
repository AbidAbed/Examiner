import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router"
import ProtectedStudentRoute from "./Shared-Components/ProtectedStudentRoute"

import Login from "./Shared-Pages/Login/Login"
import Signup from "./Shared-Pages/Signup/Signup"
import ForgetPassword from "./Shared-Pages/Forget-password/ForgetPassword"
import Loading from "./Shared-Components/Loading/Loading"
import { changeIsLoggedIn, changeRole, changeStudent, changeToken, changeUser, usePostAuthMutation } from "./GlobalStore/GlobalStore"
import { Slide, toast, ToastContainer } from "react-toastify"
import LoggedInStudent from "./components/LoggedInStudent/LoggedInStudent"

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
        setTimeout(() => {
          setIsLoading(false)
          if (postAuthResponse.data.user.role === 'instructor') {
            return toast.error("Invalid email or password", { delay: 7 })
          }
          if (postAuthResponse.data.user.role === 'student') {
            dispatch(changeRole('student'))
            const { user, ...studentObj } = postAuthResponse.data
            dispatch(changeStudent(studentObj))

            if (!studentObj.startedExamId || studentObj.startedExamId === null)
              navigate('/student/dashboard')
            else
              navigate(`/student/taking-exam/${studentObj.startedExamId}`)
          }
          toast.success("Logged in successfully", { delay: 7 })

          dispatch(changeIsLoggedIn(true))
          dispatch(changeToken(localStorage.getItem("token")))
          dispatch(changeUser(postAuthResponse.data.user))
        }, 7000)
      }
    }
  }, [postAuthResponse])

  return <>
    {isLoading && <Loading />}
    <ToastContainer transition={Slide} />
    <Routes>
      <Route path="/" element={<Navigate to="/student/login" replace />} />

      <Route path="/student/login" element={<Login />} />
      <Route path="/student/signup" element={<Signup />} />
      <Route path="/student/forget-password" element={<ForgetPassword />} />

      <Route path="/student" element={<ProtectedStudentRoute />}>
        <Route path="*" element={<LoggedInStudent />} />
      </Route>
      <Route path="*" element={<Login />} />
    </Routes>


  </>
}
export default App