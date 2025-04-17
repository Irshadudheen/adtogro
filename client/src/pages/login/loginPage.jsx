import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { login, signup } from '../../Api/user';
import toast from 'react-hot-toast';
import { useDispatch } from "react-redux";
import {setUser} from '../../redux/userSlice'
function LoginPage() {
  const [activeTab, setActiveTab] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate =useNavigate()
  const dispatch = useDispatch();

  // Form states
  const [formData, setFormData] = useState({
    login: { email: '', password: '', rememberMe: false },
    signup: { email: '', password: '', confirmPassword: '', name: '', agreeToTerms: false }
  });

  const handleChange = (tab, field, value) => {
    setFormData(prev => ({
      ...prev,
      [tab]: { ...prev[tab], [field]: value }
    }));
  };

  const handleSubmit = async (e) => {
    try {
      
   
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    const data = formData[activeTab];
    
    if (activeTab === 'login') {
      // Login validation
      if (!data.email || !data.password) {
        setError('Please enter both email and password');
        setIsLoading(false);
        return;
      }
     const response= await login(data)
     console.log(response,'login response')
     dispatch(setUser({
      name: response.user.name,
      email:response.user.email,
      id: response.user.id,
      token:response.token
  }))
     toast.success('Login successful!')
     navigate('/')
   
     
    } else {
      // Signup validation
      if (!data.email || !data.password || !data.confirmPassword || !data.name) {
        setError('All fields are required');
        setIsLoading(false);
        return;
      }
      
      if (data.password !== data.confirmPassword) {
        setError('Passwords do not match');
        setIsLoading(false);
        return;
      }
      
      if (!data.agreeToTerms) {
        setError('You must agree to the Terms of Service');
        setIsLoading(false);
        return;
      }
      await signup(data)
      toast.success('Account created successfully!')
      setActiveTab('login')
    }
   
    // Simulating API call
   
      setIsLoading(false);
      console.log(`${activeTab === 'login' ? 'Login' : 'Signup'} successful`);
   
  } catch (error) {
    console.log(error.message)
      console.log(error?.response?.data.errors[0].message||error.message)
   
      toast.error(error?.response?.data.errors[0].message||error.message)
      if(error.response?.data.errors[0].message=='Email not found') {
        setActiveTab('signup')
      }
      setIsLoading(false);
 
  };
}
  // Form fields configuration
  const formFields = {
    login: [
      { id: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com' },
      { 
        id: 'password', 
        label: 'Password', 
        type: 'password', 
        placeholder: '••••••••',
        extra: (
          <Link to="/forgot-password" className="text-sm text-grey-700 hover:text-grey-800">
            Forgot password?
          </Link>
        )
      }
    ],
    signup: [
      { id: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
      { id: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com' },
      { id: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
      { id: 'confirmPassword', label: 'Confirm Password', type: 'password', placeholder: '••••••••' }
    ]
  };

  return (

      
      <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Image Side */}
      <div className="hidden md:flex md:w-1/2 bg-black items-center justify-center p-12">
        <div className="max-w-md ">
          <img 
            src="/login_.jpg" 
            alt="Email verification illustration" 
            className="w-full rounded-lg shadow-xl"
          />
          <div className="mt-8 text-white">
            <h3 className="text-2xl font-bold mb-3">Welcome to Our Platform</h3>
            <p className="opacity-90">
            Thank you for signing up! Please verify your email to access all features and receive important updates about your account and activity.
            </p>
          </div>
        </div>
      </div>
      
      {/* Content Side */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-center mb-6">
            <img src="/emailPhoto/email.jpg" alt="Email icon" className="h-16 md:hidden" />
          </div>
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-gray-600 mt-2">
              {activeTab === 'login' 
                ? 'Sign in to manage your advertising campaigns' 
                : 'Sign up to start creating your advertising campaigns'}
            </p>
          </div>

          <div className="flex mb-8 border-b border-gray-200">
            <div 
              className={`flex-1 py-3 text-center cursor-pointer transition-all ${
                activeTab === 'login' 
                  ? 'font-semibold text-grey-700 border-b-2 border-grey-800' 
                  : 'text-gray-500 border-b border-gray-200'
              }`}
              onClick={() => setActiveTab('login')}
            >
              Sign In
            </div>
            <div 
              className={`flex-1 py-3 text-center cursor-pointer transition-all ${
                activeTab === 'signup' 
                  ? 'font-semibold text-grey-800 border-b-2 border-grey-700' 
                  : 'text-gray-500 border-b border-gray-200'
              }`}
              onClick={() => setActiveTab('signup')}
            >
              Sign Up
            </div>
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {/* Render form fields based on active tab */}
            {formFields[activeTab].map(field => (
              <div key={field.id} className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
                    {field.label}
                  </label>
                  {field.extra}
                </div>
                <input
                  id={field.id}
                  type={field.type}
                  value={formData[activeTab][field.id]}
                  onChange={(e) => handleChange(activeTab, field.id, e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors"
                  placeholder={field.placeholder}
                />
              </div>
            ))}
            
            {/* Checkbox section */}
            <div className="flex items-center mb-6">
              <input
                id={activeTab === 'login' ? 'remember-me' : 'agree-terms'}
                type="checkbox"
                checked={activeTab === 'login' ? formData.login.rememberMe : formData.signup.agreeToTerms}
                onChange={(e) => handleChange(
                  activeTab, 
                  activeTab === 'login' ? 'rememberMe' : 'agreeToTerms', 
                  e.target.checked
                )}
                className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded mr-2"
              />
              <label 
                htmlFor={activeTab === 'login' ? 'remember-me' : 'agree-terms'} 
                className="text-sm text-gray-500 leading-tight"
              >
                {activeTab === 'login' ? 'Remember me' : (
                  <>
                    I agree to the <Link to="/terms" className="text-black hover:text-black">Terms of Service</Link> and <Link to="/privacy" className="text-black hover:text-black">Privacy Policy</Link>
                  </>
                )}
              </label>
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-3 bg-black hover:bg-grey-800 text-white font-semibold rounded-lg transition-colors flex justify-center items-center mb-6 disabled:opacity-70"
            >
              {isLoading 
                ? (activeTab === 'login' ? 'Signing In...' : 'Creating Account...') 
                : (activeTab === 'login' ? 'Sign In' : 'Create Account')}
            </button>
          </form>
          
          <div className="mt-4 pt-6 border-t border-gray-200 flex justify-center">
            <Link to="/" className="text-gray-500 text-sm flex items-center hover:text-gray-700">
              ← Back to Home
            </Link>
          </div>
        
          {/* {renderStatusContent()} */}
        </div>
      </div>
    </div>
   
  );
}


export default LoginPage;