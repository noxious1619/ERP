import { HOLIDAY_TYPES, HOLIDAY_AUDIENCE } from '../constants/holiday.js';

export const getIndianDefaultHolidays = (
  academicYearId: string,
  baseYear: number
) => {
  return [
    {
      title: "Republic Day",
      description: "National Holiday",
      startDate: new Date(`${baseYear}-01-26T00:00:00Z`),
      endDate: new Date(`${baseYear}-01-26T00:00:00Z`),
      type: HOLIDAY_TYPES.GAZETTED,
      appliesTo: HOLIDAY_AUDIENCE.ALL,
      academicYearId
    },
    {
      title: "Independence Day",
      description: "National Holiday",
      startDate: new Date(`${baseYear}-08-15T00:00:00Z`),
      endDate: new Date(`${baseYear}-08-15T00:00:00Z`),
      type: HOLIDAY_TYPES.GAZETTED,
      appliesTo: HOLIDAY_AUDIENCE.ALL,
      academicYearId
    },
    {
      title: "Gandhi Jayanti",
      description: "Birth Anniversary of Mahatma Gandhi",
      startDate: new Date(`${baseYear}-10-02T00:00:00Z`),
      endDate: new Date(`${baseYear}-10-02T00:00:00Z`),
      type: HOLIDAY_TYPES.GAZETTED,
      appliesTo: HOLIDAY_AUDIENCE.ALL,
      academicYearId
    },
    {
      title: "Christmas",
      description: "Religious Holiday",
      startDate: new Date(`${baseYear}-12-25T00:00:00Z`),
      endDate: new Date(`${baseYear}-12-25T00:00:00Z`),
      type: HOLIDAY_TYPES.GAZETTED,
      appliesTo: HOLIDAY_AUDIENCE.ALL,
      academicYearId
    }
  ];
};