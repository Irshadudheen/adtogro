import { createContext, useContext, useEffect, useState } from 'react';
import { playBackgroundAudio } from '@/service/audio'; // adjust path if needed

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [audioControls, setAudioControls] = useState(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
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
    setIsAudioEnabled(true);
  };

  const pauseAudio = () => {
    audioControls?.pause();
    setIsAudioEnabled(false);
  };

  return (
    <AudioContext.Provider value={{ playAudio, pauseAudio,isAudioEnabled }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);
