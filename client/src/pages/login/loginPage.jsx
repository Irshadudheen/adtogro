import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import { login, signup } from '@/Api/user';
import toast from 'react-hot-toast';
import { useDispatch } from "react-redux";
import {setUser} from '@/redux/userSlice'
function LoginPage() {
  const [activeTab, setActiveTab] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate =useNavigate()
  const dispatch = useDispatch();

  // Form states
  const [formData, setFormData] = useState({
    login: { email: '', password: '' },
    signup: { email: '', password: '', name: '' }
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
      if (!data.email || !data.password  || !data.name) {
        setError('All fields are required');
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
      { id: 'password', label: 'Password', type: 'password', placeholder: '••••••••' }
    
    ]
  };

  return (

    <div className="h-screen bg-gray-50 flex flex-col md:flex-row overflow-hidden">
    {/* Image Side */}
    <div className="hidden md:flex md:w-1/2 bg-black items-center justify-center p-8">
      <div className="max-w-md">
        <img 
          src="/login_.jpg" 
          alt="Email verification illustration" 
          className="w-full rounded-lg shadow-xl"
        />
        <div className="mt-6 text-white font-poppins">
          <h3 className="text-xl font-bold mb-2">Welcome to Our Platform</h3>
          <p className="opacity-90 text-sm">
            Thank you for signing up! Please verify your email to access all features and receive important updates about your account and activity.
          </p>
        </div>
      </div>
    </div>
    
    {/* Content Side - Using flex and overflow-y-auto for scrolling only when needed */}
    <div className="flex-1 flex items-center justify-center p-4 md:p-8 overflow-y-auto">
      <div className="w-full max-w-md  rounded-xl  p-6 my-4">
        <div className="flex justify-center mb-4">
          <img src="/emailPhoto/email.jpg" alt="Email icon" className="h-14 md:hidden" />
        </div>
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">
            {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-gray-600 mt-2 text-sm">
            {activeTab === 'login' 
              ? 'Sign in to manage your advertising campaigns' 
              : 'Sign up to start creating your advertising campaigns'}
          </p>
        </div>

        <div className="flex mb-4 border-b border-gray-200">
          <div 
            className={`flex-1 py-1 text-center cursor-pointer transition-all ${
              activeTab === 'login' 
                ? 'font-semibold text-gray-700 border-b-2 border-gray-800' 
                : 'text-gray-500 border-b border-gray-200'
            }`}
            onClick={() => setActiveTab('login')}
          >
            Sign In
          </div>
          <div 
            className={`flex-1 py-1 text-center cursor-pointer transition-all ${
              activeTab === 'signup' 
                ? 'font-semibold text-gray-800 border-b-2 border-gray-700' 
                : 'text-gray-500 border-b border-gray-200'
            }`}
            onClick={() => setActiveTab('signup')}
          >
            Sign Up
          </div>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-1">
          {/* Render form fields based on active tab */}
          {formFields[activeTab].map(field => (
            <div key={field.id}>
              <div className="flex justify-between items-center mb-1">
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
                className="w-full p-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors"
                placeholder={field.placeholder}
              />
            </div>
          ))}
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-2 mt-2 bg-black hover:bg-gray-800 text-white font-semibold rounded-lg transition-colors flex justify-center items-center disabled:opacity-70"
          >
            {isLoading 
              ? (activeTab === 'login' ? 'Signing In...' : 'Creating Account...') 
              : (activeTab === 'login' ? 'Sign In' : 'Create Account')}
          </button>
        </form>
        
        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-center">
          <Link to="/" className="text-gray-500 text-sm flex items-center hover:text-gray-700">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  </div>
   
  );
}


export default LoginPage;