import {
  formatCurrentTime,
  getCurrentSystemDay
} from '../utils/time.utils.js';

export const isCurrentPeriodActive = (
  startTime: string,
  endTime: string,
  requestedDay: string
): boolean => {

  const currentDay =
    getCurrentSystemDay();
  if (
    currentDay !== requestedDay.toUpperCase()
  ) {
    return false;
  }

  const currentTime =
    formatCurrentTime();

  return (
    currentTime >= startTime &&
    currentTime <= endTime
  );
};