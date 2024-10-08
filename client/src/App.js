import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import AddPost from './pages/AddPost';
import AddParty from './pages/AddParty';
import ManageParty from './pages/ManageParty';
import ManageUsers from './pages/ManageUsers';
import SharingPage from './pages/SharingPage';
import TendorDetails from './pages/TendorDetails';
import ProtectedRoutes from './helpers/ProtectedRoute';
import ProfilePage from './pages/ProfilePage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import TendorInfo from './pages/TendorInfo';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ProtectedRoutes><Home /></ProtectedRoutes> } />
        <Route path="/add-tendor" element={<AddPost />} />
        <Route path="/add-party" element={
          <ProtectedRoutes><AddParty /></ProtectedRoutes>  } />
        <Route path="/manage-party" element={<ProtectedRoutes><ManageParty /></ProtectedRoutes>} />
        <Route path="/manage-users" element={<ProtectedRoutes><ManageUsers /></ProtectedRoutes>} />
        <Route path="/SharingPage/:clientId/:postId" element={<SharingPage />} />
        <Route path="/tendorDetails/:id" element={<TendorDetails />} />
        <Route path="/tendorInfo/:id" element={<TendorInfo />} />
        <Route path="/profile/:id" element={<ProfilePage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:id" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
