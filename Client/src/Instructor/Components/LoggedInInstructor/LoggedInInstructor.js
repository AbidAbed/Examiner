import TopNavigationBar from "../TopNavigationBar/TopNavigationBar"
import SideNavigationBar from "../SideNavigationBar/SideNavigationBar"
import Dashboard from "../../Pages/Dashboard/Dashboard";

import "./LoggedInInstructor.css"

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react"
import {
    useGetExamsQuery,
    useGetLiveExamsQuery,
    useGetOverAllStatisticsQuery,
    changeLiveExams,
    changeOverview,
    addExams,
    useGetInstructorRoomQuery,
    changeRoom
} from "../../../GlobalStore/GlobalStore"

import { Route, Routes } from "react-router";
import CreateExam from "../../Pages/create_exam/CreateExam";
import { toast } from 'react-toastify'
import Loading from "../../../Shared-Components/Loading/Loading";
import QuestionBank from "../../Pages/questions_bank/QuestionBank";
import ExamManager from "../../Pages/exam_manager/ExamManager";
import ExamDetails from "../../Pages/exam_details/ExamDetails";
import Room from "../../Pages/room_details/Room";

function LoggedInInstructor() {

    const dispatch = useDispatch()
    const config = useSelector((state) => state.config)

    const getLiveExamsResponse = useGetLiveExamsQuery({ token: config.token })
    const getOverAllStatisticsResponse = useGetOverAllStatisticsQuery({ token: config.token })
    const getInstructorExamsResponse = useGetExamsQuery({ token: config.token, page: 1 })

    const getRoomResponse = useGetInstructorRoomQuery({ token: config.token })


    useEffect(() => {
        if (!getRoomResponse.isLoading && !getRoomResponse.isUninitialized) {
            if (getRoomResponse.isError) {
                toast.error("Error loading room", { delay: 7 })
            } else {
                dispatch(changeRoom(getRoomResponse.data))
            }
        }
    }, [getRoomResponse])



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
        if (!getInstructorExamsResponse.isLoading && !getInstructorExamsResponse.isUninitialized) {
            if (getInstructorExamsResponse.isError) {
                toast.error("Error loading exams", { delay: 7 })
            } else {
                dispatch(addExams(getInstructorExamsResponse.data))
            }
        }
    }, [getInstructorExamsResponse])


    return <div className="logged-in-instructor-container">
        {(getLiveExamsResponse.isLoading ||
            getOverAllStatisticsResponse.isLoading ||
            getInstructorExamsResponse.isLoading) && <Loading />}
        <Routes>
            <Route path="/dashboard" element={<>
                <TopNavigationBar />
                <SideNavigationBar />
                <Dashboard />

            </>} />

            <Route path="/create-exam" element={<>
                <TopNavigationBar />
                <SideNavigationBar />
                <CreateExam />
            </>} />
            <Route path="/exam-manager" element={<>
                <TopNavigationBar />
                <SideNavigationBar />
                <ExamManager />
            </>} />
            <Route path="/exam-analysis" element={<>
                <TopNavigationBar />
                <SideNavigationBar />

            </>} />
            <Route path="/question-bank" element={<>
                <TopNavigationBar />
                <SideNavigationBar />
                <QuestionBank />
            </>} />
            <Route path="/room" element={<>
                <TopNavigationBar />
                <Room />
            </>} />

            <Route path="/exam-manager/exam-details/:examId" element={<>
                <TopNavigationBar />
                <ExamDetails />
            </>} />

            <Route path="/exam/edit/:examId" element={<>
                <TopNavigationBar />
                <SideNavigationBar />
                <CreateExam editMode={true} />
            </>} />

        </Routes>

    </div>
}
export default LoggedInInstructor