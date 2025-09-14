import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { showSuccessToast, showErrorToast } from "./Notification";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { motion } from "framer-motion";
import { APIURL } from "../GlobalAPIURL";

export default function Login_tourist() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Load dark mode preference
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode) setDarkMode(savedMode === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(`${APIURL}LogInUser`, { email, password });
      if (res.data.status) {
        showSuccessToast(res.data.msg);
        // Save token and user data
        sessionStorage.setItem("token", res.data.data.token);
        sessionStorage.setItem("userId", res.data.data.id);
        sessionStorage.setItem("role", "tourist");
        navigate("/dashboard_tourist"); // redirect to tourist dashboard
      }
    } catch (err) {
      showErrorToast(err.response?.data?.msg || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const particlesInit = async (engine) => {
    await loadFull(engine);
  };

  const bgStyle = {
    backgroundImage: darkMode
      ? "url('https://images.unsplash.com/photo-1566475761078-432d3f7c0743?fit=max&fm=jpg&ixid=M3wzNTY3MHwwfDF8YWxsfHx8fHx8fHx8MTc0MTQxNjYxNHw&ixlib=rb-4.0.3&q=75&w=720&utm_medium=referral&utm_source=vocal.media')" // dark nature
      : "url('https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1950&q=80')", // bright tourist/travel
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  const textColor = darkMode ? "text-white" : "text-black";

  return (
    <div className={`min-h-screen flex items-center justify-center relative ${textColor}`} style={bgStyle}>
      <Particles
        init={particlesInit}
        options={{
          fullScreen: { enable: false },
          background: { color: "transparent" },
          fpsLimit: 60,
          particles: {
            number: { value: 50 },
            size: { value: { min: 1, max: 3 } },
            move: { speed: 1 },
            color: { value: darkMode ? "#fff" : "#000" },
            links: { enable: !darkMode, distance: 100, color: "#ddd", opacity: 0.2 },
          },
        }}
        className="absolute inset-0 -z-10"
      />

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`relative z-10 max-w-md w-[90%] p-10 rounded-3xl backdrop-blur-2xl border ${darkMode ? "bg-black/50 border-white/20" : "bg-white/30 border-white/20"} shadow-2xl`}
      >
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="absolute top-4 right-4 px-3 py-1 bg-white/30 rounded-full backdrop-blur hover:bg-white/50 transition"
        >
          {darkMode ? "Light" : "Dark"}
        </button>

        <h1 className="text-2xl font-bold text-center mb-6">Tourist Login</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={`w-full px-4 py-3 rounded-xl border focus:ring-2 outline-none ${darkMode ? "bg-black text-white border-white/50" : "bg-white text-black border-gray-300"}`}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={`w-full px-4 py-3 rounded-xl border focus:ring-2 outline-none ${darkMode ? "bg-black text-white border-white/50" : "bg-white text-black border-gray-300"}`}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-full font-semibold bg-blue-600 hover:bg-blue-700 transition disabled:opacity-60"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          <span>Forgot password? </span>
          <button
            className="underline"
            onClick={() => navigate("/forgot-password")}
          >
            Reset
          </button>
        </div>
      </motion.div>
    </div>
  );
}
