import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom';
import { newPassword } from '../../Api/user';


function NewPasswordPage() {
  const [verificationStatus, setVerificationStatus] = useState('newPassword');
   const [formData, setFormData] = useState({
      newPassword: {  password: '',  },
    
    });
  const [error, setError] = useState(null);
const {token}=useParams()
 const formFields ={
    newPassword:[{
        id: 'password',
        label: "New Password",
        type:"password",
        placeholder:"••••••••",

    }]
 }
 const handleSubmit =async(e)=>{

e.preventDefault();
console.log('formData',formData)

setVerificationStatus('verifying')
try {
  await newPassword(token,formData.newPassword.password) 
  setVerificationStatus('success')
} catch (error) {
  // console.log(error.response.data.errors[0].message)
  setError(error.response.data.message=='jwt expired'&& 'Please request one more forgot password due to token expired!'||error.response.data.errors[0].message||'Failed to create new password')
  setVerificationStatus('failed')
}

 }
  const handleChange = (tab, fieldId, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [tab]: {
        ...prevState[tab],
        [fieldId]: value,
      },
}))}

  const renderStatusContent = () => {
    switch (verificationStatus) {
      case 'verifying':
        return (
          <div className="text-center">
            <div className="mb-4">
              <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Creating new password</h2>
            <p className="text-gray-600">Please wait verifying...</p>
          </div>
        );
        case 'success':
          return (
            <div className="text-center">
                        <div className="mb-6">
                          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                          </div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">New Password Created!</h2>
                        <p className="text-gray-600 mb-6">Your Password has been successfully Created. You can now access all features of your account using your new password.</p>
                        <Link to="/" className="inline-block bg-black hover:bg-gray-800 text-white font-medium py-2 px-6 rounded-lg transition duration-200">
                          Back to Home
                        </Link>
                      </div>
          )
      case 'newPassword':
        return (
           
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
              <div className="flex justify-center mb-6">
                <img src="/forgot_password.jpg"  alt="Email icon" className="h-16 md:hidden rounded" />
              </div>
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">
                  New password
                </h1>
                <p className="text-gray-600 mt-2">
                 Enter new password to reset your password
                </p>
              </div>
                    
              <div className="flex mb-8 border-b border-gray-200">
                
              </div>
              
              {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-6 text-sm">
                  {error}
                </div>
              )}
              
              <form
               onSubmit={handleSubmit}
               >
                {/* Render form fields based on active tab */}
                {formFields["newPassword"].map(field => (
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
                      value={formData["newPassword"][field.id]}
                      onChange={(e) => handleChange('newPassword', field.id, e.target.value)}
                      className="w-full p-3 rounded-lg border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors"
                      placeholder={field.placeholder}
                    />
                  </div>
                ))}
                
                
                
                <button 
                  type="submit" 
                //   disabled={isLoading}
                  className="w-full py-3 bg-black hover:bg-grey-800 text-white font-semibold rounded-lg transition-colors flex justify-center items-center mb-6 disabled:opacity-70"
                >
                    Create new Password
                    
                </button>
              </form>
              </div>
           
        );
      case 'failed':
        return (
          <div className="text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Verification Failed</h2>
            <p className="text-red-600 mb-2">{error || 'We could not set new password.'}</p>
            {error!='User already verified'&&(<div className="mt-6">
              <Link to="/forgot-password" className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-lg transition duration-200 mr-4">
                Resend Verification
              </Link>
              <Link to="/contact-support" className="inline-block bg-black hover:bg-gray-800 text-white font-medium py-2 px-6 rounded-lg transition duration-200">
                Contact Support
              </Link>
            </div>)}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Image Side */}
      <div className="hidden md:flex md:w-1/2 bg-black items-center justify-center p-12">
        <div className="max-w-md">
          <img 
            src="/forgot_password.jpg" 
            alt="Email verification illustration" 
            className="w-full rounded-lg shadow-xl"
          />
          <div className="mt-8 text-white">
            <h3 className="text-2xl font-bold mb-3">New password</h3>
            <p className="opacity-90">
             Now you can create a new password for your account. Please enter your new password.
            </p>
          </div>
        </div>
      </div>
      
      {/* Content Side */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        
         
          
          {renderStatusContent()}
        
      </div>
    </div>
  );
}

export default NewPasswordPage