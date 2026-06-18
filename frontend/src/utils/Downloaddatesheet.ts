import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ExamEntry {
  title: string;
  syllabus: string;
  examDate: string;
  startTime: string | null;
  endTime: string | null;
  totalMarks: number | null;
  status: string;
  subject: string;
}

interface DownloadOptions {
  exams: ExamEntry[];
  termName: string;
  filterLabel: string;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const downloadDatesheetPdf = ({ exams, termName, filterLabel }: DownloadOptions) => {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const pageW = doc.internal.pageSize.getWidth();
  const margin = 16;

  // ── Header bar ────────────────────────────────────────────────────────────
  doc.setFillColor(66, 133, 244);
  doc.rect(0, 0, pageW, 28, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Exam Date Sheet", margin, 12);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`${termName}  ·  ${filterLabel}`, margin, 20);

  const today = new Date().toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });
  doc.text(`Generated: ${today}`, pageW - margin, 20, { align: "right" });

  // ── Summary strip ─────────────────────────────────────────────────────────
  const upcoming  = exams.filter((e) => e.status === "UPCOMING").length;
  const ongoing   = exams.filter((e) => e.status === "ONGOING").length;
  const completed = exams.filter((e) => e.status === "COMPLETED").length;

  doc.setFillColor(240, 244, 255);
  doc.rect(0, 28, pageW, 14, "F");

  doc.setTextColor(72, 72, 72);
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.text(`Total Exams: ${exams.length}`, margin, 37);
  doc.text(`Upcoming: ${upcoming}`, margin + 40, 37);
  doc.text(`Ongoing: ${ongoing}`, margin + 80, 37);
  doc.text(`Completed: ${completed}`, margin + 118, 37);

  // ── Table ─────────────────────────────────────────────────────────────────
  const rows = exams.map((exam, i) => [
    i + 1,
    exam.title,
    formatDate(exam.examDate),
    exam.startTime && exam.endTime
      ? `${exam.startTime} – ${exam.endTime}`
      : exam.startTime ?? exam.endTime ?? "—",
    exam.totalMarks != null ? `${exam.totalMarks}` : "—",
    exam.syllabus ?? "—",
    exam.status,
  ]);

  autoTable(doc, {
    startY: 46,
    head: [["#", "Exam Title", "Date", "Time", "Marks", "Syllabus", "Status"]],
    body: rows,
    margin: { left: margin, right: margin },
    styles: {
      fontSize: 8.5,
      cellPadding: { top: 4, bottom: 4, left: 3, right: 3 },
      textColor: [72, 72, 72],
      lineColor: [220, 225, 235],
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: [66, 133, 244],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 8.5,
    },
    columnStyles: {
      0: { halign: "center", cellWidth: 8 },
      1: { cellWidth: 42, fontStyle: "bold" },
      2: { cellWidth: 34 },
      3: { cellWidth: 26 },
      4: { halign: "center", cellWidth: 14 },
      5: { cellWidth: 42, textColor: [120, 120, 120] },
      6: { halign: "center", cellWidth: 18 },
    },
    alternateRowStyles: { fillColor: [248, 249, 254] },
    didParseCell: (data: any) => {
  if (data.section === "body" && data.column.index === 6) {
    data.cell.text = []; // suppress default text rendering
  }
},
didDrawCell: (data: any) => {
  if (data.section === "body" && data.column.index === 6) {
    const status = String(data.cell.raw ?? "");
    const color: [number, number, number] =
      status === "COMPLETED" ? [158, 158, 158]
      : status === "ONGOING"  ? [66, 133, 244]
      : [72, 199, 142];
    doc.setTextColor(...color);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    const x = data.cell.x + data.cell.width / 2;
    const y = data.cell.y + data.cell.height / 2 + 1;
    doc.text(status, x, y, { align: "center" });
    doc.setTextColor(72, 72, 72);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
  }
},
  });

  // ── Footer ────────────────────────────────────────────────────────────────
  const pageH = doc.internal.pageSize.getHeight();
  doc.setFontSize(7.5);
  doc.setTextColor(180, 180, 180);
  doc.text("EdaOS · Exam Date Sheet", margin, pageH - 8);
  doc.text("Page 1", pageW - margin, pageH - 8, { align: "right" });

  // ── Save ──────────────────────────────────────────────────────────────────
  const safeName = filterLabel.replace(/\s+/g, "_");
  doc.save(`Datesheet_${termName}_${safeName}.pdf`);
};