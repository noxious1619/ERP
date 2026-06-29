import { useState, useRef, useMemo, useEffect } from "react";
import {
  X,
  FileText,
  Upload,
  Calendar,
  Clock3,
  ChevronDown,
  Trash2,
} from "lucide-react";

interface AssignHomeworkModalProps {
  open: boolean;
  onClose: () => void;
  // Passing the teachingAssignments from the parent's useAuth hook
  teachingAssignments: any[]; 
  editingAssignment?: any | null;
}

const AssignHomeworkModal = ({ open, onClose, teachingAssignments, editingAssignment }: AssignHomeworkModalProps) => {
  // Form State - Notice we removed selectedClassId!
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [chapter, setChapter] = useState("");
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [time, setTime] = useState("");
  const [maxScore, setMaxScore] = useState(100);
  const [file, setFile] = useState<File | null>(null);
  const [existingFileUrl, setExistingFileUrl] = useState<string | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  console.log("TEACHING ASSIGNMENTS DATA:", teachingAssignments);
  // --- Derived Data for Dropdowns ---
  
  // 1. Get unique Class-Section combos
  const availableClassSections = useMemo(() => {
    if (!teachingAssignments) return [];
    
    const sectionMap = new Map();
    teachingAssignments.forEach((ta) => {
      const sec = ta?.section;
      if (sec && !sectionMap.has(sec.id)) {
        sectionMap.set(sec.id, sec);
      }
    });
    
    return Array.from(sectionMap.values());
  }, [teachingAssignments]);

  // 2. Get unique subjects based ONLY on the selected section
  const availableSubjects = useMemo(() => {
    if (!selectedSectionId || !teachingAssignments) return [];

    const subjectsMap = new Map();

    teachingAssignments.forEach((ta) => {
      if (ta?.section?.id === selectedSectionId && ta?.subject) {
        subjectsMap.set(ta.subject.id, ta.subject);
      }
    });

    return Array.from(subjectsMap.values());
  }, [selectedSectionId, teachingAssignments]);

  // Pre-populate form states when editingAssignment changes
  useEffect(() => {
    if (editingAssignment) {
      setSelectedSectionId(editingAssignment.section?.id || "");
      setSelectedSubjectId(editingAssignment.subject?.id || "");
      
      const title = editingAssignment.title || "";
      const parts = title.split(" - ");
      if (parts.length > 1) {
        setChapter(parts[0]);
        setTopic(parts.slice(1).join(" - "));
      } else {
        setChapter(title);
        setTopic("");
      }

      setDescription(editingAssignment.content || "");
      
      if (editingAssignment.dueDate) {
        const d = new Date(editingAssignment.dueDate);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        setDueDate(`${yyyy}-${mm}-${dd}`);
        
        const hrs = String(d.getHours()).padStart(2, '0');
        const mins = String(d.getMinutes()).padStart(2, '0');
        setTime(`${hrs}:${mins}`);
      } else {
        setDueDate("");
        setTime("");
      }
      setMaxScore(editingAssignment.maxScore || 100);
      setFile(null);
      setExistingFileUrl(editingAssignment.fileUrl || null);
    } else {
      setSelectedSectionId("");
      setSelectedSubjectId("");
      setChapter("");
      setTopic("");
      setDescription("");
      setDueDate("");
      setTime("");
      setMaxScore(100);
      setFile(null);
      setExistingFileUrl(null);
    }
  }, [editingAssignment, open]);

  // Auto-select subject if there's only 1 available, otherwise clear it if invalid
  useEffect(() => {
    if (editingAssignment) return; // Skip auto-selection during edit
    if (availableSubjects.length === 1) {
      setSelectedSubjectId(availableSubjects[0].id);
    } else if (availableSubjects.length === 0) {
      setSelectedSubjectId("");
    } else {
      // If currently selected subject isn't in the new list, clear it
      if (!availableSubjects.find((s) => s.id === selectedSubjectId)) {
        setSelectedSubjectId("");
      }
    }
  }, [availableSubjects, selectedSubjectId, editingAssignment]);

  // If modal is closed, don't render
  if (!open) return null;

  // --- Handlers ---
  const handleFile = (selectedFiles: FileList | null) => {
    if (!selectedFiles || selectedFiles.length === 0) return;
    setFile(selectedFiles[0]); // Only take the first file
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!selectedSectionId || !selectedSubjectId || !chapter || !dueDate) {
      alert("Please fill out the required fields (Class/Section, Subject, Chapter, Due Date).");
      return;
    }

    setIsSubmitting(true);

    try {
      // Find the selected section object to extract the Class ID for the backend
      const selectedSection = availableClassSections.find(s => s.id === selectedSectionId);
      const classId = selectedSection?.academicClass?.id;

      if (!classId) {
        alert("Error mapping Class ID. Please try selecting the section again.");
        setIsSubmitting(false);
        return;
      }

      const title = topic ? `${chapter} - ${topic}` : chapter;
      const combinedDateTime = new Date(`${dueDate}T${time || "23:59"}`);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", description);
      formData.append("classId", classId); // Extracted from the section!
      formData.append("sectionId", selectedSectionId);
      formData.append("subjectId", selectedSubjectId); 
      formData.append("dueDate", combinedDateTime.toISOString());
      formData.append("maxScore", maxScore.toString());
      
      if (file) {
        formData.append("file", file);
      } else if (!existingFileUrl && editingAssignment) {
        formData.append("removeAttachment", "true");
      }

      const url = editingAssignment
        ? `http://localhost:5000/api/assignments/${editingAssignment.id}`
        : "http://localhost:5000/api/assignments";

      const response = await fetch(url, {
        method: editingAssignment ? "PATCH" : "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setFile(null);
        setSelectedSectionId("");
        setSelectedSubjectId("");
        setChapter("");
        setTopic("");
        setDescription("");
        setDueDate("");
        setTime("");
        onClose();
      } else {
        alert(data.message || "Failed to submit assignment");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("An error occurred while submitting homework.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/30 backdrop-blur-[2px] flex items-center justify-center px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
    >
      <div className="relative w-full max-w-[730px] max-h-[90vh] bg-white rounded-[16px] shadow-2xl flex flex-col overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 w-9 h-9 rounded-full border-2 border-[#4D8DFF] flex items-center justify-center bg-white z-10 hover:bg-blue-50 transition-colors disabled:opacity-50"
        >
          <X className="w-4 h-4 text-[#4D8DFF]" />
        </button>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 px-8 py-7 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-6 h-6 text-[#4D8DFF]" />
            <h2 className="text-[20px] font-semibold text-[#222]">
              {editingAssignment ? "Edit Homework" : "Assign Homework"}
            </h2>
          </div>

          {/* Row 1: Combined Class/Section + Subject (2 columns instead of 3) */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            
            {/* Combined Class & Section Dropdown */}
            <div className="relative">
              <select
                value={selectedSectionId}
                onChange={(e) => {
                  setSelectedSectionId(e.target.value);
                  setSelectedSubjectId(""); // Reset subject when changing classes
                }}
                className="w-full h-[56px] px-4 border border-[#D9D9D9] rounded-[10px] appearance-none text-[16px] text-[#555] outline-none bg-white focus:border-[#4D8DFF] transition-colors"
              >
                <option value="">Select Class & Section *</option>
                {availableClassSections.map((sec) => (
                  <option key={sec.id} value={sec.id}>
                    {sec.academicClass?.name} - {sec.name}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* Dynamic Subject Field */}
            <div className="relative">
              {availableSubjects.length === 1 ? (
                // EXACTLY ONE SUBJECT: Read-only text box locked with the subject name
                <div className="w-full h-[56px] px-4 border border-[#D9D9D9] bg-gray-50 rounded-[10px] flex items-center text-[16px] text-[#555] font-medium cursor-not-allowed">
                  {availableSubjects[0].name}
                </div>
              ) : availableSubjects.length > 1 ? (
                // MULTIPLE SUBJECTS: Show a dropdown
                <>
                  <select
                    value={selectedSubjectId}
                    onChange={(e) => setSelectedSubjectId(e.target.value)}
                    className="w-full h-[56px] px-4 border border-[#D9D9D9] rounded-[10px] appearance-none text-[16px] text-[#555] outline-none bg-white focus:border-[#4D8DFF] transition-colors"
                  >
                    <option value="">Select Subject *</option>
                    {availableSubjects.map((sub: any) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </>
              ) : (
                // ZERO SUBJECTS (Fallback before they select a class)
                <div className="w-full h-[56px] px-4 border border-[#D9D9D9] bg-gray-50 rounded-[10px] flex items-center text-[16px] text-[#aaa] cursor-not-allowed">
                  Subject
                </div>
              )}
            </div>
          </div>

          {/* Row 2: Chapter + Topic */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              placeholder="Chapter *"
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
              className="h-[56px] px-4 border border-[#D9D9D9] rounded-[10px] text-[16px] outline-none focus:border-[#4D8DFF] transition-colors"
            />
            <input
              placeholder="Topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="h-[56px] px-4 border border-[#D9D9D9] rounded-[10px] text-[16px] outline-none focus:border-[#4D8DFF] transition-colors"
            />
          </div>

          {/* Description */}
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full h-[110px] px-4 py-3 border border-[#D9D9D9] rounded-[10px] resize-none text-[16px] outline-none focus:border-[#4D8DFF] transition-colors mb-4"
          />

          {/* Due Date + Time + Marks */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="relative border border-[#D9D9D9] rounded-[10px] h-[56px] px-4 flex items-center gap-3">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-[12px] text-gray-500">
                Due Date *
              </label>
              <Calendar className="w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="flex-1 text-[15px] text-gray-600 outline-none bg-transparent"
              />
            </div>

            <div className="relative border border-[#D9D9D9] rounded-[10px] h-[56px] px-4 flex items-center gap-3">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-[12px] text-gray-500">
                Time
              </label>
              <Clock3 className="w-5 h-5 text-gray-400" />
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="flex-1 text-[15px] text-gray-600 outline-none bg-transparent"
              />
            </div>

            <div className="relative border border-[#D9D9D9] rounded-[10px] h-[56px] px-4 flex items-center gap-3">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-[12px] text-gray-500">
                Marks
              </label>
              <input
                type="number"
                min="0"
                value={maxScore}
                onChange={(e) => setMaxScore(Number(e.target.value))}
                className="flex-1 text-[15px] text-gray-600 outline-none bg-transparent w-full"
              />
            </div>
          </div>

          {/* Attachments */}
          <div className="mb-6">
            <h3 className="flex items-center gap-2 text-[16px] font-semibold text-gray-800 mb-3">
              <Upload className="w-5 h-5 text-[#4D8DFF]" />
              Attachment (Max 1)
            </h3>

            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(e) => handleFile(e.target.files)}
            />

            {!file && !existingFileUrl ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="border-2 border-dashed border-[#D7DCE5] rounded-[12px] h-[160px] flex flex-col items-center justify-center bg-[#FAFBFC] cursor-pointer hover:border-[#4D8DFF] transition-colors"
              >
                <Upload className="w-9 h-9 text-gray-400 mb-3" />
                <p className="text-[15px] text-gray-700">
                  <span className="text-[#4D8DFF] font-medium">Click to upload</span> or drag and drop
                </p>
                <p className="text-[13px] text-[#667085] mt-1">
                  PDFs, Images, or Documents
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-between px-4 py-3 rounded-lg border bg-[#F9FAFB]">
                <div className="flex items-center gap-3">
                  <FileText size={20} className="text-[#4D8DFF]" />
                  <span className="text-[15px] font-medium text-gray-700 truncate">
                    {file ? file.name : existingFileUrl?.split("/").pop() || "Attached File"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setExistingFileUrl(null);
                  }}
                  className="text-red-500 p-2 hover:bg-red-50 rounded-full transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-[#F2F4F7] flex justify-end gap-3 bg-white">
          {!editingAssignment && (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="h-[46px] px-7 rounded-full border border-[#D0D5DD] text-[#667085] text-[14px] font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              SAVE AS DRAFT
            </button>
          )}
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="h-[46px] px-8 rounded-full bg-[#4D8DFF] text-white text-[14px] font-semibold shadow-md hover:bg-[#3d7dee] transition-colors disabled:opacity-50"
          >
            {isSubmitting 
              ? (editingAssignment ? "SAVING..." : "ASSIGNING...") 
              : (editingAssignment ? "SAVE CHANGES" : "ASSIGN HOMEWORK")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignHomeworkModal;