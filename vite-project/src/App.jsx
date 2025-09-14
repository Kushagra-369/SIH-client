import React from 'react'
import Signin from './Components/Signin'
import OTP_verification from './Components/OTP_verification';
import Login_researcher from './Components/Login_researcher';
import Login_tourist from './Components/Login_tourist';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/otp_verify" element={<OTP_verification />} />
        <Route path="/login_researcher" element={<Login_researcher />} />
        <Route path="/login_tourist" element={<Login_tourist />} />
      </Routes>
    </BrowserRouter>
  )
}
