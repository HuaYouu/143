import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Calendar, LockKeyhole, MailOpen, X } from 'lucide-react';
import { milestoneLetters, type MilestoneLetter } from '../data/loveData';
import { useTheme } from '../ThemeContext';
import { formatMilestoneDate, getMilestones } from '../services/milestoneService';

interface MilestoneLettersProps {
  startDate: Date;
}

const MilestoneLetters: React.FC<MilestoneLettersProps> = ({ startDate }) => {
  const theme = useTheme();
  const prefersReducedMotion = useReducedMotion();
  const [now, setNow] = useState(() => new Date());
  const [selectedLetter, setSelectedLetter] = useState<MilestoneLetter | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 60 * 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!selectedLetter) return;
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedLetter(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedLetter]);

  const letterItems = useMemo(() => {
    const milestones = getMilestones(startDate, now);
    return milestoneLetters.map((letter) => {
      const milestone = milestones.find((item) => item.days === letter.milestoneDays);
      const isUnlocked = milestone ? now.getTime() >= milestone.date.getTime() : false;
      return { letter, milestone, isUnlocked };
    });
  }, [now, startDate]);

  return (
    <div className="mx-auto w-full max-w-5xl p-5 md:p-7">
      <div className="mb-7 text-center">
        <div
          className="mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em]"
          style={{ backgroundColor: `${theme.primaryColor}18`, color: theme.textColor }}
        >
          <MailOpen className="h-4 w-4" />
          Hộp thư kỷ niệm
        </div>
        <h3 className="font-script text-4xl md:text-5xl" style={{ color: theme.textColor }}>
          Những lá thư chờ ngày mở
        </h3>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {letterItems.map(({ letter, milestone, isUnlocked }, index) => (
          <motion.button
            key={letter.milestoneDays}
            type="button"
            onClick={() => isUnlocked && setSelectedLetter(letter)}
            className="group relative overflow-hidden rounded-2xl border border-white/50 bg-white/55 p-5 text-left shadow-lg backdrop-blur-md transition-colors hover:bg-white/70 focus-visible:outline-none focus-visible:ring-4"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.45, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
            style={{
              borderColor: isUnlocked ? `${theme.primaryColor}36` : 'rgba(255,255,255,0.55)',
              boxShadow: isUnlocked ? `0 18px 42px ${theme.primaryColor}14` : undefined,
            }}
          >
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-1"
              style={{
                background: isUnlocked
                  ? `linear-gradient(90deg, ${theme.primaryColor}, ${theme.accentColor})`
                  : 'linear-gradient(90deg, rgba(148,163,184,0.25), rgba(148,163,184,0.05))',
              }}
            />
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">
                  {milestone ? milestone.title : `${letter.milestoneDays} ngày`}
                </p>
                <h4 className="text-xl font-bold" style={{ color: theme.textColor }}>
                  {letter.title}
                </h4>
              </div>
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
                style={{
                  backgroundColor: isUnlocked ? `${theme.primaryColor}18` : 'rgba(148,163,184,0.16)',
                  color: isUnlocked ? theme.primaryColor : '#64748B',
                }}
              >
                {isUnlocked ? <MailOpen className="h-5 w-5" /> : <LockKeyhole className="h-5 w-5" />}
              </span>
            </div>

            <p className="mt-4 min-h-[3.5rem] text-sm leading-7 text-gray-600">
              {letter.preview}
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                <Calendar className="h-4 w-4" />
                {milestone ? formatMilestoneDate(milestone.date) : 'Đang cập nhật'}
              </span>
              <span
                className="rounded-full px-3 py-1 text-xs font-semibold"
                style={{
                  backgroundColor: isUnlocked ? `${theme.primaryColor}16` : 'rgba(148,163,184,0.16)',
                  color: isUnlocked ? theme.primaryColor : '#64748B',
                }}
              >
                {isUnlocked ? 'Mở thư' : milestone ? `Còn ${Math.max(0, milestone.daysUntil)} ngày` : 'Đang khóa'}
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {selectedLetter && (
          <motion.div
            className="fixed inset-0 z-[95] flex items-center justify-center bg-rose-950/35 px-4 py-8 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="milestone-letter-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onMouseDown={() => setSelectedLetter(null)}
          >
            <motion.div
              className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-white/60 bg-white/90 p-7 text-center shadow-2xl"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onMouseDown={(event) => event.stopPropagation()}
            >
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setSelectedLetter(null)}
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 text-rose-900 transition-colors hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-200"
                aria-label="Đóng lá thư"
                title="Đóng"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full" style={{ backgroundColor: `${theme.primaryColor}18`, color: theme.primaryColor }}>
                <MailOpen className="h-7 w-7" />
              </div>
              <h4 id="milestone-letter-title" className="font-script text-4xl md:text-5xl" style={{ color: theme.textColor }}>
                {selectedLetter.title}
              </h4>
              <p className="mt-5 text-base leading-8 text-gray-700">
                {selectedLetter.body}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MilestoneLetters;

