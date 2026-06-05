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
  subject: { name: string };
  teacher: { firstName: string; lastName: string };
  submissions: Array<{ status: string; score: number | null }>;
}

export const normalizeAssignmentsForStudent = (assignments: RawAssignmentInput[]) => {
  const now = new Date();

  return assignments.map((task) => {
    // 1. Resolve Status Core Logic
    let status = "PENDING";
    let statusClass = "bg-gray-200 text-zinc-600"; // Default styling for PENDING

    const hasSubmitted = task.submissions && task.submissions.length > 0;
    const taskDueDate = new Date(task.dueDate);

    if (hasSubmitted) {
      status = "COMPLETED";
      statusClass = "bg-green-100 text-green-700"; // Green for finished tasks
    } else if (taskDueDate < now) {
      status = "OVERDUE";
      statusClass = "bg-rose-400/20 text-[#A8364B]"; // Matches your pink/crimson UI
    } else {
      // Check if due date is within today's calendar date bounds
      const isDueToday = 
        taskDueDate.getDate() === now.getDate() &&
        taskDueDate.getMonth() === now.getMonth() &&
        taskDueDate.getFullYear() === now.getFullYear();

      if (isDueToday) {
        status = "DUE TODAY";
        statusClass = "bg-pink-200/30 text-[#7C5270]"; // Matches your purple/pink UI banner
      } else {
        // Look ahead: Check if due date is exactly tomorrow
        const tomorrow = new Date(now);
        tomorrow.setDate(now.getDate() + 1);
        const isDueTomorrow =
          taskDueDate.getDate() === tomorrow.getDate() &&
          taskDueDate.getMonth() === tomorrow.getMonth() &&
          taskDueDate.getFullYear() === tomorrow.getFullYear();

        if (isDueTomorrow) {
          status = "DUE TOMORROW";
          // Keeps standard pending look or custom gray variant
        }
      }
    }

    // 2. Parse Human Readable Date Components
    const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
    const timeOptions: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit', hour12: true };

    const dueDateFormatted = taskDueDate.toLocaleDateString('en-US', dateOptions);
    const dueTimeFormatted = taskDueDate.toLocaleTimeString('en-US', timeOptions);

    // 3. Construct Normalized Output Object matching Frontend Schema
    return {
      id: task.id,
      title: task.title,
      description: task.content, // Maps 'content' directly to UI 'description'
      subject: task.subject.name,
      attachments: task.fileUrl ? "1 attachment" : "No attachments",
      fileUrl: task.fileUrl ? task.fileUrl.replace(/\\/g, '/') : null, // Normalize Windows backslashes for web paths
      status,
      statusClass,
      dueDate: dueDateFormatted, // Outputs format: "Monday, June 15"
      dueTime: dueTimeFormatted, // Outputs format: "11:59 PM"
      givenBy: `${task.teacher.firstName} ${task.teacher.lastName}`
    };
  });
};