export type DayOfWeek = "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY";

export interface Subject {
  id: string;
  name: string;
  code: string;
}

export interface Teacher {
  id: string;
  name: string;
}

export interface TimetableEntry {
  id: string;
  day: DayOfWeek;
  period: number;
  startTime: string; // Stored in "HH:MM" 24h format
  endTime: string;   // Stored in "HH:MM" 24h format
  room: string | null;
  color: string | null;
  isBreak: boolean;
  breakLabel: string | null;
  sectionId: string;
  subjectId: string | null;
  teacherId: string | null;
  subject?: Subject | null;
  teacher?: Teacher | null;
}