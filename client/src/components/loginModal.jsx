import { useGoogleLogin } from '@react-oauth/google';
import React from 'react'
import { useDispatch } from 'react-redux';
import { decodedToken } from '../Api/user';
import { setUser } from '../redux/userSlice';
import { useLoginModal } from '../context/LoginModalContext';

function LoginModal({onClose}) {
  
    const {setIsLoginModalOpen} =useLoginModal() 
     const dispatch = useDispatch()
const googlelogin = useGoogleLogin({
  
    onSuccess:async (tokenResponse) => {
      try {
        
    const userData = await decodedToken(tokenResponse.access_token)

       dispatch(setUser({
             name: userData.user.name,
             email:userData.user.email,
             id: userData.user.id,
             profileImage: userData.user.profileImage,
             token:userData.token
         }))
         setIsLoginModalOpen(false)
      } catch (error) {
       toast.error('login failed')
      }
      
    },
    onError: () => {
      toast.error('Login Failed')
      
    },
  });
  return (
    <div className="fixed inset-0 z-50 bg-opacity-50 flex justify-center items-center">
      <div className="opacity-100 backdrop-blur-md bg-white/30 border shadow-lg p-8 rounded-md w-80">
        <h2 className="text-xl text-black font-semibold mb-4">Sign in</h2>
        <p className="text-black mb-6">Continue with your Google account</p>
        <button
          onClick={googlelogin}
          className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 cursor-pointer transition duration-200"
        >
          Sign in with Google
        </button>
        <button
          onClick={onClose}
          className="mt-4 w-full py-2 text-black rounded-md border border-gray-400 hover:bg-gray-100 cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

export default LoginModal;
