
import React, { useMemo, useState, useEffect } from 'react';
import Timer from './components/Timer';
import Milestones from './components/Milestones';
import PhotoTimeline from './components/PhotoTimeline';
import LoadingScreen from './components/LoadingScreen';
import { Heart } from 'lucide-react';
import { fetchPhotos } from './services/photoService';
import { Quote, PhotoMemory } from './types';
import maleImage from './assets/image/m.jpg';
import femaleImage from './assets/image/fm.jpg';

const App: React.FC = () => {
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

        // Artificial delay for smooth transition if data loads too fast
        setTimeout(() => {
          setIsAppLoading(false);
        }, 2000);

      } catch (error: any) {
        console.error("Initialization failed:", error);
        setLoadError(error.message || "Không thể kết nối đến kho dữ liệu.");
        // Still hide loading after a while to show error state in components
        setTimeout(() => setIsAppLoading(false), 2000);
      }
    };

    initializeData();
  }, []);

  if (isAppLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-rose-50 to-pink-100 text-gray-800 relative overflow-hidden selection:bg-pink-200">

      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-300/20 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
            100% { transform: translateY(0px); }
          }
          .animate-float-slow {
            animation: float 6s ease-in-out infinite;
          }
          .animate-float-delayed {
            animation: float 6s ease-in-out infinite;
            animation-delay: 3s;
          }
          .animate-in {
            animation: fadeIn 1s ease-out forwards;
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}
      </style>

      <div className="animate-in">
        {/* Header / Hero Section */}
        <header className="relative z-10 pt-16 pb-12 px-4 text-center">
          <div className="flex justify-center items-center gap-16 md:gap-48 mb-12 relative">

            {/* Avatar Nam */}
            <div className="relative animate-float-slow z-30">
              <div className="w-24 h-24 md:w-40 md:h-40 rounded-full border-4 border-white shadow-2xl overflow-hidden ring-8 ring-blue-100/50 group transition-transform hover:scale-105 bg-white">
                <img
                  src={maleImage}
                  alt="Nam"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </div>

            {/* Avatar Nữ */}
            <div className="relative animate-float-delayed z-30">
              <div className="w-24 h-24 md:w-40 md:h-40 rounded-full border-4 border-white shadow-2xl overflow-hidden ring-8 ring-pink-100/50 group transition-transform hover:scale-105 bg-white">
                <img
                  src={femaleImage}
                  alt="Nữ"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-pink-400/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </div>

          </div>

          <h1 className="text-5xl md:text-7xl font-script text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-pink-600 mb-4 drop-shadow-sm">
            Nhật Ký Tình Yêu
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 font-light tracking-wide">
            14 tháng 03
          </p>
        </header>

        {/* Main Content */}
        <main className="relative z-10 container mx-auto px-4 pb-20 space-y-20">
          <section className="bg-white/30 backdrop-blur-md rounded-3xl shadow-xl border border-white/50 p-2 md:p-6 transition-transform hover:scale-[1.01] duration-500">
            <Timer targetDate={startDate} />
          </section>

          <section>
            <Milestones startDate={startDate} />
          </section>

          <section>
            <PhotoTimeline memories={photos} error={loadError} />
          </section>

          <section className="text-center max-w-2xl mx-auto py-12 px-4 relative">
            {quote ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 text-pink-200/50">
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

        {/* Footer */}
        <footer className="relative z-10 text-center py-6 text-gray-500 text-sm">
          <p>&copy; 2025 LoveChronicle. Được tạo bằng tình yêu.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
