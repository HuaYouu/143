import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTheme } from '../ThemeContext';
import { X, Palette } from 'lucide-react';

const ALL_THEMES: { id: string; label: string; emoji: string }[] = [
    { id: 'spring', label: 'Mùa Xuân', emoji: '🌸' },
    { id: 'summer', label: 'Mùa Hè', emoji: '☀️' },
    { id: 'autumn', label: 'Mùa Thu', emoji: '🍂' },
    { id: 'winter', label: 'Mùa Đông', emoji: '❄️' },
    { id: 'womens-day', label: 'Phụ Nữ 8/3', emoji: '💜' },
    { id: 'anniversary', label: 'Kỷ Niệm 14/3', emoji: '❤️' },
    { id: 'childrens-day', label: 'Thiếu Nhi 1/6', emoji: '🌈' },
];

// Export toggle function so footer can trigger it
let globalToggle: (() => void) | null = null;
export const toggleThemeSwitcher = () => globalToggle?.();

const ThemeSwitcher: React.FC = () => {
    const theme = useTheme();
    const [isVisible, setIsVisible] = useState(false);

    // Register global toggle
    useEffect(() => {
        globalToggle = () => setIsVisible(prev => !prev);
        return () => { globalToggle = null; };
    }, []);

    // Escape to close
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isVisible) setIsVisible(false);
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [isVisible]);

    const switchTheme = (themeId: string) => {
        const url = new URL(window.location.href);
        url.searchParams.set('theme', themeId);
        window.location.href = url.toString();
    };

    const resetTheme = () => {
        const url = new URL(window.location.href);
        url.searchParams.delete('theme');
        window.location.href = url.toString();
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 right-4 z-[999] animate-in">
            <div
                className="rounded-2xl shadow-2xl border border-white/30 backdrop-blur-xl p-4 w-72"
                style={{
                    background: `linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))`,
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <Palette className="w-4 h-4" style={{ color: theme.primaryColor }} />
                        <span className="text-sm font-bold text-gray-700">Theme Switcher</span>
                    </div>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                        <X className="w-3.5 h-3.5 text-gray-500" />
                    </button>
                </div>

                {/* Current theme indicator */}
                <div
                    className="text-xs px-3 py-1.5 rounded-lg mb-3 font-medium"
                    style={{
                        backgroundColor: `${theme.primaryColor}15`,
                        color: theme.primaryColor,
                    }}
                >
                    Hiện tại: <strong>{theme.name}</strong> ({theme.type})
                </div>

                {/* Theme buttons */}
                <div className="grid grid-cols-1 gap-1.5">
                    {ALL_THEMES.map(t => {
                        const isActive = theme.id === t.id;
                        return (
                            <button
                                key={t.id}
                                onClick={() => switchTheme(t.id)}
                                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm
                  transition-all duration-200 cursor-pointer
                  ${isActive
                                        ? 'shadow-md font-bold scale-[1.02]'
                                        : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800'
                                    }
                `}
                                style={isActive ? {
                                    backgroundColor: `${theme.primaryColor}20`,
                                    color: theme.primaryColor,
                                    borderLeft: `3px solid ${theme.primaryColor}`,
                                } : {}}
                            >
                                <span className="text-base">{t.emoji}</span>
                                <span>{t.label}</span>
                                {isActive && <span className="ml-auto text-xs opacity-60">●</span>}
                            </button>
                        );
                    })}
                </div>

                {/* Reset button */}
                <button
                    onClick={resetTheme}
                    className="w-full mt-3 px-3 py-2 rounded-lg text-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors cursor-pointer border border-dashed border-gray-300"
                >
                    🔄 Reset về tự động (theo ngày)
                </button>

                {/* Hint */}
                <p className="text-[10px] text-gray-400 text-center mt-2">
                    Nhấn 5 lần vào footer để ẩn/hiện
                </p>
            </div>

            <style>
                {`
          @keyframes slideInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-in { animation: slideInUp 0.3s ease-out forwards; }
        `}
            </style>
        </div>
    );
};

export default ThemeSwitcher;
