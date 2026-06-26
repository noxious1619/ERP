import { isCurrentPeriodActive }
from './activePeriod.helper.js';

export const normalizeTimetable = (
  timetableRows: any[],
  requestedDay: string
) => {

  return timetableRows.map((item) => {

    const isActive =
      isCurrentPeriodActive(
        item.startTime,
        item.endTime,
        requestedDay
      );

    return {
      id: item.id,
      period: item.period,
      time:`${item.startTime} - ${item.endTime}`,
      startTime: item.startTime,
      endTime: item.endTime,
      isActive,
      isBreak: item.isBreak,
      breakLabel: item.breakLabel,
      room: item.room,
      color: item.color,
      subject:
        item.subject?.name || null,
      professor: item.isBreak 
        ? null 
        : item.teacher 
          ? `${item.teacher.firstName || ''} ${item.teacher.lastName || ''}`.trim() 
          : null
    };
  });
};