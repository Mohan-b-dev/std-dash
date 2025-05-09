import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  UserIcon,
  PencilIcon,
  EyeIcon,
  PlusIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [courseFilter, setCourseFilter] = useState("");
  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    course: "",
    degree: "",
    department: "",
    year: "",
  });
  const [editStudent, setEditStudent] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Mock API simulation
  useEffect(() => {
    const fetchStudents = () => {
      setTimeout(() => {
        const mockData = [
          {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            course: "Computer Science",
            degree: "BSc",
            department: "CS",
            year: "2023",
          },
          {
            id: 2,
            name: "Jane Smith",
            email: "jane@example.com",
            course: "Mathematics",
            degree: "BSc",
            department: "Math",
            year: "2024",
          },
          {
            id: 3,
            name: "Alice Johnson",
            email: "alice@example.com",
            course: "Computer Science",
            degree: "MSc",
            department: "CS",
            year: "2025",
          },
        ];
        setStudents(mockData);
        setFilteredStudents(mockData);
        setLoading(false);
      }, 1000);
    };
    fetchStudents();
  }, []);

  // Firebase authentication check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);

  // Filter students by course
  useEffect(() => {
    if (courseFilter) {
      setFilteredStudents(
        students.filter((student) =>
          student.course.toLowerCase().includes(courseFilter.toLowerCase())
        )
      );
    } else {
      setFilteredStudents(students);
    }
  }, [courseFilter, students]);

  const handleAddStudentChange = (e) => {
    setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
  };

  const handleEditStudentChange = (e) => {
    setEditStudent({ ...editStudent, [e.target.name]: e.target.value });
  };

  const validateForm = (data) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (
      !data.name ||
      !data.email ||
      !data.course ||
      !data.degree ||
      !data.department ||
      !data.year
    ) {
      toast.error("All fields are required");
      return false;
    }
    if (!emailRegex.test(data.email)) {
      toast.error("Invalid email format");
      return false;
    }
    return true;
  };

  const handleAddStudent = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please log in to add a student");
      navigate("/login");
      return;
    }
    if (!validateForm(newStudent)) return;
    const newStudentData = {
      id: students.length + 1,
      ...newStudent,
    };
    setStudents([...students, newStudentData]);
    setFilteredStudents([...filteredStudents, newStudentData]);
    setNewStudent({
      name: "",
      email: "",
      course: "",
      degree: "",
      department: "",
      year: "",
    });
    toast.success("Student added successfully");
  };

  const handleEditStudent = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please log in to edit a student");
      navigate("/login");
      return;
    }
    if (!validateForm(editStudent)) return;
    const updatedStudents = students.map((student) =>
      student.id === editStudent.id ? editStudent : student
    );
    setStudents(updatedStudents);
    setFilteredStudents(updatedStudents);
    setEditStudent(null);
    toast.success("Student updated successfully");
  };

  const viewStudent = (student) => {
    navigate(`/student/${student.id}`, { state: { student } });
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4 relative overflow-hidden">
      {/* Cosmic galaxy background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,255,255,0.15)_0%,_transparent_80%)]">
        <div className="absolute w-[600px] h-[600px] bg-gradient-to-r from-purple-600/30 to-cyan-600/30 rounded-full blur-3xl top-0 left-0 animate-swirl"></div>
        <div className="absolute w-[500px] h-[500px] bg-gradient-to-r from-pink-600/30 to-blue-600/30 rounded-full blur-3xl bottom-0 right-0 animate-swirl delay-2000"></div>
        <div className="absolute w-2 h-2 bg-cyan-400 rounded-full top-1/4 left-1/5 animate-comet"></div>
        <div className="absolute w-2 h-2 bg-pink-400 rounded-full bottom-1/3 right-1/4 animate-comet delay-1000"></div>
        <div className="absolute w-1 h-1 bg-purple-300 rounded-full top-1/2 left-3/4 animate-pulse-star"></div>
        <div className="absolute w-1 h-1 bg-blue-300 rounded-full bottom-1/4 left-1/4 animate-pulse-star delay-1500"></div>
        <div className="absolute w-3 h-3 bg-white/50 rounded-full top-2/3 right-1/5 animate-orbit-comet"></div>
      </div>

      <div className="bg-black/80 backdrop-blur-3xl p-8 rounded-3xl w-full max-w-6xl border border-cyan-500/40 shadow-[0_0_50px_rgba(0,255,255,0.5)] transition-all hover:shadow-[0_0_70px_rgba(0,255,255,0.7)] relative overflow-hidden group">
        {/* Holographic overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/15 via-pink-500/15 to-purple-500/15 opacity-60 animate-gradient-x group-hover:-translate-x-1 group-hover:-translate-y-1 transition-transform duration-500"></div>

        <div className="flex justify-end mb-6">
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-red-600 to-red-800 text-white py-2 px-4 rounded-xl font-bold shadow-[0_0_20px_rgba(255,0,0,0.5)] hover:shadow-[0_0_30px_rgba(255,0,0,0.7)] transition-all duration-300 transform hover:scale-105 font-futuristic"
            aria-label="Log out"
          >
            Logout
          </button>
        </div>

        <h2 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-400 animate-text-glow font-futuristic mb-6">
          Cosmic Student Management
        </h2>

        {/* Filter Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-100 mb-1 font-futuristic">
            Filter by Course
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className="relative">
                <FunnelIcon className="w-5 h-5 text-cyan-400 group-hover:animate-orbit-ring" />
                <div className="absolute inset-0 border-2 border-cyan-400/50 rounded-full animate-spin-slow group-hover:animate-spin-fast"></div>
              </div>
            </div>
            <input
              type="text"
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="w-full pl-10 pr-3 py-3 bg-black/30 border border-cyan-500/50 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all duration-300 font-futuristic animate-neon-trail"
              placeholder="Enter course name"
              aria-label="Filter by course"
            />
          </div>
        </div>

        {/* Student List */}
        {loading ? (
          <p className="text-center text-gray-100 font-futuristic">
            Scanning the Cosmos...
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-black/50">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-100 font-futuristic">
                    Name
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-100 font-futuristic">
                    Email
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-100 font-futuristic">
                    Course
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-100 font-futuristic">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="border-b border-cyan-500/20 hover:bg-black/60 transition-all"
                  >
                    <td className="px-4 py-2 text-gray-100 font-futuristic">
                      {student.name}
                    </td>
                    <td className="px-4 py-2 text-gray-100 font-futuristic">
                      {student.email}
                    </td>
                    <td className="px-4 py-2 text-gray-100 font-futuristic">
                      {student.course}
                    </td>
                    <td className="px-4 py-2 flex gap-2">
                      <button
                        onClick={() => viewStudent(student)}
                        className="text-cyan-400 hover:text-cyan-300 transition-colors"
                        title="View Details"
                        aria-label="View student details"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setEditStudent(student)}
                        className="text-purple-400 hover:text-purple-300 transition-colors"
                        title="Edit Student"
                        aria-label="Edit student"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add Student Form */}
        <div className="mt-8">
          <h3 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-200/50 to-cyan-300/50 static-glow font-futuristic">
            Add New Cosmic Entity
          </h3>
          <form onSubmit={handleAddStudent} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["name", "email", "course", "degree", "department", "year"].map(
                (field) => (
                  <div key={field} className="relative group">
                    <label className="block text-sm font-medium text-gray-100 mb-1 font-futuristic capitalize">
                      {field}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <div className="relative">
                          <UserIcon className="w-5 h-5 text-pink-400 group-hover:animate-orbit-ring" />
                          <div className="absolute inset-0 border-2 border-pink-400/50 rounded-full animate-spin-slow group-hover:animate-spin-fast"></div>
                        </div>
                      </div>
                      <input
                        type={field === "email" ? "email" : "text"}
                        name={field}
                        value={newStudent[field]}
                        onChange={handleAddStudentChange}
                        className="w-full pl-10 pr-3 py-3 bg-black/30 border border-pink-500/50 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-pink-400 transition-all duration-300 font-futuristic animate-neon-trail"
                        placeholder={`Enter ${field}`}
                        required
                        aria-label={`Enter student ${field}`}
                      />
                    </div>
                  </div>
                )
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500/70 to-purple-500/70 text-white py-3 rounded-xl font-bold shadow-[0_0_20px_rgba(0,255,255,0.6)] hover:shadow-[0_0_30px_rgba(0,255,255,0.8)] transition-all duration-300 transform hover:scale-105 relative overflow-hidden group animate-aura-pulse-subtle font-futuristic"
              aria-label="Add new student"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <PlusIcon className="w-5 h-5" />
                Add Student
              </span>
              <span className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-150 rounded-full transition-transform duration-300 origin-center"></span>
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="absolute w-2 h-2 bg-cyan-200/70 rounded-full animate-particle-burst top-1/2 left-1/2"></span>
                <span className="absolute w-2 h-2 bg-pink-200/70 rounded-full animate-particle-burst top-1/2 left-1/2 delay-100"></span>
                <span className="absolute w-2 h-2 bg-purple-200/70 rounded-full animate-particle-burst top-1/2 left-1/2 delay-200"></span>
              </span>
            </button>
          </form>
        </div>

        {/* Edit Student Form */}
        {editStudent && (
          <div className="mt-8">
            <h3 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-200/50 to-cyan-300/50 static-glow font-futuristic">
              Edit Cosmic Entity
            </h3>
            <form onSubmit={handleEditStudent} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "name",
                  "email",
                  "course",
                  "degree",
                  "department",
                  "year",
                ].map((field) => (
                  <div key={field} className="relative group">
                    <label className="block text-sm font-medium text-gray-100 mb-1 font-futuristic capitalize">
                      {field}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <div className="relative">
                          <UserIcon className="w-5 h-5 text-purple-400 group-hover:animate-orbit-ring" />
                          <div className="absolute inset-0 border-2 border-purple-400/50 rounded-full animate-spin-slow group-hover:animate-spin-fast"></div>
                        </div>
                      </div>
                      <input
                        type={field === "email" ? "email" : "text"}
                        name={field}
                        value={editStudent[field]}
                        onChange={handleEditStudentChange}
                        className="w-full pl-10 pr-3 py-3 bg-black/30 border border-purple-500/50 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-all duration-300 font-futuristic animate-neon-trail"
                        placeholder={`Enter ${field}`}
                        required
                        aria-label={`Edit student ${field}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500/70 to-purple-500/70 text-white py-3 rounded-xl font-bold shadow-[0_0_20px_rgba(0,255,255,0.6)] hover:shadow-[0_0_30px_rgba(0,255,255,0.8)] transition-all duration-300 transform hover:scale-105 relative overflow-hidden group animate-aura-pulse-subtle font-futuristic"
                  aria-label="Update student"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <PencilIcon className="w-5 h-5" />
                    Update Student
                  </span>
                  <span className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-150 rounded-full transition-transform duration-300 origin-center"></span>
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="absolute w-2 h-2 bg-cyan-200/70 rounded-full animate-particle-burst top-1/2 left-1/2"></span>
                    <span className="absolute w-2 h-2 bg-pink-200/70 rounded-full animate-particle-burst top-1/2 left-1/2 delay-100"></span>
                    <span className="absolute w-2 h-2 bg-purple-200/70 rounded-full animate-particle-burst top-1/2 left-1/2 delay-200"></span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditStudent(null)}
                  className="w-full bg-gradient-to-r from-gray-500/70 to-gray-700/70 text-white py-3 rounded-xl font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all duration-300 transform hover:scale-105 font-futuristic"
                  aria-label="Cancel edit"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
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
          @keyframes text-glow-subtle {
            0%, 100% { text-shadow: 0 0 10px rgba(0, 255, 255, 0.5); }
            50% { text-shadow: 0 0 20px rgba(0, 255, 255, 0.7); }
          }
          @keyframes neon-trail {
            0%, 100% { box-shadow: 0 0 10px rgba(0, 255, 255, 0.4); }
            50% { box-shadow: 0 0 20px rgba(0, 255, 255, 0.8); }
          }
          @keyframes aura-pulse {
            0%, 100% { box-shadow: 0 0 30px rgba(0, 255, 255, 0.8); }
            50% { box-shadow: 0 0 50px rgba(0, 255, 255, 1); }
          }
          @keyframes aura-pulse-subtle {
            0%, 100% { box-shadow: 0 0 20px rgba(0, 255, 255, 0.6); }
            50% { box-shadow: 0 0 30px rgba(0, 255, 255, 0.8); }
          }
          @keyframes particle-burst {
            0% { transform: translate(0, 0); opacity: 1; }
            100% { transform: translate(30px, -30px); opacity: 0; }
          }
          .static-glow {
            text-shadow: 0 0 8px rgba(0, 255, 255, 0.4);
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
          .animate-text-glow-subtle {
            animation: text-glow-subtle 4s ease-in-out infinite;
          }
          .animate-neon-trail {
            animation: neon-trail 5s ease-in-out infinite;
          }
          .animate-aura-pulse {
            animation: aura-pulse 6s ease-in-out infinite;
          }
          .animate-aura-pulse-subtle {
            animation: aura-pulse-subtle 6s ease-in-out infinite;
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

export default Dashboard;
