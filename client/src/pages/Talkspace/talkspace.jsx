import { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { PlusCircle, Globe, MessageCircle, Users, Search, TrendingUp, Star, Clock, Link, Coffee } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import {createRoom} from '@/Api/user';
import { useNavigate } from 'react-router-dom';
import { commmunityCount, roomsDetails } from '@/Api/user';
import toast from 'react-hot-toast';
import { LiveCountContext } from '@/context/LiveCountContext';
import useGetUserData from '@/hooks/useGetUser';
import { useLoginModal } from '@/context/LoginModalContext';
import { useDebounce } from '@/utils/debounce';
import { validateRoom } from '@/utils/validateCreatRoom';
import { Helmet } from 'react-helmet';
import socket from '@/utils/socket';
import './coffestyle.css'
// import { useAudio } from '../../context/backgroundAudio/AudioContext';
import FooterTalkspace from '../../components/talkspace/Footer';

export default function Talkspace() {
   useEffect(() => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}, []);
  //  const { playAudio, pauseAudio } = useAudio();
    const allLanguages = ["Arabic",
  "English", "Spanish", "French", "German","Gen Z", "Japanese", "Vietnamese",
  "Sinhala", "Hindi", "Bengali", "Telugu", "Marathi", "Tamil", "Gujarati",
  "Urdu", "Kannada", "Odia", "Punjabi", "Malayalam", "Assamese", "Maithili",
  "Konkani", "Dogri", "Kashmiri", "Manipuri", "Bodo",'Mandarin'
];
 const [selectedLanguage, setSelectedLanguage] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [page, setPage] = useState(1);
  const { setIsLoginModalOpen} = useLoginModal()
  const {email}=useGetUserData()

  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false); // Separate loading state for pagination
  const [rooms,setRooms]=useState([]);
  const ITEMS_PER_PAGE = 6;
  const [hasMore, setHasMore] = useState(false);
  
  const [roomData, setRoomData] = useState({roomName:'',roomDescription:'',roomLanguage:'English',roomLevel:'Any Level'});
  const debouncedSearch = useDebounce(searchQuery, 300);
  
  // Track if we're already fetching to prevent duplicate calls
  const isFetchingRef = useRef(false);
  
  const observer = useRef();
  const lastRoomElementRef = useCallback(node => {
    if (isLoading || isLoadingMore || isFetchingRef.current) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !isFetchingRef.current) {
        setPage(prev => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, isLoadingMore, hasMore]);

  const handleChange = (e) => {
    const {name,value} = e.target;
    setRoomData(prev => ({
      ...prev,
      [name]:value
    }));
  };

  const navigate = useNavigate();

  const handleCreateRoom = async () => {
    try {
      if(!email){
        setIsLoginModalOpen(true)
        return
      }
      roomData.roomLanguage=selectedLanguage
      
    validateRoom(roomData)
      
      const data = await createRoom(roomData)
      // pauseAudio()
      navigate(`/talkspaceroom/${data.roomId}`)
    } catch (error) {
     
      toast.error(error.response.data.errors[0].message||'something went wrong.')
      throw error
    }
  }

  const handleNavigate = (roomId, participants) => {
    return () => {
      if(!email){
        setIsLoginModalOpen(true)
        return
      }
      if(participants < 3){
        // pauseAudio()
        navigate(`/talkspaceroom/${roomId}`)
      } else {
        toast.error('Room is full you can create a new room or join another room')
      }
    }
  }

  const fetchRoomDetails = async () => {
    // Prevent duplicate calls
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    
    try {
      if(page === 1){
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }
   
      const { rooms: newRooms, hasMore: more} = await roomsDetails({
        page, 
        search: debouncedSearch,
        limit: ITEMS_PER_PAGE
      });
      
      setRooms(prev => (page === 1 ? newRooms : [...prev, ...newRooms]));
      setHasMore(more);
      
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast.error('Failed to load rooms');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
      isFetchingRef.current = false;
    }
  }

  const handleSelect = (lang) => {
    if (!selectedLanguage.includes(lang)) {
      setSelectedLanguage([...selectedLanguage, lang]);
    }
    setShowDropdown(false);
  };

  const handleRemove = (lang) => {
    setSelectedLanguage(selectedLanguage.filter((l) => l !== lang));
  };
  // Reset page when search changes
  useEffect(() => {
    setPage(1);
    setRooms([]); // Clear existing rooms when search changes
  }, [debouncedSearch]);

  // Fetch rooms when page or search changes
  useEffect(() => {
    fetchRoomDetails();
     socket.on("room:new", (room) => {
      setRooms(prev => [room, ...prev]);
    });
     socket.on("room:updated", (updatedRoom) => {
     
      setRooms(prev => prev.map(r => r.id === updatedRoom.id ? updatedRoom : r));
    });
    socket.on("room:deleted", (roomId) => {
      setRooms(prev => prev.filter(r => r.id !== roomId));
    });
    return () => {
      socket.off("room:new");
      socket.off("room:updated");
      socket.off("room:deleted");
    };
  }, [page, debouncedSearch]);

  // Fetch community count on component mount

  const liveCount = useContext(LiveCountContext);
  const navigateTocoffee = ()=>{
    try {
      navigate('/coffee')
    } catch (error) {
      
    }
  }
  return (
    <>
   <Helmet>
    <title>Free Talkspace / AdToGro </title>
<meta name="description" content="Join Free Talkspace by Adtogro – a safe, supportive community where you can express yourself, share your thoughts, and connect with others. No judgment, just real conversations that matter." />

   </Helmet>
    <Layout>
    <div className=" min-h-screen py-8 px-4">
      <style >{`
        /* Glow Border Animation */
        .animated-border-box, .animated-border-box-glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
          z-index: 0;
          border-radius: 12px;
        }

        .animated-border-box-glow {
          filter: blur(20px);
        }

        .animated-border-box:before, .animated-border-box-glow:before {
          content: '';
          z-index: -2;
          text-align: center;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(0deg);
          position: absolute;
          width: 99999px;
          height: 99999px;
          background-repeat: no-repeat;
          background-position: 0 0;
          background-image: conic-gradient(rgba(0,0,0,0), #f0b207, rgba(0,0,0,0) 25%);
          animation: rotate 4s linear infinite;
        }

        .animated-border-box:after {
          content: '';
          position: absolute;
          z-index: -1;
          left: 3px;
          top: 3px;
          width: calc(100% - 6px);
          height: calc(100% - 6px);
          background: white;
          border-radius: 9px;
        }

        @keyframes rotate {
          100% {
            transform: translate(-50%, -50%) rotate(1turn);
          }
        }

        .premium-room-container {
          position: relative;
          z-index: 1;
        }
      `}</style>
      <div className="w-full rounded-xl p-6 max-w-5xl mx-auto">
        {/* Header with animation */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 relative">
          <div className="mb-4 md:mb-0 relative">
            <div className="flex items-center">
              <div className="bg-black text-white p-2 rounded-lg mr-3">
                <MessageCircle size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">
                  Talkspace
                </h1>
                <p className="text-gray-600 mt-1">Connect, discuss, and grow together</p>
              </div>
            </div>
            {!isLoading && (
              <div className="absolute -top-2 sm:-right-[-60px]  -right-[-30px]  bg-yellow-400 text-xs text-yellow-900 px-2 py-1 rounded-full transform rotate-12 shadow-sm font-medium">
                {liveCount||0}+ online now
              </div>
            )}
          </div>
          <button 
            onClick={() => {email ? setShowCreateRoom(!showCreateRoom) : setIsLoginModalOpen(true)}}
            className="bg-gradient-to-r from-gray-600 to-black hover:from-gray-700 hover:to-black text-white px-5 py-3 rounded-lg flex items-center transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1"
          >
            <PlusCircle className="mr-2" size={20} />
            Create Group
          </button>
        </div>
        
        {/* Create Room Form with animation */}
        {showCreateRoom && (
          <div className="p-6 rounded-xl mb-8 border border-gray-100 shadow-inner animate-fadeIn">
            <h2 className="text-xl font-semibold text-gray-600 mb-4 flex items-center">
              <PlusCircle className="mr-2 text-black" size={20} />
              Create a new group
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2 font-medium" htmlFor="roomName">Group Name</label>
                <input 
                  id="roomName"
                  type="text" 
                  name='roomName'
                  onChange={handleChange}
                  value={roomData.roomName}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all"
                  placeholder="English Learners (optional)"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2 font-medium" htmlFor="roomDescription">Group Description</label>
                <input 
                  id="roomDescription"
                  type="text" 
                  name='roomDescription'
                  onChange={handleChange}
                  value={roomData.roomDescription}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all"
                  placeholder="Talk in English (optional)"
                />
              </div>
                 <div className="w-full relative">
      <label className="block text-gray-700 mb-2 font-medium">Language</label>

      <div
        className="flex flex-wrap items-start gap-2 p-2  border border-gray-300 rounded-lg min-h-[48px] cursor-pointer"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        {selectedLanguage.map((lang) => (
          <span
            key={lang}
            className="flex items-center bg-gray-200 text-sm px-2 py-1 rounded-full"
          >
            {lang}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(lang);
              }}
              className="ml-1 text-gray-600 hover:text-red-500"
            >
              &times;
            </button>
          </span>
        ))}
        <input
          className="flex-grow outline-none bg-transparent"
          placeholder={selectedLanguage.length === 0 ? "Select languages..." : ""}
          readOnly
        />
      </div>

      {showDropdown && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-md max-h-60 overflow-y-auto">
          {allLanguages.map((lang) => (
            <div
              key={lang}
              onClick={() => handleSelect(lang)}
              className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
            >
              {lang}
            </div>
          ))}
        </div>
      )}
    </div>
              <div>
                <label className="block text-gray-700 mb-2 font-medium" htmlFor="roomLevel">Proficiency Level</label>
                <select 
                  id="roomLevel"
                  name='roomLevel'
                  onChange={handleChange}
                  value={roomData.roomLevel}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all"
                >
                  <option value="any">Any Level</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="upper-intermediate">Upper Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setShowCreateRoom(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-2  sm:px-6 sm:py-3 rounded-lg transition-all mr-3"
              >
                Cancel
              </button>
              <button onClick={handleCreateRoom} className="bg-gradient-to-r  whitespace-nowrap from-gray-600 to-black hover:from-gray-700 hover:to-black text-white px-6 py-3 rounded-lg transition-all shadow-md hover:shadow-lg">
                Create Group
              </button>
            </div>
          </div>
        )}
        
        {/* Introduction section */}
        <div className="mb-8 bg-gradient-to-r from-gray-600 to-black text-white p-6 rounded-xl shadow-md">
          <h3 className=" sm:text-2xl font-bold mb-2">Join  conversation space</h3>
          <p className="text-sm sm:text-base text-blue-50 mb-3">Practice languages with native speakers, discuss interesting topics, and make new friends from around the world.</p>
          <div className="grid grid-cols-3 md:grid-cols-3  mt-4">
             <div className="flex  items-center" onClick={navigateTocoffee}>
              <div className="bg-white/20 cursor-pointer p-2 rounded-lg mr-3">
                <img  src='/icone/coffee.png' width={20} />
               
              </div>
              <span className='hidden sm:inline coffee-text cursor-pointer'>Keep Me Caffeinated</span>
            </div>
            <div className="flex items-center">
              <div className="bg-white/20 p-2 rounded-lg mr-3">
                <Users size={18} />
              </div>
              <span className='hidden sm:inline'>Join friendly communities</span>
            </div>
            <div className="flex items-center">
              <div className="bg-white/20 p-2 rounded-lg mr-3">
                <MessageCircle size={18} />
              </div>
              <span className='hidden sm:inline'>Practice real conversations</span>
            </div>
          </div>
        </div>
        
        {/* Search and filters */}
        <div className="mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-1/2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="text-gray-400" size={18} />
            </div>
            <input
              type="text"
              placeholder="Search rooms by language, level or topic..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-2 w-full md:w-auto">
            
             <a 
            href='https://x.com/ad2gro'
              className={`px-4 py-2 rounded-lg flex items-center transition-all ${
                activeFilter === 'active' 
                  ? 'bg-black text-gray-100 font-medium' 
                  : 'bg-white text-black hover:bg-gray-200'
              }`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
  <path d="M14.2 10.6L22 2h-1.8l-6.5 7.3L8.5 2H2l8.3 12L2 22h1.8l6.9-7.8 5.5 7.8H22l-7.8-11.4z" />
</svg> 
              
            </a>
             <a 
            href='https://instagram.com/adtogro'
              className={`px-4 py-2 rounded-lg flex items-center transition-all ${
                activeFilter === 'active' 
                  ? 'bg-black text-gray-100 font-medium' 
                  : 'bg-white text-gray-500 hover:bg-gray-200'
              }`}
            >
              <svg width="25" height="25" viewBox="0 0 24 24" fill="currentColor">
  <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm5.25-.88a1.13 1.13 0 1 1 0 2.25 1.13 1.13 0 0 1 0-2.25z"/>
</svg>
              
            </a>
             <a 
            href='https://facebook.com'
              className={`px-4 py-2 rounded-lg flex items-center transition-all ${
                activeFilter === 'active' 
                  ? 'bg-black text-gray-100 font-medium' 
                  : 'bg-white  text-blue-700 hover:bg-gray-200'
              }`}
            >
               <svg width="25" height="25" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path>
                </svg>
              
            </a>
            
            <a 
            href='https://linkedin.com/in/irshadudheenp'
              className={`px-4 py-2 rounded-lg flex items-center transition-all ${
                activeFilter === 'active' 
                  ? 'bg-black text-gray-100 font-medium' 
                  : 'bg-white  text-blue-700 hover:bg-gray-200'
              }`}
            >
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>
                </svg>
              
            </a>
          </div>
        </div>
        
        {/* Room cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="border border-gray-200 rounded-xl p-4 animate-pulse">
                <div className="flex items-center mb-4">
                  <div className="bg-gray-200 h-8 w-8 rounded mr-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-24"></div>
                  <div className="ml-2 h-6 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {rooms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room, index) => {
                  // Add ref to the last element
                  const isLast  = index === rooms.length - 1;
                  
                  return (
                    <div 
                      key={`${room.id}-${index}`} // More unique key
                      ref={isLast ? lastRoomElementRef : null}
                      
                      className={`${room.created_by_premium ? "premium-room-container relative" : ""} border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all hover:border-gray-300 bg-white group cursor-pointer`}
                    >
                      {room.created_by_premium && (
                <>
                  <div className="animated-border-box-glow"></div>
                  <div className="animated-border-box"></div>
                </>
              )}
                      <div className={`flex items-center mb-3 ${room.created_by_premium &&'relative z-20'}`}>
                        <div className={`text-white mr-3 p-2 rounded-lg ${
                          room.roomLanguage === 'English' ? 'bg-blue-600' :
                          room.roomLanguage === 'Spanish' ? 'bg-green-600' :
                          room.roomLanguage === 'Japanese' ? 'bg-red-600' :
                          room.roomLanguage === 'French' ? 'bg-purple-600' :
                          room.roomLanguage === 'German' ? 'bg-yellow-600' :
                          'bg-yellow-500'
                        }`}>
                           <MessageCircle size={24} />
                        </div>
                        <span className="font-medium text-lg ">{room.roomLanguage}</span>
                        
                        <span className={`ml-1 text-xs px-2 py-1 r ${
                          room.roomLevel === 'Beginner' ? 'bg-green-100 text-green-700' :
                          room.roomLevel === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                          room.roomLevel === 'Upper Intermediate' ? 'bg-orange-100 text-orange-700' :
                          room.roomLevel === 'Advanced' ? 'bg-red-100 text-red-700' :
                          ' text-blue-700 '
                        }`}>
                          {room.roomLevel}
                          
                        </span>
                        {room?.users.length>1 && (
                          <span className="flex px-1 items-center text-sm text-green-600">
                            <span className="h-2 w-2 bg-green-600 rounded-full mr-1"></span>
                            Active now
                          </span>
                        )}
                        
                        
                        
                      </div>
                      
                     <div className={`text-gray-700 mb-4 font-medium ${room.created_by_premium &&'relative z-20'}`}>
                      {room.roomDescription}
                      <span className="inline-flex items-center text-sm text-gray-500 ml-2">
                        <Users size={14} className="mr-1" />
                        <span>{room.users.length} Members</span>
                      </span>
                    </div>
                      
                      <div className={`flex items-center gap-1 mb-4 ${room.created_by_premium &&'relative z-20'}`}>
                       
  {Array.isArray(room.users) && room.users.length > 0 ? (
    room.users.map((user, index) => (
      <img
        key={index}
        src={user.userImage}
        alt=""
        className="bg-gray border border-gray-300 rounded-full w-1/3"
        draggable={false}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "icone/person.png";
        }}
      />
    ))
  ) : (
    <p className="text-gray-500 text-sm">No users in this room</p>
  )}
                        
                       
                      </div>
                      
                      <button 
                      onClick={handleNavigate(room.id, room.users.length)} 
                        disabled={room.users.length >= 3}  
                        className={`w-full px-4 py-3 rounded-lg flex items-center justify-center text-sm font-medium transition-all shadow-sm
                          ${room.users.length === 0 && 'mt-21'}
                          ${room.users.length >= 3 
                            ? 'border border-solid text-black cursor-not-allowed bg-gray-100' 
                            : 'bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 text-white hover:to-black group-hover:shadow-md transform group-hover:-translate-y-1'}
                        `}
                      >
                        <MessageCircle className="mr-2" size={16} />
                        {room.users.length < 3 ? 'Join Conversation' : 'This Group is full'}
                      </button>
                    </div>
                    
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search size={48} className="mx-auto mb-4" />
                  <p className="text-xl font-medium">No rooms found matching your search</p>
                  <p className="mt-2">Try adjusting your search or filters</p>
                </div>
                <button 
                  onClick={() => {setSearchQuery(''); setActiveFilter('all');}}
                  className="mt-4 bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg inline-flex items-center"
                >
                  Show all rooms
                </button>
              </div>
            )}
            
            {/* Loading indicator at bottom */}
            {isLoadingMore && (
              <div className="flex justify-center mt-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            )}
          </>
        )}
        
        {/* Statistics footer */}
        <FooterTalkspace/>
      </div>
    </div>
    </Layout>
     </>
  );
}