import { createContext, useContext, useEffect, useState } from 'react';
import { playBackgroundAudio } from '@/service/audio'; // adjust path if needed

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [audioControls, setAudioControls] = useState(null);

  useEffect(() => {
    const player = playBackgroundAudio({
      volume: 0.1,
      loop: true,
    });

    setAudioControls(player);

    return () => {
      player.pause();
    };
  }, []);

  const playAudio = () => {
    audioControls?.play();
  };

  const pauseAudio = () => {
    audioControls?.pause();
  };

  return (
    <AudioContext.Provider value={{ playAudio, pauseAudio }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);
