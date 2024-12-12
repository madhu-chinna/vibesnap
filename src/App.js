import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PostProvider } from './contexts/PostContext';
import { ProfileProvider } from './contexts/ProfileContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';

import Login from './components/Auth/Login';

import Register from './components/Auth/Register';
import Feed from './components/Feed/';
import Profile from './components/Profile/';
// import EditProfile from './components/Profile/EditProfile';
import CreatePost from './components/CreatePost/CreatePost';

function App() {
  return (
    <Router>
      <AuthProvider>
        <PostProvider>
          <ProfileProvider>
            <div className="min-h-screen bg-gray-100">
              <Navbar />
              <main className="container mx-auto px-4 py-8">
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/" element={
                    <PrivateRoute>
                      <Feed />
                    </PrivateRoute>
                  } />
                  <Route path="/profile" element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  } />

                  <Route path="/create-post" element={
                    <PrivateRoute>
                      <CreatePost />
                    </PrivateRoute>
                  } />
                </Routes>
              </main>
            </div>
          </ProfileProvider>
        </PostProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;


