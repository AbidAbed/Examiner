import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Routes, Route, useNavigate, Outlet } from "react-router";

function ProtectedInstructorRoute() {
    const navigate = useNavigate();
    const config = useSelector((state) => state.config);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        // Check authentication and role on mount
        if (!config.isLoggedIn || config.role !== "instructor") {
            navigate("/student/login"); // Redirect to login if not authenticated
        } else {
            setIsAuthorized(true); // User is authorized to view the route
        }
    }, [config, navigate]); // Add config and navigate as dependencies

    // Render nothing if not authorized
    if (!isAuthorized) {
        return null;
    }

    return <Outlet />; // Render the protected routes if authorized
};

export default ProtectedInstructorRoute;
