import React from 'react';
import { Milestone } from '../types';
import { Calendar, CheckCircle, Circle } from 'lucide-react';

interface MilestonesProps {
  startDate: Date;
}

const Milestones: React.FC<MilestonesProps> = ({ startDate }) => {
  const getMilestones = (): Milestone[] => {
    const milestones: Milestone[] = [];
    const now = new Date();

    // Helper to add days
    const addDays = (date: Date, days: number) => {
      const result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    };
    
    // Helper to add months
    const addMonths = (date: Date, months: number) => {
      const result = new Date(date);
      result.setMonth(result.getMonth() + months);
      return result;
    };

    const targets = [
      { days: 0, title: "Ngày bắt đầu", desc: "Khoảnh khắc định mệnh của chúng ta" },
      { days: 30, title: "1 Tháng", desc: "Tháng đầu tiên trọn vẹn" },
      { days: 100, title: "100 Ngày", desc: "Kỷ niệm 100 ngày bên nhau" },
      { days: 365, title: "1 Năm", desc: "365 ngày của yêu thương" },
      { days: 500, title: "500 Ngày", desc: "500 Cảm giác cứ như ngày đầu" },
      { days: 1000, title: "1000 Ngày", desc: "Một hành trình dài tuyệt đẹp" }
    ];

    targets.forEach(target => {
      const date = addDays(startDate, target.days);
      milestones.push({
        date: date,
        title: target.title,
        description: target.desc,
        isCompleted: now >= date
      });
    });

    return milestones.sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  const milestones = getMilestones();

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <h3 className="text-2xl font-bold text-pink-800 mb-8 text-center flex items-center justify-center gap-2">
        <Calendar className="w-6 h-6" />
        Cột Mốc Quan Trọng
      </h3>
      
      <div className="relative border-l-4 border-pink-200 ml-4 space-y-8">
        {milestones.map((m, idx) => (
          <div key={idx} className="mb-8 ml-6 relative group">
            <span className={`absolute -left-10 top-1 flex items-center justify-center w-8 h-8 rounded-full ring-4 ring-white transition-colors duration-300 ${m.isCompleted ? 'bg-green-500' : 'bg-pink-200'}`}>
              {m.isCompleted ? <CheckCircle className="w-5 h-5 text-white" /> : <Circle className="w-5 h-5 text-pink-500" />}
            </span>
            <div className={`p-5 rounded-lg shadow-md border transition-all duration-300 hover:scale-[1.02] ${m.isCompleted ? 'bg-white/60 border-green-200' : 'bg-white/40 border-pink-100 opacity-80'}`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <h4 className={`text-lg font-bold ${m.isCompleted ? 'text-green-700' : 'text-gray-600'}`}>
                    {m.title}
                  </h4>
                  <p className="text-gray-600 italic text-sm">{m.description}</p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium">
                    {m.date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Milestones;