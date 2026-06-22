interface RawAssignmentInput {
    id: string;
    title: string;
    content: string;
    fileUrl: string | null;
    dueDate: Date;
    maxScore: number;
    subjectId: string;
    classId: string;
    sectionId: string | null;
    teacherId: string;
    createdAt: Date;
    updatedAt: Date;
    subject: {
        name: string;
    };
    teacher: {
        firstName: string;
        lastName: string;
    };
    submissions: Array<{
        status: string;
        score: number | null;
    }>;
}
export declare const normalizeAssignmentsForStudent: (assignments: RawAssignmentInput[]) => {
    id: string;
    title: string;
    description: string;
    subject: string;
    attachments: string;
    fileUrl: string | null;
    status: string;
    statusClass: string;
    dueDate: string;
    dueTime: string;
    givenBy: string;
}[];
export {};
//# sourceMappingURL=assignmentNormalizer.d.ts.map