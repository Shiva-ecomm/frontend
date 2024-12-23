import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { message } from 'antd';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import host from '../APIRoute/host';
import { ClipLoader } from 'react-spinners';
import { FaUserAlt, FaPhoneAlt, FaEnvelope, FaUserCog } from 'react-icons/fa'; // Icons for user profile

const ProfilePage = () => {
  const [user, setUser] = useState({});
  const params = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${host}/user/getUser/${params?.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (data.success) {
        setUser(data.user);
      }
    } catch (error) {
      message.error('Something went wrong');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (loading) return <div className="flex justify-center items-center min-h-screen"><ClipLoader /></div>;

  return (
    <>
      <Header />
      <div className="profile-container py-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-gray-200">User Profile</h1>
          <div className="user-details space-y-6">
            <div className="details flex items-center space-x-4">
              <FaUserAlt className="text-gray-600 dark:text-gray-400" />
              <span className="label text-gray-700 dark:text-gray-300">Name:</span>
              <span className="text-gray-900 dark:text-gray-100">{user?.name}</span>
            </div>
            <div className="details flex items-center space-x-4">
              <FaPhoneAlt className="text-gray-600 dark:text-gray-400" />
              <span className="label text-gray-700 dark:text-gray-300">Phone:</span>
              <span className="text-gray-900 dark:text-gray-100">{user?.phone}</span>
            </div>
            <div className="details flex items-center space-x-4">
              <FaEnvelope className="text-gray-600 dark:text-gray-400" />
              <span className="label text-gray-700 dark:text-gray-300">Email:</span>
              <span className="text-gray-900 dark:text-gray-100">{user?.email}</span>
            </div>
            <div className="details flex items-center space-x-4">
              <FaUserCog className="text-gray-600 dark:text-gray-400" />
              <span className="label text-gray-700 dark:text-gray-300">User Type:</span>
              <span className="text-gray-900 dark:text-gray-100">{user?.isAdmin ? 'Admin' : 'User'}</span>
            </div>
          </div>
          {/* Uncomment if you want to add password change functionality */}
          {/* <div className="password-details mt-8">
            <h2 className="subtitle text-lg font-semibold text-gray-800 dark:text-gray-200">Change Password</h2>
            <div className="details space-y-4">
              <div className="details">
                <label className="label">Old Password:</label>
                <input type="password" name="old-password" placeholder="Old Password" className="input-field" />
              </div>
              <div className="details">
                <label className="label">New Password:</label>
                <input type="password" name="new-password" placeholder="New Password" className="input-field" />
              </div>
              <div className="details">
                <label className="label">Confirm New Password:</label>
                <input type="password" name="confirm-new-password" placeholder="Confirm New Password" className="input-field" />
              </div>
              <div className="details">
                <button type="button" className="update-btn">Update Password</button>
              </div>
            </div>
          </div> */}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProfilePage;
