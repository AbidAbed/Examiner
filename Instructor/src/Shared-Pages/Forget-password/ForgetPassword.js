import { Link } from "react-router"
import "./forget_password_style.css"
import { useEffect, useState } from "react"
import { usePostForgetPasswordMutation } from "../../GlobalStore/GlobalStore"
import Loading from "../../Shared-Components/Loading/Loading"
import { toast } from "react-toastify"
function ForgetPassword() {
    const [email, setEmail] = useState()
    const [isLoading, setIsLoading] = useState(false)

    const [postForgetPassword, postForgetPasswordResponse] = usePostForgetPasswordMutation()

    function handleForgetPassword(e) {
        e.preventDefault()
        postForgetPassword({ email: email })
        setIsLoading(true)
    }

    useEffect(() => {
        if (!postForgetPasswordResponse.isLoading && !postForgetPasswordResponse.isUninitialized) {
            if (postForgetPasswordResponse.isError) {
                setTimeout(() => {
                    setIsLoading(false)
                    toast.error("Invalid email", { delay: 7 })
                }, 4000)
            } else {
                setTimeout(() => {
                    setIsLoading(false)
                    toast.success("Reset mail sent successfully", { delay: 7 })
                }, 4000)
            }
        }
    }, [postForgetPasswordResponse])


    return <div className="forgot-password-container-parent">
        <div className="forgot-password-back">
            <div className="forgot-password-container">

                <div><h2>Forgot Your Password?</h2></div>
                <div><p>Enter your email address and we will send you a link to reset your password.</p></div>
                <form onSubmit={handleForgetPassword}>
                    {isLoading && <Loading />}
                    <input type="email" placeholder="Enter Your Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input type="submit" value="Send"></input>
                </form>
                <div>
                    <Link to="/instructor/login">Back to Login</Link></div>
            </div>
        </div>
    </div>
}
export default ForgetPassword