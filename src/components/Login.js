import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEnvelope, FaLock } from "react-icons/fa";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      toast.success("Login Success!", {
        autoClose: 3000,
        onClose: () => navigate("/dashboard"),
      });
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4 relative overflow-hidden">
      {/* Cosmic galaxy background with swirling nebulae and moving objects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,255,255,0.15)_0%,_transparent_80%)]">
        <div className="absolute w-[600px] h-[600px] bg-gradient-to-r from-purple-600/30 to-cyan-600/30 rounded-full blur-3xl top-0 left-0 animate-swirl"></div>
        <div className="absolute w-[500px] h-[500px] bg-gradient-to-r from-pink-600/30 to-blue-600/30 rounded-full blur-3xl bottom-0 right-0 animate-swirl delay-2000"></div>
        <div className="absolute w-2 h-2 bg-cyan-400 rounded-full top-1/4 left-1/5 animate-comet"></div>
        <div className="absolute w-2 h-2 bg-pink-400 rounded-full bottom-1/3 right-1/4 animate-comet delay-1000"></div>
        <div className="absolute w-1 h-1 bg-purple-300 rounded-full top-1/2 left-3/4 animate-pulse-star"></div>
        <div className="absolute w-1 h-1 bg-blue-300 rounded-full bottom-1/4 left-1/4 animate-pulse-star delay-1500"></div>
        <div className="absolute w-3 h-3 bg-white/50 rounded-full top-2/3 right-1/5 animate-orbit-comet"></div>
      </div>

      <div className="bg-black/80 backdrop-blur-3xl p-12 rounded-3xl w-full max-w-lg border border-cyan-500/40 shadow-[0_0_50px_rgba(0,255,255,0.5)] transition-all hover:shadow-[0_0_70px_rgba(0,255,255,0.7)] hover:-translate-y-2 relative overflow-hidden group">
        {/* Holographic prism overlay with parallax */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/15 via-pink-500/15 to-purple-500/15 opacity-60 animate-gradient-x group-hover:-translate-x-1 group-hover:-translate-y-1 transition-transform duration-500"></div>
        <div className="text-center mb-10">
          <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-400 animate-text-glow">
            Login
          </h2>
          <p className="text-gray-100 mt-3 text-lg font-futuristic">
            Access the Cosmic Grid
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className="relative">
                <FaEnvelope className="text-pink-400 group-hover:animate-orbit-ring transition-all duration-300" />
                <div className="absolute inset-0 border-2 border-pink-400/50 rounded-full animate-spin-slow group-hover:animate-spin-fast"></div>
              </div>
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full pl-10 pr-3 py-3 bg-black/30 border border-pink-500/50 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-pink-400 transition-all duration-300 font-futuristic animate-neon-trail"
              required
            />
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className="relative">
                <FaLock className="text-purple-400 group-hover:animate-orbit-ring transition-all duration-300" />
                <div className="absolute inset-0 border-2 border-purple-400/50 rounded-full animate-spin-slow group-hover:animate-spin-fast"></div>
              </div>
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full pl-10 pr-3 py-3 bg-black/30 border border-purple-500/50 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-all duration-300 font-futuristic animate-neon-trail"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 text-white py-3 rounded-xl font-bold shadow-[0_0_30px_rgba(0,255,255,0.8)] hover:shadow-[0_0_50px_rgba(0,255,255,1)] transition-all duration-300 transform hover:scale-105 relative overflow-hidden group animate-aura-pulse"
          >
            <span className="relative z-10 font-futuristic">Login</span>
            <span className="absolute inset-0 bg-white/40 scale-0 group-hover:scale-150 rounded-full transition-transform duration-300 origin-center"></span>
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="absolute w-2 h-2 bg-cyan-300 rounded-full animate-particle-burst top-1/2 left-1/2"></span>
              <span className="absolute w-2 h-2 bg-pink-300 rounded-full animate-particle-burst top-1/2 left-1/2 delay-100"></span>
              <span className="absolute w-2 h-2 bg-purple-300 rounded-full animate-particle-burst top-1/2 left-1/2 delay-200"></span>
            </span>
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-200 text-sm font-futuristic">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors duration-300"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>

      {/* Tailwind CSS animation keyframes */}
      <style>
        {`
          @keyframes swirl {
            0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.6; }
            50% { transform: scale(1.2) rotate(180deg); opacity: 1; }
          }
          @keyframes comet {
            0% { transform: translate(0, 0); opacity: 1; }
            50% { transform: translate(100px, -100px); opacity: 0.3; }
            100% { transform: translate(0, 0); opacity: 1; }
          }
          @keyframes pulse-star {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.5); }
          }
          @keyframes orbit-comet {
            0% { transform: translate(0, 0); }
            25% { transform: translate(50px, -50px); }
            50% { transform: translate(100px, 0); }
            75% { transform: translate(50px, 50px); }
            100% { transform: translate(0, 0); }
          }
          @keyframes orbit-ring {
            0% { transform: rotate(0deg) translateX(10px) rotate(0deg); }
            100% { transform: rotate(360deg) translateX(10px) rotate(-360deg); }
          }
          @keyframes spin-slow {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes spin-fast {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(720deg); }
          }
          @keyframes gradient-x {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes text-glow {
            0%, 100% { text-shadow: 0 0 15px rgba(0, 255, 255, 0.8); }
            50% { text-shadow: 0 0 30px rgba(0, 255, 255, 1); }
          }
          @keyframes neon-trail {
            0%, 100% { box-shadow: 0 0 10px rgba(0, 255, 255, 0.4); }
            50% { box-shadow: 0 0 20px rgba(0, 255, 255, 0.8); }
          }
          @keyframes aura-pulse {
            0%, 100% { box-shadow: 0 0 30px rgba(0, 255, 255, 0.8); }
            50% { box-shadow: 0 0 50px rgba(0, 255, 255, 1); }
          }
          @keyframes particle-burst {
            0% { transform: translate(0, 0); opacity: 1; }
            100% { transform: translate(30px, -30px); opacity: 0; }
          }
          .animate-swirl {
            animation: swirl 10s infinite;
          }
          .animate-comet {
            animation: comet 8s infinite;
          }
          .animate-pulse-star {
            animation: pulse-star 3s infinite;
          }
          .animate-orbit-comet {
            animation: orbit-comet 12s infinite linear;
          }
          .animate-orbit-ring {
            animation: orbit-ring 3s infinite linear;
          }
          .animate-spin-slow {
            animation: spin-slow 10s infinite linear;
          }
          .animate-spin-fast {
            animation: spin-fast 2s infinite linear;
          }
          .animate-gradient-x {
            background-size: 200% 200%;
            animation: gradient-x 10s ease infinite;
          }
          .animate-text-glow {
            animation: text-glow 4s ease-in-out infinite;
          }
          .animate-neon-trail {
            animation: neon-trail 5s ease-in-out infinite;
          }
          .animate-aura-pulse {
            animation: aura-pulse 6s ease-in-out infinite;
          }
          .animate-particle-burst {
            animation: particle-burst 0.5s ease-out forwards;
          }
          .font-futuristic {
            font-family: 'Orbitron', sans-serif;
          }
        `}
      </style>
    </div>
  );
};

export default Login;
