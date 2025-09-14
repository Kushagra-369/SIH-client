import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { showSuccessToast, showErrorToast } from "./Notification";
import { APIURL } from "../GlobalAPIURL";

export default function OTP_verification() {

    const navigate = useNavigate();

    const userId = sessionStorage.getItem("userId");
    const role = sessionStorage.getItem("role");
    const email = sessionStorage.getItem("email");

    const [code, setCode] = useState(new Array(4).fill(""));
    const [isLoading, setIsLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const [shake, setShake] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    // Load saved dark mode preference
    useEffect(() => {
        const savedMode = localStorage.getItem("darkMode");
        if (savedMode) setDarkMode(savedMode === "true");
    }, []);

    useEffect(() => {
        localStorage.setItem("darkMode", darkMode);
    }, [darkMode]);

    // Countdown timer
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setCanResend(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleResendOTP = async () => {
        if (!canResend) return;
        setCanResend(false);
        setTimeLeft(30);

        try {
            await axios.post(`${APIURL}ResendOTP/${userId}`);
            showSuccessToast("📩 New OTP has been sent to your email.");
        } catch (err) {
            showErrorToast(err.response?.data?.msg || err.message);
        }
    };

    const handleChange = (e, idx) => {
        const val = e.target.value;
        if (!/^\d?$/.test(val)) return;
        const newCode = [...code];
        newCode[idx] = val;
        setCode(newCode);
        if (val && idx < code.length - 1) {
            document.getElementById(`otp-input-${idx + 1}`).focus();
        }
    };

    const handleKeyDown = (e, idx) => {
        if (e.key === "Backspace" && !code[idx] && idx > 0) {
            document.getElementById(`otp-input-${idx - 1}`).focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const userOtp = code.join("");

        try {
            const res = await axios.post(`${APIURL}user_otp_verify/${userId}`, { otp: userOtp });
            if (res.data.status) {
                showSuccessToast(res.data.msg);
                if (role === "tourist") navigate("/login_tourist");
                else navigate("/login_researcher");
            }
        } catch (err) {
            setShake(true);
            setTimeout(() => setShake(false), 600);
            showErrorToast(err.response?.data?.msg || err.message || "OTP invalid");
        } finally {
            setIsLoading(false);
        }
    };

    const particlesInit = useCallback(async (engine) => {
        await loadFull(engine);
    }, []);

    const theme = darkMode
        ? "bg-[url('https://d2rdhxfof4qmbb.cloudfront.net/wp-content/uploads/20200127180747/iStock-607904588-1024x683.jpg')] bg-cover bg-center text-white"
        : "bg-[url('https://www.sotc.in/blog/wp-content/uploads/2023/08/mysterious-places-in-india.jpg')] bg-cover bg-center text-black";

    return (
        <div className={`min-h-screen relative overflow-hidden flex items-center justify-center ${theme}`}>
            <Particles
                init={particlesInit}
                options={{
                    fullScreen: { enable: false },
                    background: { color: darkMode ? "#000" : "transparent" },
                    fpsLimit: 60,
                    particles: {
                        number: { value: 80 },
                        size: { value: { min: 1, max: 3 } },
                        move: { speed: 1 },
                        color: { value: darkMode ? "#fff" : ["#fff", "#ff0", "#f00", "#00f"] },
                        links: { enable: !darkMode, distance: 100, color: "#ddd", opacity: 0.2 },
                    },
                }}
                className="absolute inset-0 -z-10"
            />

            {/* Floating blobs */}
            <div className="absolute inset-0 -z-20 overflow-hidden">
                <div className="absolute w-[500px] h-[500px] bg-yellow-400 opacity-30 rounded-full top-[-100px] left-[-150px] blur-3xl animate-pulse" />
                <div className="absolute w-[400px] h-[400px] bg-red-400 opacity-30 rounded-full bottom-[-100px] right-[-150px] blur-2xl animate-bounce" />
                <div className="absolute w-[350px] h-[350px] bg-blue-400 opacity-30 rounded-full top-[20%] left-[50%] blur-2xl animate-ping" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className={`relative z-10 max-w-md w-[90%] p-10 rounded-3xl backdrop-blur-2xl border ${darkMode ? "bg-black/50 border-white/20" : "bg-white/30 border-white/20"
                    } shadow-2xl`}
            >
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="absolute top-4 right-4 px-3 py-1 bg-white/30 rounded-full backdrop-blur hover:bg-white/50 transition"
                >
                    {darkMode ? "Light" : "Dark"}
                </button>

                <h1 className="text-xl text-center font-bold mb-2">{darkMode ? "Verify OTP" : "OTP Verification"}</h1>
                <p className="text-sm text-center mb-6">
                    Code sent to <strong>{email || "your email"}</strong>
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6">
                    <motion.div
                        animate={shake ? { x: [0, -10, 10, -10, 10, 0] } : {}}
                        transition={{ duration: 0.6 }}
                        className="flex gap-4"
                    >
                        {code.map((d, i) => (
                            <input
                                key={i}
                                id={`otp-input-${i}`}
                                type="text"
                                maxLength="1"
                                value={d}
                                autoComplete="off"
                                onChange={(e) => handleChange(e, i)}
                                onKeyDown={(e) => handleKeyDown(e, i)}
                                onFocus={(e) => e.target.select()}
                                className={`w-14 h-14 text-center text-lg font-bold rounded-xl border bg-white text-black shadow focus:ring-2 outline-none ${darkMode ? "bg-black text-black border-white/50" : ""
                                    }`}
                            />
                        ))}
                    </motion.div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 rounded-full font-semibold bg-blue-600 hover:bg-blue-700 transition disabled:opacity-60"
                    >
                        {isLoading ? "Verifying..." : "Verify Account"}
                    </button>
                </form>

                <div className="mt-6 text-sm flex gap-2 items-center justify-center">
                    <span>Didn't receive code?</span>
                    {canResend ? (
                        <button onClick={handleResendOTP} className="underline">
                            Resend
                        </button>
                    ) : (
                        <span>Resend in {timeLeft}s</span>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
