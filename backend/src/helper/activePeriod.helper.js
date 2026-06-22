import { formatCurrentTime, getCurrentSystemDay } from '../utils/time.utils.js';
export const isCurrentPeriodActive = (startTime, endTime, requestedDay) => {
    const currentDay = getCurrentSystemDay();
    if (currentDay !== requestedDay.toUpperCase()) {
        return false;
    }
    const currentTime = formatCurrentTime();
    return (currentTime >= startTime &&
        currentTime <= endTime);
};
export function getDuration(startTime, endTime) {
    const parts1 = startTime.split(":");
    const parts2 = endTime.split(":");
    const startH = Number(parts1[0]);
    const startM = Number(parts1[1]);
    const endH = Number(parts2[0]);
    const endM = Number(parts2[1]);
    const totalMinutes = (endH * 60 + endM) - (startH * 60 + startM);
    return `${totalMinutes} MINUTES`;
}
//# sourceMappingURL=activePeriod.helper.js.map