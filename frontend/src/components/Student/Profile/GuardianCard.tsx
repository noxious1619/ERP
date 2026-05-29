export interface ParentData {
  id: string;
  fatherName: string | null;
  fatherPhone: string | null;
  motherName: string | null;
  motherPhone: string | null;
  email: string | null;
}
interface GuardianCardProps {
  parent?: ParentData | null;
  isLoading?: boolean;
}
// ─── Sub-components ────────────────────────────────────────────────────────────
const Skeleton = () => (
  <div className="animate-pulse space-y-6 mt-8">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="grid grid-cols-[170px_1fr] gap-x-4">
        <div className="h-5 bg-gray-200 rounded-full w-24" />
        <div className="h-5 bg-gray-200 rounded-full w-40" />
      </div>
    ))}
  </div>
);
const EmptyState = () => (
  <div className="mt-8 flex flex-col items-center justify-center py-8 text-center gap-2">
    <svg
      className="w-12 h-12 text-gray-300"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
    <p className="text-[16px] text-[#9B9B9B] font-medium">
      No guardian information linked.
    </p>
    <p className="text-[14px] text-[#BEBEBE]">
      Please contact your administrator.
    </p>
  </div>
);
// ─── Row ────────────────────────────────────────────────────────────────────────
interface RowProps {
  label: string;
  value: string | null | undefined;
  isEmail?: boolean;
}
 
const Row = ({ label, value, isEmail = false }: RowProps) => {
  if (!value) return null; // Don't render rows with no data
  return (
    <>
      <p className="text-[18px] font-medium text-[#9B9B9B] self-center">
        {label}
      </p>
      <p
        className={`text-[20px] font-semibold text-[#2B2B2B] ${
          isEmail ? "truncate" : ""
        }`}
        title={isEmail ? value : undefined}
      >
        {value}
      </p>
    </>
  );
};
 
// ─── Main Component ─────────────────────────────────────────────────────────────
 
const GuardianCard = ({ parent, isLoading = false }: GuardianCardProps) => {
  const hasAnyData =
    parent &&
    (parent.fatherName ||
      parent.motherName ||
      parent.fatherPhone ||
      parent.motherPhone ||
      parent.email);
 
  return (
    <div className="w-full rounded-3xl bg-white/40 px-10 py-4 shadow-[0px_4px_88px_0px_rgba(0,0,0,0.05)] border-[0.50px] border-stone-300/80">
      {/* Heading */}
      <h2 className="text-center text-[34px] font-bold uppercase text-black">
        Guardian
      </h2>
 
      {/* Content */}
      {isLoading ? (
        <Skeleton />
      ) : !hasAnyData ? (
        <EmptyState />
      ) : (
        <div className="mt-8 grid grid-cols-[170px_1fr] gap-y-6 items-center">
 
          {/* Father Block */}
          <Row label="FATHER" value={parent.fatherName} />
          <Row label="MOBILE NO." value={parent.fatherPhone} />
 
          {/* Divider — only show if BOTH parents have data */}
          {parent.fatherName && parent.motherName && (
            <div className="col-span-2 border-t border-stone-200/70" />
          )}
 
          {/* Mother Block */}
          <Row label="MOTHER" value={parent.motherName} />
          <Row label="MOBILE NO." value={parent.motherPhone} />
 
          {/* Shared Email */}
          {parent.email && (
            <>
              {(parent.fatherName || parent.motherName) && (
                <div className="col-span-2 border-t border-stone-200/70" />
              )}
              <Row label="EMAIL" value={parent.email} isEmail />
            </>
          )}
        </div>
      )}
    </div>
  );
};
 
export default GuardianCard;