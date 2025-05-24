import { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { PlusCircle, Globe, MessageCircle, Users, Search, TrendingUp, Star, Clock, Link } from 'lucide-react';
import Layout from '@/components/Layout';
import {createRoom} from '@/Api/user';
import { useNavigate } from 'react-router-dom';
import { commmunityCount, roomsDetails } from '@/Api/user';
import toast from 'react-hot-toast';
import { LiveCountContext } from '@/context/LiveCountContext';
import useGetUserData from '@/hooks/useGetUser';
import { useLoginModal } from '@/context/LoginModalContext';
import { useDebounce } from '@/utils/debounce';
import { validateRoom } from '@/utils/validateCreatRoom';
export default function Talkspace() {
    const allLanguages = ["Arabic",
  "English", "Spanish", "French", "German", "Japanese", "Vietnamese",
  "Sinhala", "Hindi", "Bengali", "Telugu", "Marathi", "Tamil", "Gujarati",
  "Urdu", "Kannada", "Odia", "Punjabi", "Malayalam", "Assamese", "Maithili",
  "Konkani", "Dogri", "Kashmiri", "Manipuri", "Bodo",'Mandarin'
];
 const [selectedLanguage, setSelectedLanguage] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [page, setPage] = useState(1);
  const { setIsLoginModalOpen} = useLoginModal()
  const {email}=useGetUserData()
  const [CommunityCount, setCommunityCount] = useState(0);
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
      navigate(`/talkspaceroom/${data.roomId}`)
    } catch (error) {
      console.log(error.response)
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

  const fetchCommunityCount = async ( ) => {
    try {
      const {communityCount} = await commmunityCount();
      setCommunityCount(communityCount);
    } catch (error) {
      throw error;
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
  }, [page, debouncedSearch]);

  // Fetch community count on component mount
  useEffect(() => {
    fetchCommunityCount();
  }, []);

  const liveCount = useContext(LiveCountContext);
  
  return (
    <Layout>
    <div className="bg-[url('/bground_talkspace.jpg')] bg-cover bg-fixed bg-center min-h-screen py-8 px-4">
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
              <div className="absolute -top-2 -right-16 bg-yellow-400 text-xs text-yellow-900 px-2 py-1 rounded-full transform rotate-12 shadow-sm font-medium">
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
          <div className="p-6 rounded-xl mb-8 border border-blue-100 shadow-inner animate-fadeIn">
            <h2 className="text-xl font-semibold text-gray-600 mb-4 flex items-center">
              <PlusCircle className="mr-2 text-black" size={20} />
              Create a New Group
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
                  placeholder="Enter group name"
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
                  placeholder="Brief description of your Group"
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
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg transition-all mr-3"
              >
                Cancel
              </button>
              <button onClick={handleCreateRoom} className="bg-gradient-to-r from-gray-600 to-black hover:from-gray-700 hover:to-black text-white px-6 py-3 rounded-lg transition-all shadow-md hover:shadow-lg">
                Create Group
              </button>
            </div>
          </div>
        )}
        
        {/* Introduction section */}
        <div className="mb-8 bg-gradient-to-r from-gray-600 to-black text-white p-6 rounded-xl shadow-md">
          <h3 className="text-2xl font-bold mb-2">Join  conversation space</h3>
          <p className="text-blue-50 mb-3">Practice languages with native speakers, discuss interesting topics, and make new friends from around the world.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="flex items-center">
              <div className="bg-white/20 p-2 rounded-lg mr-3">
                <Globe size={18} />
              </div>
              <span>7+ languages available</span>
            </div>
            <div className="flex items-center">
              <div className="bg-white/20 p-2 rounded-lg mr-3">
                <Users size={18} />
              </div>
              <span>Join friendly communities</span>
            </div>
            <div className="flex items-center">
              <div className="bg-white/20 p-2 rounded-lg mr-3">
                <MessageCircle size={18} />
              </div>
              <span>Practice real conversations</span>
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
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-2 w-full md:w-auto">
            <button 
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-lg flex items-center transition-all ${
                activeFilter === 'all' 
                  ? 'bg-black text-gray-100 font-medium' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ALL GROUP
            </button>
            <button 
              onClick={() => setActiveFilter('trending')}
              className={`px-4 py-2 rounded-lg flex items-center transition-all ${
                activeFilter === 'trending' 
                  ? 'bg-black text-gray-100 font-medium' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <TrendingUp className="mr-1" size={16} />
              Trending
            </button>
            <button 
              onClick={() => setActiveFilter('active')}
              className={`px-4 py-2 rounded-lg flex items-center transition-all ${
                activeFilter === 'active' 
                  ? 'bg-black text-gray-100 font-medium' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Clock className="mr-1" size={16} />
              Active Now
            </button>
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
                      onClick={handleNavigate(room.id, room.users.length)} 
                      className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all hover:border-gray-300 bg-white group cursor-pointer"
                    >
                      <div className="flex items-center mb-3">
                        <div className={`text-white mr-3 p-2 rounded-lg ${
                          room.roomLanguage === 'English' ? 'bg-blue-600' :
                          room.roomLanguage === 'Spanish' ? 'bg-green-600' :
                          room.roomLanguage === 'Japanese' ? 'bg-red-600' :
                          room.roomLanguage === 'French' ? 'bg-purple-600' :
                          room.roomLanguage === 'German' ? 'bg-yellow-600' :
                          'bg-indigo-600'
                        }`}>
                          <Globe size={18} />
                        </div>
                        <span className="font-medium text-lg">{room.roomLanguage}</span>
                        <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
                          room.roomLevel === 'Beginner' ? 'bg-green-100 text-green-700' :
                          room.roomLevel === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                          room.roomLevel === 'Upper Intermediate' ? 'bg-orange-100 text-orange-700' :
                          room.roomLevel === 'Advanced' ? 'bg-red-100 text-red-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {room.roomLevel}
                        </span>
                        
                      </div>
                      
                      <p className="text-gray-700 mb-4 font-medium">{room.roomDescription}</p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Users size={14} className="mr-1" />
                          <span>{room.users.length} participants</span>
                        </div>
                        {room.active && (
                          <span className="flex items-center text-sm text-green-600">
                            <span className="h-2 w-2 bg-green-600 rounded-full mr-1"></span>
                            Active now
                          </span>
                        )}
                      </div>
                      
                      <button 
                        disabled={room.users.length >= 3}  
                        className={`w-full px-4 py-3 rounded-lg flex items-center justify-center text-sm font-medium transition-all shadow-sm
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
        <div className="mt-12 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap justify-center gap-8 text-center text-gray-600">
            <div>
              <div className="font-bold text-2xl text-black">7+</div>
              <div className="text-sm">Languages</div>
            </div>
            <div>
              <div className="font-bold text-2xl text-black">{rooms.length||0}+</div>
              <div className="text-sm">Active groups</div>
            </div>
            <div>
              <div className="font-bold text-2xl text-black">{liveCount||0}+</div>
              <div className="text-sm">Users online</div>
            </div>
            <div>
              <div className="font-bold text-2xl text-black">{CommunityCount}+</div>
              <div className="text-sm">Community members</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
}