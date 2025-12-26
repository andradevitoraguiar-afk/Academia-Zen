export interface Technique {
  id: string;
  title: string;
  description: string;
  tips: string[];
  videoUrl?: string;
  category?: string;
}

export interface Level {
  id: string;
  name: string;
  color: string; // Tailwind color class or hex
  description: string;
  techniques: Technique[];
  progress: number; // Mock progress for UI
}

export interface Discipline {
  id: string;
  name: string;
  iconType: 'gi' | 'wrestling' | 'boxing';
  description: string;
  imageUrl: string;
  instructor: string;
  levels: Level[];
}

export interface User {
  email: string;
  name: string;
  password?: string;
  avatar?: string;
  age?: string;
  weight?: string;
  height?: string;
  goal?: string;
}

export interface ProgressState {
  completedTechniques: string[]; // Array of technique IDs
  attendanceDates: string[]; // Array of ISO date strings (YYYY-MM-DD)
}

export interface ClassSession {
  id: string;
  time: string;
  disciplineId: string;
  title: string;
  instructor: string;
  duration: string;
}

export interface DaySchedule {
  day: string;
  shortDay: string;
  sessions: ClassSession[];
}