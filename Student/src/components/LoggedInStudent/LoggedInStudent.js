
import { Route, Routes } from 'react-router'
import TopNavigationBar from "../TopNavigationBar/TopNavigationBar"
import SideNavigationBar from "../SideNavigationBar/SideNavigationBar"
import Dashboard from "../../pages/Dashboard/DashBoard"
import "./LoggedInStudent.css"
import { addExams, changeLiveExams, changeOverview, useGetExamsQuery, useGetLiveExamsQuery, useGetOverAllStatisticsQuery } from '../../GlobalStore/GlobalStore'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import Loading from '../../Shared-Components/Loading/Loading'
import EnrollRoom from '../../pages/EnrollRoom/EnrollRoom'
import RoomExams from '../../pages/EnrollRoom/exams_of_room/RoomExams'
import TakingExamProtectedRoute from "../../Shared-Components/TakingExamProtectedRoute"
import TakingExam from '../../pages/Dashboard/taking_exam/TakingExam'
import ExamsReview from '../../pages/exams_review/ExamsReview'
import ExamDetails from '../../pages/exams_review/exam_details/ExamDetails'

function LoggedInStudent() {

    const dispatch = useDispatch()
    const config = useSelector((state) => state.config)

    const getLiveExamsResponse = useGetLiveExamsQuery({ token: config.token })
    const getOverAllStatisticsResponse = useGetOverAllStatisticsQuery({ token: config.token })
    const getStudentExamsResponse = useGetExamsQuery({ token: config.token, page: 1 })

    useEffect(() => {
        if (!getLiveExamsResponse.isLoading && !getLiveExamsResponse.isUninitialized) {
            if (getLiveExamsResponse.isError) {
                toast.error("Error loading upcoming exams", { delay: 7 })
            } else {
                dispatch(changeLiveExams(getLiveExamsResponse.data))
            }
        }
    }, [getLiveExamsResponse])

    useEffect(() => {
        if (!getOverAllStatisticsResponse.isLoading && !getOverAllStatisticsResponse.isUninitialized) {
            if (getOverAllStatisticsResponse.isError) {
                toast.error("Error loading statistics", { delay: 7 })
            } else {
                dispatch(changeOverview(getOverAllStatisticsResponse.data))
            }
        }
    }, [getOverAllStatisticsResponse])

    useEffect(() => {
        if (!getStudentExamsResponse.isLoading && !getStudentExamsResponse.isUninitialized) {
            if (getStudentExamsResponse.isError) {
                toast.error("Error loading exams", { delay: 7 })
            } else {
                dispatch(addExams(getStudentExamsResponse.data))
            }
        }
    }, [getStudentExamsResponse])


    return <div className='logged-in-student-container'>
        {(getLiveExamsResponse.isLoading ||
            getOverAllStatisticsResponse.isLoading ||
            getStudentExamsResponse.isLoading) && <Loading />}
        <Routes>
            <Route path='/dashboard' element={<TakingExamProtectedRoute />}>
                <Route path="" element={<>
                    <TopNavigationBar />
                    <SideNavigationBar />
                    <Dashboard />
                </>} />
            </Route>


            <Route path='/enroll-exam' element={<TakingExamProtectedRoute />}>
                <Route path="" element={<>
                    <TopNavigationBar />
                    <SideNavigationBar />
                    <EnrollRoom />
                </>} />
            </Route>


            <Route path='/room/exams/:roomId' element={<TakingExamProtectedRoute />}>
                <Route path="" element={<>
                    <TopNavigationBar />
                    <RoomExams />
                </>} />
            </Route>


            <Route path='/taking-exam/:startedExamId' element={<>
                <TopNavigationBar />
                <TakingExam />
            </>} />


            <Route path='/exams-review' element={<TakingExamProtectedRoute />}>
                <Route
                    path=""
                    element={<>
                        <TopNavigationBar />
                        <SideNavigationBar />
                        <ExamsReview />
                    </>} />
            </Route>

            <Route path='/exams-review/exam-details/:roomId/:examId' element={<TakingExamProtectedRoute />}>
                <Route
                    path=""
                    element={<>
                        <TopNavigationBar />
                        <ExamDetails />
                    </>} />
            </Route>

        </Routes>
    </div >
}
export default LoggedInStudent