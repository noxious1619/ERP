import type { Request, Response } from 'express';
export declare const createNotice: (req: Request, res: Response) => Promise<void>;
export declare const getMyNotices: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getTeacherNotices: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=noticeController.d.ts.map