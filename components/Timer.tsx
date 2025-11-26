import React, { useState, useEffect, useRef } from 'react';
import { TimeLeft } from '../types';
import { Heart, Star, Gem, Sparkles, Zap } from 'lucide-react';

interface TimerProps {
  targetDate: Date;
}

const Timer: React.FC<TimerProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const target = targetDate.getTime();
      const difference = now - target;
      
      const isPast = difference >= 0;
      const absDiff = Math.abs(difference);

      const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((absDiff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isPast });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="flex flex-col items-center justify-center p-8 relative">
      <style>
        {`
          @keyframes floatUp {
            0% { transform: translateY(0) scale(0.5) rotate(0deg); opacity: 0; }
            20% { opacity: 1; transform: translateY(-20px) scale(1.2) rotate(-10deg); }
            100% { transform: translateY(-100px) scale(1) rotate(20deg); opacity: 0; }
          }
          @keyframes floatUpSpecial {
             0% { transform: translateY(0) scale(0.5) rotate(0deg); opacity: 0; }
             15% { opacity: 1; transform: translateY(-30px) scale(1.5) rotate(15deg); }
             100% { transform: translateY(-140px) scale(1.2) rotate(-15deg); opacity: 0; }
          }
        `}
      </style>
      <h2 className="text-2xl md:text-3xl text-pink-800 font-light mb-8 uppercase tracking-widest text-center">
        {timeLeft.isPast ? "Chúng mình đã yêu nhau được" : "Đếm ngược đến ngày đặc biệt"}
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
        <TimeUnit value={timeLeft.days} label="Ngày" type="days" />
        <TimeUnit value={timeLeft.hours} label="Giờ" type="hours" />
        <TimeUnit value={timeLeft.minutes} label="Phút" type="minutes" />
        <TimeUnit value={timeLeft.seconds} label="Giây" type="seconds" />
      </div>

      <div className="mt-10 text-center">
        <p className="text-lg text-pink-600 font-medium animate-pulse">
          {timeLeft.isPast 
            ? "Mỗi giây trôi qua đều là khoảnh khắc tuyệt vời." 
            : "Chờ đợi là hạnh phúc..."}
        </p>
      </div>
    </div>
  );
};

type EggType = 'gold' | 'love' | 'diamond' | 'magic' | 'energy' | null;

interface Particle {
  id: number;
  eggType: EggType; // If null, it's a normal particle
  offset: number; // Random horizontal offset
}

const TimeUnit: React.FC<{ value: number; label: string; type: 'days' | 'hours' | 'minutes' | 'seconds' }> = ({ value, label, type }) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const prevValueRef = useRef(value);
  const firstRender = useRef(true);

  useEffect(() => {
    // Skip animation on first render
    if (firstRender.current) {
      firstRender.current = false;
      prevValueRef.current = value;
      return;
    }

    if (value !== prevValueRef.current) {
      // Logic for spawning particles
      const isRoundNumber = value % 10 === 0 && value !== 0; // Easter egg condition
      
      let eggType: EggType = null;
      if (isRoundNumber) {
        const types: EggType[] = ['gold', 'love', 'diamond', 'magic', 'energy'];
        eggType = types[Math.floor(Math.random() * types.length)];
      }

      const id = Date.now();
      
      // Add new particle
      setParticles(prev => [...prev, { 
        id, 
        eggType,
        offset: Math.random() * 60 - 30 // Random x offset between -30px and 30px
      }]);

      // Cleanup particle after animation
      setTimeout(() => {
        setParticles(prev => prev.filter(p => p.id !== id));
      }, 2500);

      prevValueRef.current = value;
    }
  }, [value]);

  const renderEasterEggIcon = (eggType: EggType) => {
    switch (eggType) {
      case 'gold':
        return (
          <>
            <Star className="w-10 h-10 fill-yellow-400 text-yellow-500 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]" />
            <div className="absolute inset-0 bg-yellow-400/50 rounded-full blur-xl animate-pulse"></div>
          </>
        );
      case 'love':
        return (
          <>
            <Heart className="w-12 h-12 fill-red-500 text-red-600 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
            <div className="absolute inset-0 bg-red-400/50 rounded-full blur-xl animate-pulse"></div>
          </>
        );
      case 'diamond':
        return (
          <>
            <Gem className="w-10 h-10 fill-cyan-400 text-blue-500 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
            <div className="absolute inset-0 bg-cyan-400/50 rounded-full blur-xl animate-pulse"></div>
          </>
        );
      case 'magic':
        return (
          <>
            <Sparkles className="w-12 h-12 fill-purple-400 text-purple-600 drop-shadow-[0_0_15px_rgba(192,132,252,0.8)]" />
            <div className="absolute inset-0 bg-purple-400/50 rounded-full blur-xl animate-pulse"></div>
          </>
        );
      case 'energy':
        return (
          <>
            <Zap className="w-10 h-10 fill-orange-400 text-orange-600 drop-shadow-[0_0_15px_rgba(251,146,60,0.8)]" />
            <div className="absolute inset-0 bg-orange-400/50 rounded-full blur-xl animate-pulse"></div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center relative group">
      {/* Container for particles - absolute relative to this unit */}
      <div className="absolute inset-0 pointer-events-none overflow-visible flex justify-center z-20">
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute bottom-full mb-2"
            style={{
              left: `calc(50% + ${p.offset}px)`,
              animation: p.eggType ? 'floatUpSpecial 2s ease-out forwards' : 'floatUp 1.5s ease-out forwards',
              zIndex: p.eggType ? 30 : 20
            }}
          >
            {p.eggType ? (
              <div className="relative transform hover:scale-110 transition-transform">
                {renderEasterEggIcon(p.eggType)}
              </div>
            ) : (
              <Heart 
                className={`fill-current ${
                  type === 'days' ? 'w-8 h-8 text-purple-500' :
                  type === 'hours' ? 'w-6 h-6 text-red-500' :
                  type === 'minutes' ? 'w-5 h-5 text-rose-400' :
                  'w-4 h-4 text-pink-300'
                }`} 
              />
            )}
          </div>
        ))}
      </div>

      <div className={`relative bg-white/40 backdrop-blur-sm rounded-2xl p-4 md:p-6 w-24 md:w-32 shadow-lg border border-white/50 transition-all duration-300 ${value % 10 === 0 && value !== 0 ? 'scale-110 shadow-pink-300/50 border-pink-300' : ''}`}>
        <span className={`block text-4xl md:text-5xl font-bold text-center font-mono transition-colors duration-300 ${value % 10 === 0 && value !== 0 ? 'text-yellow-600' : 'text-transparent bg-clip-text bg-gradient-to-br from-pink-600 to-rose-600'}`}>
          {String(value).padStart(2, '0')}
        </span>
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-pink-400 to-transparent opacity-50"></div>
      </div>
      <span className="mt-3 text-sm md:text-base font-medium text-pink-800 uppercase tracking-wider">{label}</span>
    </div>
  );
};

export default Timer;