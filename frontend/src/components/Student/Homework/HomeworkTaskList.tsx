import { useState } from "react";
import sigmaIcon from "../../../assets/Student/Homework/physics.svg";
import biologyIcon from "../../../assets/Student/Homework/biology.svg";
import chemistryIcon from "../../../assets/Student/Homework/chemistry.svg";
import attachment from "../../../assets/Student/Homework/attachment.svg";
import ViewDetailSidebar from "./ViewDetailSidebar";
import type { HomeworkTask } from "./ViewDetailSidebar";

// ─── Task data ────────────────────────────────────────────────────────────────
// Each task extends HomeworkTask with the UI-only fields (icon, attachments, statusClass).

const tasks: (HomeworkTask & {
  icon: string;
  attachments: string;
  statusClass: string;
})[] = [
  {
    id: 1,
    icon: sigmaIcon,
    title: "Quantum Mechanics Problem Set",
    subject: "Physics",
    attachments: "2 attachments",
    status: "OVERDUE",
    statusClass: "bg-rose-400/20 text-[#A8364B]",
    dueDate: "Monday, May 22",
    dueTime: "10:00 PM",
    givenBy: "Miss. Archana Shah",
    description:
      "Get your graph theory homework done quickly by focusing on these key graph concepts. These are very important questions for the upcoming unit exams and we need you to prepare them very well. There is a high chance that they get repeated in the upcoming exams. Make sure to cover all theorems discussed in class and attempt every question neatly.",
    // Two teacher images → carousel with chevrons visible
    teacherImages: [
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop",
    ],
  },
  {
    id: 2,
    icon: biologyIcon,
    title: "Cell Structure Diagram",
    subject: "Biology",
    attachments: "1 attachment",
    status: "DUE TODAY",
    statusClass: "bg-pink-200/30 text-[#7C5270]",
    dueDate: "Saturday, May 23",
    dueTime: "11:59 PM",
    givenBy: "Mr. Raj Patel",
    description:
      "Draw a detailed diagram of a eukaryotic cell and label all major organelles. Include brief notes on the function of each organelle. Refer to Chapter 4 of your textbook for reference diagrams.",
    // Empty → triggers empty state (image 2 in screenshots)
    teacherImages: [],
  },
  {
    id: 3,
    icon: chemistryIcon,
    title: "Organic Synthesis Report",
    subject: "Chemistry",
    attachments: "No attachments",
    status: "DUE TOMORROW",
    statusClass: "bg-gray-200 text-zinc-600",
    dueDate: "Sunday, May 24",
    dueTime: "10:00 AM",
    givenBy: "Mrs. Priya Mehta",
    description:
      "Write a concise report (1–2 pages) on the mechanism of esterification. Include reactants, reaction conditions, products, and at least two real-life applications of esters in industry and food.",
    teacherImages: undefined, // undefined also triggers empty state
  },
  {
    id: 4,
    icon: chemistryIcon,
    title: "Organic Synthesis Report",
    subject: "Chemistry",
    attachments: "No attachments",
    status: "DUE TOMORROW",
    statusClass: "bg-gray-200 text-zinc-600",
    dueDate: "Sunday, May 24",
    dueTime: "10:00 AM",
    givenBy: "Mrs. Priya Mehta",
    description:
      "Write a concise report (1–2 pages) on the mechanism of esterification. Include reactants, reaction conditions, products, and at least two real-life applications of esters.",
    teacherImages: [],
  },
  {
    id: 5,
    icon: chemistryIcon,
    title: "Organic Synthesis Report",
    subject: "Chemistry",
    attachments: "No attachments",
    status: "DUE TOMORROW",
    statusClass: "bg-gray-200 text-zinc-600",
    dueDate: "Sunday, May 24",
    dueTime: "10:00 AM",
    givenBy: "Mrs. Priya Mehta",
    description:
      "Write a concise report (1–2 pages) on the mechanism of esterification. Include reactants, reaction conditions, products, and at least two real-life applications of esters.",
    teacherImages: [],
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

const HomeworkTaskList = () => {
  const [selectedTask, setSelectedTask] = useState<HomeworkTask | null>(null);

  return (
    <>
      <div className="mt-3 flex w-full flex-col gap-5">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="
              flex h-[96px] items-center justify-between
              rounded-[26px] bg-white px-6
              shadow-[0px_4px_12px_rgba(0,0,0,0.04)]
            "
          >
            {/* LEFT */}
            <div className="flex items-center gap-5">
              <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#F4EFFB]">
                <img
                  src={task.icon}
                  alt={task.subject}
                  className="h-[22px] w-[22px]"
                />
              </div>

              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-[14px] font-bold text-gray-800">
                    {task.title}
                  </h3>
                  <span
                    className={`rounded-full px-3 py-[4px] text-[11px] font-semibold tracking-[0.5px] ${task.statusClass}`}
                  >
                    {task.status}
                  </span>
                </div>
                <p className="mt-[4px] text-zinc-600 text-sm flex items-center gap-1">
                  {task.subject} •
                  <img src={attachment} alt="" className="h-[14px] w-[14px]" />
                  {task.attachments}
                </p>
              </div>
            </div>

            {/* RIGHT — View Details button */}
            <button
              onClick={() => setSelectedTask(task)}
              className="text-[14px] font-semibold text-[#090958] hover:text-[#4F52A3] transition-colors cursor-pointer"
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      {/*
        ViewDetailSidebar renders as a fixed overlay (z-50) so it slides
        over the existing right sidebar without any layout changes needed
        in Homework.tsx.
      */}
      <ViewDetailSidebar
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
      />
    </>
  );
};

export default HomeworkTaskList;
