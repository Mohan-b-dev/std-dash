import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  auth,
  db,
  collection,
  query,
  where,
  getDocs,
} from "../services/firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaUser,
  FaGraduationCap,
  FaUniversity,
  FaCalendarAlt,
  FaBook,
  FaSignOutAlt,
  FaChartLine,
  FaCalendar,
} from "react-icons/fa";

// Mock API data
const mockApi = {
  getCourseProgress: (course) => ({
    course,
    progress: Math.floor(Math.random() * 100), // Random progress percentage
    lastUpdated: new Date().toLocaleDateString(),
  }),
  getUpcomingEvents: (department, year) => [
    {
      id: 1,
      title: `${department} Seminar`,
      date: "2025-05-15",
      description: `A seminar for ${year} year students in ${department}.`,
    },
    {
      id: 2,
      title: "Career Workshop",
      date: "2025-05-20",
      description: "Explore career opportunities for your degree.",
    },
  ],
};

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [courseProgress, setCourseProgress] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Fetch user data from Firestore
          const q = query(
            collection(db, "users"),
            where("uid", "==", user.uid)
          );
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0].data();
            setUserData(userDoc);

            // Fetch mock API data
            setCourseProgress(mockApi.getCourseProgress(userDoc.course));
            setUpcomingEvents(
              mockApi.getUpcomingEvents(userDoc.department, userDoc.year)
            );
          } else {
            toast.error("User data not found.");
            navigate("/login");
          }
        } catch (error) {
          toast.error("Error fetching user data: " + error.message);
        }
      } else {
        navigate("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch (error) {
      toast.error("Error logging out: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-cyan-400 text-2xl font-futuristic animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-black px-4 sm:px-6 lg:px-8 py-8 relative overflow-hidden">
      {/* Cosmic galaxy background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,255,255,0.15)_0%,_transparent_80%)]">
        <div className="absolute w-[600px] h-[600px] bg-gradient-to-r from-purple-600/30 to-cyan-600/30 rounded-full blur-3xl top-0 left-0 animate-swirl"></div>
        <div className="absolute w-[500px] h-[500px] bg-gradient-to-r from-pink-600/30 to-blue-600/30 rounded-full blur-3xl bottom-0 right-0 animate-swirl delay-2000"></div>
        <div className="absolute w-2 h-2 bg-cyan-400 rounded-full top-1/4 left-1/5 animate-comet"></div>
        <div className="absolute w-2 h-2 bg-pink-400 rounded-full bottom-1/3 right-1/4 animate-comet delay-1000"></div>
      </div>

      {/* Dashboard Content */}
      <div className="bg-black/80 backdrop-blur-3xl p-12 rounded-3xl w-full max-w-6xl mx-auto border border-cyan-500/40 shadow-[0_0_50px_rgba(0,255,255,0.5)] transition-all hover:shadow-[0_0_70px_rgba(0,255,255,0.7)] relative overflow-hidden group mt-8">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/15 via-pink-500/15 to-purple-500/15 opacity-60 animate-gradient-x group-hover:-translate-x-1 group-hover:-translate-y-1 transition-transform duration-500"></div>

        {/* Header and Logout Button */}
        <div className="flex justify-between items-center mb-10">
          <div className="text-center flex-1">
            <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-teal-400 to-green-500 animate-text-glow opacity-80">
              Welcome, {userData?.name || "User"}
            </h2>
            <p className="text-gray-100 mt-3 text-lg font-futuristic">
              Your Academic Dashboard
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-cyan-600 to-purple-600 text-white py-2 px-4 rounded-xl font-bold shadow-[0_0_20px_rgba(0,255,255,0.8)] hover:shadow-[0_0_30px_rgba(0,255,255,1)] transition-all duration-300 transform hover:scale-105 relative overflow-hidden group animate-aura-pulse"
          >
            <span className="relative z-10 font-futuristic flex items-center space-x-2">
              <FaSignOutAlt />
              <span>Logout</span>
            </span>
            <span className="absolute inset-0 bg-white/40 scale-0 group-hover:scale-150 rounded-full transition-transform duration-300 origin-center"></span>
          </button>
        </div>

        {/* Two-Column Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Side: Profile Data */}
          <div className="lg:w-1/3 bg-black/30 p-6 rounded-lg border border-cyan-500/50">
            <h3 className="text-2xl font-bold text-cyan-400 mb-6 font-futuristic">
              Profile
            </h3>
            <div className="space-y-6">
              <div className="relative group">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <FaUser className="text-cyan-400 group-hover:animate-orbit-ring" />
                    <div className="absolute inset-0 border-2 border-cyan-400/50 rounded-full animate-spin-slow group-hover:animate-spin-fast"></div>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm font-futuristic">
                      Name
                    </p>
                    <p className="text-gray-100 text-lg font-futuristic">
                      {userData?.name}
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <FaUser className="text-purple-400 group-hover:animate-orbit-ring" />
                    <div className="absolute inset-0 border-2 border-purple-400/50 rounded-full animate-spin-slow group-hover:animate-spin-fast"></div>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm font-futuristic">
                      Email
                    </p>
                    <p className="text-gray-100 text-lg font-futuristic">
                      {userData?.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <FaGraduationCap className="text-pink-400 group-hover:animate-orbit-ring" />
                    <div className="absolute inset-0 border-2 border-pink-400/50 rounded-full animate-spin-slow group-hover:animate-spin-fast"></div>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm font-futuristic">
                      Degree
                    </p>
                    <p className="text-gray-100 text-lg font-futuristic">
                      {userData?.degree}
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <FaUniversity className="text-purple-400 group-hover:animate-orbit-ring" />
                    <div className="absolute inset-0 border-2 border-purple-400/50 rounded-full animate-spin-slow group-hover:animate-spin-fast"></div>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm font-futuristic">
                      Department
                    </p>
                    <p className="text-gray-100 text-lg font-futuristic">
                      {userData?.department}
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <FaCalendarAlt className="text-cyan-400 group-hover:animate-orbit-ring" />
                    <div className="absolute inset-0 border-2 border-cyan-400/50 rounded-full animate-spin-slow group-hover:animate-spin-fast"></div>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm font-futuristic">
                      Year
                    </p>
                    <p className="text-gray-100 text-lg font-futuristic">
                      {userData?.year}
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <FaBook className="text-pink-400 group-hover:animate-orbit-ring" />
                    <div className="absolute inset-0 border-2 border-pink-400/50 rounded-full animate-spin-slow group-hover:animate-spin-fast"></div>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm font-futuristic">
                      Course
                    </p>
                    <p className="text-gray-100 text-lg font-futuristic">
                      {userData?.course}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Other Details */}
          <div className="lg:w-2/3 space-y-8">
            {/* Course Progress Tracker */}
            <div>
              <h3 className="text-2xl font-bold text-cyan-400 mb-4 font-futuristic">
                Course Progress
              </h3>
              <div className="relative group bg-black/30 p-6 rounded-lg border border-cyan-500/50">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="relative">
                    <FaChartLine className="text-cyan-400 group-hover:animate-orbit-ring" />
                    <div className="absolute inset-0 border-2 border-cyan-400/50 rounded-full animate-spin-slow group-hover:animate-spin-fast"></div>
                  </div>
                  <div>
                    <p className="text-gray-100 text-lg font-futuristic">
                      {courseProgress?.course}
                    </p>
                    <p className="text-gray-400 text-sm font-futuristic">
                      Last Updated: {courseProgress?.lastUpdated}
                    </p>
                  </div>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-cyan-400 to-purple-400 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${courseProgress?.progress}%` }}
                  ></div>
                </div>
                <p className="text-gray-100 text-sm mt-2 font-futuristic">
                  {courseProgress?.progress}% Complete
                </p>
              </div>
            </div>

            {/* Upcoming Events */}
            <div>
              <h3 className="text-2xl font-bold text-cyan-400 mb-4 font-futuristic">
                Upcoming Events
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="relative group bg-black/30 p-6 rounded-lg border border-pink-500/50"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <FaCalendar className="text-pink-400 group-hover:animate-orbit-ring" />
                        <div className="absolute inset-0 border-2 border-pink-400/50 rounded-full animate-spin-slow group-hover:animate-spin-fast"></div>
                      </div>
                      <div>
                        <p className="text-gray-100 text-lg font-futuristic">
                          {event.title}
                        </p>
                        <p className="text-gray-400 text-sm font-futuristic">
                          {event.date}
                        </p>
                        <p className="text-gray-100 text-sm mt-2 font-futuristic">
                          {event.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
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
          @keyframes aura-pulse {
            0%, 100% { box-shadow: 0 0 30px rgba(0, 255, 255, 0.8); }
            50% { box-shadow: 0 0 50px rgba(0, 255, 255, 1); }
          }
          .animate-swirl {
            animation: swirl 10s infinite;
          }
          .animate-comet {
            animation: comet 8s infinite;
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
          .animate-aura-pulse {
            animation: aura-pulse 6s ease-in-out infinite;
          }
          .font-futuristic {
            font-family: 'Orbitron', sans-serif;
          }
        `}
      </style>
    </div>
  );
};

export default Dashboard;
