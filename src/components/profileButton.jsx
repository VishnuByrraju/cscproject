import { useState, useEffect, useRef } from 'react';
import Cookies from 'universal-cookie';
import LogoutComponent from './LogoutComponent';
import { Link } from 'react-router-dom';
import profile from '../assets/profile.png'; 

const cookies = new Cookies();

const BASE_URL = "http://localhost:5000"

const ProfileButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [userMail, setUserMail] = useState('');
  const [userName, setUserName] = useState('');
  const accessToken = cookies.get("access_token");
  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`${BASE_URL}/v1/my-profile`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserMail(data.data.email);
        setUserName(data.data.first_name + ' ' + data.data.last_name);
      } else {
        console.error('Failed to fetch user profile:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    fetchUserProfile();
  }, [userMail, userName]);

  // Define a class for text color based on dark mode
  const textColorClass = isOpen ? "text-black" : "text-gray-900 ";

  return (

    <div ref={dropdownRef} className="relative inline-block text-left">
      <img
        onClick={toggleDropdown}
        className="w-12 h-12 p-1 bg-cover bg-center rounded-full ring-2 ring-blue-300 "
        src={profile}
        alt="Bordered avatar"
      />

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            
            <div className={`px-4 py-3 text-sm ${textColorClass}`}>
              <div>{userName}</div>
              <div className="font-medium truncate">{userMail}</div>
            </div>

            <button
              className={`w-full text-left px-4 py-2 text-sm ${textColorClass} hover:bg-gray-100`}
              onClick={() => console.log('Action 1')} >
              <Link
                to="/profile">
                Manage Profile
              </Link>
            </button>

            <button className={`w-full text-left px-4 py-2 text-sm ${textColorClass} hover:bg-gray-100`}>
              <Link
                to="/getresults">
                My Results
              </Link>
            </button>


            <LogoutComponent />

          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileButton;
