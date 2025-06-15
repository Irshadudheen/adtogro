import React, { useEffect, useRef } from 'react';

const RemoteVideo = ({ stream }) => {
  const ref = useRef(null);

  useEffect(() => {
    const setVideoStream = () => {
      if (stream && ref.current) {
        ref.current.srcObject = stream;
      }
    };
    
    setVideoStream();
    // Add a small delay to ensure the ref is connected
    const timeoutId = setTimeout(setVideoStream, );
    
    return () => {
      clearTimeout(timeoutId);
      if (ref.current) {
        ref.current.srcObject = null;
      }
    };
  }, [stream]);

  return <video ref={ref} autoPlay playsInline className="w-full h-full object-cover" />;
};

export default RemoteVideo;