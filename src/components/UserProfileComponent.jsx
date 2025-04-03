import React, { useState, useEffect } from 'react';
import Cookies from 'universal-cookie';
import LoadingScreenLarge from "./LodingScreenLarge"; // Adjust the import path as needed
import NavBar from './NavBar'; // Adjust the import path as needed
import LoginSignUpPage from '../pages/LoginSignUpPage'; // Adjust the import path as needed
import PopupComponent from './PopupComponent';
import axios from "axios";


const cookies = new Cookies();

const BASE_URL  = "http://localhost:5000";

function ProfilePage() {
  
  const accesstoken = cookies.get("access_token");
  const userRole = cookies.get("user_role");
  const email = cookies.get("email");
  const [updateProfileSuccess, setUpdateProfileSuccess] = useState(false);
  const [updatePasswordSuccess, setUpdatePasswordSuccess] = useState(false);
  const [updatePasswordError, setUpdatePasswordError] = useState(false);
  const [updateProfileError, setUpdateProfileError] = useState(false);

  if(accesstoken === "undefined" || !accesstoken){        
      return (<LoginSignUpPage/>);
  }

  const [userData, setUserData] = useState({
    email: '',
    first_name: '',
    last_name: '',
  });

  const [originalUserData, setOriginalUserData] = useState({
    email: '',
    first_name: '',
    last_name: '',
  });

  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    retypeNewPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [tokenError, setTokenError] = useState('');
  const [userMail, setUserMail] = useState('');

  useEffect(() => {
    if (accesstoken) {
      fetchUserProfile();
    } else {
      setTokenError('Access token is missing. Please log in.');
    }
  }, [accesstoken]);


const fetchUserProfile = async () => {
    setLoading(true);
    try {
        const response = await axios.get(
            `https://55cr1n59r3.execute-api.us-east-2.amazonaws.com/dev/v1/user/get-profile?email=${email}`,
            {
                headers: {
                    Authorization: `Bearer ${accesstoken}`,
                },
            }
        );
        console.log(response.data);
        setUserMail(response.data.email);
        setUserData(response.data);
        setOriginalUserData(response.data); // Save original data to detect changes
    } catch (error) {
        if (error.response) {
            const { status } = error.response;
            if (status === 498 || status === 440) {
                cookies.remove("access_token", { path: "/" });
                cookies.remove("user_role", { path: "/" });
                window.location.reload();
            }
            console.error("Failed to fetch user profile:", error.response.statusText);
        } else {
            console.error("Error fetching user profile:", error.message);
        }
    }
    setLoading(false);
};


  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const response2 = await fetch(`https://55cr1n59r3.execute-api.us-east-2.amazonaws.com/dev/v1/user/edit-profile`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accesstoken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "body": {
          email,
          first_name: userData.first_name,
          last_name: userData.last_name,
          }
        }),
      });

      const response = await fetch(`https://55cr1n59r3.execute-api.us-east-2.amazonaws.com/dev/v1/user/edit-profile`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accesstoken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "body": {
          email,
          first_name: userData.first_name,
          last_name: userData.last_name,
          }
        }),
      });

      if (response.ok) {
        setUpdateProfileSuccess('Profile updated successfully');
        setOriginalUserData(userData); // Update original data after successful update
      } else {
        setUpdateProfileError('Error updating profile');
        console.error('Failed to update profile:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
    setLoading(false);
  };

  const handleUpdatePassword = async () => {
    const { newPassword } = passwordData;

    // Validate password
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?`~]).{8,}$/;
    if (!passwordPattern.test(newPassword)) {
      if (newPassword.length < 8) {
        setPasswordError('Password must be at least 8 characters long.');
      } else if (!/[A-Z]/.test(newPassword)) {
        setPasswordError('Password must contain at least one uppercase letter.');
      } else if (!/\d/.test(newPassword)) {
        setPasswordError('Password must contain at least one digit.');
      } else if (!/[!@#$%^&*()_+[\]{};':"\\|,.<>/?`~]/.test(newPassword)) {
        setPasswordError('Password must contain at least one special character.');
      }
      return;
    } else {
      setPasswordError('');
    }

    if (newPassword !== passwordData.retypeNewPassword) {
      alert('Passwords do not match');
      return;
    }

    setPasswordLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/v1/change-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accesstoken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userMail,
          role: userRole,
          password: newPassword,
        }),
      });

      if (response.ok) {
        setUpdatePasswordSuccess('Password changed successfully');
      } else {
        setUpdatePasswordError('Error changing password');
        console.error('Failed to change password:', response.statusText);
      }
    } catch (error) {
      console.error('Error changing password:', error);
    }
    setPasswordLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  const isProfileChanged = () => {
    return (
      userData.first_name !== originalUserData.first_name ||
      userData.last_name !== originalUserData.last_name
    );
  };

  if (tokenError) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="container max-w-md mx-auto p-8 bg-white shadow-md rounded-md text-center">
          <p className="text-red-500">{tokenError}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {userRole ? <NavBar /> : null}
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-8">
        <div className="container max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">

          <div className="flex flex-col lg:flex-row lg:space-x-8">
            <div className="w-full lg:w-full mb-8 lg:mb-0">
              <h2 className="text-xl mb-4">My Profile</h2>
              {loading ? (
                <LoadingScreenLarge />
              ) : (
                <>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={userData.email}
                      readOnly
                      className="w-full p-2 border rounded bg-gray-200 text-gray-700"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      name="first_name"
                      value={userData.first_name}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      name="last_name"
                      value={userData.last_name}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  {isProfileChanged() && (
                    <button
                      onClick={handleUpdateProfile}
                      className="px-4 py-2 text-white bg-primary rounded-lg hover:bg-red-800"
                      disabled={loading}
                    >
                      Update Details
                    </button>
                  )}
                </>
              )}
            </div>
              
              {updateProfileSuccess && (
                <PopupComponent content={updateProfileSuccess} contentType={"Update Profile Status"} redirectPath={""}/>
              )}
              {updateProfileError && (
                <PopupComponent content={updateProfileError} contentType={"Update Profile Status"} redirectPath={""}/>
              )}
              
          </div>
        </div>
      </div>
    </>
  );
  
}

export default ProfilePage;