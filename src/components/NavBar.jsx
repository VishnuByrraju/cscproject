import { Link } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import ProfileButton from "./profileButton";
import logo50 from '../assets/logo_50x50.png'; 
import coinicon from '../assets/coin.webp'; 
import Cookies from 'universal-cookie';

const cookies = new Cookies();
const BASE_URL = "http://localhost:5000";

function NavBar() {
    const accessToken = cookies.get("access_token");
    const [credits, setCredits] = useState(-1);
    
    useEffect(() => {
        fetchCredits();
    }, []);
    
    const fetchCredits = async () => {
        try {
            const response = await fetch(`${BASE_URL}/v1/get-student-credits?studentId=None`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            const data = await response.json();
            console.log("data", data);
            if (data.data && data.data.result) {
                setCredits(data.data.result.credits);
            }
            else{
                if (data.status_code === 498 || data.status_code === 440) {
                    cookies.remove('access_token', { path: '/' });
                    cookies.remove('user_role', { path: '/' });
                    window.location.reload();
                }
            }
        } catch (error) {
            console.error('Error fetching student credits:', error);
        }
    };

    return (
        <nav className="fixed w-screen top-0 left-0 right-0 bg-white border border-gray-100 z-10">
            <div className="max-w-screen-xl flex items-center justify-between mx-auto p-2">
                <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    {/* <img src={logo50} className="h-10" alt="Example"/> */}
                    <span className="self-center text-2xl font-semibold whitespace-nowrap">CSC Project</span>
                </Link>

                <button type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 " aria-controls="navbar-default" aria-expanded="false">
                    <span className="sr-only">Open main menu</span>
                </button>

                <div className="flex items-center">
                    {credits !== -1 && (
                        <div className="mr-5 py-1.5 px-2.5 text-sm font-medium flex items-center text-gray-900 bg-red-100 rounded-full border border-red-200 text-blue-700">
                            <div className="text-2xl mx-2 font-bold">{credits}</div>
                            <img className="h-7" src={coinicon} alt="" />
                        </div>
                    )}
                    <ProfileButton />
                </div>
            </div>
        </nav>
    );
}

export default NavBar;
