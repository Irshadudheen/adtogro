import React, { createContext, useState, useEffect } from 'react';
import socket from '../utils/socket';

export const LiveCountContext = createContext();

export const LiveCountProvider = ({ children }) => {
  const [liveCount, setLiveCount] = useState(0);

  useEffect(() => {
    // Fetch the initial live count from the server
    socket.emit('getUserCount', (count) => {
      setLiveCount(count);
    });

    // Listen for live count updates
    socket.on('userCount', (count) => {
      setLiveCount(count);
    });

    return () => {
      socket.off('userCount'); // Clean up the listener
    };
  }, []);

  return (
    <LiveCountContext.Provider value={liveCount}>
      {children}
    </LiveCountContext.Provider>
  );
};