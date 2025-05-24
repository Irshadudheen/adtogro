import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import socket from '../../utils/socket';
import useGetUserData from '../../hooks/useGetUser'
import toast from 'react-hot-toast';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const {roomId} = useParams()
  const socketRef = useRef(null);
  const streamRef = useRef(null);
    const userVideoRef = useRef(null);
  const userData = useGetUserData()
  const screenStreamRef  = useRef(null)
  const peerConnectionsRef = useRef({});
  const [socketId, setSocketId] = useState(null);
  const [usersInRoom, setUsersInRoom] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [messages, setMessages] = useState([]);
  const [remoteStreams, setRemoteStreams] = useState({});
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [isAudioMuted,setIsAudioMuted] = useState(true)
  const [isVideoOff,setIsVideoOff] =useState()
  const [errorMessage,setErrorMessage] = useState('')
  const [isChatOpen, setIsChatOpen] = useState(true); // make sure to control this from your component
  const navigate = useNavigate();
  const createPeerConnection = async (from)=>{
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
            to: from,
            candidate: event.candidate
          });
        }
      };
      
      // Handle remote stream
      peerConnection.ontrack = (event) => {
        setRemoteStreams(prev => ({
          ...prev,
          [from]: event.streams[0]
        }));
      };
      
      return peerConnection;
    } catch (err) {
      console.error("Error creating peer connection:", err);
      return null;
    }
  }
  const createOffer = async (from) => {
    try {
      // Create peer connection if it doesn't exist
      if (!peerConnectionsRef.current[from]) {
        const peerConnection = createPeerConnection(from);
        peerConnectionsRef.current[from] = peerConnection;
      }
      
      const peerConnection = peerConnectionsRef.current[from];
      
      // Create offer
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      
      // Send offer to remote peer
      socketRef.current.emit('offer', {
        to: from,
        offer: peerConnection.localDescription
      });
    } catch (err) {
      console.error("Error creating offer:", err);
    }
  };

  const handleOffer = async (from, offer) => {
     try {
      // Create peer connection if it doesn't exist
      if (!peerConnectionsRef.current[from]) {
        const peerConnection = createPeerConnection(from);
        peerConnectionsRef.current[from] = peerConnection;
      }
      
      const peerConnection = peerConnectionsRef.current[from];
      
      // Set remote description (the offer)
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      
      // Create answer
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      
      // Send answer to remote peer
      socketRef.current.emit('answer', {
        to: from,
        answer: peerConnection.localDescription
      });
    } catch (err) {
      console.error("Error handling offer:", err);
    }
  };

  const setupVideoCall = async() => {
     try {
      // Clear previous error messages
      setErrorMessage('');
       setIsAudioMuted(true);   // update state accordingly
    setIsVideoOff(true);
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      stream.getAudioTracks().forEach(track => track.enabled = false);
    stream.getVideoTracks().forEach(track => track.enabled = false);

   
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
   try {
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
   } catch (error) {
    console.error(error)
   }
  };

  useEffect(() => {
     // or import socket from another file
    socketRef.current = socket;

    socketRef.current.on('me', (id) => {
      setSocketId(id);
      console.log("Connected with socket ID:", id);
    });

    socketRef.current.on('already_in_room', () => {
      toast.error('You are already in a room. Please leave the current room before joining another.');
      navigate('/talkspace');
    });

    socketRef.current.on('room_not_found', () => {
      toast.error('Room not found. Please check the room ID or create a new room.');
      navigate('/TalkSpace');
    });

    socketRef.current.on('room_full', () => {
      toast.error('Room is full. Please try another room or create a new one.');
      navigate('/TalkSpace');
    });

    socketRef.current.on('users_in_room', (users) => {
      setUsersInRoom(users);
      const map = {};
      users.forEach(u => { map[u.socketId] = u; });
      setUserMap(map);
    });

    socketRef.current.on('offer_request', async ({ from }) => {
      try {
        await createOffer(from);
      } catch (err) {
        console.error("Error creating offer:", err);
      }
    });

   socketRef.current.on('offer', async ({ from, offer }) => {
      try {
        await handleOffer(from, offer);
      } catch (err) {
        console.error("Error handling offer:", err);
      }
    });

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

    socketRef.current.on('user_left', (id, name) => {
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

        setMessages(prev => [
          ...prev,
          {
            type: 'system',
            content: `${name} left the room`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } catch (err) {
        console.error("Error handling user disconnect:", err);
      }
    });

  socketRef.current.on('chat_message', ({ from, message, userData }) => {
      const newMessage = {
        type: 'remote',
        sender: userData.name,
        content: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, newMessage]);

      if (!isChatOpen) {
        setUnreadMessages(prev => prev + 1);
      }

      const audio = new Audio('/aud/group_chat_received_25c22bd649cdf2538dcc3a39ba7a616b.mp3');
      audio.play().catch(err => console.log('Audio play failed:', err));
    });

    setupVideoCall();

    return () => {
      cleanupResources();
      
    };
  }, []);

  return (
    <SocketContext.Provider value={{
      socketRef,
      peerConnectionsRef,
      socketId,
      usersInRoom,
      userMap,
      messages,
      remoteStreams,
      unreadMessages,
      isAudioMuted,
      cleanupResources,
      setupVideoCall,
      setIsChatOpen,
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
