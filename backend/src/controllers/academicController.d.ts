import type { Request, Response } from 'express';
export declare const createAcademicYear: (req: any, res: Response) => Promise<void>;
export declare const getAcademicYears: (req: Request, res: Response) => Promise<void>;
export declare const createClass: (req: any, res: Response) => Promise<void>;
export declare const createSection: (req: any, res: Response) => Promise<void>;
export declare const createSubject: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createTimetableEntry: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const createWeeklyTimetable: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getWeeklyTimetableBySection: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getStudentTimetable: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getTeacherMySubjectTimetable: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getTeacherMySubjectWeekly: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getDailyTimetableBySection: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=academicController.d.ts.map