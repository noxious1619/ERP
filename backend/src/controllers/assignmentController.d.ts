import type { Request, Response } from 'express';
export declare const createAssignment: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getStudentAssignments: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const submitAssignment: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getAssignmentSubmissions: (req: Request, res: Response) => Promise<void>;
export declare const gradeSubmission: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=assignmentController.d.ts.map