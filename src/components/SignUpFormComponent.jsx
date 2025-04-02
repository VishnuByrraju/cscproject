/* eslint-disable react/prop-types */
import { useState } from 'react';
import InputBox from "../components/InputBox";
import BigButton from "../components/BigButton";
import LoadingScreenLarge from '../components/LodingScreenLarge';
import PopupComponent from './PopupComponent';
import BottomToast from './BottomToast';

function SignUpFormComponent({ isStudent, BASE_URL }) {
    
    const [signUpResponseData, setSignUpResponseData] = useState(null);
    const [signUpErrorData, setSignUpErrorData] = useState(null);
    const [isFirstNameEmpty, setIsFirstNameEmpty] = useState(false);
    const [isLastNameEmpty, setIsLastNameEmpty] = useState(false);
    const [isEmailEmpty, setIsEmailEmpty] = useState(false);
    const [isPasswordEmpty, setIsPasswordEmpty] = useState(false);
    const [passwordError, setPasswordError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const [isCategoryEmpty, setIsCategoryEmpty] = useState(false);
    const [isPrivacyPolicyUnchecked, setIsPrivacyPolicyUnchecked] = useState(false);

    const postData = async (event) => {
        event.preventDefault(); // Prevent default form submission behavior

        const first_name = document.getElementById('first_name').value;
        const last_name = document.getElementById('last_name').value;
        const email_id = document.getElementById('email_id').value;
        const password = document.getElementById('password').value;
        const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?`~]).{8,}$/;
        const category = document.getElementById('category').value;
        const privacyPolicy = document.getElementById('privacy_policy').checked;

        // Check if any input is empty
        setIsFirstNameEmpty(first_name === '');
        setIsLastNameEmpty(last_name === '');
        setIsEmailEmpty(email_id === '');
        setIsPasswordEmpty(password === '');
        setIsPrivacyPolicyUnchecked(!privacyPolicy);
        
        if (first_name === '' || last_name === '' || email_id === '' || password === '' || !privacyPolicy) {
            return; // Exit early if any input is empty
        }

        // Validate password
        if (!passwordPattern.test(password)) {
            if (password.length < 8) {
                setPasswordError('Password must be at least 8 characters long.');
            } else if (!/[A-Z]/.test(password)) {
                setPasswordError('Password must contain at least one uppercase letter.');
            } else if (!/\d/.test(password)) {
                setPasswordError('Password must contain at least one digit.');
            } else if (!/[!@#$%^&*()_+[\]{};':"\\|,.<>/?`~]/.test(password)) {
                setPasswordError('Password must contain at least one special character.');
            }
            return;
        } else {
            setPasswordError(null);
        }

        try {
            setIsLoading(1); // show the loading screen 
            
            const response = await fetch(`${BASE_URL}/v1/signup`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    first_name,
                    last_name,
                    email: email_id,
                    password,
                    role: isStudent,
                    category : document.getElementById('category').value
                })
            });

            setIsLoading(0); // remove the signup loading screen

            const content = await response.json();

            if (response.ok) {
                console.log("data", content);
                setSignUpResponseData(content.data.msg);
            } else {
                setSignUpErrorData(content.detail || 'Signup failed');
            }
        } catch (error) {
            setIsLoading(0); // remove the signup loading screen
            setSignUpErrorData('Network error: ' + error.message);
        }
    };

    return (
        <form className="w-full max-w-lg mx-auto " onSubmit={postData}>
            <div className="text-2xl text-gray-800 text-left ">
                <span className='text-3xl font-bold text-second'>Sign Up</span> as
                <span className="text-primary">
                    {isStudent ? " Student" : " Teacher"}
                </span>
            </div>

            <div id="input" className="flex flex-col w-full my-5 space-y-4">
                <InputBox
                    type="text"
                    label="First Name"
                    id="first_name"
                    placeholder="Enter First Name"
                    isEmpty={isFirstNameEmpty}
                />

                <InputBox
                    type="text"
                    label="Last Name"
                    id="last_name"
                    placeholder="Enter Last Name"
                    isEmpty={isLastNameEmpty}
                />

                <InputBox
                    type="email"
                    label="Email ID"
                    id="email_id"
                    placeholder="Enter your Email ID (eg. liny@xyz.com)"
                    isEmpty={isEmailEmpty}
                />

                <InputBox
                    type="password"
                    label="Password"
                    id="password"
                    placeholder="Enter your password"
                    isEmpty={isPasswordEmpty}
                />

                {passwordError && <div className='text-1xl text-red-500'>{passwordError}</div>}

                <InputBox
                    type="category"
                    label="School/Company Name"
                    id="category"
                    placeholder="Enter Your School/Company Name"
                    isEmpty={isCategoryEmpty}
                />

                <div className="mt-4 flex items-start">
                    <div className="flex items-center h-5">
                        <input
                            id="privacy_policy"
                            name="privacy_policy"
                            type="checkbox"
                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        />
                    </div>
                    <div className="ml-2 text-sm">
                        <label htmlFor="privacy_policy" className="font-medium text-gray-700">
                                Accetto i Termini e Condizioni e Politica sulla Privacy
                                <a className='text-blue-600 underline' href="https://skill-bridge.uk/parliamo-privacy-policy-italiano/"> Privacy & Policy</a>
                        </label>
                    </div>
                </div>
                {isPrivacyPolicyUnchecked && <div className="text-red-500 text-sm">Please agree to the privacy policy</div>}

                {signUpResponseData && <PopupComponent content={signUpResponseData + "Check Your Spam Folder Also."} contentType={"Sign Up Status"} redirectPath={"/"} />}
                {signUpErrorData ? <BottomToast text={signUpErrorData} textState={setSignUpErrorData} color='grey' /> : null}
            </div>
                        
            <BigButton type="submit" placeholder="SIGN UP" />
            {isLoading ? <LoadingScreenLarge /> : null }
        </form>
    );
}

export default SignUpFormComponent;
