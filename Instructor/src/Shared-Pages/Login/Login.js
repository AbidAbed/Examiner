import { useDispatch, useSelector } from "react-redux"
import "./Login.css"
import {
    changeInstructor, changeIsLoggedIn, changeRole,
    changeToken, changeUser, usePostLoginMutation
} from "../../GlobalStore/GlobalStore"
import { Link, useNavigate } from "react-router"
import { useEffect, useState } from "react"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from "../../Shared-Components/Loading/Loading"

function Login() {
    const config = useSelector((state) => state.config)
    const dispatch = useDispatch()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isRememberMe, setIsRememberMe] = useState(true)
    const [isLoading, setIsLoading] = useState(false)

    const [postLogin, postLoginResponse] = usePostLoginMutation()

    const navigate = useNavigate()

    function handleLogin(e) {
        e.preventDefault()
        setIsLoading(true)
        postLogin({ email: email, password: password })
    }

    useEffect(() => {
        if (!postLoginResponse.isLoading && !postLoginResponse.isUninitialized) {
            if (postLoginResponse.isError) {
                setTimeout(() => {
                    setIsLoading(false)
                    toast.error("Invalid email or password", { delay: 7 })
                }, 4000)
            } else {
                setTimeout(() => {
                    if (postLoginResponse.data.user.role === 'student') {
                        setIsLoading(false)
                        toast.error("Invalid email or password", { delay: 7 })
                        return
                    } else if (postLoginResponse.data.user.role === 'instructor') {
                        dispatch(changeRole('instructor'))
                        const { user, ...instructorObj } = postLoginResponse.data
                        dispatch(changeInstructor(instructorObj))

                        navigate('/instructor/dashboard')
                    }

                    setIsLoading(false)
                    toast.success("Logged in successfully", { delay: 7 })
                    dispatch(changeToken(postLoginResponse.data.token))
                    dispatch(changeUser(postLoginResponse.data.user))
                    if (isRememberMe)
                        localStorage.setItem("token", postLoginResponse.data.token)

                    dispatch(changeIsLoggedIn(true))

                }, 4000)
            }
        }
    }, [postLoginResponse])

    return <div className="login-container">
        <div className="main-content">
            {isLoading && <Loading />}
            <div className="intro-text">
                <h1>Examiner - Instructors Portal</h1>
                <p>Welcome to Examiner – Your hub for effortless exam creation , giving , and grading.</p>
            </div>
            <div className="form">

                <form onSubmit={handleLogin}>
                    <div className="account_info">
                        <div>
                            <label htmlFor="username">Email</label>
                            <input type="text" name="username" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div>
                            <label htmlFor="password">Password</label>
                            <input type="password" name="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                    </div>

                    <div className="password">
                        <div>
                            <input type="checkbox" name="remember" checked={isRememberMe} onChange={() => setIsRememberMe(!isRememberMe)} /> <span> Remember Me</span>
                        </div>
                        <Link style={{ color: 'red' }} to="/instructor/forget-password">Forget password?</Link>
                    </div>

                    <input type="submit" value="Login" className="submit" />

                    <div className="sign_up">
                        <p>Don't have an account?</p>
                        <Link to="/instructor/signup">Sign Up</Link>
                    </div>

                </form>
            </div>

        </div>

    </div>
}
export default Login