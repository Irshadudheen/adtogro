import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { forgotPassword, login, signup } from '../../Api/user';
import toast from 'react-hot-toast';
import { useDispatch } from "react-redux";
import {setUser} from '../../redux/userSlice'
function ForgotPassowrd() {
  const [activeTab, setActiveTab] = useState('forgotPassword');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
const navigate = useNavigate()

  // Form states
  const [formData, setFormData] = useState({
    forgotPassword: { email: '', password: ''},
   
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
    
    await forgotPassword(data)
   
      setIsLoading(false);
    toast.success('Password reset link sent to your email!')
      navigate('/')
  } catch (error) {
   
      
      toast.error(error?.response?.data.errors[0].message||error.message)
      if(error.response?.data.errors[0].message=='Email not found') {
        toast.error('Email not found')
      }
      setIsLoading(false);
 
  };
}
  // Form fields configuration
  const formFields = {
    forgotPassword: [
      { id: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com' },
      
    ],
  
  };

  return (

      
      <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Image Side */}
      <div className="hidden md:flex md:w-1/2 bg-black items-center justify-center p-12">
        <div className="max-w-md ">
          <img 
            src="/forgot_password.jpg" 
            alt="Email verification illustration" 
            className="w-full rounded-lg shadow-xl"
          />
          <div className="mt-8 text-white">
            <h3 className="text-2xl font-bold mb-3">You forgot your password!</h3>
            <p className="opacity-90">
            Don't worry, we can help you reset it. Just enter your email address and we'll send you a link to create a new password.
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
              {activeTab === 'forgotPassword' && 'Forgot Password' }
            </h1>
            <p className="text-gray-600 mt-2">
              {activeTab === 'forgotPassword' &&
                'Enter your email to reset your password' 
                }
            </p>
          </div>
                
          <div className="flex mb-8 border-b border-gray-200">
            
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
            
            
            
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-3 bg-black hover:bg-grey-800 text-white font-semibold rounded-lg transition-colors flex justify-center items-center mb-6 disabled:opacity-70"
            >
              {isLoading 
                ? (activeTab === 'forgotPassword' && 'Forgot Password...' ) 
                : (activeTab === 'forgotPassword' && 'Forgot Password' )}
            </button>
          </form>
          
          <div className="mt-4 pt-6 border-t border-gray-200 flex justify-center">
            <Link to="/" className="text-gray-500 text-sm flex items-center hover:text-gray-700">
              ← Back to Home
            </Link>
          </div>
        
          
        </div>
      </div>
    </div>
   
  );
}


export default ForgotPassowrd;