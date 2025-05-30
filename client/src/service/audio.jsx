// audioPlayer.js
let backgroundAudio = null;
import sound from '../assets/Better When.mp3';

export function playBackgroundAudio(options = {}) {
  const {
    loop = true,
    volume = 0.5,
    muted = false,
    autoPlay = true,
  } = options;

  // If already playing, stop previous
  if (backgroundAudio) {
    backgroundAudio.pause();
    backgroundAudio = null;
  }

  backgroundAudio = new Audio(sound);
  backgroundAudio.loop = loop;
  backgroundAudio.volume = volume;
  backgroundAudio.muted = muted;
  const playAudio = () => {
    backgroundAudio.play().catch(() => {});
    document.removeEventListener('click', playAudio);
    document.removeEventListener('keydown', playAudio);
  };

  if (autoPlay) {
    document.addEventListener('click', playAudio);
    document.addEventListener('keydown', playAudio);
  }

  return {
    pause: () => {
      if (backgroundAudio) {
        backgroundAudio.pause();
      }
    },
    play: () => {
      if (backgroundAudio) {
        backgroundAudio.play().catch(() => {});
      }
    },
  };
}
