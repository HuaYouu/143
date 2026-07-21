import React, { useEffect, useMemo, useState } from 'react';
import { Calendar, CheckCircle, Circle, Clock, Sparkles } from 'lucide-react';
import { useTheme } from '../ThemeContext';
import type { RelationshipMilestone } from '../services/milestoneService';
import { formatMilestoneDate, getMilestones } from '../services/milestoneService';

interface MilestonesProps {
  startDate: Date;
}

const getDistanceLabel = (milestone: RelationshipMilestone) => {
  if (milestone.status === 'current') return 'Hôm nay';
  if (milestone.status === 'next') return milestone.daysUntil <= 0 ? 'Đang tới' : `Còn ${milestone.daysUntil} ngày`;
  if (milestone.status === 'completed') return 'Đã đi qua';
  return milestone.daysUntil > 0 ? `Còn ${milestone.daysUntil} ngày` : 'Sắp tới';
};

const Milestones: React.FC<MilestonesProps> = ({ startDate }) => {
  const theme = useTheme();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 60 * 1000);
    return () => window.clearInterval(interval);
  }, []);

  const milestones = useMemo(() => getMilestones(startDate, now), [startDate, now]);

  const getStatusMeta = (milestone: RelationshipMilestone) => {
    switch (milestone.status) {
      case 'current':
        return {
          label: 'Hôm nay',
          icon: <Sparkles className="h-5 w-5 text-white" />,
          dotColor: theme.accentColor,
          borderColor: theme.accentColor,
          cardBg: 'rgba(255,255,255,0.78)',
          textColor: theme.textColor,
        };
      case 'next':
        return {
          label: 'Đang chờ',
          icon: <Clock className="h-5 w-5 text-white" />,
          dotColor: theme.primaryColor,
          borderColor: theme.primaryColor,
          cardBg: 'rgba(255,255,255,0.72)',
          textColor: theme.textColor,
        };
      case 'completed':
        return {
          label: 'Đã đi qua',
          icon: <CheckCircle className="h-5 w-5 text-white" />,
          dotColor: '#22C55E',
          borderColor: '#BBF7D0',
          cardBg: 'rgba(255,255,255,0.60)',
          textColor: '#15803D',
        };
      default:
        return {
          label: 'Còn xa một chút',
          icon: <Circle className="h-5 w-5" style={{ color: theme.primaryColor }} />,
          dotColor: `${theme.primaryColor}30`,
          borderColor: `${theme.primaryColor}20`,
          cardBg: 'rgba(255,255,255,0.42)',
          textColor: '#4B5563',
        };
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl p-6">
      <h3
        className="mb-8 flex items-center justify-center gap-2 text-center text-2xl font-bold"
        style={{ color: theme.textColor }}
      >
        <Calendar className="h-6 w-6" />
        Cột Mốc Quan Trọng
      </h3>

      <div
        className="relative ml-4 space-y-8"
        style={{ borderLeft: `4px solid ${theme.primaryColor}30` }}
      >
        {milestones.map((milestone) => {
          const meta = getStatusMeta(milestone);
          const isHighlighted = milestone.status === 'next' || milestone.status === 'current';

          return (
            <div key={milestone.days} className="group relative mb-8 ml-6">
              <span
                className="absolute -left-10 top-1 flex h-8 w-8 items-center justify-center rounded-full ring-4 ring-white transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: meta.dotColor }}
              >
                {meta.icon}
              </span>

              <div
                className={[
                  'rounded-lg border p-5 shadow-md transition-all duration-300',
                  isHighlighted ? 'shadow-lg' : 'hover:scale-[1.02]',
                ].join(' ')}
                style={{
                  backgroundColor: meta.cardBg,
                  borderColor: meta.borderColor,
                  boxShadow: isHighlighted ? `0 18px 42px ${theme.primaryColor}18` : undefined,
                }}
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <h4 className="text-lg font-bold" style={{ color: meta.textColor }}>
                        {milestone.title}
                      </h4>
                      <span
                        className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]"
                        style={{
                          backgroundColor: `${meta.dotColor}18`,
                          color: meta.textColor,
                        }}
                      >
                        {meta.label}
                      </span>
                    </div>
                    <p className="text-sm italic text-gray-600">{milestone.description}</p>
                  </div>

                  <div className="flex flex-col items-start gap-2 md:items-end">
                    <span
                      className="inline-block rounded-full px-3 py-1 text-sm font-medium"
                      style={{
                        backgroundColor: `${theme.primaryColor}15`,
                        color: theme.primaryColor,
                      }}
                    >
                      {formatMilestoneDate(milestone.date)}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                      {getDistanceLabel(milestone)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Milestones;
