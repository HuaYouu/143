
import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import loveAnimation from '../assets/love_is_blind.json';

const LoadingScreen: React.FC = () => {
  const [loadingText, setLoadingText] = useState("Đang kết nối trái tim");

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingText(prev => {
        if (prev === "Đang kết nối trái tim...") return "Đang kết nối trái tim";
        return prev + ".";
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-b from-pink-50 via-rose-50 to-pink-100 overflow-hidden">
      {/* Hiệu ứng hào quang nền (Màu hồng nhạt đồng bộ với App.tsx) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink-300/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-300/10 rounded-full blur-3xl animate-pulse delay-700"></div>

      {/* Container Lottie Animation 200x200 */}
      <div className="relative z-10 w-[200px] h-[200px] flex items-center justify-center rounded-full overflow-hidden shadow-[0_15px_35px_rgba(236,72,153,0.2)] bg-white/60 border-4 border-white backdrop-blur-sm group transition-transform hover:scale-105 duration-500">
        <Lottie 
          animationData={loveAnimation} 
          loop={true} 
          className="w-full h-full scale-110"
        />
        
        {/* Hiệu ứng bóng đổ nhẹ phía dưới animation */}
        <div className="absolute inset-0 bg-gradient-to-t from-pink-500/5 to-transparent pointer-events-none"></div>
      </div>
      
      {/* Phần chữ thông điệp (Sử dụng font và màu sắc từ App.tsx) */}
      <div className="mt-12 text-center z-10">
        <h2 className="font-script text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-pink-600 mb-4 drop-shadow-sm">
          {loadingText}
        </h2>
        
        <div className="flex justify-center gap-2 mb-8">
          <div className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-bounce [animation-delay:-0.3s] shadow-sm"></div>
          <div className="w-2.5 h-2.5 bg-rose-400 rounded-full animate-bounce [animation-delay:-0.15s] shadow-sm"></div>
          <div className="w-2.5 h-2.5 bg-pink-400 rounded-full animate-bounce shadow-sm"></div>
        </div>

        <p className="text-pink-800 font-medium tracking-[0.4em] uppercase text-[10px] md:text-xs opacity-60">
          Khởi đầu hành trình: 14.03.2025
        </p>
      </div>

      {/* Hiệu ứng các hạt trái tim nhỏ bay lơ lửng */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i}
            className="absolute text-rose-300 animate-float-heart opacity-0"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 6 + 4}s`,
              animationDelay: `${Math.random() * 5}s`,
              fontSize: `${Math.random() * 10 + 10}px`
            }}
          >
            ❤
          </div>
        ))}
      </div>

      <style>
        {`
          @keyframes float-heart {
            0% { transform: translateY(20px) rotate(0deg) scale(0); opacity: 0; }
            50% { opacity: 0.4; }
            100% { transform: translateY(-100px) rotate(45deg) scale(1); opacity: 0; }
          }
          .animate-float-heart { animation: float-heart linear infinite; }
        `}
      </style>
    </div>
  );
};

export default LoadingScreen;
