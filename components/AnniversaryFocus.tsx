import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Calendar, Clock, Heart, Maximize2, Sparkles, X } from 'lucide-react';
import { useTheme } from '../ThemeContext';
import maleImage from '../assets/image/m.jpg';
import femaleImage from '../assets/image/fm.jpg';
import MusicToggle from './MusicToggle';
import type { CountdownParts, FocusMilestoneState } from '../services/milestoneService';
import {
  formatMilestoneDate,
  getCountdownParts,
  getFocusMilestoneState,
  isNightWaitWindow,
} from '../services/milestoneService';

interface AnniversaryFocusProps {
  startDate: Date;
}

interface TimeBlockProps {
  value: number;
  label: string;
  isLarge?: boolean;
}

const zeroCountdown = getCountdownParts(0);

const TimeBlock: React.FC<TimeBlockProps> = ({ value, label, isLarge = false }) => (
  <div
    className={[
      'flex flex-col items-center justify-center rounded-2xl border border-white/45 bg-white/55 shadow-[0_18px_45px_rgba(80,23,48,0.10)] backdrop-blur-md',
      'transition-transform duration-300',
      isLarge ? 'h-24 w-20 md:h-28 md:w-24' : 'h-20 w-[72px] md:h-24 md:w-24',
    ].join(' ')}
  >
    <span className={['font-mono font-bold tabular-nums leading-none text-rose-950', isLarge ? 'text-4xl md:text-5xl' : 'text-3xl md:text-4xl'].join(' ')}>
      {label === 'Ngày' ? value : String(value).padStart(2, '0')}
    </span>
    <span className={['mt-2 uppercase tracking-[0.22em] text-rose-900/60', isLarge ? 'text-[10px] md:text-xs' : 'text-[9px] md:text-[10px]'].join(' ')}>
      {label}
    </span>
  </div>
);

const CountdownGrid: React.FC<{ countdown: CountdownParts; isLarge?: boolean }> = ({ countdown, isLarge }) => (
  <div className="grid grid-cols-2 justify-items-center gap-3 sm:grid-cols-4 md:gap-4">
    <TimeBlock value={countdown.days} label="Ngày" isLarge={isLarge} />
    <TimeBlock value={countdown.hours} label="Giờ" isLarge={isLarge} />
    <TimeBlock value={countdown.minutes} label="Phút" isLarge={isLarge} />
    <TimeBlock value={countdown.seconds} label="Giây" isLarge={isLarge} />
  </div>
);

const getStateCopy = (state: FocusMilestoneState) => {
  const milestone = state.targetMilestone;

  if (!milestone) {
    return {
      eyebrow: 'Hành trình của mình',
      title: 'Mình đã đi qua những mốc thật đẹp',
      body: `${state.daysTogether} ngày đã ở lại trong câu chuyện này.`,
      button: 'Mở khoảnh khắc',
    };
  }

  if (state.phase === 'celebrating') {
    return {
      eyebrow: 'Hôm nay là ngày của mình',
      title: milestone.reachedMessage,
      body: `${state.daysTogether} ngày yêu nhau, và mốc ${milestone.title} vừa được đặt thêm vào nhật ký.`,
      button: 'Mở khoảnh khắc',
    };
  }

  if (state.phase === 'tonight') {
    return {
      eyebrow: 'Đêm chờ mốc',
      title: milestone.waitMessage,
      body: `Mốc ${milestone.title} sẽ tới lúc 00:00, ${formatMilestoneDate(milestone.date)}.`,
      button: 'Vào đêm chờ',
    };
  }

  return {
    eyebrow: 'Mốc kế tiếp',
    title: `Còn ${state.countdown.days} ngày nữa là ${milestone.title}.`,
    body: milestone.description,
    button: 'Mở khoảnh khắc',
  };
};

const getDockText = (state: FocusMilestoneState) => {
  const milestone = state.targetMilestone;
  if (!milestone) return `${state.daysTogether} ngày bên nhau`;
  if (state.phase === 'celebrating') return `Hôm nay là ${milestone.title}`;
  if (state.phase === 'tonight') return `Đêm nay chờ ${milestone.title}`;
  return `Còn ${state.countdown.days} ngày tới ${milestone.title}`;
};

const FloatingHearts: React.FC<{ active: boolean; color: string }> = ({ active, color }) => {
  const prefersReducedMotion = useReducedMotion();
  if (!active || prefersReducedMotion) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 14 }).map((_, index) => (
        <motion.div
          key={index}
          className="absolute"
          initial={{ opacity: 0, y: 60, scale: 0.55, rotate: -8 }}
          animate={{ opacity: [0, 0.9, 0], y: [-10, -150], scale: [0.55, 1, 0.9], rotate: [-8, 10] }}
          transition={{
            duration: 4.2 + (index % 4) * 0.35,
            delay: index * 0.18,
            repeat: Infinity,
            repeatDelay: 1.1,
            ease: 'easeOut',
          }}
          style={{
            left: `${10 + ((index * 29) % 80)}%`,
            bottom: `${(index * 11) % 34}%`,
            color,
            willChange: 'transform, opacity',
          }}
        >
          <Heart className="h-4 w-4 fill-current md:h-5 md:w-5" />
        </motion.div>
      ))}
    </div>
  );
};

const AnniversaryFocus: React.FC<AnniversaryFocusProps> = ({ startDate }) => {
  const theme = useTheme();
  const prefersReducedMotion = useReducedMotion();
  const [now, setNow] = useState(() => new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [showDock, setShowDock] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowDock(window.scrollY > 360);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const state = useMemo(() => getFocusMilestoneState(startDate, now), [startDate, now]);
  const copy = useMemo(() => getStateCopy(state), [state]);
  const displayCountdown = state.phase === 'celebrating' ? zeroCountdown : state.countdown;
  const milestone = state.targetMilestone;
  const isUrgent = state.phase === 'tonight';
  const isCelebrating = state.phase === 'celebrating';
  const isNightWait = isNightWaitWindow(state);
  const cardTextColor = isNightWait ? '#FFF7ED' : theme.textColor;
  const cardMutedColor = isNightWait ? 'rgba(255,247,237,0.72)' : theme.textMuted;
  const overlayTextClass = isNightWait ? 'text-white' : 'text-rose-950';
  const overlayMutedClass = isNightWait ? 'text-white/72' : 'text-rose-950/70';
  const overlayBadgeClass = isNightWait ? 'bg-white/10 text-white/80' : 'bg-white/45 text-rose-950/70';

  const ambientAnimation = prefersReducedMotion
    ? {}
    : { x: ['-8%', '8%', '-8%'], opacity: [0.22, 0.42, 0.22] };

  return (
    <>
      <motion.div
        className="relative overflow-hidden p-5 shadow-xl md:p-7"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        style={{
          borderRadius: theme.layout.cardRadius,
          background: isNightWait
            ? 'linear-gradient(135deg, rgba(42,16,41,0.92), rgba(93,31,69,0.82), rgba(16,8,28,0.92))'
            : `linear-gradient(135deg, ${theme.primaryColor}24, rgba(255,255,255,0.70), ${theme.secondaryColor}24)`,
          border: `1px solid ${isNightWait ? 'rgba(255,255,255,0.18)' : `${theme.primaryColor}24`}`,
        }}
      >
        <motion.div
          aria-hidden="true"
          className="absolute inset-x-[-20%] top-0 h-1/2"
          animate={ambientAnimation}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            background: `linear-gradient(100deg, transparent, ${theme.primaryColor}26, ${theme.secondaryColor}26, transparent)`,
            willChange: 'transform, opacity',
          }}
        />

        <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div
              className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em]"
              style={{ backgroundColor: isNightWait ? 'rgba(255,255,255,0.10)' : `${theme.primaryColor}18`, color: cardTextColor }}
            >
              {isCelebrating ? <Sparkles className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
              {copy.eyebrow}
            </div>
            <h3 className="max-w-2xl text-2xl font-bold leading-tight md:text-4xl" style={{ color: cardTextColor }}>
              {copy.title}
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 md:text-base" style={{ color: cardMutedColor }}>
              {copy.body}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <motion.button
                type="button"
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white shadow-lg outline-none transition-shadow focus-visible:ring-4"
                whileHover={prefersReducedMotion ? undefined : { y: -2 }}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
                style={{
                  background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.accentColor})`,
                  boxShadow: `0 18px 40px ${theme.primaryColor}30`,
                }}
              >
                <Maximize2 className="h-4 w-4" />
                {copy.button}
              </motion.button>

              {milestone && (
                <span className="inline-flex items-center gap-2 text-sm font-medium" style={{ color: cardMutedColor }}>
                  <Calendar className="h-4 w-4" />
                  {formatMilestoneDate(milestone.date)}
                </span>
              )}
            </div>
          </div>

          <CountdownGrid countdown={displayCountdown} />
        </div>
      </motion.div>

      <AnimatePresence>
        {showDock && !isOpen && (
          <motion.button
            type="button"
            onClick={() => setIsOpen(true)}
            className="fixed left-1/2 z-[80] flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/45 bg-white/75 px-4 py-3 text-sm font-semibold text-rose-950 shadow-[0_18px_55px_rgba(80,23,48,0.22)] backdrop-blur-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70 md:px-5"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 28, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20, x: '-50%' }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 1rem)' }}
          >
            <Clock className="h-4 w-4" style={{ color: theme.primaryColor }} />
            <span className="whitespace-nowrap">{getDockText(state)}</span>
            <Maximize2 className="h-4 w-4 opacity-60" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[90] overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="anniversary-focus-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: isNightWait
                  ? 'radial-gradient(circle at 50% 18%, rgba(255,215,170,0.16), transparent 32%), linear-gradient(145deg, #150719, #3a1232 45%, #090512)'
                  : `linear-gradient(145deg, ${theme.primaryColor}, #fff7ed 44%, ${theme.secondaryColor})`,
              }}
            />
            <motion.div
              aria-hidden="true"
              className="absolute inset-x-[-18%] top-[8%] h-1/3"
              animate={ambientAnimation}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                background: `linear-gradient(100deg, transparent, rgba(255,255,255,0.34), ${theme.accentColor}26, transparent)`,
                willChange: 'transform, opacity',
              }}
            />
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-1/3 opacity-45"
              style={{
                background: 'linear-gradient(to top, rgba(255,255,255,0.55), transparent)',
              }}
            />

            <FloatingHearts active={isCelebrating || isUrgent} color={theme.primaryColor} />

            <div className="relative z-10 flex min-h-screen flex-col px-5 py-5 text-center md:px-8 md:py-7">
              <div className="flex items-center justify-between">
                <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] backdrop-blur-md ${overlayBadgeClass}`}>
                  {isCelebrating ? <Sparkles className="h-4 w-4" /> : <Heart className="h-4 w-4 fill-current" />}
                  {copy.eyebrow}
                </div>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-full shadow-lg backdrop-blur-md transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/60 ${isNightWait ? 'bg-white/12 text-white hover:bg-white/20' : 'bg-white/50 text-rose-950 hover:bg-white/70'}`}
                  aria-label="Đóng khoảnh khắc chờ"
                  title="Đóng"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-5 py-5">
                <motion.div
                  className="flex items-center justify-center -space-x-5"
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                >
                  {[maleImage, femaleImage].map((image, index) => (
                    <motion.div
                      key={image}
                      className="h-[72px] w-[72px] overflow-hidden rounded-full border-4 border-white bg-white shadow-2xl md:h-24 md:w-24"
                      animate={prefersReducedMotion ? undefined : { y: index === 0 ? [0, -8, 0] : [0, 8, 0] }}
                      transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
                      style={{ willChange: 'transform' }}
                    >
                      <img src={image} alt={index === 0 ? 'Nam' : 'Nữ'} className="h-full w-full object-cover" />
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div
                  className="max-w-4xl"
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className={`mb-4 text-xs font-semibold uppercase tracking-[0.42em] md:text-sm ${isNightWait ? 'text-white/55' : 'text-rose-950/55'}`}>
                    {milestone ? milestone.focusTitle : 'LoveChronicle'}
                  </p>
                  <h2 id="anniversary-focus-title" className={`font-script text-5xl leading-tight drop-shadow-sm md:text-6xl ${overlayTextClass}`}>
                    {copy.title}
                  </h2>
                  <p className={`mx-auto mt-5 max-w-2xl text-base leading-8 md:text-lg ${overlayMutedClass}`}>
                    {copy.body}
                  </p>
                </motion.div>

                <motion.div
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.65, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                >
                  <CountdownGrid countdown={displayCountdown} isLarge />
                </motion.div>

                <motion.div
                  className="flex flex-wrap items-center justify-center gap-3"
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.65, delay: 0.26, ease: [0.22, 1, 0.36, 1] }}
                >
                  <MusicToggle />
                  <div className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold backdrop-blur-md ${overlayBadgeClass}`}>
                    <Calendar className="h-4 w-4" />
                    {milestone ? formatMilestoneDate(milestone.date) : `${state.daysTogether} ngày bên nhau`}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AnniversaryFocus;
