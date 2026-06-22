import type { Request, Response } from "express";
export declare const getAllSubjects: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const createSubject: (req: any, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateSubject: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const bulkDeleteSubjects: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getClasses: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=subjectController.d.ts.map