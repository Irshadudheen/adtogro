// src/components/Layout.js
import  { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import useGetUserData from '@/hooks/useGetUser';
import { removeUser, setUser } from '@/redux/userSlice';
import { useDispatch } from 'react-redux';
import { logout } from '@/Api/user';
import './layoutanimation.css'
import {  useGoogleLogin } from '@react-oauth/google';
import { decodedToken } from '@/Api/user';
import LoginModal from '@/components/loginModal';
import { useLoginModal } from '@/context/LoginModalContext';
import toast from 'react-hot-toast';
import { useAudio } from '@/context/backgroundAudio/AudioContext';
 

function Layout({ children }) {
   const { playAudio, pauseAudio,isAudioEnabled } = useAudio();
   const [imageError, setImageError] = useState(false);
   const handlePlayAudio = (e)=>{
    console.log(e.target.checked)

    if(!e.target.checked){
      pauseAudio()
    
    }else{
      playAudio()
    
    }
   }
const { isLoginModalOpen, setIsLoginModalOpen} = useLoginModal()
const dispatch = useDispatch()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

const googlelogin = useGoogleLogin({
    onSuccess:async (tokenResponse) => {
      try {
    
    const userData = await decodedToken(tokenResponse.access_token)
        console.log(userData,'userData')
       dispatch(setUser({
             name: userData.user.name,
             email:userData.user.email,
             id: userData.user.id,
             profileImage: userData.user.profileImage,
             token:userData.token,
             is_advertiser: userData.user.is_purchasedAd,
         }))
         setIsDropdownOpen(false)
      } catch (error) {
        console.error('Error decoding token:', error);
      }
      
    },
    onError: () => {
      toast.error('Login Failed')

    },
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const user=useGetUserData()

  // State to track if mobile menu is open or closed
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
const handleModalClose = ()=>{
  setIsLoginModalOpen(false)
}
  
  // Toggle mobile menu function
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
 const handleLogout = async() =>{
 
  await logout()
  dispatch(removeUser())
  
 }
  
  return (
    <div className="bg-[url('/bground_talkspace.jpg')] bg-cover bg-fixed bg-center min-h-screen flex flex-col">
      {/* Header/Navigation */}
      <header className=" shadow-sm  top-0 z-10 h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
        <Link to="/" className="text-decoration-none">
          <img src="/logo/logo.png" className="my-3 w-28 md:w-28 " alt="AdMetrix Logo" />
        </Link>
        
        {/* Mobile menu button (hidden on larger screens) */}
        
        <button 
          className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none"
          onClick={user.name?toggleMobileMenu: googlelogin}
          aria-label="Toggle mobile menu"
        >{!imageError && user?.name ? ( <img
                src={user.profileImage}
                onError={() => setImageError(true)}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
                draggable={false}
              />):(<div
          className={`${user.name?"w-8 h-8  rounded-full bg-gray-400 text-white flex items-center justify-center text-sm font-semibold":'px-4 rise-shake py-1 bg-black text-white rounded-md font-medium hover:bg-white hover:text-black transition-colors duration-300 cursor-pointer flex items-center gap-2 border'}`}
          title={user.name}
        >
          {user.name ? user.name.charAt(0).toUpperCase(): "Login"}
        </div>)}
         
        </button>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-6 items-center">
           
            
           
            <li>
              {user?.name ? (
                <div className="relative" ref={dropdownRef}
                onClick={() => setIsDropdownOpen(true)}
                  >
                  <div
              className="flex items-center gap-2 px-4 py-1 border border-black rounded-full text-black  cursor-pointer transition-all duration-300"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {!imageError?(<img
                src={user.profileImage}
                onError={()=> setImageError(true)}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
                draggable={false}
              />):(<div
          className="w-8 h-8 rounded-full bg-gray-400 text-white flex items-center justify-center text-sm font-semibold"
          title={user.name}
        >
          {user.name ? user.name.charAt(0).toUpperCase(): "U"}
        </div>)}
              <span className="font-medium">{user.name}</span>
              <svg
                className="w-4 h-4 text-black "
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
                  
                  {/* Dropdown menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-50 bg-white rounded-md shadow-lg py-1 z-20">
                     <div className="flex items-center justify-center">

                   
                      <img
                src={user.profileImage}
                onError={(e) => {
                e.target.onerror = null;
                e.target.src = "icone/person.png"; // use a default image
              }}
                alt="Profile"
                className="w-15 h-15  rounded-full object-cover"
                draggable={false}
              />
                </div>
            
            
                
                      <Link 
                        to="/advertiser-dashboard" 
                        className="block px-2 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={(e) => {

                          setIsDropdownOpen(false)
                          if(!user.is_advertiser){
                            e.preventDefault();
                            toast.error('You need to purchase an ad plan to access this page.');
                          }
                        }}
                      >
                       My Ads
                      </Link>
                       <div className="px-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-600">Music</span>
                          <label className="relative inline-flex items-center cursor-pointer ">
                            <input type="checkbox" defaultChecked={isAudioEnabled} className="sr-only peer" onChange={handlePlayAudio} />
                            <div className="w-11 h-6 mt-2 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full 
                                            peer peer-checked:after:translate-x-full peer-checked:after:border-white 
                                            after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white 
                                            after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all 
                                            peer-checked:bg-black relative">
                            </div>
                          </label>
                        </div>
                      </div>
                      <button 
                        
                        className="block font-medium px-2 w-full py-2 text-sm  text-red-700 hover:bg-red-100 text-left"
                        onClick={() =>{ setIsDropdownOpen(false)
                          handleLogout()
                        }}
                      >
                        Logout 
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="">

                
                <div 
                 onClick={() => googlelogin()}
                  className="px-4 rise-shake py-1 bg-black text-white rounded-md font-medium hover:bg-white hover:text-black transition-colors duration-300 cursor-pointer flex items-center gap-2 border"
                >
                <span > Log In</span> 
                </div>
                </div>
              )}
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Mobile Navigation - shown/hidden based on state */}
      <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-md">
          <Link 
            to="/advertisers" 
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            My Ads
          </Link>
          
            
          <Link 
            to="/pricing" 
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Pricing
          </Link>
          <Link 
            to="/contact" 
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Contact
          </Link>
          
          {user?.name ? (
            <>
              <Link 
                to="/profile" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Profile
              </Link>
              <Link 
                to="/advertiser-dashboard" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Your Advertiser Dashboard
              </Link>
              <button 
           
                className="block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-500 hover:bg-gray-50"
                onClick={() =>{ setIsMobileMenuOpen(false)
                  handleLogout()
                }
                }
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:cursor-pointer text-white bg-blue-500 hover:bg-blue-600"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Log In
            </Link>
          )}
        </div>
      </div>
    </header>
    {isLoginModalOpen&&<LoginModal onClose={handleModalClose}/>}
      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>
      
      {/* Footer */}
      <hr></hr>
      <footer className=" text-black ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ">
            <div className='mt-3'>
              <img src="/logo/logo.png" width={150} height={150} alt="" />
              <p className="text-gray-900 text-xs">
               We connect strangers and turn them into loyal supporters through targeted outreach.
              </p>
            </div>
            
           
            <div>
              <h4 className="text-base font-medium mb-2 mt-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="text-gray-800 text-sm hover:text-gray-900">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-gray-800 text-sm hover:text-gray-900">Terms of Service</Link></li>
                
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-2 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-gray-900 text-xs">
              © {new Date().getFullYear()} Powered by Irshadudheen 
            </p>
            <div className="flex space-x-4">
              <a href="https://x.com/ad2gro" className="text-gray-700 hover:text-gray-800" aria-label="Twitter">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
  <path d="M14.2 10.6L22 2h-1.8l-6.5 7.3L8.5 2H2l8.3 12L2 22h1.8l6.9-7.8 5.5 7.8H22l-7.8-11.4z" />
</svg> </a>
 <a href="https://instagram.com/adtogro" className="text-gray-700 hover:text-gray-800" aria-label="Twitter">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
  <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm5.25-.88a1.13 1.13 0 1 1 0 2.25 1.13 1.13 0 0 1 0-2.25z"/>
</svg>


              </a>
              
              <a href="https://facebook.com" className="text-gray-700 hover:text-gray-800" aria-label="Facebook">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path>
                </svg>
              </a>
              <a href="https://youtube.com/@Irshadudheenp" className="text-gray-700 hover:text-gray-800" aria-label="Facebook">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
  <path d="M10 15.5l6-3.5-6-3.5v7zm12-7.2v7.4c0 2.2-1.8 4-4 4H6c-2.2 0-4-1.8-4-4V8.3C2 6.1 3.8 4.3 6 4.3h12c2.2 0 4 1.8 4 4z"/>
</svg>

              </a>
              <a href="https://linkedin.com/in/irshadudheenp" className="text-gray-700 hover:text-gray-800" aria-label="LinkedIn">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
      
    
    </div>
  );
}

export default Layout;