import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { logActivity } from '../lib/auditService.js';

/**
 * 1. Initialize an Exam Term
 * Path: POST /api/grades/terms
 */
export const createExamTerm = async (req: any, res: Response) => {
  try {
    const { name } = req.body;
    const term = await prisma.examTerm.create({ data: { name } });

    logActivity(req.user.id, 'CREATE', 'ExamTerm', term.id, null, term);
    res.status(201).json({ success: true, data: term });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 2. Component Generator (The Rulebook)
 * Creates the "Slots" (Theory/Practical) with weights for a Subject/Class.
 * Path: POST /api/grades/components
 */
export const createAssessmentComponents = async (req: any, res: Response) => {
  try {
    const { termId, subjectId, classId, components } = req.body; 
    // components: [{ name: "Theory", maxMarks: 70, weightage: 0.7 }, ...]

    const totalWeight = components.reduce((sum: number, c: any) => sum + c.weightage, 0);
    if (Math.abs(totalWeight - 1.0) > 0.001) {
      return res.status(400).json({ success: false, message: "Total weightage must equal 1.0" });
    }

    const created = await prisma.$transaction(
      components.map((c: any) => 
        prisma.assessmentComponent.create({
          data: { ...c, termId, subjectId, classId }
        })
      )
    );

    logActivity(req.user.id, 'CREATE_BULK', 'AssessmentComponent', termId, null, created);
    res.status(201).json({ success: true, data: created });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 3. Grading Scale Configurator
 * Defines the ranges (e.g., 91-100 = A1)
 * Path: POST /api/grades/scales
 */
export const createGradingScale = async (req: any, res: Response) => {
  try {
    const { scales } = req.body; // Array of { minPercent, maxPercent, grade, gradePoint }

    const newScales = await prisma.$transaction(
      scales.map((s: any) => prisma.gradingScale.create({ data: s }))
    );

    res.status(201).json({ success: true, data: newScales });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 4. Global Toggle API
 * Switches the school between Percentage, CGPA, or Grade views.
 * Path: PATCH /api/grades/config
 */
export const updateSchoolConfig = async (req: any, res: Response) => {
  try {
    const { reportDisplayMode, passingPercent } = req.body;

    // Since it's a single-row config, we use an upsert or findFirst
    const config = await prisma.schoolConfig.findFirst();
    const updatedConfig = await prisma.schoolConfig.upsert({
      where: { id: config?.id || 'default-config' },
      update: { reportDisplayMode, passingPercent },
      create: { reportDisplayMode, passingPercent }
    });

    logActivity(req.user.id, 'UPDATE', 'SchoolConfig', updatedConfig.id, config, updatedConfig);
    res.json({ success: true, data: updatedConfig });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * PHASE 3: Teacher's "Grade Sheet" Fetch
 * Returns students and their current marks for a specific component.
 * Path: GET /api/grades/sheet?sectionId=...&assessmentComponentId=...
 */
export const getGradeSheet = async (req: any, res: Response) => {
  try {
    const { sectionId, assessmentComponentId } = req.query;
    
    // Ownership Check: BYPASSED FOR TESTING
    const component = await prisma.assessmentComponent.findUnique({
      where: { id: assessmentComponentId as string },
      include: { 
        subject: {
           select: { name: true } 
        },
      }
    });

    if (!component) return res.status(404).json({ message: "Component not found" });

    // 2. Fetch Students and their existing marks
    const students = await prisma.student.findMany({
      where: { sectionId: sectionId as string },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        rollNumber: true,
        marks: {
          where: { assessmentComponentId: assessmentComponentId as string },
          select: { marksObtained: true, isAbsent: true }
        }
      },
      orderBy: { rollNumber: 'asc' }
    });

    res.json({
      success: true,
      metadata: { 
        subjectName: component.subject.name,
        componentName: component.name, 
        maxMarks: component.maxMarks },
      data: students.map(s => ({
        studentId: s.id,
        name: `${s.firstName} ${s.lastName}`,
        rollNumber: s.rollNumber,
        marksObtained: s.marks[0]?.marksObtained || 0,
        isAbsent: s.marks[0]?.isAbsent || false
      }))
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Path: POST /api/grades/marks
 */
export const saveMarks = async (req: any, res: Response) => {
  try {
    const { assessmentComponentId, marks } = req.body; 
    // marks should be an array: [{ studentId: "...", marksObtained: 65, isAbsent: false }]
    const teacherId = req.user.id;

    // 1. Fetch component to get subject/term context
    const component = await prisma.assessmentComponent.findUnique({
      where: { id: assessmentComponentId },
    });

    if (!component) return res.status(404).json({ message: "Component not found" });

    // 2. Transaction: Save marks and flag the cache as stale
    await prisma.$transaction(async (tx) => {
      for (const entry of marks) {
        // Validation: Don't allow marks higher than maxMarks
        if (entry.marksObtained > component.maxMarks) {
          throw new Error(`Invalid marks for student ${entry.studentId}: ${entry.marksObtained} exceeds max ${component.maxMarks}`);
        }

        // A. Upsert the Mark
        await tx.mark.upsert({
          where: {
            studentId_assessmentComponentId: {
              studentId: entry.studentId,
              assessmentComponentId
            }
          },
          update: { marksObtained: entry.marksObtained, isAbsent: entry.isAbsent, teacherId },
          create: { 
            studentId: entry.studentId, 
            assessmentComponentId, 
            marksObtained: entry.marksObtained, 
            isAbsent: entry.isAbsent, 
            teacherId 
          }
        });

        // B. Set Cache to Stale
        await tx.calculatedResult.upsert({
          where: {
            studentId_subjectId_termId: {
              studentId: entry.studentId,
              subjectId: component.subjectId,
              termId: component.termId
            }
          },
          update: { isStale: true },
          create: {
            studentId: entry.studentId,
            subjectId: component.subjectId,
            termId: component.termId,
            finalPercentage: 0, 
            isStale: true
          }
        });
      }
    });

    res.json({ success: true, message: `Successfully saved ${marks.length} marks.` });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * PHASE 4: Calculation Engine
 * Calculates final percentage and assigns grades based on weightage
 */
export const calculateResults = async (req: any, res: Response) => {
  try {
    const { termId, classId, subjectId } = req.body;

    // 1. Find all stale results (those needing re-calculation)
    const staleResults = await prisma.calculatedResult.findMany({
      where: { 
        termId, 
        subjectId, 
        isStale: true 
      },
    });

    if (staleResults.length === 0) {
      return res.json({ 
        success: true, 
        message: "All results are already up to date for this subject/term." 
      });
    }

    // 2. Loop through each student who needs a calculation
    for (const result of staleResults) {
      // Fetch all marks for this student in this specific Subject and Term
      const marks = await prisma.mark.findMany({
        where: {
          studentId: result.studentId,
          assessment: { 
            termId,
            subjectId
          }
        },
        include: { 
          assessment: true // This gives us access to maxMarks and weightage
        }
      });

      let calculatedTotal = 0;

      marks.forEach((m: any) => {
        if (m.assessment.maxMarks > 0) {
          // Weighted Score = (Obtained / Max) * Weightage
          // Example: (58 / 70) * 0.7 = 0.58
          const weightedScore = (m.marksObtained / m.assessment.maxMarks) * m.assessment.weightage;
          calculatedTotal += weightedScore;
        }
      });

      // Convert the decimal (0.83) to a 100-base percentage (83.00)
      const finalPercentage = Math.round(calculatedTotal * 100 * 100) / 100;

      // 3. Dynamic Grade Lookup
      // Find where the percentage fits in your GradingScale table
      const gradeScale = await prisma.gradingScale.findFirst({
        where: {
          minPercent: { lte: finalPercentage },
          maxPercent: { gte: finalPercentage }
        }
      });

      // 4. Update the CalculatedResult table
      await prisma.calculatedResult.update({
        where: { id: result.id },
        data: {
          finalPercentage,
          grade: gradeScale?.grade || 'N/A',
          isStale: false, // Calculation is now fresh
          isComplete: true // All processed
        }
      });
    }

    res.json({ 
      success: true, 
      message: `Successfully processed and updated ${staleResults.length} student results.` 
    });

  } catch (error: any) {
    console.error("Calculation Error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Internal server error during calculation." 
    });
  }
};

/**
 * PHASE 5: Student Dashboard API
 * Returns all calculated results for a student in a specific term
 */
export const getStudentResults = async (req: any, res: Response) => {
  try {
    const studentId = req.user.id; // From your auth middleware
    const { termId } = req.query;

    if (!termId) {
      return res.status(400).json({ message: "Term ID is required" });
    }

    // Fetch all results for this student in this term
    const results = await prisma.calculatedResult.findMany({
      where: {
        studentId: studentId as string,
        termId: termId as string,
      },
      include: {
        // We need the subject name for the UI
        // Note: Make sure your schema has a relation from CalculatedResult to Subject
        // If not, you might need to fetch subjects separately or fix the relation
      }
    });

    // Transform the data for a clean Frontend experience
    const dashboardData = results.map(res => ({
      subjectId: res.subjectId,
      percentage: res.finalPercentage,
      grade: res.grade || "N/A",
      status: res.isComplete ? "Released" : "Result Awaited",
      lastUpdated: res.updatedAt
    }));

    res.json({
      success: true,
      termId,
      results: dashboardData
    });

  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Additional API: Get a comprehensive summary of all results for a student across terms
/**
 * GET /api/grades/student-summary/:studentId
 */
export const getStudentFullSummary = async (req: any, res: Response) => {
  try {
    const { studentId } = req.params;

    const summary = await prisma.calculatedResult.findMany({
      where: { studentId },
      include: {
        term: { select: { name: true } }, // Gets "Term 1", "Finals", etc.
      },
      orderBy: {
        termId: 'asc'
      }
    });

    if (!summary || summary.length === 0) {
      return res.status(404).json({ success: false, message: "No results found for this student." });
    }

    res.json({
      success: true,
      studentId,
      totalSubjects: summary.length,
      results: summary.map(item => ({
        term: item.term.name,
        subjectId: item.subjectId,
        percentage: item.finalPercentage,
        grade: item.grade || "N/A",
        isComplete: item.isComplete,
        updatedAt: item.updatedAt
      }))
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};