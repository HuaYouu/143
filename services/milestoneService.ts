import { milestoneDefinitions } from '../data/loveData';

export type MilestoneStatus = 'completed' | 'current' | 'next' | 'upcoming';
export type FocusMilestonePhase = 'waiting' | 'tonight' | 'celebrating' | 'complete';

export interface MilestoneDefinition {
  days: number;
  title: string;
  description: string;
  focusTitle: string;
  waitMessage: string;
  reachedMessage: string;
}

export interface RelationshipMilestone extends MilestoneDefinition {
  date: Date;
  status: MilestoneStatus;
  daysUntil: number;
}

export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
}

export interface FocusMilestoneState {
  phase: FocusMilestonePhase;
  targetMilestone: RelationshipMilestone | null;
  currentMilestone: RelationshipMilestone | null;
  nextMilestone: RelationshipMilestone | null;
  countdown: CountdownParts;
  daysTogether: number;
}

const DAY_MS = 24 * 60 * 60 * 1000;

export const startOfLocalDay = (date: Date): Date => (
  new Date(date.getFullYear(), date.getMonth(), date.getDate())
);

export const addDays = (date: Date, days: number): Date => {
  const result = startOfLocalDay(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const isSameLocalDay = (first: Date, second: Date): boolean => (
  first.getFullYear() === second.getFullYear()
  && first.getMonth() === second.getMonth()
  && first.getDate() === second.getDate()
);

export const differenceInCalendarDays = (later: Date, earlier: Date): number => {
  const laterDay = startOfLocalDay(later).getTime();
  const earlierDay = startOfLocalDay(earlier).getTime();
  return Math.round((laterDay - earlierDay) / DAY_MS);
};

export const differenceInFullDays = (later: Date, earlier: Date): number => (
  Math.max(0, Math.floor((later.getTime() - earlier.getTime()) / DAY_MS))
);

export const getCountdownParts = (milliseconds: number): CountdownParts => {
  const totalMs = Math.max(0, milliseconds);
  const days = Math.floor(totalMs / DAY_MS);
  const hours = Math.floor((totalMs % DAY_MS) / (60 * 60 * 1000));
  const minutes = Math.floor((totalMs % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((totalMs % (60 * 1000)) / 1000);

  return { days, hours, minutes, seconds, totalMs };
};

export const formatMilestoneDate = (date: Date): string => (
  date.toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
);

export const getMilestones = (startDate: Date, now: Date = new Date()): RelationshipMilestone[] => {
  const datedMilestones = milestoneDefinitions.map((definition) => {
    const date = addDays(startDate, definition.days);
    return {
      ...definition,
      date,
      daysUntil: differenceInFullDays(date, now),
      status: 'upcoming' as MilestoneStatus,
    };
  });

  const currentIndex = datedMilestones.findIndex((milestone) => (
    isSameLocalDay(milestone.date, now) && now.getTime() >= milestone.date.getTime()
  ));
  const nextIndex = datedMilestones.findIndex((milestone) => milestone.date.getTime() > now.getTime());

  return datedMilestones.map((milestone, index) => {
    let status: MilestoneStatus = 'upcoming';

    if (index === currentIndex) {
      status = 'current';
    } else if (index === nextIndex) {
      status = 'next';
    } else if (now.getTime() >= milestone.date.getTime()) {
      status = 'completed';
    }

    return { ...milestone, status };
  });
};

export const isNightWaitWindow = (state: FocusMilestoneState): boolean => (
  state.phase === 'tonight' && state.countdown.totalMs <= 3 * 60 * 60 * 1000
);

export const getFocusMilestoneState = (startDate: Date, now: Date = new Date()): FocusMilestoneState => {
  const milestones = getMilestones(startDate, now);
  const currentMilestone = milestones.find((milestone) => milestone.status === 'current') ?? null;
  const nextMilestone = milestones.find((milestone) => milestone.status === 'next') ?? null;
  const targetMilestone = currentMilestone ?? nextMilestone;
  const countdown = nextMilestone
    ? getCountdownParts(nextMilestone.date.getTime() - now.getTime())
    : getCountdownParts(0);

  let phase: FocusMilestonePhase = 'complete';
  if (currentMilestone) {
    phase = 'celebrating';
  } else if (nextMilestone && countdown.totalMs <= DAY_MS) {
    phase = 'tonight';
  } else if (nextMilestone) {
    phase = 'waiting';
  }

  return {
    phase,
    targetMilestone,
    currentMilestone,
    nextMilestone,
    countdown,
    daysTogether: Math.max(0, differenceInCalendarDays(now, startDate)),
  };
};
