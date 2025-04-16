import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom';
import { verifyEmailApi } from '../../Api/user';

function EmailVerifyPage() {
  const [verificationStatus, setVerificationStatus] = useState('verifying');
  const [error, setError] = useState(null);
const {userId}=useParams()
  useEffect(() => {
    // Extract userId and token from URL parameters
 console.log(userId)
    console.log(userId,'the userid')


    const verifyEmail = async () => {
      if (!userId) {
        setVerificationStatus('failed');
        setError('User ID is missing');
        return;
      }

      try {
        // Make API call to backend for verification
     const data=   await verifyEmailApi(userId)
        console.log(data,'the verified data')
       
        setVerificationStatus('success');
       
      
      } catch (err) {
      
        setVerificationStatus('failed');
        setError(err.response?.data?.errors[0].message || 'An error occurred during verification.');
        console.error('Email verification error:', err);
      }
    };

    verifyEmail();
  }, [userId]);

  const renderStatusContent = () => {
    switch (verificationStatus) {
      case 'verifying':
        return (
          <div className="text-center">
            <div className="mb-4">
              <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Verifying Your Email</h2>
            <p className="text-gray-600">Please wait while we verify your email address...</p>
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
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Email Verified!</h2>
            <p className="text-gray-600 mb-6">Your email has been successfully verified. You can now access all features of your account.</p>
            <Link to="/" className="inline-block bg-black hover:bg-gray-800 text-white font-medium py-2 px-6 rounded-lg transition duration-200">
              Back to Home
            </Link>
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
            <p className="text-gray-600 mb-2">{error || 'We could not verify your email address.'}</p>
            {error!='User already verified'&&(<div className="mt-6">
              <a href="/resend-verification" className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-lg transition duration-200 mr-4">
                Resend Verification
              </a>
              <a href="/contact-support" className="inline-block bg-black hover:bg-gray-800 text-white font-medium py-2 px-6 rounded-lg transition duration-200">
                Contact Support
              </a>
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
            src="/emailPhoto/email.jpg" 
            alt="Email verification illustration" 
            className="w-full rounded-lg shadow-xl"
          />
          <div className="mt-8 text-white">
            <h3 className="text-2xl font-bold mb-3">Welcome to Our Platform</h3>
            <p className="opacity-90">
              Thank you for joining us! By verifying your email, you'll have full access
              to all our features and receive important updates about your account.
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
          
          {renderStatusContent()}
        </div>
      </div>
    </div>
  );
}

export default EmailVerifyPage