import React, { useMemo, useState, useEffect, useRef } from 'react';
import Timer from './components/Timer';
import Milestones from './components/Milestones';
import PhotoTimeline from './components/PhotoTimeline';
import LoadingScreen from './components/LoadingScreen';
import ThemeEffects from './components/ThemeEffects';
import ThemeBanner from './components/ThemeBanner';
import ThemeSwitcher, { toggleThemeSwitcher } from './components/ThemeSwitcher';
import {
  FloralFrame,
  SparkleBorder,
  CloudRainbow,
  HeartConnector,
  RibbonConnector,
  getAvatarStyle,
  getCardStyle,
  ThemeLayoutStyles,
} from './components/ThemeDecorations';
import { ThemeProvider, useTheme } from './ThemeContext';
import { Heart } from 'lucide-react';
import { fetchPhotos } from './services/photoService';
import { Quote, PhotoMemory } from './types';
import maleImage from './assets/image/m.jpg';
import femaleImage from './assets/image/fm.jpg';

// Hidden footer: tap 5 times quickly to open Theme Switcher
const FooterWithSecret: React.FC = () => {
  const tapCount = useRef(0);
  const lastTap = useRef(0);

  const handleTap = () => {
    const now = Date.now();
    if (now - lastTap.current > 2000) tapCount.current = 0;
    tapCount.current++;
    lastTap.current = now;
    if (tapCount.current >= 5) {
      tapCount.current = 0;
      toggleThemeSwitcher();
    }
  };

  return (
    <p className="cursor-default select-none" onClick={handleTap}>
      &copy; 2025 LoveChronicle. Được tạo bằng tình yêu.
    </p>
  );
};

// ─── Header Decoration Wrapper ───────────────────────
const HeaderDecorationWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useTheme();

  switch (theme.layout.headerDecoration) {
    case 'floral-frame':
      return <FloralFrame>{children}</FloralFrame>;
    case 'sparkle-border':
      return <SparkleBorder>{children}</SparkleBorder>;
    case 'cloud-rainbow':
      return <CloudRainbow>{children}</CloudRainbow>;
    default:
      return <>{children}</>;
  }
};

// ─── Avatar Connector ────────────────────────────────
const AvatarConnector: React.FC = () => {
  const theme = useTheme();
  switch (theme.layout.avatarConnector) {
    case 'hearts':
      return <HeartConnector />;
    case 'ribbon':
      return <RibbonConnector />;
    default:
      return null;
  }
};

const AppContent: React.FC = () => {
  const theme = useTheme();
  const { layout } = theme;

  // Relationship start date
  const startDate = useMemo(() => new Date('2025-03-14T00:00:00'), []);

  // State management
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [photos, setPhotos] = useState<PhotoMemory[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Global initialization logic
  useEffect(() => {
    const initializeData = async () => {
      try {
        const photoData = await fetchPhotos();
        setPhotos(photoData);
        setTimeout(() => setIsAppLoading(false), 2000);
      } catch (error: any) {
        console.error("Initialization failed:", error);
        setLoadError(error.message || "Không thể kết nối đến kho dữ liệu.");
        setTimeout(() => setIsAppLoading(false), 2000);
      }
    };
    initializeData();
  }, []);

  // Dynamic scrollbar & card styles
  const cardStyle = getCardStyle(layout.cardStyle, theme);
  const avatarStyleMale = getAvatarStyle(layout.avatarBorder, theme.primaryColor);
  const avatarStyleFemale = getAvatarStyle(layout.avatarBorder, theme.accentColor);

  const dynamicStyles = `
    ::-webkit-scrollbar-thumb {
      background: ${theme.scrollbarColor};
      border-radius: 10px;
    }
  `;

  if (isAppLoading) {
    return <LoadingScreen />;
  }

  return (
    <div
      className="min-h-screen text-gray-800 relative overflow-hidden selection:bg-pink-200"
      style={{ background: theme.bgGradient }}
    >
      <style>{dynamicStyles}</style>
      <ThemeLayoutStyles />

      {/* Theme Particle Effects */}
      <ThemeEffects />

      {/* Special Date Banner */}
      <ThemeBanner />

      {/* Hidden Theme Switcher */}
      <ThemeSwitcher />

      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div
          className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-3xl animate-pulse"
          style={{ backgroundColor: theme.glowColor }}
        />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-3xl animate-pulse delay-700"
          style={{ backgroundColor: theme.glowColor }}
        />
      </div>

      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
            100% { transform: translateY(0px); }
          }
          .animate-float-slow { animation: float 6s ease-in-out infinite; }
          .animate-float-delayed { animation: float 6s ease-in-out infinite; animation-delay: 3s; }
          .animate-in { animation: fadeIn 1s ease-out forwards; }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        `}
      </style>

      <div className="animate-in">
        {/* Header / Hero Section */}
        <header className="relative z-10 pt-16 pb-12 px-4 text-center">
          <HeaderDecorationWrapper>
            <div className="flex justify-center items-center gap-16 md:gap-48 mb-12 relative">

              {/* Avatar Nam */}
              <div className="relative animate-float-slow z-30">
                <div
                  className="w-24 h-24 md:w-40 md:h-40 shadow-2xl overflow-hidden group transition-all duration-500 hover:scale-105 bg-white"
                  style={{
                    ...avatarStyleMale,
                    boxShadow: `0 10px 25px -5px rgba(0,0,0,0.1), 0 0 0 8px ${theme.primaryColor}15`,
                  }}
                >
                  <img src={maleImage} alt="Nam" className="w-full h-full object-cover" />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ backgroundColor: `${theme.primaryColor}15` }}
                  />
                </div>
              </div>

              {/* Avatar Connector */}
              <AvatarConnector />

              {/* Avatar Nữ */}
              <div className="relative animate-float-delayed z-30">
                <div
                  className="w-24 h-24 md:w-40 md:h-40 shadow-2xl overflow-hidden group transition-all duration-500 hover:scale-105 bg-white"
                  style={{
                    ...avatarStyleFemale,
                    boxShadow: `0 10px 25px -5px rgba(0,0,0,0.1), 0 0 0 8px ${theme.accentColor}15`,
                  }}
                >
                  <img src={femaleImage} alt="Nữ" className="w-full h-full object-cover" />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ backgroundColor: `${theme.accentColor}15` }}
                  />
                </div>
              </div>

            </div>
          </HeaderDecorationWrapper>

          <h1
            className="text-5xl md:text-7xl font-script mb-4 drop-shadow-sm"
            style={{
              backgroundImage: `linear-gradient(to right, ${theme.primaryColor}, ${theme.accentColor})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Nhật Ký Tình Yêu
          </h1>
          <p className="text-xl md:text-2xl font-light tracking-wide" style={{ color: theme.textMuted }}>
            14 tháng 03
          </p>

          {/* Theme indicator */}
          {theme.type === 'seasonal' && (
            <div
              className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase opacity-60"
              style={{ backgroundColor: `${theme.primaryColor}15`, color: theme.textColor }}
            >
              {theme.name}
            </div>
          )}
        </header>

        {/* Main Content */}
        <main
          className="relative z-10 container mx-auto px-4 pb-20"
          style={{ display: 'flex', flexDirection: 'column', gap: layout.sectionGap }}
        >
          {/* Timer Section */}
          <section
            className="shadow-xl p-2 md:p-6 transition-transform hover:scale-[1.01] duration-500"
            style={{
              ...cardStyle,
              borderRadius: layout.cardRadius,
              transform: layout.cardRotation ? `rotate(${layout.cardRotation}deg)` : undefined,
            }}
          >
            <Timer targetDate={startDate} />
          </section>

          {/* Milestones Section */}
          <section
            className="shadow-lg p-2 md:p-4"
            style={{
              ...cardStyle,
              borderRadius: layout.cardRadius,
              transform: layout.cardRotation ? `rotate(-${layout.cardRotation}deg)` : undefined,
            }}
          >
            <Milestones startDate={startDate} />
          </section>

          {/* Photo Timeline Section */}
          <section
            className="shadow-lg p-2 md:p-4"
            style={{
              ...cardStyle,
              borderRadius: layout.cardRadius,
            }}
          >
            <PhotoTimeline memories={photos} error={loadError} />
          </section>

          {/* Quote Section */}
          <section className="text-center max-w-2xl mx-auto py-12 px-4 relative">
            {quote ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <div style={{ color: `${theme.primaryColor}30` }} className="absolute top-0 left-1/2 -translate-x-1/2">
                  <Heart className="w-32 h-32 fill-current" />
                </div>
                <div className="relative">
                  <blockquote className="font-script text-3xl md:text-4xl text-gray-700 leading-relaxed relative z-10">
                    "{quote.text}"
                  </blockquote>
                  <cite className="block mt-6 text-gray-500 font-medium not-italic tracking-wider uppercase text-sm z-10 relative">
                    — {quote.author}
                  </cite>
                </div>
              </div>
            ) : null}
          </section>
        </main>

        {/* Footer  */}
        <footer className="relative z-10 text-center py-6 text-gray-500 text-sm">
          <FooterWithSecret />
        </footer>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
