/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import Cookies from 'universal-cookie';

import InputBox from "../components/InputBox"
import BigButton from "../components/BigButton"
import EmptyFieldWarning from '../components/EmptyFieldWarning';
import BottomToast from './BottomToast';
import BottomErrorToast from './BottomErrorToast';
import LoadingScreenLarge from './LodingScreenLarge';
import PopupComponent from './PopupComponent';
import axios from "axios";
import { set } from 'react-hook-form';


const cookies = new Cookies();

function SignInFormComponent({ isStudent, BASE_URL }) {

    const [signInResponseData, setSignInResponseData] = useState(null);
    const [bottomToastData, setBottomToastData] = useState(null);
    const [bottomErrorToastData, setErrorBottomToastData] = useState(null);
    const [signInErrorData, setSignInErrorData] = useState(null);
    const [isUsernameEmpty, setIsUsernameEmpty] = useState(0);
    const [isPasswordEmpty, setIsPasswordEmpty] = useState(null);
    const [isLoading, setIsLoading] = useState(0);
    const [userMail, setUserMail] = useState(null);
    const [forgetPasswordComponentVisibility, setForgetPasswordComponentVisibility] = useState(0);

    // useEffect to log when the component mounts or when state changes
    useEffect(() => {
        console.log('SignInFormComponent mounted');
        console.log('Current state - isStudent:', isStudent, 'forgetPasswordComponentVisibility:', forgetPasswordComponentVisibility);

        // Optional cleanup function
        return () => {
            console.log('SignInFormComponent unmounted');
        };
    }, [isStudent, forgetPasswordComponentVisibility]); // Dependency array: runs when isStudent or forgetPasswordComponentVisibility changes

    const signInPostData = async (event) => {
        event.preventDefault(); // Prevent default form submission behavior
    
        const email = document.getElementById("username").value;
        setUserMail(email);
        const password = document.getElementById("password").value;
    
        // Check if any input is empty
        if (email === "" || password.length < 8) {
            setIsUsernameEmpty(email === "" ? 1 : 0);
            setIsPasswordEmpty(password.length < 8 ? 1 : 0);
            return; // Exit early if any input is empty
        }
    
        try {
            setIsLoading(1); // Show loading screen
    
            const response = await axios.post(
                "https://55cr1n59r3.execute-api.us-east-2.amazonaws.com/dev/v1/auth/login",
                {"body":{ email, password }}, // Corrected body format
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
    
            setIsLoading(0); // Remove loading screen
    
            if (response.status === 200) {
                setBottomToastData("Login Successful"); // Access token
                console.log(response.access_token)
                window.location.reload();
            } else {
                setErrorBottomToastData(JSON.stringify(response.data.error));
            }
    
            handleTheSignInSuccessResponseData(JSON.stringify(response.data));
        } catch (error) {
            setIsLoading(0); // Remove loading screen
            setIsPasswordEmpty(0); // Set password to non-empty
            setSignInErrorData(error.response?.data || error.message);
            console.error("Error:", error);
        }
    };

    const forgetPasswordPostData = async (event) => {
        event.preventDefault(); // Prevent default form submission behavior
        const username = document.getElementById('username').value;

        // Check if any input is empty
        if (username === '') {
            setIsUsernameEmpty(username === '' ? 1 : 0);
            return; // Exit early if any input is empty
        }

        try {

            setIsLoading(1); // show the loding screen 

            const rawResponse = await fetch(BASE_URL + '/v1/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "email": username,
                    "role": isStudent,
                })
            });

            setIsLoading(0); // remove the loding screen

            const content = await rawResponse.json();
            console.log("Login Response data:", content);

            if (rawResponse.ok) {
                setBottomToastData(content?.data?.msg || "Password reset successful.");
            } else {
                setBottomToastData(content?.detail || "Failed to change password!");
            }
        } catch (error) {

            setIsLoading(0); // remove the loding screen

            setBottomToastData("Network Error: Failed to change password! Please Try Again Later");
            console.log('Error:', error);
        } 
    };

    function handleTheSignInSuccessResponseData(jsonData) {
        const jsonObject = JSON.parse(jsonData);
        const accessTokenValue = jsonObject.access_token || null;
        const mail = jsonObject.email || null;
        const userId = jsonObject.userId || null;
        const userRoleValue = jsonObject.role || null;
        const userIdValue = jsonObject.userId || null;

        if (accessTokenValue) {
            cookies.set('access_token', accessTokenValue, { path: '/' });
            cookies.set('email', mail, { path: '/' });
            cookies.set('userId', userId, { path: '/' });
        }
        cookies.set('user_role', isStudent, { path: '/' });
    }

    function forgetPasswordClickFunction() {
        setBottomToastData(null);
        setForgetPasswordComponentVisibility(1);
    }

    return (
        <form className="w-full">
            <div className="text-2xl text-gray-800 text-secondary text-left mb-5">
                <span className='text-3xl font-bold'>
                    {forgetPasswordComponentVisibility ? "Recover Password" : "Sign In"}
                </span> as
                <span className="text-primary">
                    {isStudent ? " Student" : " Teacher"}
                </span>
            </div>

            <div id="input" className="flex flex-col w-full my-5">
                <InputBox
                    id="username"
                    type="text"
                    label="Email"
                    placeholder="Enter your email"
                />
                {isUsernameEmpty ? (<EmptyFieldWarning emptyfield="Email/Username" position='start' />) : null}

                {forgetPasswordComponentVisibility ? null :
                    <InputBox
                        id="password"
                        type="password"
                        label="Password"
                        placeholder="Enter your password"
                    />
                }

                {isPasswordEmpty ? (<EmptyFieldWarning emptyfield="Password" position='start' />) : null}

                {forgetPasswordComponentVisibility === 0 ?
                    <div onClick={forgetPasswordClickFunction}
                        className="w-full text-end font-medium text-grey-500">
                        Forgot password!
                    </div> : null
                }
            </div>


            {bottomToastData ? <BottomToast text={bottomToastData} color="green" /> : null}
            {bottomErrorToastData ? <BottomErrorToast text={bottomErrorToastData} /> : null}
            {signInResponseData ? (<div className='text-1xl text-blue-500 text-start'> *{signInResponseData} </div>) : null}
            {signInErrorData ? <BottomToast text={signInErrorData} color='grey' /> : null}

            {forgetPasswordComponentVisibility === 0 ?
                <BigButton onClickBehavior={signInPostData} placeholder="SIGN IN" /> :
                <BigButton onClickBehavior={forgetPasswordPostData} placeholder="FORGET PASSWORD" />
            }

            {bottomToastData && <PopupComponent content={bottomToastData} contentType={"Forgot Password Status"} redirectPath={"/"}/>}

            {isLoading ? <LoadingScreenLarge /> : null } 
        </form>
    );
}

export default SignInFormComponent;
