import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { APIURL } from '../GlobalAPIURL';

export default function Signin() {
  const [darkMode, setDarkMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loadingTourist, setLoadingTourist] = useState(false);
  const [loadingResearcher, setLoadingResearcher] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (role) => {
    if (!formData.name || !formData.email || !formData.password) {
      alert("⚠️ Please fill in all fields.");
      return;
    }

    try {
      if (role === "tourist") setLoadingTourist(true);
      else setLoadingResearcher(true);

      const res = await axios.post(`${APIURL}createuser`, { ...formData, role });

   if (res.data.status) {
  const user = res.data.data;
  const msg = res.data.msg;

  if (user.role !== role) {
    alert(`⚠️ This account is registered as ${user.role}. Please use the correct login page.`);
    return;
  }

  // Save session
  sessionStorage.setItem("userId", user._id);
  sessionStorage.setItem("email", user.email);
  sessionStorage.setItem("role", user.role);

  // 🚀 Silent redirect if already verified
  if (msg === "already_verified") {
    navigate(user.role === "tourist" ? "/login_tourist" : "/login_researcher");
  } else {
    navigate("/otp_verify");
  }
}


    } catch (err) {
      alert(err.response?.data?.msg || err.message);
    } finally {
      if (role === "tourist") setLoadingTourist(false);
      else setLoadingResearcher(false);
    }
  };



  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-10 bg-cover bg-center"
      style={{
        backgroundImage: darkMode
          ? "url('https://media.istockphoto.com/id/467763134/photo/winter-at-night-banff-national-park.jpg?s=612x612&w=0&k=20&c=ekdjW0-4S4ckabtW8gCIZ5aKJ4ZUyYksirGklhSRG1o=')"
          : "url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80')",
      }}
    >
      <div className={`absolute inset-0 -z-10 ${darkMode ? 'bg-black/60' : 'bg-black/30'}`} />

      <div className={`${darkMode ? 'bg-gray-800/90 text-white' : 'bg-white/80 text-black'} w-full max-w-2xl backdrop-blur-xl border rounded-2xl shadow-2xl p-8`}>
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-4 py-2 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition"
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">Create your account</h1>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-semibold mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
              className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 border-gray-300 focus:ring-green-300 text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 border-gray-300 focus:ring-green-300 text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 border-gray-300 focus:ring-green-300 text-black"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <button
              type="button"
              disabled={loadingTourist}
              onClick={() => handleSignup("tourist")}
              className="w-full bg-green-600 text-white py-3 rounded-full font-semibold hover:bg-green-700 transition disabled:opacity-50"
            >
              {loadingTourist ? "Processing..." : "Sign In as Tourist"}
            </button>

            <button
              type="button"
              disabled={loadingResearcher}
              onClick={() => handleSignup("researcher")}
              className="w-full bg-purple-600 text-white py-3 rounded-full font-semibold hover:bg-purple-700 transition disabled:opacity-50"
            >
              {loadingResearcher ? "Processing..." : "Sign In as Researcher"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
