import type { TeacherProfileData } from "../../../types/teacherprofile";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatDate = (raw: string | null): string => {
  if (!raw) return "—";
  const d = new Date(raw);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
};

/** "English, Mathematics" — deduplicated from teachingAssignments */
const buildSubjects = (teacher: TeacherProfileData): string => {
  const names = [
    ...new Set(teacher.teachingAssignments.map((a) => a.subject.name)),
  ];
  return names.length ? names.join(", ") : "—";
};

/** "Class 10 - Section A, Class 10 - Section B" from teachingAssignments */
const buildClassesAssigned = (teacher: TeacherProfileData): string => {
  const classes = teacher.teachingAssignments.map(
    (a) => `${a.section.academicClass.name} - ${a.section.name}`,
  );
  const unique = [...new Set(classes)];
  return unique.length ? unique.join(", ") : "—";
};

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

interface Props {
  teacher: TeacherProfileData | null;
  isLoading: boolean;
}

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
            <Row
              label="JOINING DATE"
              value={formatDate(teacher?.joiningDate ?? null)}
            />
            <Row label="DESIGNATION" value={teacher?.designation} />
            <Row label="QUALIFICATION" value={teacher?.qualification} />
            <Row
              label="EXPERIENCE"
              value={
                teacher?.experience != null
                  ? `${teacher.experience} year${teacher.experience === 1 ? "" : "s"}`
                  : null
              }
            />
            <Row
              label="SUB ASSIGNED"
              value={teacher ? buildSubjects(teacher) : null}
            />
            <Row
              label="CLASSES ASSIGNED"
              value={teacher ? buildClassesAssigned(teacher) : null}
            />
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
