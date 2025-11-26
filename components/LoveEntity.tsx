import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Heart, Sparkles, MessageCircle, X, Zap } from 'lucide-react';
import { generateLoveWish } from '../services/geminiService';
import { LoveMessage } from '../types';

const LoveEntity: React.FC = () => {
  // Logic state
  const [message, setMessage] = useState<LoveMessage | null>(null);
  const [loading, setLoading] = useState(false);
  const [isNear, setIsNear] = useState(false); // Mouse is close
  const [showHint, setShowHint] = useState(true);

  // Physics refs
  const entityRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  
  // Current position
  const pos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  // Velocity
  const vel = useRef({ x: 0, y: 0 });
  // Target position (where it wants to go)
  const target = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  // Mouse position tracking
  const mousePos = useRef({ x: -1000, y: -1000 });
  
  const frameRef = useRef<number>(0);
  const isRelocating = useRef(false); // True when moving after a click

  // Helper: Get random position within screen bounds with padding
  const getRandomPosition = () => {
    const padding = 80;
    return {
      x: padding + Math.random() * (window.innerWidth - padding * 2),
      y: padding + Math.random() * (window.innerHeight - padding * 2)
    };
  };

  // --- Physics Engine ---
  useEffect(() => {
    // Initial random target
    target.current = getRandomPosition();

    const updatePhysics = () => {
      const now = Date.now();
      
      // Calculate distance to mouse
      const dxMouse = mousePos.current.x - pos.current.x;
      const dyMouse = mousePos.current.y - pos.current.y;
      const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
      
      // Update "Near" state for React render
      if (distMouse < 200 && !isNear) setIsNear(true);
      if (distMouse >= 200 && isNear) setIsNear(false);

      // --- Behavior Logic ---
      
      if (isRelocating.current) {
        // Mode 1: Relocating (Flying to new spot after click)
        // Strong spring force to target
        const dx = target.current.x - pos.current.x;
        const dy = target.current.y - pos.current.y;
        
        vel.current.x += dx * 0.08;
        vel.current.y += dy * 0.08;

        // If very close to target, stop relocating mode
        if (Math.abs(dx) < 5 && Math.abs(dy) < 5) {
          isRelocating.current = false;
        }

      } else if (distMouse < 150) {
        // Mode 2: Interaction/Evasion (Mouse is too close)
        // Gently move away if too close (Personal space), but look at mouse
        
        // Repel vector (inverse of distance)
        const repelFactor = 0.5; // Strength of repulsion
        vel.current.x -= dxMouse * 0.05 * repelFactor;
        vel.current.y -= dyMouse * 0.05 * repelFactor;

      } else {
        // Mode 3: Wandering / Idle
        // Occasionally pick a new random target to drift towards
        if (Math.random() < 0.01) { // 1% chance per frame to change direction
           const drift = getRandomPosition();
           // Don't go too far, just drift
           target.current = {
             x: pos.current.x + (drift.x - pos.current.x) * 0.5,
             y: pos.current.y + (drift.y - pos.current.y) * 0.5
           };
        }

        // Gentle spring to wandering target
        const dx = target.current.x - pos.current.x;
        const dy = target.current.y - pos.current.y;
        vel.current.x += dx * 0.005;
        vel.current.y += dy * 0.005;
        
        // Add some sine wave hovering
        vel.current.y += Math.sin(now * 0.002) * 0.05;
      }

      // Physics Application
      const friction = 0.92;
      vel.current.x *= friction;
      vel.current.y *= friction;

      pos.current.x += vel.current.x;
      pos.current.y += vel.current.y;

      // Wall collisions (bounce off screen edges)
      const padding = 40;
      if (pos.current.x < padding) { pos.current.x = padding; vel.current.x *= -0.5; }
      if (pos.current.x > window.innerWidth - padding) { pos.current.x = window.innerWidth - padding; vel.current.x *= -0.5; }
      if (pos.current.y < padding) { pos.current.y = padding; vel.current.y *= -0.5; }
      if (pos.current.y > window.innerHeight - padding) { pos.current.y = window.innerHeight - padding; vel.current.y *= -0.5; }

      // DOM Update
      if (entityRef.current) {
        // Rotate towards movement or mouse
        const rotation = vel.current.x * 1.5;
        // Scale based on interaction
        const scale = isNear ? 1.15 : 1;
        entityRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) rotate(${rotation}deg) scale(${scale})`;
      }

      // Bubble position
      if (bubbleRef.current) {
        // Smart positioning: if on right side of screen, put bubble to left, else right
        const onRight = pos.current.x > window.innerWidth / 2;
        const bubbleX = onRight ? pos.current.x - 290 : pos.current.x + 70;
        const bubbleY = pos.current.y - 80;
        bubbleRef.current.style.transform = `translate3d(${bubbleX}px, ${bubbleY}px, 0)`;
      }

      frameRef.current = requestAnimationFrame(updatePhysics);
    };

    frameRef.current = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(frameRef.current);
  }, [isNear]);

  // --- Input Handling ---

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mousePos.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (e.touches[0]) {
      mousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    const hintTimer = setTimeout(() => setShowHint(false), 5000);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      clearTimeout(hintTimer);
    };
  }, [handleMouseMove, handleTouchMove]);

  // --- Logic ---

  const handleClick = async () => {
    // 1. Trigger Animation/Physics Change
    // Pick a new spot far away to "run" to
    target.current = getRandomPosition();
    isRelocating.current = true;
    
    // Add an impulse velocity towards the new target immediately
    const angle = Math.atan2(target.current.y - pos.current.y, target.current.x - pos.current.x);
    vel.current.x += Math.cos(angle) * 15;
    vel.current.y += Math.sin(angle) * 15;

    if (loading) return;

    // 2. API Call
    setLoading(true);
    const context = isNear ? "Người dùng bắt được bạn" : "Người dùng gọi bạn từ xa";
    const msg = await generateLoveWish(`${context}. Hãy nói một câu ngắn thật hay rồi chạy trốn.`);
    
    setMessage(msg);
    setLoading(false);
    
    setTimeout(() => setMessage(null), 8000);
  };

  return (
    <>
      {/* Message Bubble */}
      <div 
        ref={bubbleRef}
        className={`fixed top-0 left-0 z-50 w-72 pointer-events-none transition-opacity duration-500 ${message ? 'opacity-100' : 'opacity-0'}`}
      >
         {message && (
          <div className="bg-white/95 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border-2 border-pink-300 transform transition-all animate-in fade-in zoom-in-95 slide-in-from-bottom-2">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">Love AI</span>
            </div>
            <p className="text-gray-800 font-medium font-script text-xl leading-relaxed text-pink-600">
              "{message.text}"
            </p>
          </div>
        )}
      </div>

      {/* The Entity */}
      <div 
        ref={entityRef}
        onClick={handleClick}
        onTouchEnd={handleClick}
        className="fixed top-0 left-0 z-[60] cursor-pointer touch-none select-none -ml-10 -mt-10" // Centering logic
      >
        <div className="relative group">
          {/* Hint */}
          <div className={`absolute -top-14 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap transition-opacity duration-500 pointer-events-none ${showHint ? 'opacity-100' : 'opacity-0'}`}>
            Bắt mình đi nếu bạn có thể!
          </div>

          {/* Glow */}
          <div className={`absolute inset-0 bg-pink-500 rounded-full blur-2xl transition-all duration-300 ${isNear || loading ? 'opacity-60 scale-125' : 'opacity-20 scale-100'}`}></div>
          
          {/* Main Body */}
          <div className={`relative w-20 h-20 bg-gradient-to-br from-rose-500 via-pink-500 to-purple-500 rounded-full shadow-[0_0_20px_rgba(236,72,153,0.6)] flex items-center justify-center border-2 border-pink-200/50 backdrop-blur-sm transition-all duration-300 ${isNear ? 'scale-110' : ''}`}>
             
             {/* Icon Logic */}
             {loading ? (
               <Sparkles className="text-yellow-200 w-10 h-10 animate-spin" />
             ) : isNear ? (
               <Zap className="text-yellow-300 w-10 h-10 fill-current animate-pulse" /> // Excited when near
             ) : (
               <Heart className="text-white w-10 h-10 fill-current animate-pulse" /> // Normal heartbeat
             )}
             
             {/* Face Eyes */}
             <div className={`absolute top-1/3 left-1/4 w-2 h-2 bg-white rounded-full opacity-90 transition-all ${isNear ? 'h-3' : 'h-2'}`}></div>
             <div className={`absolute top-1/3 right-1/4 w-2 h-2 bg-white rounded-full opacity-90 transition-all ${isNear ? 'h-3' : 'h-2'}`}></div>
             
             {/* Mouth (optional simple curve using border) */}
             {isNear && (
                <div className="absolute bottom-1/4 w-4 h-2 border-b-2 border-white/80 rounded-full"></div>
             )}
          </div>

          {/* Orbiting Particles */}
          <div className="absolute inset-0 animate-spin-slow pointer-events-none">
            <div className="absolute -top-3 left-1/2 w-4 h-4 bg-yellow-300 rounded-full shadow-lg blur-[1px] opacity-80"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoveEntity;