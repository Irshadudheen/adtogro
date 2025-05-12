// src/components/Layout.js
import  { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import useGetUserData from '../hooks/useGetUser';
import { removeUser, setUser } from '../redux/userSlice';
import { useDispatch } from 'react-redux';
import { logout } from '../Api/user';

import {  useGoogleLogin } from '@react-oauth/google';
import { decodedToken } from '../Api/user';
import LoginModal from './loginModal';
import { useLoginModal } from '../context/LoginModalContext';
import toast from 'react-hot-toast';
 

function Layout({ children }) {
const { isLoginModalOpen, setIsLoginModalOpen} = useLoginModal()
const dispatch = useDispatch()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

const googlelogin = useGoogleLogin({
    onSuccess:async (tokenResponse) => {
      try {
        console.log(tokenResponse);
    const userData = await decodedToken(tokenResponse.access_token)
console.log(userData,'userData')
       dispatch(setUser({
             name: userData.user.name,
             email:userData.user.email,
             id: userData.user.id,
             profileImage: userData.user.profileImage,
             token:userData.token
         }))
         setIsDropdownOpen(false)
      } catch (error) {
        console.error('Error decoding token:', error);
      }
      
    },
    onError: () => {
      toast.error('Login Failed')
      console.log('Login Failed');
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
    <div className="min-h-screen flex flex-col">
      {/* Header/Navigation */}
      <header className="bg-white shadow-sm sticky top-0 z-10 h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
        <Link to="/" className="text-decoration-none">
          <img src="/logo/A-unscreen.gif" className="w-16 md:w-16" alt="AdMetrix Logo" />
        </Link>
        
        {/* Mobile menu button (hidden on larger screens) */}
        <button 
          className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d={isMobileMenuOpen 
                ? "M6 18L18 6M6 6l12 12" // X icon when menu is open
                : "M4 6h16M4 12h16M4 18h16" // Hamburger icon when menu is closed
              } 
            />
          </svg>
        </button>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-6 items-center">
            <li>
              <Link to="/TalkSpace" className="text-gray-700 font-medium hover:text-gray-800">
              TalkSpace
              </Link>
            </li>
            <li>
              <Link to="/publishers" className="text-gray-700 font-medium hover:text-gray-800">
                For Publishers
              </Link>
            </li>
            <li>
              <Link to="/pricing" className="text-gray-700 font-medium hover:text-gray-800">
                Pricing
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-gray-700 font-medium hover:text-gray-800">
                Contact
              </Link>
            </li>
            <li>
              {user?.name ? (
                <div className="relative" ref={dropdownRef}
                onClick={() => setIsDropdownOpen(true)}
                  >
                  <div
              className="flex items-center gap-2 px-4 py-1 border border-black rounded-full text-white bg-black hover:bg-gray-800 cursor-pointer transition-all duration-300"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <img
                src={user.profileImage}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="font-medium">{user.name}</span>
              <svg
                className="w-4 h-4 text-white"
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
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                      
                      <Link 
                        to="/advertiser-dashboard" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Your Advertiser Dashboard
                      </Link>
                      <button 
                        
                        className="block px-4 w-full py-2 text-sm  text-red-700 hover:bg-red-100 text-left"
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
                <button
                 onClick={() => googlelogin()}
                  className="px-4 py-1 bg-black text-white rounded-md font-medium hover:bg-gray-800"
                >
                  Log In
                </button>
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
            For Advertisers
          </Link>
          <Link 
            to="/publishers" 
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            For Publishers
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
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <img src="/logo/traparent_img_logo.png" className="w-24 h-auto mb-4" alt="" />
              <p className="text-gray-400 text-sm">
                Connecting businesses with their ideal customers through targeted advertising solutions.
              </p>
            </div>
            <div>
              <h4 className="text-base font-medium mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link to="/blog" className="text-gray-400 hover:text-gray-300">Blog</Link></li>
                <li><Link to="/help" className="text-gray-400 hover:text-gray-300">Help Center</Link></li>
                <li><Link to="/guides" className="text-gray-400 hover:text-gray-300">Guides</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-base font-medium mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-400 hover:text-gray-300">About Us</Link></li>
                <li><Link to="/careers" className="text-gray-400 hover:text-gray-300">Careers</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-gray-300">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-base font-medium mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="text-gray-400 hover:text-gray-300">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-gray-400 hover:text-gray-300">Terms of Service</Link></li>
                <li><Link to="/cookies" className="text-gray-400 hover:text-gray-300">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} AdPlatform. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com" className="text-gray-400 hover:text-gray-300" aria-label="Twitter">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path>
                </svg>
              </a>
              <a href="https://facebook.com" className="text-gray-400 hover:text-gray-300" aria-label="Facebook">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path>
                </svg>
              </a>
              <a href="https://linkedin.com" className="text-gray-400 hover:text-gray-300" aria-label="LinkedIn">
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