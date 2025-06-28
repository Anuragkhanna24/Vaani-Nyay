import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { FaUser, FaLock, FaEnvelope, FaPhone, FaEye, FaEyeSlash, FaSignInAlt } from 'react-icons/fa';
import apiService from '../apiService';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Check authentication status on mount and when location changes
  useEffect(() => {
    const checkAuthStatus = () => {
      if (apiService.isAuthenticated()) {
        const from = location.state?.from?.pathname || '/forms';
        navigate(from, { replace: true });
      } else {
        setIsCheckingAuth(false);
      }
    };

    checkAuthStatus();
  }, [navigate, location]);

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#141E28]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#33FEBF] mx-auto mb-4"></div>
          <p className="text-white">Checking authentication...</p>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (formData.name.trim().length < 2) {
      setError('Name must be at least 2 characters long');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!formData.phone.trim()) {
      setError('Phone number is required');
      return false;
    }
    if (!/^[6-9]\d{9}$/.test(formData.phone.trim())) {
      setError('Please enter a valid Indian phone number');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      apiService.setPersistentStorage(rememberMe); // <-- Add this line
      await apiService.register(formData);

      // Show success message
      setSuccess(true);
      const registerCard = document.querySelector('.register-card');
      if (registerCard) {
        registerCard.classList.add('animate-pulse');
      }
      
      // Redirect to forms dashboard after 2 seconds
      setTimeout(() => {
        const from = location.state?.from?.pathname || '/forms';
        navigate(from, { replace: true });
      }, 2000);

    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
      const registerCard = document.querySelector('.register-card');
      if (registerCard) {
        registerCard.classList.add('animate-shake');
        setTimeout(() => {
          registerCard.classList.remove('animate-shake');
        }, 1000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#141E28] text-white">
      {/* Left Section */}
      <div className="w-full md:w-1/2 p-8 flex items-center justify-center bg-gradient-to-br from-[#141E28] to-[#0f172a]">
        <div className="max-w-md space-y-6">
          <h1 className="text-4xl font-bold text-[#33FEBF]">Vaani-Nyay</h1>
          <p className="text-xl text-white">Voice for Justice - Accessible Legal Aid Platform</p>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-[#33FEBF]"></div>
              <span>AI-Powered Legal Assistance</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-[#33FEBF]"></div>
              <span>Multilingual Support</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-[#33FEBF]"></div>
              <span>Secure Document Handling</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="register-card w-full max-w-md bg-[#141E28] rounded-xl shadow-lg p-8 transition-all duration-300">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white">Create Your Account</h2>
            <p className="text-gray-300">Join Vaani-Nyay to access legal services</p>
          </div>
          
          {success ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-[#33FEBF] text-[#141E28]">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#33FEBF] mb-2">Registration Successful!</h3>
              <p className="text-gray-300">Welcome to Vaani-Nyay! You will be redirected shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-500 text-white p-3 rounded-md text-center animate-fade-in">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <FaUser className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#1E293B] text-white placeholder-gray-400 border border-[#334155] focus:outline-none focus:ring-2 focus:ring-[#33FEBF] transition-colors"
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <FaEnvelope className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#1E293B] text-white placeholder-gray-400 border border-[#334155] focus:outline-none focus:ring-2 focus:ring-[#33FEBF] transition-colors"
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <FaPhone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="Enter your phone number"
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#1E293B] text-white placeholder-gray-400 border border-[#334155] focus:outline-none focus:ring-2 focus:ring-[#33FEBF] transition-colors"
                    disabled={loading}
                  />
                </div>
                <p className="text-xs text-gray-400">Enter 10-digit Indian mobile number</p>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <FaLock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Create a password"
                    className="w-full pl-10 pr-12 py-3 rounded-lg bg-[#1E293B] text-white placeholder-gray-400 border border-[#334155] focus:outline-none focus:ring-2 focus:ring-[#33FEBF] transition-colors"
                    disabled={loading}
                  />
                  <button 
                    type="button" 
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-[#33FEBF] transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-400">Minimum 8 characters</p>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <FaLock className="w-4 h-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Confirm your password"
                    className="w-full pl-10 pr-12 py-3 rounded-lg bg-[#1E293B] text-white placeholder-gray-400 border border-[#334155] focus:outline-none focus:ring-2 focus:ring-[#33FEBF] transition-colors"
                    disabled={loading}
                  />
                  <button 
                    type="button" 
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-[#33FEBF] transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                  >
                    {showConfirmPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 text-[#33FEBF] focus:ring-[#33FEBF] border-gray-600 rounded bg-[#1E293B]"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-300">
                  Remember me
                </label>
              </div>
              
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="terms" 
                  required
                  className="h-4 w-4 text-[#33FEBF] focus:ring-[#33FEBF] border-gray-600 rounded bg-[#1E293B]"
                  disabled={loading}
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-300">
                  I agree to the <a href="/terms" className="text-[#33FEBF] hover:underline transition-colors">Terms of Service</a> and <a href="/privacy" className="text-[#33FEBF] hover:underline transition-colors">Privacy Policy</a>
                </label>
              </div>
              
              <button 
                type="submit" 
                className={`w-full flex items-center justify-center py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                  loading 
                    ? 'bg-[#2a4a3e] cursor-not-allowed text-gray-300' 
                    : 'bg-[#33FEBF] hover:bg-[#2bd4a8] text-[#141E28] hover:shadow-lg'
                }`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <FaSignInAlt className="mr-2" />
                    <span>Create Account</span>
                  </>
                )}
              </button>
            </form>
          )}
          
          <div className="mt-6 text-center text-sm text-gray-300">
            <p>Already have an account? <Link to="/login" className="text-[#33FEBF] hover:underline transition-colors">Sign in here</Link></p>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Register;