import type { Response } from 'express';
/**
 * PHASE 1: Define/Update Fee Structure (Admin)
 * This sets the "Price List" for a specific class and year.
 */
export declare const updateFeeStructure: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * PHASE 1: Fetch Fee Structure
 * Used to display the "Price List" to Admins or Students.
 */
export declare const getFeeStructure: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * PHASE 2: Bulk Monthly Fee Generator (Admin)
 * URL: POST /api/finance/generate-month
 */
export declare const generateMonthlyFees: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * PHASE 3: Update Payment Status (Finance Person)
 * URL: PATCH /api/finance/update-status/:recordId
 */
export declare const updatePaymentStatus: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * PHASE 4: The Defaulter Engine
 * Goal: Find all students with unpaid bills for a specific Class/Section.
 */
export declare const getDefaulters: (req: any, res: Response) => Promise<void>;
/**
 * PHASE 6: Personal Fee History (Student/Parent)
 * URL: GET /api/finance/my-fees
 */
export declare const getMyFeeHistory: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=financeController.d.ts.map