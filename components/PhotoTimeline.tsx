import React, { useEffect, useState } from 'react';
import { PhotoMemory } from '../types';
import { fetchPhotos } from '../services/photoService';
import { Loader, Heart, AlertCircle } from 'lucide-react';

const PhotoTimeline: React.FC = () => {
  const [memories, setMemories] = useState<PhotoMemory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPhotos = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchPhotos();
        if (data.length === 0) {
          setError("Không tìm thấy hình ảnh nào trong danh sách.");
        } else {
          setMemories(data);
        }
      } catch (err: any) {
        setError(err.message || "Có lỗi xảy ra khi tải ảnh.");
      } finally {
        setLoading(false);
      }
    };
    loadPhotos();
  }, []);

  const rainbowColors = [
    'border-red-400',
    'border-orange-400',
    'border-yellow-400',
    'border-green-400',
    'border-blue-400',
    'border-indigo-400',
    'border-purple-400',
  ];
  
  const rainbowText = [
    'text-red-500',
    'text-orange-500',
    'text-yellow-600',
    'text-green-600',
    'text-blue-600',
    'text-indigo-600',
    'text-purple-600',
  ];

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-20 gap-4">
        <Loader className="w-8 h-8 animate-spin text-pink-500" />
        <span className="text-pink-500 font-medium animate-pulse">Đang kết nối kho ký ức...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-2xl mx-auto p-8 text-center bg-red-50 rounded-2xl border border-red-200 shadow-sm">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
        <h3 className="text-red-800 font-bold text-lg mb-2">Không thể tải hình ảnh</h3>
        <p className="text-red-600">{error}</p>
        <p className="text-sm text-gray-500 mt-4">
          Gợi ý: Kiểm tra Google Script đã được Deploy chế độ "Anyone" chưa.
        </p>
      </div>
    );
  }

  if (memories.length === 0) {
    return null; 
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-12">
      <h3 className="text-3xl font-bold text-center mb-16 font-script bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-green-500 to-blue-500 animate-pulse">
        Hành Trình Tình Yêu
      </h3>

      <div className="relative">
        {/* The Rainbow Line */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 md:w-2 transform md:-translate-x-1/2 rounded-full bg-gradient-to-b from-red-400 via-yellow-400 via-green-400 via-blue-400 to-purple-400 shadow-[0_0_15px_rgba(255,255,255,0.8)]"></div>

        <div className="space-y-12">
          {memories.map((memory, index) => {
            const isLeft = index % 2 === 0;
            const colorClass = rainbowColors[index % rainbowColors.length];
            const textClass = rainbowText[index % rainbowText.length];

            return (
              <div key={index} className={`relative flex items-center ${isLeft ? 'md:flex-row-reverse' : 'md:flex-row'} flex-row-reverse`}>
                
                {/* Content Side */}
                <div className="flex-1 w-full md:w-1/2 p-4">
                  <div className={`relative bg-white/80 backdrop-blur-sm p-3 rounded-2xl shadow-lg border-4 ${colorClass} transform transition-all duration-300 hover:scale-[1.03] hover:rotate-1 group`}>
                    
                    {/* Image */}
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
                       <img 
                         src={memory.url} 
                         alt={memory.filename}
                         className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                         loading="lazy"
                         onError={(e) => {
                           (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/pink/white?text=Ảnh+lỗi';
                         }}
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    {/* Date Tag */}
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-1 rounded-full shadow-md border border-pink-100 flex items-center gap-2 whitespace-nowrap">
                      <Heart className={`w-3 h-3 ${textClass} fill-current`} />
                      <span className={`font-bold font-mono text-sm ${textClass}`}>
                        {memory.displayDate}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Center Dot */}
                <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 w-4 h-4 md:w-6 md:h-6 rounded-full bg-white border-4 border-pink-400 shadow-lg z-10 flex items-center justify-center">
                   <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-current ${textClass}`}></div>
                </div>

                {/* Empty Side (Spacer for Desktop) */}
                <div className="hidden md:block flex-1 w-1/2"></div>
                
                {/* Connector for Mobile */}
                <div className="md:hidden absolute left-4 top-1/2 w-4 h-0.5 bg-pink-300"></div>
              </div>
            );
          })}
        </div>

        {/* End Decoration */}
        <div className="absolute bottom-0 left-4 md:left-1/2 transform -translate-x-1/2 translate-y-full pt-4">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full animate-bounce shadow-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default PhotoTimeline;