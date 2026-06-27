import AdminSidebar from "../../components/Admin/sidebar";
import AdminNavbar from "../../components/Admin/Navbar";
import useAuth from "../../hooks/useAuth";

export default function AdminProfilePage() {
  const { adminData } = useAuth();

  const formatDate = (date: string | null | undefined) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const fullName =
    adminData?.firstName && adminData?.lastName
      ? `${adminData.firstName} ${adminData.lastName}`.toUpperCase()
      : (adminData?.name?.toUpperCase() ?? "—");

  const designation = adminData?.designation ?? adminData?.role ?? "Admin";

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
      <AdminSidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminNavbar />

        <main className="flex-1 overflow-auto p-6">
          {/* Profile Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-sans">
                Profile
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {adminData?.firstName
                  ? `${adminData.firstName} ${adminData.lastName}`
                  : (adminData?.name ?? "Admin")}
              </p>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column: Personal Info */}
            <div className="col-span-1 bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col items-center">
              <div className="w-36 h-36 bg-gray-100 rounded-full flex items-center justify-center mb-6 overflow-hidden border border-gray-200 shadow-inner relative group">
                <svg
                  className="w-20 h-20 text-gray-300 transition-colors group-hover:text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>

              <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide text-center">
                {fullName}
              </h2>
              <p className="text-sm text-gray-500 mt-1 mb-8">{designation}</p>

              <div className="w-full space-y-4 text-sm">
                {[
                  { label: "EMP NO.", value: adminData?.employeeId },
                  { label: "PHONE", value: adminData?.phone },
                  { label: "GENDER", value: adminData?.gender },
                  { label: "DOB", value: formatDate(adminData?.dateOfBirth) },
                  { label: "BLOOD GRP.", value: adminData?.bloodGroup },
                  { label: "AREA", value: adminData?.address },
                  { label: "CITY", value: adminData?.city },
                  { label: "STATE", value: adminData?.state },
                ].map(({ label, value }) => (
                  <div key={label} className="grid grid-cols-[100px_1fr] gap-4">
                    <span className="text-gray-400 text-xs font-semibold tracking-wider uppercase">
                      {label}
                    </span>
                    <span className="font-semibold text-gray-900 leading-relaxed">
                      {value ?? "—"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column */}
            <div className="col-span-2 flex flex-col gap-6">
              {/* Professional Info */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-8 text-center">
                  Professional Information
                </h3>
                <div className="space-y-6 text-sm max-w-xl mx-auto">
                  {[
                    {
                      label: "JOINING DATE",
                      value: formatDate(adminData?.joiningDate),
                    },
                    { label: "DESIGNATION", value: adminData?.designation },
                    { label: "DEPARTMENT", value: adminData?.department },
                    {
                      label: "STATUS",
                      value:
                        adminData?.status === "ACTIVE"
                          ? "Active"
                          : adminData?.status === "ON_LEAVE"
                            ? "On Leave"
                            : adminData?.status,
                    },
                    { label: "BIO", value: adminData?.bio },
                  ].map(({ label, value }) => (
                    <div key={label} className="grid grid-cols-4 gap-4">
                      <span className="text-gray-400 uppercase text-xs font-semibold tracking-wider col-span-1 mt-0.5">
                        {label}
                      </span>
                      <span className="col-span-3 font-semibold text-gray-900">
                        {value ?? "—"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-8 text-center">
                  Contact
                </h3>
                <div className="space-y-6 text-sm max-w-xl mx-auto">
                  {[
                    { label: "EMAIL", value: adminData?.email },
                    { label: "PHONE NO.", value: adminData?.phone },
                  ].map(({ label, value }) => (
                    <div key={label} className="grid grid-cols-4 gap-4">
                      <span className="text-gray-400 uppercase text-xs font-semibold tracking-wider col-span-1 mt-0.5">
                        {label}
                      </span>
                      <span className="col-span-3 font-semibold text-gray-900">
                        {value ?? "—"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
