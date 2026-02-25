import React, { createContext, useContext, useMemo } from 'react';

// ─── Theme Configuration ─────────────────────────────────────────
export interface ThemeLayout {
    avatarBorder: 'circle' | 'wavy' | 'floral';    // avatar frame style
    avatarConnector: 'none' | 'ribbon' | 'hearts'; // connector between avatars
    cardRadius: string;         // border-radius for cards
    cardRotation: number;       // subtle rotation in degrees (0 = none)
    cardStyle: 'glass' | 'frost' | 'solid' | 'rainbow'; // card visual style
    sectionGap: string;         // gap between sections
    headerDecoration: 'none' | 'floral-frame' | 'sparkle-border' | 'cloud-rainbow';
}

export interface ThemeConfig {
    id: string;
    name: string;
    type: 'seasonal' | 'special';
    bannerText?: string;
    bgGradient: string;        // CSS gradient
    bgGradientLight: string;   // lighter variant for cards
    primaryColor: string;      // hex
    secondaryColor: string;
    accentColor: string;
    textColor: string;
    textMuted: string;
    particleType: 'petals' | 'sunbeams' | 'leaves' | 'snowflakes' | 'sakura' | 'fireworks' | 'balloons';
    scrollbarColor: string;
    glowColor: string;         // for blurred background blobs
    layout: ThemeLayout;
}

// ─── 7 Theme Definitions ─────────────────────────────────────────

const THEMES: Record<string, ThemeConfig> = {
    // ── Seasonal Themes ──
    spring: {
        id: 'spring',
        name: 'Mùa Xuân',
        type: 'seasonal',
        bgGradient: 'linear-gradient(to bottom, #fdf2f8, #fce7f3, #d1fae5)',
        bgGradientLight: 'rgba(252, 231, 243, 0.3)',
        primaryColor: '#EC4899',
        secondaryColor: '#34D399',
        accentColor: '#F472B6',
        textColor: '#831843',
        textMuted: '#9D174D',
        particleType: 'petals',
        scrollbarColor: '#EC4899',
        glowColor: 'rgba(236, 72, 153, 0.2)',
        layout: {
            avatarBorder: 'circle',
            avatarConnector: 'none',
            cardRadius: '1.5rem',
            cardRotation: 0,
            cardStyle: 'glass',
            sectionGap: '5rem',
            headerDecoration: 'none',
        },
    },
    summer: {
        id: 'summer',
        name: 'Mùa Hè',
        type: 'seasonal',
        bgGradient: 'linear-gradient(to bottom, #FFFBEB, #FEF3C7, #E0F2FE)',
        bgGradientLight: 'rgba(254, 243, 199, 0.3)',
        primaryColor: '#F59E0B',
        secondaryColor: '#06B6D4',
        accentColor: '#FBBF24',
        textColor: '#92400E',
        textMuted: '#B45309',
        particleType: 'sunbeams',
        scrollbarColor: '#F59E0B',
        glowColor: 'rgba(245, 158, 11, 0.2)',
        layout: {
            avatarBorder: 'circle',
            avatarConnector: 'none',
            cardRadius: '1.5rem',
            cardRotation: 0,
            cardStyle: 'solid',
            sectionGap: '5rem',
            headerDecoration: 'none',
        },
    },
    autumn: {
        id: 'autumn',
        name: 'Mùa Thu',
        type: 'seasonal',
        bgGradient: 'linear-gradient(to bottom, #FFF7ED, #FFEDD5, #FED7AA)',
        bgGradientLight: 'rgba(255, 237, 213, 0.3)',
        primaryColor: '#EA580C',
        secondaryColor: '#92400E',
        accentColor: '#F97316',
        textColor: '#7C2D12',
        textMuted: '#9A3412',
        particleType: 'leaves',
        scrollbarColor: '#EA580C',
        glowColor: 'rgba(234, 88, 12, 0.2)',
        layout: {
            avatarBorder: 'circle',
            avatarConnector: 'none',
            cardRadius: '1rem',
            cardRotation: 0,
            cardStyle: 'glass',
            sectionGap: '5rem',
            headerDecoration: 'none',
        },
    },
    winter: {
        id: 'winter',
        name: 'Mùa Đông',
        type: 'seasonal',
        bgGradient: 'linear-gradient(to bottom, #EFF6FF, #DBEAFE, #E2E8F0)',
        bgGradientLight: 'rgba(219, 234, 254, 0.3)',
        primaryColor: '#3B82F6',
        secondaryColor: '#E2E8F0',
        accentColor: '#60A5FA',
        textColor: '#1E3A5F',
        textMuted: '#1E40AF',
        particleType: 'snowflakes',
        scrollbarColor: '#3B82F6',
        glowColor: 'rgba(59, 130, 246, 0.2)',
        layout: {
            avatarBorder: 'circle',
            avatarConnector: 'none',
            cardRadius: '1.5rem',
            cardRotation: 0,
            cardStyle: 'frost',
            sectionGap: '5rem',
            headerDecoration: 'none',
        },
    },

    // ── Special Date Themes ──
    'womens-day': {
        id: 'womens-day',
        name: 'Ngày Phụ Nữ',
        type: 'special',
        bannerText: '💜 Happy Women\'s Day — Chúc mừng ngày Quốc tế Phụ nữ 8/3! 💐',
        bgGradient: 'linear-gradient(to bottom, #F5F3FF, #EDE9FE, #DDD6FE)',
        bgGradientLight: 'rgba(237, 233, 254, 0.3)',
        primaryColor: '#7C3AED',
        secondaryColor: '#A78BFA',
        accentColor: '#8B5CF6',
        textColor: '#4C1D95',
        textMuted: '#6D28D9',
        particleType: 'sakura',
        scrollbarColor: '#7C3AED',
        glowColor: 'rgba(124, 58, 237, 0.2)',
        layout: {
            avatarBorder: 'floral',
            avatarConnector: 'hearts',
            cardRadius: '2rem',
            cardRotation: 0,
            cardStyle: 'glass',
            sectionGap: '4rem',
            headerDecoration: 'floral-frame',
        },
    },
    anniversary: {
        id: 'anniversary',
        name: 'Kỷ Niệm Ngày Quen',
        type: 'special',
        bannerText: '❤️ Happy Anniversary — Kỷ niệm ngày quen nhau 14/3! ✨',
        bgGradient: 'linear-gradient(to bottom, #FEF2F2, #FEE2E2, #FEF3C7)',
        bgGradientLight: 'rgba(254, 226, 226, 0.3)',
        primaryColor: '#DC2626',
        secondaryColor: '#F59E0B',
        accentColor: '#EF4444',
        textColor: '#7F1D1D',
        textMuted: '#991B1B',
        particleType: 'fireworks',
        scrollbarColor: '#DC2626',
        glowColor: 'rgba(220, 38, 38, 0.2)',
        layout: {
            avatarBorder: 'circle',
            avatarConnector: 'ribbon',
            cardRadius: '1.5rem',
            cardRotation: 0,
            cardStyle: 'glass',
            sectionGap: '5rem',
            headerDecoration: 'sparkle-border',
        },
    },
    'childrens-day': {
        id: 'childrens-day',
        name: 'Ngày Thiếu Nhi',
        type: 'special',
        bannerText: '🌈 Happy Children\'s Day — Chúc mừng ngày Quốc tế Thiếu nhi 1/6! 🎈',
        bgGradient: 'linear-gradient(to bottom, #EEF2FF, #E0E7FF, #FEF3C7)',
        bgGradientLight: 'rgba(224, 231, 255, 0.3)',
        primaryColor: '#4F46E5',
        secondaryColor: '#F97316',
        accentColor: '#6366F1',
        textColor: '#1E1B4B',
        textMuted: '#3730A3',
        particleType: 'balloons',
        scrollbarColor: '#4F46E5',
        glowColor: 'rgba(79, 70, 229, 0.2)',
        layout: {
            avatarBorder: 'wavy',
            avatarConnector: 'none',
            cardRadius: '2.5rem',
            cardRotation: 1.5,
            cardStyle: 'rainbow',
            sectionGap: '4rem',
            headerDecoration: 'cloud-rainbow',
        },
    },
};

// ─── Date-Based Theme Selection ──────────────────────────────────

interface DateRange {
    startMonth: number;
    startDay: number;
    endMonth: number;
    endDay: number;
}

const SPECIAL_DATE_RANGES: { themeId: string; range: DateRange }[] = [
    { themeId: 'womens-day', range: { startMonth: 3, startDay: 1, endMonth: 3, endDay: 8 } },
    { themeId: 'anniversary', range: { startMonth: 3, startDay: 10, endMonth: 3, endDay: 17 } },
    { themeId: 'childrens-day', range: { startMonth: 5, startDay: 25, endMonth: 6, endDay: 1 } },
];

function getSeasonalThemeId(month: number): string {
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'autumn';
    return 'winter'; // 11, 12, 1
}

function isInDateRange(month: number, day: number, range: DateRange): boolean {
    const current = month * 100 + day;
    const start = range.startMonth * 100 + range.startDay;
    const end = range.endMonth * 100 + range.endDay;

    if (start <= end) {
        return current >= start && current <= end;
    }
    // Cross-year range (e.g., Dec → Jan) — not needed now but future-proof
    return current >= start || current <= end;
}

export function getActiveTheme(dateOverride?: Date): ThemeConfig {
    // 1. Check query param override (for testing)
    if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const themeParam = params.get('theme');
        if (themeParam && THEMES[themeParam]) {
            return THEMES[themeParam];
        }
    }

    const now = dateOverride || new Date();
    const month = now.getMonth() + 1; // 1-12
    const day = now.getDate();

    // 2. Check special dates first (higher priority)
    for (const { themeId, range } of SPECIAL_DATE_RANGES) {
        if (isInDateRange(month, day, range)) {
            return THEMES[themeId];
        }
    }

    // 3. Fallback to seasonal theme
    return THEMES[getSeasonalThemeId(month)];
}

// ─── React Context ───────────────────────────────────────────────

const ThemeContext = createContext<ThemeConfig>(THEMES.spring);

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
    children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const theme = useMemo(() => getActiveTheme(), []);

    return (
        <ThemeContext.Provider value={theme}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeContext;
