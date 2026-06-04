import type { TeacherProfileData } from "../../../types/teacherprofile";
// ─── Skeleton row ─────────────────────────────────────────────────────────────
const SkeletonRow = () => (
  <div className="grid grid-cols-[120px_1fr] items-center gap-4">
    <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
    <div className="h-5 w-48 animate-pulse rounded bg-gray-200" />
  </div>
);
// ─── Props ────────────────────────────────────────────────────────────────────
interface Props {
  teacher: TeacherProfileData | null;
  isLoading: boolean;
}
// ─── Component ────────────────────────────────────────────────────────────────
const ContactCard = ({ teacher, isLoading }: Props) => {
  // Prefer teacher.email (personal), fall back to user.email (login email)
  const email = teacher?.email ?? teacher?.user?.email ?? "—";
  const phone = teacher?.phone ?? "—";

  const rows = [
    { label: "EMAIL", value: email },
    { label: "PHONE NO.", value: phone },
  ];

  return (
    <div className="bg-white/40 rounded-3xl shadow-[0px_4px_88px_0px_rgba(0,0,0,0.05)] border-[0.50px] border-stone-300/80 px-10 py-8 backdrop-blur-[2px]">
      {/* Title */}
      <h2 className="text-center text-[22px] font-black uppercase tracking-wide text-black mb-8">
        Contact
      </h2>

      {/* Rows */}
      <div className="flex flex-col gap-6">
        {isLoading
          ? [1, 2].map((i) => <SkeletonRow key={i} />)
          : rows.map((item) => (
              <div
                key={item.label}
                className="grid grid-cols-[120px_1fr] items-center gap-4"
              >
                <span className="text-[18px] font-medium uppercase tracking-[0.5px] text-[#767676]">
                  {item.label}
                </span>
                <p className="text-[20px] font-semibold text-black break-all">
                  {item.value}
                </p>
              </div>
            ))}
      </div>
    </div>
  );
};

export default ContactCard;
