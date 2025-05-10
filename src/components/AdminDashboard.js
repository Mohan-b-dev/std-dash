import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db, collection, getDocs, doc, updateDoc, deleteDoc } from "../services/firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaSignOutAlt, FaUsers, FaEdit, FaTrash, FaSearch } from "react-icons/fa";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [nameQuery, setNameQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    degree: "",
    department: "",
    year: "",
    course: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (user.email === "test1@gmail.com") {
          try {
            const querySnapshot = await getDocs(collection(db, "users"));
            const usersData = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setUsers(usersData);
            setFilteredUsers(usersData);
          } catch (error) {
            toast.error("Error fetching users: " + error.message);
          }
        } else {
          toast.error("Unauthorized access. Admin credentials required.");
          navigate("/login");
        }
      } else {
        toast.error("Admin access required.");
        navigate("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  // Fixed course options (Bee removed)
  const courseOptions = ["Solana", "Full Stack", "Front-end", "Back-end"];

  const handleNameSearch = (e) => {
    const query = e.target.value;
    setNameQuery(query);
    filterUsers(query, selectedCourse);
  };

  const handleCourseSelect = (e) => {
    const course = e.target.value;
    setSelectedCourse(course);
    filterUsers(nameQuery, course);
  };

  const filterUsers = (nameQuery, selectedCourse) => {
    let filtered = users;
    if (nameQuery.trim()) {
      filtered = filtered.filter((user) =>
        user.name.toLowerCase().includes(nameQuery.toLowerCase())
      );
    }
    if (selectedCourse && selectedCourse !== "All Courses") {
      filtered = filtered.filter((user) => user.course === selectedCourse);
    }
    setFilteredUsers(filtered);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch (error) {
      toast.error("Error logging out: " + error.message);
    }
  };

  const openEditModal = (user, e) => {
    e.stopPropagation();
    console.log("Edit button clicked for user:", user.id);
    setEditUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      degree: user.degree,
      department: user.department,
      year: user.year,
      course: courseOptions.includes(user.course) ? user.course : courseOptions[0], // Default to first option if invalid
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const userRef = doc(db, "users", editUser.id);
      await updateDoc(userRef, formData);
      setUsers((prev) =>
        prev.map((user) =>
          user.id === editUser.id ? { ...user, ...formData } : user
        )
      );
      setFilteredUsers((prev) =>
        prev.map((user) =>
          user.id === editUser.id ? { ...user, ...formData } : user
        )
      );
      setEditUser(null);
      toast.success("User updated successfully!");
    } catch (error) {
      toast.error("Error updating user: " + error.message);
    }
  };

  const handleDelete = async (userId, e) => {
    e.stopPropagation();
    console.log("Delete button clicked for user:", userId);
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteDoc(doc(db, "users", userId));
        setUsers((prev) => prev.filter((user) => user.id !== userId));
        setFilteredUsers((prev) => prev.filter((user) => user.id !== userId));
        toast.success("User deleted successfully!");
      } catch (error) {
        toast.error("Error deleting user: " + error.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-cyan-400 text-2xl font-futuristic animate-pulse">Loading...</div>
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
            <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-400 animate-text-glow">
              Admin Control Hub
            </h2>
            <p className="text-gray-100 mt-3 text-lg font-futuristic">
              Manage Student Data
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

        {/* Search Bar and Course Dropdown */}
        <div className="mb-6 flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
          <div className="relative group flex-1">
            <input
              type="text"
              value={nameQuery}
              onChange={handleNameSearch}
              placeholder="Search by name..."
              className="w-full pl-3 pr-10 py-3 bg-black/30 border border-cyan-500/50 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all duration-300 font-futuristic animate-neon-trail"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <div className="relative">
                <FaSearch className="text-cyan-400 group-hover:animate-orbit-ring transition-all duration-300" />
                <div className="absolute inset-0 border-2 border-cyan-400/50 rounded-full animate-spin-slow group-hover:animate-spin-fast"></div>
              </div>
            </div>
          </div>
          <div className="relative group flex-1">
            <select
              value={selectedCourse}
              onChange={handleCourseSelect}
              className="w-full pl-3 pr-10 py-3 bg-black border border-cyan-500/50 rounded-lg text-gray-100 focus:outline-none focus:border-cyan-400 transition-all duration-300 font-futuristic animate-neon-trail appearance-none"
            >
              <option value="All Courses">All Courses</option>
              {courseOptions.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-cyan-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-black/30 p-6 rounded-lg border border-cyan-500/50">
          <h3 className="text-2xl font-bold text-cyan-400 mb-6 font-futuristic flex items-center">
            <FaUsers className="mr-2" /> All Users
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-gray-100 font-futuristic">
              <thead>
                <tr className="bg-cyan-500/20">
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Degree</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Year</th>
                  <th className="p-4">Course</th>
                  <th className="p-4 pl-20">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-cyan-500/20">
                      <td className="p-4">{user.name}</td>
                      <td className="p-4">{user.email}</td>
                      <td className="p-4">{user.degree}</td>
                      <td className="p-4">{user.department}</td>
                      <td className="p-4">{user.year}</td>
                      <td className="p-4">{user.course}</td>
                      <td className="p-4">
                        <div className="flex space-x-4">
                          <button
                            type="button"
                            onClick={(e) => openEditModal(user, e)}
                            className="flex items-center justify-center px-3 py-2 bg-cyan-500/20 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/30 rounded-lg transition-colors font-futuristic z-10"
                            title="Edit"
                          >
                            <FaEdit className="w-5 h-5 mr-1" /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleDelete(user.id, e)}
                            className="flex items-center justify-center px-3 py-2 bg-red-500/20 text-red-400 hover:text-red-300 hover:bg-red-500/30 rounded-lg transition-colors font-futuristic z-10"
                            title="Delete"
                          >
                            <FaTrash className="w-5 h-5 mr-1" /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="p-4 text-center text-gray-400">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      {editUser && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-black/90 backdrop-blur-xl p-8 rounded-3xl border border-cyan-500/40 shadow-[0_0_30px_rgba(0,255,255,0.5)] max-w-md w-full">
            <h3 className="text-2xl font-bold text-cyan-400 mb-6 font-futuristic">Edit User</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm font-futuristic">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-black/50 border border-cyan-500/50 rounded-lg p-2 text-gray-100 font-futuristic focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm font-futuristic">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-black/50 border border-cyan-500/50 rounded-lg p-2 text-gray-100 font-futuristic focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm font-futuristic">Degree</label>
                <input
                  type="text"
                  name="degree"
                  value={formData.degree}
                  onChange={handleInputChange}
                  className="w-full bg-black/50 border border-cyan-500/50 rounded-lg p-2 text-gray-100 font-futuristic focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm font-futuristic">Department</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full bg-black/50 border border-cyan-500/50 rounded-lg p-2 text-gray-100 font-futuristic focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm font-futuristic">Year</label>
                <input
                  type="text"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className="w-full bg-black/50 border border-cyan-500/50 rounded-lg p-2 text-gray-100 font-futuristic focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm font-futuristic">Course</label>
                <div className="relative">
                  <select
                    name="course"
                    value={formData.course}
                    onChange={handleInputChange}
                    className="w-full bg-black border border-cyan-500/50 rounded-lg p-2 text-gray-100 font-futuristic focus:outline-none focus:border-cyan-400 appearance-none"
                    required
                  >
                    {courseOptions.map((course) => (
                      <option key={course} value={course}>
                        {course}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg
                      className="w-5 h-5 text-cyan-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-cyan-600 to-purple-600 text-white py-2 rounded-xl font-bold shadow-[0_0_20px_rgba(0,255,255,0.8)] hover:shadow-[0_0_30px_rgba(0,255,255,1)] transition-all duration-300 font-futuristic"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditUser(null)}
                  className="flex-1 bg-gray-600 text-white py-2 rounded-xl font-bold hover:bg-gray-500 transition-all duration-300 font-futuristic"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
          @keyframes neon-trail {
            0%, 100% { box-shadow: 0 0 10px rgba(0, 255, 255, 0.4); }
            50% { box-shadow: 0 0 20px rgba(0, 255, 255, 0.8); }
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
          .animate-neon-trail {
            animation: neon-trail 5s ease-in-out infinite;
          }
          .font-futuristic {
            font-family: 'Orbitron', sans-serif;
          }
          select::-ms-expand {
            display: none;
          }
        `}
      </style>
    </div>
  );
};

export default AdminDashboard;
