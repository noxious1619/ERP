// ─── ADD this utility to utils/downloadTimetable.ts ──────────────────────────
// Call this from DateScheduleCard's Download button onClick

import jsPDF from "jspdf";

interface TimetableItem {
  time: string;
  isBreak: boolean;
  breakLabel?: string | null;
  subject?: string | null;
  professor?: string | null;
  room?: string | null;
  duration?: string;
}

interface DownloadOptions {
  teacherName: string;
  filterMode: "class" | "mySubject";
  sectionLabel?: string; // e.g. "Class 10 - Section A"
  items: TimetableItem[];
  day: string; // e.g. "MONDAY"
}

// ─── Colors ───────────────────────────────────────────────────────────────────
const COLORS = {
  primary:     [63,  91, 246] as [number, number, number],  // #3F5BF6
  dark:        [30,  30,  50] as [number, number, number],
  gray:        [100, 100, 120] as [number, number, number],
  lightGray:   [240, 242, 248] as [number, number, number],
  breakBg:     [248, 249, 254] as [number, number, number],
  white:       [255, 255, 255] as [number, number, number],
  accent:      [238, 240, 255] as [number, number, number],
};

export const downloadTimetablePDF = ({
  teacherName,
  filterMode,
  sectionLabel,
  items,
  day,
}: DownloadOptions) => {
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = 210;
  const margin = 16;
  const contentW = pageW - margin * 2;
  let y = 0;

  // ─── Header band ────────────────────────────────────────────────────────────
  pdf.setFillColor(...COLORS.primary);
  pdf.rect(0, 0, pageW, 38, "F");

  // School ERP label
  pdf.setTextColor(...COLORS.white);
  pdf.setFontSize(8);
  pdf.setFont("helvetica", "normal");
  pdf.text("SCHOOL ERP", margin, 10);

  // Title
  pdf.setFontSize(20);
  pdf.setFont("helvetica", "bold");
  pdf.text("My Timetable", margin, 22);

  // Subtitle — teacher name + mode
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  const subtitle = filterMode === "class"
    ? `${teacherName}  ·  ${sectionLabel || ""}  ·  ${day}`
    : `${teacherName}  ·  My Subject  ·  ${day}`;
  pdf.text(subtitle, margin, 31);

  // Date printed (top right)
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  pdf.setFontSize(8);
  pdf.text(`Printed: ${dateStr}`, pageW - margin, 31, { align: "right" });

  y = 48;

  // ─── Section label bar ───────────────────────────────────────────────────────
  pdf.setFillColor(...COLORS.accent);
  pdf.roundedRect(margin, y, contentW, 9, 2, 2, "F");
  pdf.setTextColor(...COLORS.primary);
  pdf.setFontSize(8);
  pdf.setFont("helvetica", "bold");
  const modeLabel = filterMode === "class"
    ? `CLASS TIMETABLE  —  ${(sectionLabel || "").toUpperCase()}`
    : "MY SUBJECT TIMETABLE";
  pdf.text(modeLabel, margin + 4, y + 6);
  y += 16;

  // ─── Timetable rows ──────────────────────────────────────────────────────────
  items.forEach((item) => {
    if (item.isBreak) {
      // Break row — dashed line with centered label
      pdf.setDrawColor(...COLORS.lightGray);
      pdf.setLineDashPattern([2, 2], 0);
      pdf.line(margin, y + 4, pageW - margin, y + 4);
      pdf.setLineDashPattern([], 0);

      pdf.setFontSize(7.5);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(...COLORS.gray);
      const breakText = (item.breakLabel || "BREAK").toUpperCase();
      pdf.text(breakText, pageW / 2, y + 3, { align: "center" });
      y += 10;
    } else {
      // Period card
      const cardH = 18;

      // Card background
      pdf.setFillColor(...COLORS.white);
      pdf.setDrawColor(...COLORS.lightGray);
      pdf.roundedRect(margin, y, contentW, cardH, 3, 3, "FD");

      // Left accent bar
      pdf.setFillColor(...COLORS.primary);
      pdf.roundedRect(margin, y, 3, cardH, 1.5, 1.5, "F");

      // Time (left)
      pdf.setTextColor(...COLORS.primary);
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "bold");
      pdf.text(item.time, margin + 7, y + 7);

      // Duration below time
      if (item.duration) {
        pdf.setFontSize(6.5);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(...COLORS.gray);
        pdf.text(item.duration, margin + 7, y + 13);
      }

      // Subject / class name (center-left)
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(...COLORS.dark);
      const subjectText = item.subject || "No Subject";
      pdf.text(subjectText, margin + 35, y + 8);

      // Professor / subject label below
      if (item.professor) {
        pdf.setFontSize(7.5);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(...COLORS.gray);
        pdf.text(item.professor, margin + 35, y + 14);
      }

      // Room (right side)
      if (item.room) {
        pdf.setFontSize(7.5);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(...COLORS.gray);
        pdf.text(item.room, pageW - margin - 3, y + 8, { align: "right" });
      }

      y += cardH + 3;
    }

    // Page overflow guard
    if (y > 270) {
      pdf.addPage();
      y = 16;
    }
  });

  // ─── Footer ──────────────────────────────────────────────────────────────────
  y += 6;
  pdf.setFillColor(...COLORS.lightGray);
  pdf.rect(0, 282, pageW, 15, "F");
  pdf.setFontSize(7);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(...COLORS.gray);
  pdf.text("Generated by School ERP  ·  For internal use only", pageW / 2, 291, { align: "center" });

  // ─── Save ─────────────────────────────────────────────────────────────────────
  const filename = filterMode === "class"
    ? `timetable_${(sectionLabel || "class").replace(/\s+/g, "_")}_${day}.pdf`
    : `timetable_my_subject_${day}.pdf`;

  pdf.save(filename);
};