import type { Response } from 'express';
/**
 * 1. Initialize an Exam Term
 * Path: POST /api/grades/terms
 */
export declare const createExamTerm: (req: any, res: Response) => Promise<void>;
/**
 * 2. Component Generator (The Rulebook)
 * Creates the "Slots" (Theory/Practical) with weights for a Subject/Class.
 * Path: POST /api/grades/components
 */
export declare const createAssessmentComponents: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * 3. Grading Scale Configurator
 * Defines the ranges (e.g., 91-100 = A1)
 * Path: POST /api/grades/scales
 */
export declare const createGradingScale: (req: any, res: Response) => Promise<void>;
/**
 * 4. Global Toggle API
 * Switches the school between Percentage, CGPA, or Grade views.
 * Path: PATCH /api/grades/config
 */
export declare const updateSchoolConfig: (req: any, res: Response) => Promise<void>;
/**
 * PHASE 3: Teacher's "Grade Sheet" Fetch
 * Returns students and their current marks for a specific component.
 * Path: GET /api/grades/sheet?sectionId=...&assessmentComponentId=...
 */
export declare const getGradeSheet: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Path: POST /api/grades/marks
 */
export declare const saveMarks: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * PHASE 4: Calculation Engine
 * Calculates final percentage and assigns grades based on weightage
 */
export declare const calculateResults: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * PHASE 5: Student Dashboard API
 * Returns all calculated results for a student in a specific term
 */
export declare const getStudentResults: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * GET /api/grades/student-summary/:studentId
 */
export declare const getStudentFullSummary: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=gradeController.d.ts.map