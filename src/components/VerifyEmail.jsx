import Cookies from 'universal-cookie';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import LoadingScreenLarge from '../components/LodingScreenLarge';
import PopupComponent from '../components/PopupComponent';

const BASE_URL = 'http://localhost:5000';
const cookies = new Cookies();

function VerifyEmailPage() {
    const navigate = useNavigate();
    const [isReadingResult, setIsReadingResult] = useState(null);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [responseText, setResponseText] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const token = urlParams.get('token');
        const userId = urlParams.get('userId');

        Get_verifyEmail({ token, userId });
    }, []);

    const Get_verifyEmail = async ({ token, userId }) => {
        try {
            setIsLoading(true);
            const rawResponse = await fetch(`${BASE_URL}/v1/verifyemail/${token}/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const content = await rawResponse.json();
            setIsLoading(false);

            if (rawResponse.ok) {
                setIsEmailVerified(true);

                setResponseText(content.data.msg);
            } else {
                setResponseText(content.detail);
            }
        } catch (error) {
            console.error('Error:', error);
            setIsLoading(false);
            setResponseText('An error occurred while verifying your email.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
                {isLoading && <LoadingScreenLarge />}
                {!isLoading && <PopupComponent content={responseText} redirectPath={'/'} contentType={"Email Verification Status"}/>}
            </div>
        </div>
    );
}

export default VerifyEmailPage;
