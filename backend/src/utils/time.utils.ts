export const formatCurrentTime = (): string => {

  const now = new Date();

  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
};

export const getCurrentSystemDay = () => {

  const days = [
    'SUNDAY',
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY'
  ] as const;

  return days[new Date().getDay()];
};

export const isValid24HourTime = (
  time: string
): boolean => {

  const timeRegex =
    /^([01]\d|2[0-3]):([0-5]\d)$/;

  return timeRegex.test(time);
};