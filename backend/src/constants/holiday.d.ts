export declare const HOLIDAY_TYPES: {
    readonly GAZETTED: "GAZETTED";
    readonly INTERNAL: "INTERNAL";
    readonly EMERGENCY: "EMERGENCY";
};
export declare const HOLIDAY_AUDIENCE: {
    readonly ALL: "ALL";
    readonly STUDENT: "STUDENT";
    readonly STAFF: "STAFF";
};
export type HolidayType = typeof HOLIDAY_TYPES[keyof typeof HOLIDAY_TYPES];
export type HolidayAudience = typeof HOLIDAY_AUDIENCE[keyof typeof HOLIDAY_AUDIENCE];
//# sourceMappingURL=holiday.d.ts.map