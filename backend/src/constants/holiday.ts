export const HOLIDAY_TYPES = {
  GAZETTED: 'GAZETTED',
  INTERNAL: 'INTERNAL',
  EMERGENCY: 'EMERGENCY'
} as const;

export const HOLIDAY_AUDIENCE = {
  ALL: 'ALL',
  STUDENT: 'STUDENT',
  STAFF: 'STAFF'
} as const;

// Optional: Types (VERY useful)
export type HolidayType = typeof HOLIDAY_TYPES[keyof typeof HOLIDAY_TYPES];
export type HolidayAudience = typeof HOLIDAY_AUDIENCE[keyof typeof HOLIDAY_AUDIENCE];