import type { TeacherProfileData } from "../../../types/teacherprofile";
const formatDate = (raw: string | null): string => {
  if (!raw) return "—";
  const d = new Date(raw);
  return `${String(d.getDate()).padStart(2, "0")}-${String(
    d.getMonth() + 1,
  ).padStart(2, "0")}-${d.getFullYear()}`;
};

const SkeletonRow = () => (
  <div className="grid grid-cols-[100px_1fr] items-start gap-8">
    <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
    <div className="h-5 w-40 animate-pulse rounded bg-gray-200" />
  </div>
);

interface Props {
  teacher: TeacherProfileData | null;
  isLoading: boolean;
  error: string | null;
}

const TeacherProfileCard = ({ teacher, isLoading, error }: Props) => {
  const infoRows = teacher
    ? [
        { label: "UID", value: teacher.user.id },
        { label: "EMP NO.", value: teacher.employeeId },
        { label: "PHONE", value: teacher.phone ?? "—" },
        { label: "GENDER", value: teacher.gender ?? "—" },
        { label: "DOB", value: formatDate(teacher.dateOfBirth) },
        { label: "BLOOD GRP.", value: teacher.bloodGroup ?? "—" }, // ← new
        ...(teacher.address ? [{ label: "AREA", value: teacher.address }] : []),
        { label: "CITY", value: teacher.city ?? "—" }, // ← new
        { label: "STATE", value: teacher.state ?? "—" }, // ← new
      ]
    : [];

  const fullName = teacher
    ? `${teacher.firstName} ${teacher.lastName}`.trim() || "—"
    : "";

  const subjectNames = teacher?.subjects.map((s) => s.name).join(", ") ?? "";

  return (
    <div className="w-[460px] bg-white/40 rounded-3xl shadow-[0px_4px_88px_0px_rgba(0,0,0,0.05)] border-[0.50px] border-stone-300/80 px-12 py-8 backdrop-blur-[2px]">
      {/* Profile Image */}
      <div className="flex justify-center">
        {isLoading ? (
          <div className="h-[180px] w-[150px] animate-pulse rounded-2xl bg-gray-200" />
        ) : (
          <div className="flex h-[180px] w-[150px] items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 text-5xl font-black text-indigo-400 select-none">
            {teacher
              ? `${teacher.firstName?.[0] ?? ""}${teacher.lastName?.[0] ?? ""}`
              : "?"}
          </div>
        )}
      </div>

      {/* Name */}
      <div className="mt-2 text-center min-h-[36px]">
        {isLoading ? (
          <div className="mx-auto h-7 w-48 animate-pulse rounded bg-gray-200" />
        ) : error ? (
          <p className="text-red-500 text-sm">{error}</p>
        ) : (
          <h2 className="text-[26px] font-black uppercase tracking-[-0.5px] text-black">
            {fullName}
          </h2>
        )}
      </div>

      {/* Subtitle */}
      <div className="mt-3 flex items-center justify-center gap-8 min-h-[24px]">
        {isLoading ? (
          <>
            <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
          </>
        ) : teacher ? (
          <>
            {subjectNames && (
              <p className="text-[16px] font-medium text-[#1D1D1D]">
                Sub – {subjectNames}
              </p>
            )}
            {teacher.designation && (
              <p className="text-[16px] font-medium text-[#1D1D1D]">
                {teacher.designation}
              </p>
            )}
          </>
        ) : null}
      </div>

      {/* Info rows */}
      <div className="mt-12 flex flex-col gap-8">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
          : infoRows.map((item) => (
              <div
                key={item.label}
                className="grid grid-cols-[100px_1fr] items-start gap-8"
              >
                <span className="text-[18px] font-medium uppercase tracking-[0.5px] text-[#767676]">
                  {item.label}
                </span>
                <p className="text-[20px] font-semibold leading-[28px] text-black">
                  {item.value}
                </p>
              </div>
            ))}
      </div>
    </div>
  );
};

export default TeacherProfileCard;
