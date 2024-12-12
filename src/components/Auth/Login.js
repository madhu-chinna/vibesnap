// src/components/auth/Login.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import loginpageimg from '../../assets/loginpage.png'
import appname from '../../assets/Group 1171276168.png'
import loginwithgoogle from '../../assets/Group 1171276159.png'

// import './Auth.css'

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      setError('Failed to login. Please check your credentials.');
    }
  }

  async function handleGoogleLogin() {
    try {
      await googleLogin();
      navigate('/');
    } catch (error) {
      setError('Failed to login with Google.');
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        {/* <h2 className="text-2xl font-bold mb-6 text-center">Login to VibeSnap</h2> */}
        <div>
            <img src={loginpageimg} alt='landing page image' className='h-2/4'/>
            <div className='flex justify-center mt-2 mb-2'> <img src={appname} alt='appname'/> </div>
        </div>  

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div className='flex justify-center'>
            <button type="submit" className="w-45 bg-slate-950 text-white auth-button">
                Login
            </button>
        </div>
        
      </form>
      <div className="mt-4">
        <button
          onClick={handleGoogleLogin}
          className="w-full btn-secondary flex items-center justify-center"
        >
          <img src={loginwithgoogle} alt="Google" />
          {/* Continue with Google */}
        </button>
      </div>
    </div>
  );
}

export default Login;


