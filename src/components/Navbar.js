import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { auth, db} from "../firebase/config";
import { doc, getDoc} from "firebase/firestore";

function Navbar() {
  const [profilePicUrl, setProfilePicUrl] = useState("");
  const [name, setName] = useState("");
  const { currentUser, logout } = useAuth();

  const fetchProfileData = async () => {
      try {
        const userDoc = doc(db, "users", auth.currentUser.uid);
        const userData = await getDoc(userDoc);
  
        if (userData.exists()) {
          const { profilePicUrl } = userData.data();
          // setBio(bio || "");
          setProfilePicUrl(profilePicUrl || "");
        }
        setName(auth.currentUser.displayName || "");
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
      }
    };

    useEffect(() => {
        fetchProfileData();
      }, []);
  

  return (
    <nav className="bg-white shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <h1>
            <Link to="/" className="text-xl font-bold text-indigo-600">
              VibeSnap
            </Link>
          </h1>

          {currentUser ? (
            <div className="flex items-center space-x-4">
              <Link to="/create-post" className="btn-primary">
                New Post
              </Link>
              <Link to="/profile" className="flex items-center space-x-2">
                <img
                  src={profilePicUrl} // Correct field name
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-gray-700">{name}</span>
              </Link>
              <button onClick={logout} className="btn-secondary">
                Logout
              </button>
            </div>
          ) : (
            <div className="space-x-4">
              <Link to="/login" className="btn-primary">
                Login
              </Link>
              <Link to="/register" className="btn-secondary">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;


