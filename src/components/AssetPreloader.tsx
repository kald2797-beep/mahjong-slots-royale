import { useEffect } from 'react';
import bgDragon from '../assets/bg-dragon-paradise.jpg';
import bgTemple from '../assets/bg-temple.jpg';
import themeMusic from '../assets/theme-music.mp3';
import s0 from '../assets/symbols/s0.png';
import s1 from '../assets/symbols/s1.png';
import s2 from '../assets/symbols/s2.png';
import s3 from '../assets/symbols/s3.png';
import s4 from '../assets/symbols/s4.png';
import s5 from '../assets/symbols/s5.png';
import s6 from '../assets/symbols/s6.png';
import s7 from '../assets/symbols/s7.png';
import s8 from '../assets/symbols/s8.png';
import s9 from '../assets/symbols/s9.png';

const IMAGE_SRCS = [
  bgDragon, bgTemple,
  s0, s1, s2, s3, s4, s5, s6, s7, s8, s9,
];

const AUDIO_SRCS = [themeMusic];

export function AssetPreloader() {
  useEffect(() => {
    IMAGE_SRCS.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    AUDIO_SRCS.forEach((src) => {
      const audio = document.createElement('audio');
      audio.preload = 'auto';
      audio.src = src;
      audio.style.display = 'none';
      document.body.appendChild(audio);
    });
  }, []);

  return null;
}
