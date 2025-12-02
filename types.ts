export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean; // True if we are past the date (counting up), False if counting down
}

export interface Milestone {
  date: Date;
  title: string;
  description: string;
  isCompleted: boolean;
}

export interface LoveMessage {
  text: string;
  mood: 'romantic' | 'funny' | 'poetic' | 'deep';
}

export interface Quote {
  text: string;
  author: string;
}

export interface PhotoMemory {
  url: string;
  filename: string;
  date: Date;
  displayDate: string;
}