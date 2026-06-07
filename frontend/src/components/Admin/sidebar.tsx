"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  GraduationCap,
  UserPlus,
  DollarSign,
  Bell,
  Settings,
  HelpCircle,
  ChevronDown,
} from "lucide-react";

const NAV = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin/dashboard",
    children: [],
  },
  {
    label: "Academics",
    icon: GraduationCap,
    href: "#",
    defaultOpen: true,
    children: [
      { label: "Students", href: "/admin/academics/students" },
      { label: "Staff", href: "/admin/academics/staff" },
      { label: "Classes & Sections", href: "/admin/academics/classes" },
      { label: "Subjects", href: "/admin/academics/subjects" },
      { label: "Timetable", href: "/admin/academics/timetable" },
      { label: "Attendance", href: "/admin/academics/attendance" },
      { label: "Exams", href: "/admin/academics/exams" },
      { label: "Results", href: "/admin/academics/results" },
    ],
  },
  {
    label: "Admission",
    icon: UserPlus,
    href: "#",
    children: [],
  },
  {
    label: "Finance",
    icon: DollarSign,
    href: "#",
    children: [
      { label: "Fee Setup", href: "/admin/finance/fee-setup" },
      { label: "Collections", href: "/admin/finance/collections" },
      { label: "Transactions", href: "/admin/finance/transactions" },
    ],
  },
  {
    label: "Communication",
    icon: Bell,
    href: "#",
    children: [
      { label: "Notices", href: "/admin/communication/notices" },
      { label: "Announcements", href: "/admin/communication/announcements" },
    ],
  },
];

const FOOTER_NAV = [
  { label: "Settings", icon: Settings, href: "/admin/settings" },
  { label: "Support", icon: HelpCircle, href: "/admin/support" },
];

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(true);

  const [activeParent, setActiveParent] = useState("Academics");
  const [activeChild, setActiveChild] = useState("Students");

  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    () =>
      Object.fromEntries(
        NAV.filter((item) => item.defaultOpen).map((item) => [
          item.label,
          true,
        ]),
      ),
  );

  const toggleSection = (label: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <aside
      onMouseEnter={() => setCollapsed(false)}
      onMouseLeave={() => setCollapsed(true)}
      className={[
        "group flex h-screen flex-col border-r border-gray-200 bg-white transition-all duration-200 ease-linear",
        collapsed ? "w-[3.5rem]" : "w-[16rem]",
      ].join(" ")}
    >
      <div className="flex h-16 items-center gap-2.5 border-b border-gray-100 px-3">
        <svg
          width="43"
          height="40"
          viewBox="0 0 43 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="1.5"
            width="40"
            height="40"
            rx="20"
            fill="url(#paint0_linear_639_721)"
          />
          <path
            d="M21.5 29L14.5 25.2V19.2L10.5 17L21.5 11L32.5 17V25H30.5V18.1L28.5 19.2V25.2L21.5 29ZM21.5 20.7L28.35 17L21.5 13.3L14.65 17L21.5 20.7ZM21.5 26.725L26.5 24.025V20.25L21.5 23L16.5 20.25V24.025L21.5 26.725Z"
            fill="#F8F9FE"
          />
          <defs>
            <linearGradient
              id="paint0_linear_639_721"
              x1="1.5"
              y1="0"
              x2="41.5"
              y2="40"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0.408654" stopColor="#4285F4" />
              <stop offset="1" stopColor="white" />
            </linearGradient>
          </defs>
        </svg>

        {!collapsed && (
          <div className="overflow-hidden">
            <p className="truncate text-lg font-bold text-[#4285F4]">EdaOS</p>
            <p className="truncate text-[11px] text-gray-500">Admin Portal</p>
          </div>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto overflow-x-hidden px-2 py-3">
        {NAV.map((item) => {
          const Icon = item.icon;
          const hasChildren = item.children.length > 0;
          const isOpen = openSections[item.label] ?? false;

          return (
            <div key={item.label}>
              <button
                onClick={() => {
                  setActiveParent(item.label);

                  if (hasChildren) {
                    toggleSection(item.label);
                  }
                }}
                title={collapsed ? item.label : undefined}
                className={[
                  "flex w-full items-center gap-2.5 rounded-3xl px-2.5 py-2 text-sm font-medium transition-colors",
                  activeParent === item.label
                    ? "bg-[#4285F4] text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                ].join(" ")}
              >
                <Icon className="h-4 w-4 shrink-0" />

                {!collapsed && (
                  <>
                    <span className="flex-1 truncate text-left">
                      {item.label}
                    </span>

                    {hasChildren && (
                      <ChevronDown
                        className={[
                          "h-4 w-4 shrink-0 transition-transform duration-200",
                          isOpen ? "rotate-180" : "",
                        ].join(" ")}
                      />
                    )}
                  </>
                )}
              </button>

              {hasChildren && !collapsed && isOpen && (
                <ul className="ml-[1.65rem] mt-0.5 border-l border-[#4285F4]/40 py-0.5">
                  {item.children.map((child) => (
                    <li key={child.label}>
                      <a
                        href={child.href}
                        onClick={() => {
                          setActiveParent(item.label);
                          setActiveChild(child.label);
                        }}
                        className={[
                          "block py-1.5 pl-3 text-sm transition-colors",
                          activeChild === child.label
                            ? "font-medium text-[#4285F4]"
                            : "text-gray-500 hover:text-[#4285F4]",
                        ].join(" ")}
                      >
                        {child.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </nav>

      <div className="border-t border-gray-100 px-2 py-3">
        {FOOTER_NAV.map((item) => {
          const Icon = item.icon;

          return (
            <a
              key={item.label}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </a>
          );
        })}
      </div>
    </aside>
  );
}