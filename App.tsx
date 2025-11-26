import React, { useMemo, useState, useEffect } from 'react';
import Timer from './components/Timer';
import LoveEntity from './components/LoveEntity';
import Milestones from './components/Milestones';
import { Heart } from 'lucide-react';
import { getRandomQuote } from './services/geminiService';
import { Quote } from './types';

const App: React.FC = () => {
  // Define the relationship start date: March 14, 2025
  const startDate = useMemo(() => new Date('2025-03-14T00:00:00'), []);
  const [quote, setQuote] = useState<Quote | null>(null);

  // Pick a random quote on component mount (page reset)
  useEffect(() => {
    setQuote(getRandomQuote());
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-rose-50 to-pink-100 text-gray-800 relative overflow-hidden selection:bg-pink-200">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-300/20 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      {/* Header / Hero Section */}
      <header className="relative z-10 pt-16 pb-12 px-4 text-center">
        <div className="flex justify-center mb-6">
           <div className="relative">
             <Heart className="w-16 h-16 text-rose-500 fill-pink-500 animate-bounce shadow-xl filter drop-shadow-lg" />
             <div className="absolute inset-0 bg-rose-400 blur-lg opacity-40 animate-pulse"></div>
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
      <main className="relative z-10 container mx-auto px-4 pb-20 space-y-16">
        
        {/* Timer Section */}
        <section className="bg-white/30 backdrop-blur-md rounded-3xl shadow-xl border border-white/50 p-2 md:p-6 transition-transform hover:scale-[1.01] duration-500">
          <Timer targetDate={startDate} />
        </section>

        {/* Milestones Section */}
        <section>
          <Milestones startDate={startDate} />
        </section>

        {/* Quote Section (Dynamic AI Selection) */}
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
            ) : (
               <div className="h-32 flex items-center justify-center">
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-100 mx-1"></div>
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-200"></div>
               </div>
            )}
        </section>

      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-6 text-gray-500 text-sm">
        <p>&copy; 2025 LoveChronicle. Được tạo bằng tình yêu.</p>
      </footer>

      {/* The AI Love Entity - Floating Assistant */}
      <LoveEntity />
    </div>
  );
};

export default App;