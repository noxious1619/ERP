interface Stats {
  totalStaff: number;
  newThisMonth: number;
  active: number;
  onLeave: number;
}

interface Props {
  stats: Stats | null;
  loading: boolean;
}

export default function StaffStatsCards({ stats, loading }: Props) {
  const cards = [
    { label: "Total Staff", value: stats?.totalStaff ?? "-" },
    { label: "New This Month", value: stats?.newThisMonth ?? "-" },
    { label: "Active", value: stats?.active ?? "-" },
    { label: "On Leave", value: stats?.onLeave ?? "-" },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {cards.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
        >
          <p className="text-sm text-gray-500">{stat.label}</p>
          <p
            className={`mt-1 text-3xl font-semibold text-gray-900 ${loading ? "animate-pulse text-gray-300" : ""}`}
          >
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
