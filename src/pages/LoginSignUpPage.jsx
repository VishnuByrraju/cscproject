import { useState, useEffect } from 'react';

import SignUpFormComponent from '../components/SignUpFormComponent';
import SignInFormComponent from '../components/SignInFormComponent';
import HeroLoginSignUp from '../components/HeroLoginSignUp';
import {
    createBrowserRouter, 
    RouterProvider, 
    useNavigate
} from "react-router-dom"
import Cookies from 'universal-cookie';
const cookies = new Cookies();


const BASE_URL = "http://localhost:5000";

function LoginSignUpPage() {
    const [isStudent, setIsStudent] = useState(1);
    const [isLogin, setIsLogin] = useState(1);

    const isStudentButton = () => setIsStudent(1); // Set the state to indicate the user is a student
    // const isTeacherButton = () => setIsStudent(0); // Set the state to indicate the user is a teacher
    const swapLoginSignUp = () => setIsLogin(isLogin ? 0 : 1); // Toggle the login state between login and signup

    // useEffect to log when the component mounts or when isLogin/isStudent changes
    useEffect(() => {
        console.log('LoginSignUpPage component mounted');
        console.log('Current state - isStudent:', isStudent, 'isLogin:', isLogin);

        // Optional cleanup function
        return () => {
            console.log('LoginSignUpPage component unmounted');
        };
    }, []); // Dependency array: runs when isStudent or isLogin changes

    const navigate = useNavigate();
    const access_token = cookies.get("access_token");
    const userRole = cookies.get("user_role");
    const [popupContent, setPopupContent] = useState("");
    const [isLargeLoading, setIsLargeLoading] = useState(false); // Added loading state

    const handleTier1Button = async (tier) => {
        if (!access_token || access_token === "undefined") {
            setPopupContent("Please login before proceeding");
            return;
        }
        if (!userRole) {
            setPopupContent("Teachers are not allowed to buy credits");
            return;
        }
        try {
            setIsLargeLoading(true);
            const response = await fetch(`${BASE_URL}/v1/checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                },
                body: JSON.stringify({ tier: tier })
            });
            setIsLargeLoading(false);
            const content = await response.json();
            if (response.ok) {
                window.location.href = content.url; // Use content.url instead of response.url
            } else {
                console.error('Error:', content);
                setPopupContent("An error occurred while processing your request.");
            }
        } catch (error) {
            setIsLargeLoading(false);
            console.error('Error:', error);
            setPopupContent("An error occurred. Please try again later.");
        }
    }

    return (
        <div className="antialiased bg-gradient-to-br from-gray-100 to-white">
            <div className="container  lg:px-10 px-4 mx-auto">
                <div className="flex flex-col text-center md:text-left md:flex-row h-screen justify-evenly md:items-center">
                    {/* Hero Component */}
                    {/* <HeroLoginSignUp /> */}
                    <div className="w-full h-full lg:mt-24 mt-2 lg:w-6/12  md:mx-0">

                        

                        
                        <div className="bg-white p-8 flex flex-col  w-full shadow-xl rounded-xl">
                            {isLogin ? 
                                <SignInFormComponent 
                                    BASE_URL={BASE_URL} 
                                    isStudent={isStudent}
                                /> 
                                : 
                                <SignUpFormComponent 
                                    BASE_URL={BASE_URL} 
                                    isStudent={isStudent}
                                />
                            }
                            <div className="flex justify-evenly mt-5">
                                <a onClick={swapLoginSignUp} href="#" className="w-full text-center font-medium text-blue-600">
                                    {isLogin ? "Don't have an account? Sign up!" : "Already have an account? Sign in!"}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    );
}

export default LoginSignUpPage;
