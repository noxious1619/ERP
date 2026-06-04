import type { TeacherProfileData } from "../../../types/teacherprofile";
// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatDate = (raw: string | null): string => {
  if (!raw) return "—";
  const d = new Date(raw);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
};

/** "English, Mathematics" from subjects array */
const buildSubjects = (subjects: TeacherProfileData["subjects"]): string =>
  subjects.length
    ? [...new Set(subjects.map((s) => s.name))].join(", ")
    : "—";

/**
 * "Grade 10 - A, Grade 10 - B" from sections array
 * Each section knows its class via academicClass.name
 */
const buildClassesAssigned = (sections: TeacherProfileData["sections"]): string =>
  sections.length
    ? sections.map((s) => `${s.academicClass.name} - ${s.name}`).join(", ")
    : "—";

// ─── Sub-components ───────────────────────────────────────────────────────────

const SkeletonRow = () => (
  <div className="contents">
    <div className="h-4 w-28 animate-pulse rounded-full bg-gray-200" />
    <div className="h-5 w-44 animate-pulse rounded-full bg-gray-200" />
  </div>
);

const Row = ({ label, value }: { label: string; value?: string | null }) => (
  <>
    <p className="self-center text-[15px] font-medium uppercase tracking-[0.5px] text-[#767676]">
      {label}
    </p>
    <p className="text-[17px] font-semibold leading-[26px] text-black">
      {value || "—"}
    </p>
  </>
);

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  teacher: TeacherProfileData | null;
  isLoading: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

const ProfessionalInfoCard = ({ teacher, isLoading }: Props) => {
  return (
    <div className="w-full rounded-3xl border-[0.50px] border-stone-300/80 bg-white/40 px-10 py-8 shadow-[0px_4px_88px_0px_rgba(0,0,0,0.05)] backdrop-blur-[2px]">
      <h2 className="mb-8 text-center text-[22px] font-black uppercase tracking-wide text-black">
        Professional Information
      </h2>

      <div className="grid grid-cols-[180px_1fr] items-center gap-y-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
        ) : (
          <>
            <Row label="JOINING DATE"     value={formatDate(teacher?.joiningDate ?? null)} />
            <Row label="DESIGNATION"      value={teacher?.designation} />
            <Row label="QUALIFICATION"    value={teacher?.qualification} />
            <Row
              label="EXPERIENCE"
              value={
                teacher?.experience != null
                  ? `${teacher.experience} year${teacher.experience === 1 ? "" : "s"}`
                  : null
              }
            />
            {/* SUB ASSIGNED — from subjects[] */}
            <Row label="SUB ASSIGNED"     value={teacher ? buildSubjects(teacher.subjects) : null} />
            {/* CLASSES ASSIGNED — from sections[] via academicClass */}
            <Row label="CLASSES ASSIGNED" value={teacher ? buildClassesAssigned(teacher.sections) : null} />
            {teacher?.specialization && (
              <Row label="SPECIALIZATION" value={teacher.specialization} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProfessionalInfoCard;