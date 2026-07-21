import React, { useEffect, useRef, useState } from 'react';
import { Music2, VolumeX } from 'lucide-react';
import { focusMusic } from '../data/loveData';

type WebkitAudioWindow = Window & typeof globalThis & {
  webkitAudioContext?: typeof AudioContext;
};

interface MusicToggleProps {
  className?: string;
}

const MusicToggle: React.FC<MusicToggleProps> = ({ className = '' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const intervalRef = useRef<number | null>(null);

  const stop = (updateState = true) => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const context = audioContextRef.current;
    const gain = masterGainRef.current;
    if (context && gain) {
      gain.gain.cancelScheduledValues(context.currentTime);
      gain.gain.setTargetAtTime(0.0001, context.currentTime, 0.18);
    }

    window.setTimeout(() => {
      audioContextRef.current?.close();
      audioContextRef.current = null;
      masterGainRef.current = null;
    }, 450);

    if (updateState) setIsPlaying(false);
  };

  const playNote = (frequency: number, delay: number, duration = 1.8) => {
    const context = audioContextRef.current;
    const masterGain = masterGainRef.current;
    if (!context || !masterGain) return;

    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const filter = context.createBiquadFilter();
    const startAt = context.currentTime + delay;

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, startAt);
    oscillator.detune.setValueAtTime(Math.random() * 6 - 3, startAt);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, startAt);
    gain.gain.setValueAtTime(0.0001, startAt);
    gain.gain.exponentialRampToValueAtTime(0.12, startAt + 0.24);
    gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);

    oscillator.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);
    oscillator.start(startAt);
    oscillator.stop(startAt + duration + 0.1);
  };

  const play = async () => {
    const AudioContextConstructor = window.AudioContext || (window as WebkitAudioWindow).webkitAudioContext;
    if (!AudioContextConstructor) return;

    const context = new AudioContextConstructor();
    const masterGain = context.createGain();
    masterGain.gain.setValueAtTime(0.0001, context.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.055, context.currentTime + 0.8);
    masterGain.connect(context.destination);

    audioContextRef.current = context;
    masterGainRef.current = masterGain;

    const phrase = () => {
      playNote(261.63, 0);
      playNote(329.63, 0.38);
      playNote(392.0, 0.76);
      playNote(523.25, 1.36, 2.3);
    };

    phrase();
    intervalRef.current = window.setInterval(phrase, 5200);
    setIsPlaying(true);
  };

  useEffect(() => () => stop(false), []);

  return (
    <button
      type="button"
      onClick={isPlaying ? () => stop() : play}
      className={[
        'inline-flex items-center gap-2 rounded-full bg-white/45 px-5 py-3 text-sm font-semibold text-rose-950/70 shadow-lg backdrop-blur-md transition-colors hover:bg-white/65 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/60',
        className,
      ].join(' ')}
      aria-pressed={isPlaying}
      aria-label={isPlaying ? 'Tắt nhạc nền' : 'Bật nhạc nền'}
      title={focusMusic.description}
    >
      {isPlaying ? <VolumeX className="h-4 w-4" /> : <Music2 className="h-4 w-4" />}
      {isPlaying ? 'Tắt nhạc' : 'Bật nhạc'}
    </button>
  );
};

export default MusicToggle;
