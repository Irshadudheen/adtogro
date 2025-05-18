// src/components/RoomPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useBeforeUnload } from 'react-router-dom';
import { Video, Mic, MicOff, Monitor, VideoOff, X, MessageSquare, Send, Users, } from 'lucide-react';
import socket from '@/utils/socket';
import RemoteVideo from './RemoteVideo';
import toast from 'react-hot-toast';
import useGetUserData from '@/hooks/useGetUser';
import { roomDetailsApi } from '../../Api/user';
import { notifyTheuser } from '../../utils/copyRoomUrl';

const RoomPage = () => {
  const [userMap, setUserMap] = useState({});
  const { roomId } = useParams();
  const navigate = useNavigate();
  const userData = useGetUserData()
  const [socketId, setSocketId] = useState('');
  const [isAudioMuted,setIsAudioMuted]= useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [usersInRoom, setUsersInRoom] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [remoteStreams, setRemoteStreams] = useState({});
  const [roomDetails, setRoomDetails]= useState({})
  // Chat feature states
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [unreadMessages, setUnreadMessages] = useState(0);
  
  const socketRef = useRef();
  const userVideoRef = useRef(null);
  const peerConnectionsRef = useRef({});
  const streamRef = useRef();
  const screenStreamRef = useRef();
  const chatContainerRef = useRef(null);

  // STUN servers for ICE candidates
  const iceServers = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ]
  };

  // Handle browser back button and page navigation
  useEffect(() => {
    const fetchRoomDetails = async () =>{
      try {
        const data = await roomDetailsApi(roomId)
        setRoomDetails(data)
        console.log("Room details:", data);
        
      } catch (error) {
        navigate('/TalkSpace');
        throw err
      }
    }
    fetchRoomDetails()
    // Cleanup function to be called on page unload
    const handleBeforeUnload = (e) => {
      cleanupResources();
    };

    // Listen for browser navigation events
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Create a popstate handler for the back button
    const handlePopState = () => {
      cleanupResources();
    };
    
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(()=>{
    setTimeout(()=>{
  notifyTheuser(usersInRoom,roomId)
    },4000)
    
  },[usersInRoom])
  

  useEffect(() => {
    // Connect to the signaling server
    socketRef.current = socket;
    
    // Get your socket ID
    socketRef.current.on('me', (id) => {
      setSocketId(id);
      console.log("Connected with socket ID:", id);
    });
    socketRef.current.on('room_not_found',()=>{
     
      toast.error('Room not found. Please check the room ID or create a new room.');
      navigate('/TalkSpace'); // Go back to join page
    })
    // Handle room full error
    socketRef.current.on('room_full', () => {
      toast.error('Room is full. Please try another room. or create');
      navigate('/TalkSpace'); // Go back to join page
    });

    // Handle user list updates
    socketRef.current.on('users_in_room', (users) => {
      setUsersInRoom(users);
      const map = {};
    users.forEach(u => { map[u.socketId] = u; });
    setUserMap(map);
    });

    // Handle offer request
    socketRef.current.on('offer_request', async ({ from }) => {
      try {
        await createOffer(from);
      } catch (err) {
        console.error("Error creating offer:", err);
      }
    });

    // Handle offer
    socketRef.current.on('offer', async ({ from, offer }) => {
      try {
        await handleOffer(from, offer);
      } catch (err) {
        console.error("Error handling offer:", err);
      }
    });

    // Handle answer
    socketRef.current.on('answer', ({ from, answer }) => {
      try {
        const peerConnection = peerConnectionsRef.current[from];
        if (peerConnection) {
          peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
        }
      } catch (err) {
        console.error("Error handling answer:", err);
      }
    });

    // Handle ICE candidate
    socketRef.current.on('ice_candidate', ({ from, candidate }) => {
      try {
        const peerConnection = peerConnectionsRef.current[from];
        if (peerConnection) {
          peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        }
      } catch (err) {
        console.error("Error adding ICE candidate:", err);
      }
    });

    // Handle user left
    socketRef.current.on('user_left', (id,name) => {
      try {
        if (peerConnectionsRef.current[id]) {
          peerConnectionsRef.current[id].close();
          delete peerConnectionsRef.current[id];
        }
        
        setRemoteStreams(prev => {
          const newStreams = { ...prev };
          delete newStreams[id];
          return newStreams;
        });
        
        // Add system message when user leaves
        setMessages(prev => [
          ...prev,
          { 
            type: 'system', 
            content: ` ${name} left the room`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } catch (err) {
        console.error("Error handling user disconnect:", err);
      }
    });

    // Handle chat messages
    socketRef.current.on('chat_message', ({ from, message,userData }) => {
      const newMessage = {
        type: 'remote',
        sender: userData.name,
       
        content: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, newMessage]);
      
      // Increment unread counter if chat is not open
      if (!isChatOpen) {
        setUnreadMessages(prev => prev + 1);
      }
      
      // Play notification sound
      const audio = new Audio('/aud/group_chat_received_25c22bd649cdf2538dcc3a39ba7a616b.mp3');
      audio.play().catch(err => console.log('Audio play failed:', err));
    });

    // Setup video call when component mounts
    setupVideoCall();

    return () => {
      // Clean up resources when component unmounts
      cleanupResources();
    };
  }, []); // Empty dependency array to run only once on mount

  // Update unread messages counter when isChatOpen changes
  useEffect(() => {
    if (isChatOpen) {
      setUnreadMessages(0);
    }
  }, [isChatOpen]);

  // Auto scroll chat to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current && isChatOpen) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isChatOpen]);

  const setupVideoCall = async () => {
    try {
      // Clear previous error messages
      setErrorMessage('');
      
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      
      // We'll set the video element srcObject after the component re-renders
      setTimeout(() => {
        if (userVideoRef.current) {
          userVideoRef.current.srcObject = stream;
           const audio = new Audio('/aud/join_call_6a6a67d6bcc7a4e373ed40fdeff3930a.ogg');
      audio.play().catch(err => console.log('Audio play failed:', err));
          
        } else {
          console.error("Video element not found after timeout");
        }
      }, 100);
      
      // Join a room
      socketRef.current.emit('join_room', roomId, userData.token);
      
      // Add system message for joining
      setMessages([{ 
        type: 'system', 
        content: 'You joined the room', 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (err) {
      console.error("Error accessing media devices:", err);
      if (err.name === 'NotAllowedError') {
        setErrorMessage('Camera or microphone access denied. Please allow access in your browser settings.');
      } else if (err.name === 'NotFoundError') {
        setErrorMessage('Camera or microphone not found. Please check your device connections.');
      } else {
        setErrorMessage(`Failed to access camera or microphone: ${err.message}`);
      }
      // Navigate back to join room page if there was an error
      navigate('/Talkspace');
    }
  };

  const cleanupResources = () => {
    console.log("Cleaning up resources and stopping all media tracks");
    
    // Stop all media tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log(`Stopped track: ${track.kind}`);
      });
      streamRef.current = null;
    }
    
    // Clean up screen sharing
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log(`Stopped screen sharing track: ${track.kind}`);
      });
      screenStreamRef.current = null;
    }

    // Close all peer connections
    Object.keys(peerConnectionsRef.current).forEach(peerId => {
      const connection = peerConnectionsRef.current[peerId];
      if (connection) {
        connection.close();
        console.log(`Closed peer connection with: ${peerId}`);
      }
    });
    peerConnectionsRef.current = {};
    
    // Clean up socket connection
    if (socketRef.current) {
      socketRef.current.emit('leave_room');
      console.log("Emitted leave_room event");
    }
  };

  const createPeerConnection = (userId) => {
    try {
      // Create new RTCPeerConnection
      const peerConnection = new RTCPeerConnection(iceServers);
      
      // Add local tracks to peer connection
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => {
          peerConnection.addTrack(track, streamRef.current);
        });
      }
      
      // Handle ICE candidate events
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socketRef.current.emit('ice_candidate', {
            to: userId,
            candidate: event.candidate
          });
        }
      };
      
      // Handle remote stream
      peerConnection.ontrack = (event) => {
        setRemoteStreams(prev => ({
          ...prev,
          [userId]: event.streams[0]
        }));
      };
      
      return peerConnection;
    } catch (err) {
      console.error("Error creating peer connection:", err);
      return null;
    }
  };

  const createOffer = async (userId) => {
    try {
      // Create peer connection if it doesn't exist
      if (!peerConnectionsRef.current[userId]) {
        const peerConnection = createPeerConnection(userId);
        peerConnectionsRef.current[userId] = peerConnection;
      }
      
      const peerConnection = peerConnectionsRef.current[userId];
      
      // Create offer
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      
      // Send offer to remote peer
      socketRef.current.emit('offer', {
        to: userId,
        offer: peerConnection.localDescription
      });
    } catch (err) {
      console.error("Error creating offer:", err);
    }
  };

  const handleOffer = async (userId, offer) => {
    try {
      // Create peer connection if it doesn't exist
      if (!peerConnectionsRef.current[userId]) {
        const peerConnection = createPeerConnection(userId);
        peerConnectionsRef.current[userId] = peerConnection;
      }
      
      const peerConnection = peerConnectionsRef.current[userId];
      
      // Set remote description (the offer)
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      
      // Create answer
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      
      // Send answer to remote peer
      socketRef.current.emit('answer', {
        to: userId,
        answer: peerConnection.localDescription
      });
    } catch (err) {
      console.error("Error handling offer:", err);
    }
  };

  const leaveRoom = () => {
    cleanupResources();
    navigate('/TalkSpace', { replace: true }); // Using replace to avoid back button issues
  };

  const toggleAudio = () => {
    if (streamRef.current) {
      const audioTracks = streamRef.current.getAudioTracks();
      if (audioTracks.length > 0) {
        audioTracks[0].enabled = isAudioMuted;
        setIsAudioMuted(!isAudioMuted);
        if(!isAudioMuted){
          const audio = new Audio('/aud/mute_and_unmute.mp3');
      audio.play().catch(err => console.log('Audio play failed:', err));
        }else{
           const audio = new Audio('/aud/unmute.mp3');
      audio.play().catch(err => console.log('Audio play failed:', err));
        }
        
      }
    }
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTracks = streamRef.current.getVideoTracks();
      if (videoTracks.length > 0) {
        videoTracks[0].enabled = isVideoOff;
        setIsVideoOff(!isVideoOff);
        if(!isVideoOff){
            const audio = new Audio('/aud/mute_and_unmute.mp3');
      audio.play().catch(err => console.log('Audio play failed:', err));
        }else{
             const audio = new Audio('/aud/unmute.mp3');
      audio.play().catch(err => console.log('Audio play failed:', err));
        }
       
      }
    }
  };

  const shareScreen = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ 
          video: { cursor: true },
          audio: false
        });
        
        screenStreamRef.current = screenStream;
        
        // Replace video track for all peer connections
        const videoTrack = screenStream.getVideoTracks()[0];
        
        Object.values(peerConnectionsRef.current).forEach((pc) => {
          const sender = pc.getSenders().find(s => s.track && s.track.kind === 'video');
          if (sender) {
            sender.replaceTrack(videoTrack);
          }
        });
        
        // Update local video
        if (userVideoRef.current) {
          userVideoRef.current.srcObject = screenStream;
        }
        
        // Listen for screen sharing end
        videoTrack.onended = () => {
          stopScreenSharing();
        };
        
        setIsScreenSharing(true);
      } catch (err) {
        console.error("Error sharing screen:", err);
        setErrorMessage(`Failed to share screen: ${err.message}`);
      }
    } else {
      stopScreenSharing();
    }
  };

  const stopScreenSharing = () => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      
      // Replace screen track with camera track for all peer connections
      if (streamRef.current) {
        const videoTracks = streamRef.current.getVideoTracks();
        if (videoTracks.length > 0) {
          const videoTrack = videoTracks[0];
          
          Object.values(peerConnectionsRef.current).forEach((pc) => {
            const sender = pc.getSenders().find(s => s.track && s.track.kind === 'video');
            if (sender) {
              sender.replaceTrack(videoTrack);
            }
          });
          
          // Update local video
          if (userVideoRef.current) {
            userVideoRef.current.srcObject = streamRef.current;
          }
        }
      }
      
      setIsScreenSharing(false);
    }
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    if (!isChatOpen) {
      // Reset unread counter when opening chat
      setUnreadMessages(0);
    }
  };

  const sendMessage = () => {
    if (messageInput.trim() === '') return;
    
    const newMessage = {
      type: 'local',
      content: messageInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    // Add message to local state
    setMessages(prev => [...prev, newMessage]);
    
    // Send message through socket
    socketRef.current.emit('chat_message', {
      roomId,
      message: messageInput
    });
    
    // Clear input
    setMessageInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (errorMessage) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-red-500 text-lg mb-4">{errorMessage}</div>
        <button 
          onClick={() => navigate('/Talkspace')}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
        >
          Back to Group Selection
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-800">
      <div className="bg-gray-700  p-4 flex justify-between items-center">
        <h2 className="text-xl text-white font-semibold">Group: {roomDetails&&roomDetails.roomName||'Group name'}</h2>
        <div className="flex items-center text-sm text-gray-300 bg-gray-800 px-3 py-1 rounded-full shadow-sm">Connected Users:  <Users size={14} className="mr-2 text-blue-400" /> {usersInRoom.length}/3</div>
        
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        {/* Main video grid */}
        <div className={`flex-1 flex flex-wrap p-4 gap-4 overflow-auto ${isChatOpen ? 'w-3/4' : 'w-full'}`}>
          {/* Local Video */}
          <div className="relative bg-gray-200 rounded-lg overflow-hidden w-full md:w-80 h-60">
            
            <video 
              ref={userVideoRef} 
              autoPlay 
              muted 
              playsInline 
              className={`w-full h-full object-cover  ${isVideoOff ? 'hidden' : ''}` }
            />
             {isVideoOff && (
              <div className="w-full h-full object-cover ">
    <img 
      src={userData.profileImage} 
      alt="User Profile" 
      className="w-full h-full object-cover blur-sm" 
    />
      <div className="absolute inset-0 flex items-center justify-center">
      <img 
        src={userData.profileImage} 
        alt="User Avatar" 
        className="w-20 h-20 rounded-full border-2 border-white shadow-lg object-cover" 
      />
    </div>
    </div>
  )}
            <div className="absolute bottom-2 left-2 bg-gray-800 bg-opacity-60 text-white text-sm px-2 py-1 rounded">
              You {isScreenSharing ? '(Screen)' : ''}
            </div>

          </div>
          
          {/* Remote Videos */}
          {Object.keys(remoteStreams).map(peerId => (
            <div key={peerId} className="relative bg-gray-200 rounded-lg overflow-hidden w-full md:w-80 h-60">
              <RemoteVideo stream={remoteStreams[peerId]} 
               user={userMap[peerId]}
             
      
              />
              <div className="absolute bottom-2 left-2 bg-gray-800 bg-opacity-60 text-white text-sm px-2 py-1 rounded">
                {userMap[peerId]?.name ? userMap[peerId].name : `User ${peerId.substring(0, 5)}`}
              </div>
            </div>
          ))}
        </div>
        
        {/* Chat panel */}
        {isChatOpen && (
          <div className=" w-1/4 min-w-64 border-l border-gray-300 flex flex-col bg-white">
            <div className="p-3 bg-gray-100 border-b border-gray-300 font-medium flex justify-between items-center">
              <span>Chat</span>
              <button onClick={toggleChat} className="text-gray-500 hover:text-gray-700">
                <X size={18} />
              </button>
            </div>
            
            {/* Messages container */}
            <div 
              ref={chatContainerRef} 
              className="flex-1 overflow-y-auto p-4 space-y-3"
            >
              {messages.map((msg, index) => (
                <div key={index} className={`max-w-xs ${msg.type === 'local' ? 'ml-auto' : msg.type === 'system' ? 'mx-auto text-center' : ''}`}>
                  {msg.type === 'system' ? (
                    <div className="text-xs text-gray-500 py-1 px-2 bg-gray-100 rounded inline-block">
                      {msg.content}
                    </div>
                  ) : (
                    <div className={`p-3 rounded-lg ${msg.type === 'local' ? 'bg-black text-white' : 'bg-gray-200'}`}>
                      {msg.type === 'remote' && (
                        <div className="text-xs font-medium text-gray-700 mb-1">
                           {msg.sender}
                        </div>
                      )}
                      <div>{msg.content}</div>
                      <div className="text-xs mt-1 text-right opacity-75">
                        {msg.time}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Message input */}
            <div className="p-3 border-t border-gray-300">
              <div className="flex">
                <textarea
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type a message..."
                  className="flex-1 p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                  rows="2"
                />
                <button
                  onClick={sendMessage}
                  disabled={!messageInput.trim()}
                  className={`p-2 mx-0.5 rounded-r flex items-center justify-center ${!messageInput.trim() ? 'bg-gray-300' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                >
                  <Send size={20} />
                </button>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Press Enter to send, Shift+Enter for new line
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-gray-700 p-4 flex justify-center space-x-4">
        <button 
          onClick={toggleAudio}
          className={`p-3 rounded-full ${isAudioMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-200 hover:bg-gray-300'}`}
          title={isAudioMuted ? "Unmute microphone" : "Mute microphone"}
        >
          {isAudioMuted ? <MicOff size={24} /> : <Mic size={24} />}
        </button>
        <button 
          onClick={toggleVideo}
          className={`p-3 rounded-full ${isVideoOff ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-200 hover:bg-gray-300'}`}
          title={isVideoOff ? "Turn on camera" : "Turn off camera"}
        >
          {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
        </button>
        <button 
          onClick={shareScreen}
          className={`p-3 rounded-full ${isScreenSharing ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'} hidden md:inline-flex`}
          title={isScreenSharing ? "Stop screen sharing" : "Share screen"}
        >
          <Monitor size={24} />
        </button>
        <button 
          onClick={toggleChat}
          className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 relative"
          title="Toggle chat"
        >
          <MessageSquare size={24} />
          {unreadMessages > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadMessages}
            </span>
          )}
        </button>
         <button 
          onClick={leaveRoom}
          className={`p-3 px-5 rounded-full  bg-red-500 hover:bg-red-600`}
          title={isScreenSharing ? "Stop screen sharing" : "Share screen"}
        >
          <span className="material-symbols-outlined">
call_end
</span>
        </button>
      </div>
    </div>
  );
};

export default RoomPage;