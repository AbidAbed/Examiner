import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Routes, Route, useNavigate, Outlet } from "react-router";

function ProtectedInstructorRoute() {
    const navigate = useNavigate();
    const student = useSelector((state) => state.student);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        // Check authentication and role on mount
        console.log(student);
        
        if (student.startedExamId && student.startedExamId !== null) {
            navigate(`/student/taking-exam/${student.startedExamId}`)
        } else {
            setIsAuthorized(true); // User is authorized to view the route
        }
    }, [student, navigate]); // Add config and navigate as dependencies

    // Render nothing if not authorized
    if (!isAuthorized) {
        return null;
    }

    return <Outlet />; // Render the protected routes if authorized
};

export default ProtectedInstructorRoute;
