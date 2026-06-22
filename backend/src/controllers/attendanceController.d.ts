import type { Request, Response } from 'express';
export declare const markBulkAttendance: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getSectionAttendance: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getDailyAttendance: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const saveDailyAttendance: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateStudentYearlyAttendance: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getStudentAttendancePercentage: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getStudentMonthlyTrends: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getStudentWeeklyTrends: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getStudentHeatmapGrid: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=attendanceController.d.ts.map