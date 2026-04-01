export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  attendanceStatus?: 'PRESENT' | 'ABSENT' | 'LATE' | null;
  progress: number; // e.g. 79 for 79%
}