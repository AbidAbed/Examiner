import { Link, useNavigate } from "react-router"
import "./signup_style.css"
import { useEffect, useState } from "react"
import { usePostSignupMutation } from "../../GlobalStore/GlobalStore"
import { toast } from "react-toastify"
import Loading from "../../Shared-Components/Loading/Loading"
function Signup() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [username, setUsername] = useState("")
    const [tel, setTel] = useState("")
    const [confirmedPassword, setConfirmedPassword] = useState("")
    const [role, setRole] = useState('student')
    const [isLoading, setIsLoading] = useState(false)

    const [postSignup, postSignupResponse] = usePostSignupMutation()

    const navigate = useNavigate()

    function handleSignup(e) {
        e.preventDefault()
        if (confirmedPassword !== password) {
            toast.error("Password must be the exact as confirm password", { delay: 7 })
            return
        }
        setIsLoading(true)
        postSignup({ email: email, password: password, tel: tel, role: "student", username: username })
    }

    function handleRedirect(e) {
        e.preventDefault()
        window.location.href = process.env.REACT_APP_PUBLIC_URL_INSTRUCTORS
    }

    useEffect(() => {
        if (!postSignupResponse.isLoading && !postSignupResponse.isUninitialized) {
            if (postSignupResponse.isError) {
                setTimeout(() => {
                    setIsLoading(false)
                    toast.error("Check the validity of your info", { delay: 7 })
                }, 4000)

            } else {
                setTimeout(() => {
                    setIsLoading(false)
                    toast.success("User created successfully", { delay: 7 })

                    setTimeout(() => {
                        navigate("/student/login")
                    }, 4000)

                }, 4000)

            }
        }
    }, [postSignupResponse])

    return <div className="signup-container">
        <div className="main-content">
            <form onSubmit={handleSignup} className="signup-form">
                {isLoading && <Loading />}
                <input type="text" placeholder="Enter Your Username" required value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type="email" placeholder="Enter Your Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="tel" placeholder="Phone : 00962XXXXXXXXX" value={tel} onChange={(e) => setTel(e.target.value)} />
                <input type="password" placeholder="Enter Your Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                <input type="password" placeholder="confirm Your Password" required value={confirmedPassword} onChange={(e) => setConfirmedPassword(e.target.value)} />
                <input type="submit" value="Sign Up"></input>
                <div className="divider">Or With</div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button name="account_type" className="add-answer-btn" style={{ backgroundColor: '#007bff', color: 'white' }} onClick={(e) => handleRedirect(e)}>Go to Instructors Portal </button>
                </div>
                <Link to="/student/login">Already have an account? Login</Link>
            </form>
        </div>

    </div>
}
export default Signup