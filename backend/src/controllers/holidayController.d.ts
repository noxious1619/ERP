import type { Request, Response } from "express";
export declare const initializeYearHolidays: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getHolidays: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const addHoliday: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateHoliday: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteHoliday: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=holidayController.d.ts.map