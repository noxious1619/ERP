import type { Response } from 'express';
export declare const createScheduledExam: (req: any, res: Response) => Promise<void>;
export declare const getStudentUpcomingExams: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getDatesheet: (req: any, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=examController.d.ts.map