import React from "react";
import { useSelector } from "react-redux";
import { Routes, Route, useNavigate, Outlet } from "react-router";

function ProtectedStudentRoute() {
    const navigate = useNavigate();
    const config = useSelector((state) => state.config)

    if (!config.isLoggedIn || config.role !== "instructor") {
        navigate("/login"); // Redirect to login if not authenticated
        return null; // Prevent rendering protected content
    }

    else{
        //TODO VALIDATE TOKEN
    }

    return <Outlet />; // Render children if authenticated
};

export default ProtectedStudentRoute;
