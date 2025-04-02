import React, { useState, useEffect } from 'react';
import Cookies from 'universal-cookie';
import { Scrollbars } from 'react-custom-scrollbars-2';
import LoginSignUpPage from './LoginSignUpPage';
import LoadingScreenLarge from '../components/LodingScreenLarge';
import NavBar from "../components/NavBar";
import AudioRecorderComponent from "../components/AudioRecorderComponent";
import LoadingSpinner from '../components/LoadingSpinner';

const cookies = new Cookies();
const BASE_URL = "https://mlops-apis.vishnubyrraju.me";

function HomePage() {
    const accesstoken = cookies.get("access_token");
    const user_role = cookies.get("user_role");
    const email = cookies.get("email");

    if (!accesstoken || accesstoken === "undefined") {
        return <LoginSignUpPage />;
    }


    const [currentSubjectID, setCurrentSubjectID] = useState(null);
    const [currentQuestionID, setCurrentQuestionID] = useState(null);
    const [isLargeLoading, setIsLargeLoading] = useState(false);
    const [isQuestionLoading, setIsQuestionLoading] = useState(false);
    const [isReading, setIsReading] = useState(1);
    const [subjectsList, setSubjectsList] = useState([]);
    const [questionsList, setQuestionsList] = useState([]);
    const [hoveredQuestionId, setHoveredQuestionId] = useState(null);


    useEffect(() => {
        fetchSubjectDataByType();
    }, [isReading]);

    useEffect(() => {
        if (currentSubjectID) {
            fetchQuestionDataBySubjectID(currentSubjectID);
        }
    }, [currentSubjectID]);



    useEffect(() => {
        const queryString = window.location.search;

        // Create a URLSearchParams object
        const urlParams = new URLSearchParams(queryString);

        // Retrieve the value of the 'user' parameter
        const subjectId = urlParams.get('subjectId');
        const category = urlParams.get('category');
        // console.log(subjectId, category);

        if(subjectId){
            setCurrentSubjectID(subjectId);
        }

        if (category) {
            setIsReading(category == 'Reading');
        }
    }, []); // The effect will run whenever the URL search part changes


    const readingButtonClick = () => {
        setIsReading(1);
        clearData();
    }

    const speakingButtonClick = () => {
        setIsReading(0);
        clearData();
    }

    const clearData = () => {
        setSubjectsList([]);
        setCurrentSubjectID(null);
        setQuestionsList([]);
        setCurrentQuestionID(null);
    }

    const updateSubject = (event) => {
        const selectedSubjectID = event.target.value;
        setCurrentSubjectID(selectedSubjectID);
    }

    const fetchSubjectDataByType = async () => {
        try {
            setIsLargeLoading(true);

            const response = await fetch(`https://55cr1n59r3.execute-api.us-east-2.amazonaws.com/dev/v1/subjects/get-subjects?type=Reading&email=${email}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accesstoken}`
                }
            });

            setIsLargeLoading(false);
            console.log("response : ", response);

            const content = await response.json();
            console.log("content : ", content);
            if (content) {
                console.log("content.data.result : ", content);
                setSubjectsList(content);
            } else {
                if (content.status_code === 498 || content.status_code === 440) {
                    cookies.remove('access_token', { path: '/' });
                    cookies.remove('user_role', { path: '/' });
                    window.location.reload();
                }
                console.error('Error:', content);
            }
        } catch (error) {
            setIsLargeLoading(false);
            console.error('Error:', error);
        }
    };

    const fetchQuestionDataBySubjectID = async (subjectID) => {
        try {
            setIsQuestionLoading(true);

            const response = await fetch(`https://55cr1n59r3.execute-api.us-east-2.amazonaws.com/dev/v1/subjects/get-subject-questions?subjectId=${subjectID}&type=Reading&email=${email}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accesstoken}`
                }
            });

            setIsQuestionLoading(false);

            const content = await response.json();
            console.log("content : ", content);
            if (content) {
                const extractedQuestions = content.questions;
                setQuestionsList(extractedQuestions);

                if (extractedQuestions.length) {
                    setCurrentQuestionID(extractedQuestions[0].questionId);
                } else {
                    setCurrentQuestionID(null);
                }
            } else {
                if (content.status_code === 498 || content.status_code === 440) {
                    cookies.remove('access_token', { path: '/' });
                    cookies.remove('user_role', { path: '/' });
                    window.location.reload();
                }
                console.error('Error:', content);
            }
        } catch (error) {
            setIsQuestionLoading(false);
            console.error('Error:', error);
        }
    };

    const handleCardClick = (questionId) => {
        setCurrentQuestionID(questionId);
    }

    return (
        <>
            {user_role && <NavBar />}
            <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100 text-gray-900">
                {/* Left Panel */}
                <div className="p-4 bg-white border-r border-gray-200 shadow-lg text-gray-900 w-full lg:w-1/3 h-screen flex flex-col">
                    <div className="mb-4 flex-shrink-0">
                        <div className="flex justify-center">
                            <div className="grid grid-cols-1">
                                <div className="h-24"></div>
                                <div className="bg-gray-100 text-gray-500 rounded-lg inline-flex">
                                    <button
                                        className="w-full active-btn2 inline-flex justify-center items-center ease-in focus:outline-none hover:text-red-400 px-4 py-2"
                                    >
                                        <span className="text-xl lg:text-2xl px-2">Reading</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <p className="text-center lg:text-2xl md:text-xl font-light mt-4">
                            Read the following sentence aloud:
                        </p>
                        <select
                            id="subject_selector"
                            onChange={updateSubject}
                            className="bg-white mt-4 border border-gray-300 text-gray-900 text-xl rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 w-64 mx-auto lg:w-auto"
                        >
                            <option value="">Select subject</option>
                            {subjectsList.map((item, index) => (
                                <option value={item.subjectId} key={index}>
                                    {item.subject_name}
                                </option>
                            ))}
                        </select>
                    </div>
    
                    {/* Questions List with Scrollbars */}
                    <div className="overflow-hidden lg:h-full h-full pr-0">
                        <Scrollbars autoHide style={{ height: '100%' }}>
                            <div className="space-y-4 px-2">
                                {questionsList.map((question) => (
                                    <div
                                        key={question.questionId}
                                        onClick={() => handleCardClick(question.questionId)}
                                        className={`cursor-pointer w-full lg:w-90 mt-2 block p-6 bg-white border border-gray-200 rounded-lg shadow-lg 
                                            hover:bg-gray-100 overflow-hidden transition-all duration-300 ease-in-out
                                            ${currentQuestionID === question.questionId ? 'bg-blue-50 border-blue-400' : ''}`}
                                        onMouseEnter={() => setHoveredQuestionId(question.questionId)}
                                        onMouseLeave={() => setHoveredQuestionId(null)}
                                        style={{ height: hoveredQuestionId === question.questionId ? 'auto' : '10rem' }}
                                    >
                                        {/* Title */}
                                        <div
                                            className="mb-2 px-2 py-1 rounded-xl border-2 w-min border-red-300 bg-red-50 flex items-center"
                                        >
                                            <div className="h-2 w-2 mr-2 rounded-full bg-red-500"></div>
                                            <span className="text-lg font-semibold text-red-500">Reading</span>
                                        </div>
    
                                        {/* Description */}
                                        <div className="mt-3">
                                            <p className="font-normal text-gray-700 leading-tight">
                                                {hoveredQuestionId === question.questionId ? question.question.body : `${question.question.body.slice(0, 100)}${question.question.body.length > 50 ? '...' : ''}`}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Scrollbars>
                    </div>
                </div>
    
                {/* Center Panel */}
                <div className="flex-1 p-4 bg-white text-gray-900 flex items-center justify-center">
                    <div className="text-center">
                        {isQuestionLoading ? (
                            <LoadingSpinner />
                        ) : (
                            currentQuestionID ? (
                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                    <p className="mb-3 text-black" style={{ fontSize: '20px' }}>
                                        {questionsList.find(q => q.questionId === currentQuestionID)?.question.body}
                                    </p>
                                    <AudioRecorderComponent subjectId={currentSubjectID} questionId={currentQuestionID} />
                                </div>
                            ) : (
                                <p className="text-xl lg:text-2xl mt-4 mb-8">
                                    {questionsList.length ? "Select a question to start recording." : "No questions available."}
                                </p>
                            )
                        )}
                    </div>
                </div>
            </div>
    
            {isLargeLoading ? <LoadingScreenLarge /> : null}
        </>
    );
}
    export default HomePage;
    