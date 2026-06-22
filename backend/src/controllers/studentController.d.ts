import type { Request, Response } from "express";
export declare const admitStudent: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAllStudents: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const bulkAdmitStudents: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getStudentProfile: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=studentController.d.ts.map