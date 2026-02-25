import React, { useState, useEffect } from 'react';
import { useTheme } from '../ThemeContext';
import { X } from 'lucide-react';

const ThemeBanner: React.FC = () => {
    const theme = useTheme();
    const [visible, setVisible] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);

    // Only show for special themes
    if (theme.type !== 'special' || !theme.bannerText) return null;

    // Auto-dismiss after 10s
    useEffect(() => {
        const timer = setTimeout(() => {
            setFadeOut(true);
            setTimeout(() => setVisible(false), 500);
        }, 10000);
        return () => clearTimeout(timer);
    }, []);

    if (!visible) return null;

    return (
        <div
            className={`fixed top-0 left-0 right-0 z-[70] transition-all duration-500 ${fadeOut ? 'opacity-0 -translate-y-full' : 'opacity-100 translate-y-0'}`}
        >
            <div
                className="relative overflow-hidden py-3 px-6 text-center shadow-lg"
                style={{
                    background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
                }}
            >
                {/* Shimmer overlay */}
                <div className="absolute inset-0 opacity-30">
                    <div
                        className="absolute inset-0"
                        style={{
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                            animation: 'shimmer 3s ease-in-out infinite',
                        }}
                    />
                </div>

                <p className="relative z-10 text-white font-medium text-sm md:text-base tracking-wide"
                    style={{ fontFamily: "'Dancing Script', cursive" }}
                >
                    {theme.bannerText}
                </p>

                <button
                    onClick={() => {
                        setFadeOut(true);
                        setTimeout(() => setVisible(false), 500);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors cursor-pointer z-10"
                    aria-label="Đóng banner"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            <style>
                {`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}
            </style>
        </div>
    );
};

export default ThemeBanner;
