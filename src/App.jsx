import Cookies from 'universal-cookie';
import React, { useState, useEffect } from 'react';
import {
    createBrowserRouter, 
    RouterProvider, 
    useNavigate
} from "react-router-dom"

import LoginSignUpPage from "./pages/LoginSignUpPage"
import ChangePasswordPage from "./pages/ChangePasswordPage";
import HomePage from "./pages/HomePage";
import FeedbackPage from "./pages/FeedbackPage";
import UserProfileComponent from './components/UserProfileComponent';
import VerifyEmailPage from './components/VerifyEmail';
import GetResultsPage from './components/GetStudentsResult';

const cookies = new Cookies();

function App() {
    const router = createBrowserRouter([
        {
            path: "/", 
            element : <HomePage/>
        }, 
        {
            path: "/home", 
            element : <HomePage/>
        }, 
        {
            path: "/login", 
            element : <LoginSignUpPage/>
        }, 
        {
            path: "/changePassword", 
            element : <ChangePasswordPage/>
        },
        {
          path: "/verifyemail", 
          element : <VerifyEmailPage/>
        },
        {
            path: "/feedback",
            element: <FeedbackPage />
        },
        {
            path: "/profile",
            element: <UserProfileComponent />
        },
        {
            path: "/getresults",
            element: <GetResultsPage />
        }
    ]);

    return (
        <>  
            <RouterProvider router={router} /> 
        </>
    );
}

export default App;