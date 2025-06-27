import React, { useState } from "react";
import { Video, Mic, MicOff, Monitor, VideoOff, X, MessageSquare, Send, Users, } from 'lucide-react';
import { useSocket } from "../../context/videoCallRoomContext/useSocketContext";
function FooterRoom() {
      const {isAudioMuted} = useSocket()
      const [isVideoOff, setIsVideoOff] = useState(false);
      const [isScreenSharing, setIsScreenSharing] = useState(false);
     const [isChatOpen, setIsChatOpen] = useState(false);
     const [unreadMessages, setUnreadMessages] = useState(0);
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
      audio.play().catch( );
        }else{
           const audio = new Audio('/aud/unmute.mp3');
      audio.play().catch();
        }
        
      }
    }
  };
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    if (!isChatOpen) {
      // Reset unread counter when opening chat
      setUnreadMessages(0);
    }
  };
  const stopScreenSharing = () => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => {
        track.stop();
      });

      // Replace screen track with camera track for all peer connections
      if (streamRef.current) {
        const videoTracks = streamRef.current.getVideoTracks();
        if (videoTracks.length > 0) {
          const videoTrack = videoTracks[0];

          Object.values(peerConnectionsRef.current).forEach((pc) => {
            const sender = pc
              .getSenders()
              .find((s) => s.track && s.track.kind === "video");
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
  const shareScreen = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: { cursor: true },
          audio: false,
        });

        screenStreamRef.current = screenStream;

        // Replace video track for all peer connections
        const videoTrack = screenStream.getVideoTracks()[0];

        Object.values(peerConnectionsRef.current).forEach((pc) => {
          const sender = pc
            .getSenders()
            .find((s) => s.track && s.track.kind === "video");
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
  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTracks = streamRef.current.getVideoTracks();
      if (videoTracks.length > 0) {
        videoTracks[0].enabled = isVideoOff;
        setIsVideoOff(!isVideoOff);

        socketRef.current.emit("video_status_changed", {
          roomId,
          userId: socketId,
          isVideoOff: !isVideoOff,
        });

        if (!isVideoOff) {
          const audio = new Audio("/aud/mute_and_unmute.mp3");
          audio.play().catch();
        } else {
          const audio = new Audio("/aud/unmute.mp3");
          audio.play().catch();
        }
      }
    }
  };
  return (
    <div>
      <div className="bg-gray-700 p-4 flex justify-center space-x-4">
        <button
          onClick={toggleAudio}
          className={`p-3 rounded-full ${
            isAudioMuted
              ? "bg-red-500 hover:bg-red-600"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
          title={isAudioMuted ? "Unmute microphone" : "Mute microphone"}
        >
          {isAudioMuted ? <MicOff size={24} /> : <Mic size={24} />}
        </button>
        <button
          onClick={toggleVideo}
          className={`p-3 rounded-full ${
            isVideoOff
              ? "bg-red-500 hover:bg-red-600"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
          title={isVideoOff ? "Turn on camera" : "Turn off camera"}
        >
          {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
        </button>
        <button
          onClick={shareScreen}
          className={`p-3 rounded-full ${
            isScreenSharing
              ? "bg-blue-500 hover:bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          } hidden md:inline-flex`}
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
          <span className="material-symbols-outlined">call_end</span>
        </button>
      </div>
    </div>
  );
}

export default FooterRoom;
