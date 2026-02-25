import React from 'react';
import { useTheme } from '../ThemeContext';

// ─── Floral Frame (Women's Day) ──────────────────────
export const FloralFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const theme = useTheme();
    return (
        <div className="relative">
            {/* Corner flowers */}
            <div className="absolute -top-6 -left-6 text-3xl opacity-70 animate-pulse" style={{ animationDelay: '0s' }}>🌸</div>
            <div className="absolute -top-6 -right-6 text-3xl opacity-70 animate-pulse" style={{ animationDelay: '0.5s' }}>🌺</div>
            <div className="absolute -bottom-6 -left-6 text-3xl opacity-70 animate-pulse" style={{ animationDelay: '1s' }}>💐</div>
            <div className="absolute -bottom-6 -right-6 text-3xl opacity-70 animate-pulse" style={{ animationDelay: '1.5s' }}>🌷</div>
            {/* Vine borders */}
            <div className="absolute top-0 left-8 right-8 h-[2px] rounded-full" style={{ background: `linear-gradient(to right, transparent, ${theme.primaryColor}60, transparent)` }} />
            <div className="absolute bottom-0 left-8 right-8 h-[2px] rounded-full" style={{ background: `linear-gradient(to right, transparent, ${theme.primaryColor}60, transparent)` }} />
            {children}
        </div>
    );
};

// ─── Sparkle Border (Anniversary) ────────────────────
export const SparkleBorder: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const theme = useTheme();
    return (
        <div className="relative">
            {/* Corner sparkles */}
            {['-top-4 -left-4', '-top-4 -right-4', '-bottom-4 -left-4', '-bottom-4 -right-4'].map((pos, i) => (
                <div key={i} className={`absolute ${pos} w-8 h-8`} style={{ animationDelay: `${i * 0.3}s` }}>
                    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full animate-spin-slow">
                        <path d="M12 2L13.5 8.5L20 7L15 12L20 17L13.5 15.5L12 22L10.5 15.5L4 17L9 12L4 7L10.5 8.5L12 2Z"
                            fill={theme.secondaryColor} opacity="0.8" />
                    </svg>
                </div>
            ))}
            {/* Gold shimmer border */}
            <div className="absolute inset-0 rounded-3xl pointer-events-none"
                style={{
                    border: `2px solid ${theme.secondaryColor}40`,
                    boxShadow: `inset 0 0 30px ${theme.secondaryColor}10, 0 0 20px ${theme.secondaryColor}15`,
                }}
            />
            {children}
        </div>
    );
};

// ─── Cloud Rainbow (Children's Day) ──────────────────
export const CloudRainbow: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="relative">
            {/* Clouds */}
            <div className="absolute -top-8 left-[10%] text-4xl opacity-40 animate-bounce" style={{ animationDuration: '3s' }}>☁️</div>
            <div className="absolute -top-6 right-[15%] text-3xl opacity-30 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>☁️</div>
            <div className="absolute -top-10 left-[45%] text-5xl opacity-35 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>☁️</div>
            {/* Rainbow arc */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-16 opacity-20 rounded-full pointer-events-none"
                style={{ background: 'linear-gradient(to right, #EF4444, #F97316, #EAB308, #22C55E, #3B82F6, #8B5CF6)' }}
            />
            {children}
        </div>
    );
};

// ─── Avatar Connectors ───────────────────────────────
export const HeartConnector: React.FC = () => {
    const theme = useTheme();
    return (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center gap-1">
            <div className="w-8 h-[2px] rounded-full" style={{ background: `linear-gradient(to right, transparent, ${theme.primaryColor}80)` }} />
            <div className="text-2xl animate-pulse">💜</div>
            <div className="w-8 h-[2px] rounded-full" style={{ background: `linear-gradient(to left, transparent, ${theme.primaryColor}80)` }} />
        </div>
    );
};

export const RibbonConnector: React.FC = () => {
    const theme = useTheme();
    return (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center">
            <div className="relative">
                {/* Ribbon SVG */}
                <svg width="120" height="40" viewBox="0 0 120 40" fill="none" className="drop-shadow-lg">
                    <path d="M0 20C20 20 20 5 40 5C60 5 55 35 75 35C95 35 95 20 120 20"
                        stroke={theme.secondaryColor} strokeWidth="3" fill="none" strokeLinecap="round" />
                    <path d="M0 20C20 20 20 5 40 5C60 5 55 35 75 35C95 35 95 20 120 20"
                        stroke={theme.primaryColor} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeDasharray="4 4">
                        <animate attributeName="stroke-dashoffset" values="0;8" dur="1s" repeatCount="indefinite" />
                    </path>
                </svg>
                {/* Center heart */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="text-xl animate-pulse">❤️</div>
                </div>
            </div>
        </div>
    );
};

// ─── Avatar Border Styles ────────────────────────────
export const getAvatarStyle = (borderType: 'circle' | 'wavy' | 'floral', color: string): React.CSSProperties => {
    switch (borderType) {
        case 'wavy':
            return {
                borderRadius: '60% 40% 70% 30% / 50% 60% 40% 50%',
                animation: 'morphBorder 6s ease-in-out infinite',
                border: `4px solid white`,
            };
        case 'floral':
            return {
                borderRadius: '50%',
                border: `4px solid white`,
                boxShadow: `0 0 0 4px ${color}40, 0 0 0 8px ${color}20, 0 0 20px ${color}30`,
            };
        default: // circle
            return {
                borderRadius: '50%',
                border: '4px solid white',
            };
    }
};

// ─── Card Style Helpers ──────────────────────────────
export const getCardStyle = (
    cardStyle: 'glass' | 'frost' | 'solid' | 'rainbow',
    theme: { primaryColor: string; secondaryColor: string; bgGradientLight: string }
): React.CSSProperties => {
    switch (cardStyle) {
        case 'frost':
            return {
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.7)',
                boxShadow: 'inset 0 0 30px rgba(255, 255, 255, 0.3), 0 8px 32px rgba(59, 130, 246, 0.1)',
            };
        case 'solid':
            return {
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            };
        case 'rainbow':
            return {
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(8px)',
                border: '2px solid transparent',
                backgroundImage: `linear-gradient(white, white), linear-gradient(135deg, #EF4444, #F97316, #EAB308, #22C55E, #3B82F6, #8B5CF6)`,
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box',
            };
        default: // glass
            return {
                backgroundColor: theme.bgGradientLight,
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.5)',
            };
    }
};

// ─── Wavy Border Animation CSS ───────────────────────
export const ThemeLayoutStyles: React.FC = () => (
    <style>
        {`
      @keyframes morphBorder {
        0% { border-radius: 60% 40% 70% 30% / 50% 60% 40% 50%; }
        25% { border-radius: 40% 60% 30% 70% / 60% 40% 50% 50%; }
        50% { border-radius: 70% 30% 50% 50% / 40% 70% 30% 60%; }
        75% { border-radius: 30% 70% 60% 40% / 50% 30% 70% 40%; }
        100% { border-radius: 60% 40% 70% 30% / 50% 60% 40% 50%; }
      }
      @keyframes spin-slow {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      .animate-spin-slow {
        animation: spin-slow 8s linear infinite;
      }
    `}
    </style>
);
