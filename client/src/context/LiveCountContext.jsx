import React, { createContext, useState, useEffect } from 'react';
import socket from '../utils/socket';

export const LiveCountContext = createContext();

const formatLiveCount = (count) => {
  if (count < 1_000) return count.toString();
  if (count < 1_000_000) return (count / 1_000).toFixed(count % 1_000 === 0 ? 0 : 1) + 'K';
  if (count < 1_000_000_000) return (count / 1_000_000).toFixed(count % 1_000_000 === 0 ? 0 : 1) + 'M';
  return (count / 1_000_000_000).toFixed(count % 1_000_000_000 === 0 ? 0 : 1) + 'B';
};
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
  const formattedLiveCount = formatLiveCount(liveCount);
  return (
    <LiveCountContext.Provider value={formattedLiveCount}>
      {children}
    </LiveCountContext.Provider>
  );
};