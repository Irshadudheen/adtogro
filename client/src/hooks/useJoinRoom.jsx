import { createContext, useContext, useRef, useState } from 'react';
import { io } from 'socket.io-client'; // if you are creating socket here
import { v4 as uuid } from 'uuid'; // for generating unique room IDs
const iceServers = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    
  ]
};
const JoinRoomContext = createContext();
export const useJoinRoom = () => {
    return useContext(JoinRoomContext);
  };
  export const JoinRoomProvider = ({ children }) => {
    const [roomId, setRoomId] = useState('');
    const [isInRoom, setIsInRoom] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [messages, setMessages] = useState([]);
    
    const streamRef = useRef(null);
    const userVideoRef = useRef(null);
    const socketRef = useRef(null);
  
    const joinRoom = async (inputRoomId = null) => {
      try {
        setErrorMessage('');
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        streamRef.current = stream;
  
        const newRoomId = inputRoomId || uuidv4();
        setRoomId(newRoomId);
        setIsInRoom(true);
  
        setTimeout(() => {
          if (userVideoRef.current) {
            userVideoRef.current.srcObject = stream;
          } else {
            console.error("Video element not found");
          }
        }, 100);
  
       
         
        
        socketRef.current.emit('join_room', newRoomId);
  
        setMessages([{
          type: 'system',
          content: `You joined the room ${newRoomId}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } catch (err) {
        console.error("Error accessing media devices:", err);
        if (err.name === 'NotAllowedError') {
          setErrorMessage('Camera or microphone access denied.');
        } else if (err.name === 'NotFoundError') {
          setErrorMessage('Camera or microphone not found.');
        } else {
          setErrorMessage(`Error: ${err.message}`);
        }
      }
    };
  
    return (
      <JoinRoomContext.Provider value={{
        roomId,
        isInRoom,
        errorMessage,
        messages,
        streamRef,
        userVideoRef,
        socketRef,
        joinRoom,
        setMessages
      }}>
        {children}
      </JoinRoomContext.Provider>
    );
  };