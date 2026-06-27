// import AdminSidebar from "../../../components/Admin/sidebar"
// import AdminNavbar from "../../../components/Admin/Navbar"

// export default function StaffProfile() {
//   return (
//     <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
//       <AdminSidebar />

//       <div className="flex flex-1 flex-col overflow-hidden">
//         <AdminNavbar />

//         <main className="flex-1 overflow-auto p-6">

//           {/* Profile Header */}
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900 font-sans">Profile</h1>
//               <p className="text-sm text-gray-500 mt-1">Dr. Anjali Verma</p>
//             </div>
//           </div>

//           {/* Main Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

//             {/* Left Column: Personal Info */}
//             <div className="col-span-1 bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col items-center">
//               <div className="w-36 h-36 bg-gray-100 rounded-full flex items-center justify-center mb-6 overflow-hidden border border-gray-200 shadow-inner relative group">
//                 <svg className="w-20 h-20 text-gray-300 transition-colors group-hover:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
//                   <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
//                 </svg>
//               </div>

//               <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">DR. ANJALI VERMA</h2>
//               <p className="text-sm text-gray-500 mt-1 mb-8">High School Teacher (Maths)</p>

//               <div className="w-full space-y-4 text-sm">
//                 <div className="grid grid-cols-[100px_1fr] gap-4">
//                   <span className="text-gray-400 text-xs font-semibold tracking-wider uppercase">UID</span>
//                   <span className="font-semibold text-gray-900">2151651654646651656</span>
//                 </div>
//                 <div className="grid grid-cols-[100px_1fr] gap-4">
//                   <span className="text-gray-400 text-xs font-semibold tracking-wider uppercase">ADMI NO.</span>
//                   <span className="font-semibold text-gray-900">15500</span>
//                 </div>
//                 <div className="grid grid-cols-[100px_1fr] gap-4">
//                   <span className="text-gray-400 text-xs font-semibold tracking-wider uppercase">PHONE</span>
//                   <span className="font-semibold text-gray-900">96765 07252</span>
//                 </div>
//                 <div className="grid grid-cols-[100px_1fr] gap-4">
//                   <span className="text-gray-400 text-xs font-semibold tracking-wider uppercase">GENDER</span>
//                   <span className="font-semibold text-gray-900">Female</span>
//                 </div>
//                 <div className="grid grid-cols-[100px_1fr] gap-4">
//                   <span className="text-gray-400 text-xs font-semibold tracking-wider uppercase">DOB</span>
//                   <span className="font-semibold text-gray-900">12-10-2011</span>
//                 </div>
//                 <div className="grid grid-cols-[100px_1fr] gap-4">
//                   <span className="text-gray-400 text-xs font-semibold tracking-wider uppercase">BLOOD GRP.</span>
//                   <span className="font-semibold text-gray-900">B +ve</span>
//                 </div>
//                 <div className="grid grid-cols-[100px_1fr] gap-4">
//                   <span className="text-gray-400 text-xs font-semibold tracking-wider uppercase">AREA</span>
//                   <span className="font-semibold text-gray-900 leading-relaxed">Block no. 405 Abc resi. krishna park main road, KKV chowk, 150ft ringroad</span>
//                 </div>
//                 <div className="grid grid-cols-[100px_1fr] gap-4">
//                   <span className="text-gray-400 text-xs font-semibold tracking-wider uppercase">CITY</span>
//                   <span className="font-semibold text-gray-900">Surat</span>
//                 </div>
//                 <div className="grid grid-cols-[100px_1fr] gap-4">
//                   <span className="text-gray-400 text-xs font-semibold tracking-wider uppercase">STATE</span>
//                   <span className="font-semibold text-gray-900">Gujarat</span>
//                 </div>
//               </div>
//             </div>

//             {/* Right Column: Professional, Contact & Attendance Info */}
//             <div className="col-span-2 flex flex-col gap-6">

//               {/* Professional Info */}
//               <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
//                 <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-8 text-center">Professional Information</h3>

//                 <div className="space-y-6 text-sm max-w-xl mx-auto">
//                   <div className="grid grid-cols-4 gap-4">
//                     <span className="text-gray-400 uppercase text-xs font-semibold tracking-wider col-span-1 mt-0.5">JOINING DATE</span>
//                     <span className="col-span-3 font-semibold text-gray-900">15/5/2025</span>
//                   </div>
//                   <div className="grid grid-cols-4 gap-4">
//                     <span className="text-gray-400 uppercase text-xs font-semibold tracking-wider col-span-1 mt-0.5">DESIGNATION</span>
//                     <span className="col-span-3 font-semibold text-gray-900">Senior Secondary Teacher</span>
//                   </div>
//                   <div className="grid grid-cols-4 gap-4">
//                     <span className="text-gray-400 uppercase text-xs font-semibold tracking-wider col-span-1 mt-0.5">QUALIFICATION</span>
//                     <span className="col-span-3 font-semibold text-gray-900">B.Ed.</span>
//                   </div>
//                   <div className="grid grid-cols-4 gap-4">
//                     <span className="text-gray-400 uppercase text-xs font-semibold tracking-wider col-span-1 mt-0.5">EXPERIENCE</span>
//                     <span className="col-span-3 font-semibold text-gray-900">2 years</span>
//                   </div>
//                   <div className="grid grid-cols-4 gap-4">
//                     <span className="text-gray-400 uppercase text-xs font-semibold tracking-wider col-span-1 mt-0.5">SUB ASSIGNED</span>
//                     <span className="col-span-3 font-semibold text-gray-900">Math</span>
//                   </div>
//                   <div className="grid grid-cols-4 gap-4">
//                     <span className="text-gray-400 uppercase text-xs font-semibold tracking-wider col-span-1 mt-0.5">CLASSES ASSIGNED</span>
//                     <span className="col-span-3 font-semibold text-gray-900">Math – 10(A), 11(A), 12(A)</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Contact Info */}
//               <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
//                 <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-8 text-center">Contact</h3>
//                 <div className="space-y-6 text-sm max-w-xl mx-auto">
//                   <div className="grid grid-cols-4 gap-4">
//                     <span className="text-gray-400 uppercase text-xs font-semibold tracking-wider col-span-1 mt-0.5">EMAIL</span>
//                     <span className="col-span-3 font-semibold text-gray-900">anjaliverma013@gmail.com</span>
//                   </div>
//                   <div className="grid grid-cols-4 gap-4">
//                     <span className="text-gray-400 uppercase text-xs font-semibold tracking-wider col-span-1 mt-0.5">PHONE NO.</span>
//                     <span className="col-span-3 font-semibold text-gray-900">96765 07252</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   )
// }

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import AdminSidebar from "../../../components/Admin/sidebar"
import AdminNavbar from "../../../components/Admin/Navbar"

interface StaffDetail {
  id:          string
  employeeId:  string
  firstName:   string
  lastName:    string
  gender:      string | null
  dateOfBirth: string | null
  phone:       string | null
  email:       string | null
  address:     string | null
  city:        string | null
  state:       string | null
  bloodGroup:  string | null
  department:  string | null
  designation: string
  joiningDate: string
  status:      string
  bio:         string | null
}

export default function StaffProfilePage() {
  const { id }       = useParams<{ id: string }>()
  const navigate     = useNavigate()
  const [staff, setStaff]     = useState<StaffDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res  = await fetch(`http://localhost:5000/api/staff/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        const json = await res.json()
        if (!json.success) throw new Error(json.message)
        setStaff(json.data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchStaff()
  }, [id])

  const formatDate = (date: string | null) => {
    if (!date) return "—"
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit", month: "2-digit", year: "numeric"
    })
  }

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
      <AdminSidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminNavbar />

        <main className="flex-1 overflow-auto p-6">

          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="h-8 w-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
            </div>
          ) : error || !staff ? (
            <div className="rounded-xl bg-red-50 border border-red-200 p-6 text-center text-sm text-red-600">
              {error ?? "Staff member not found"}
            </div>
          ) : (
            <>
              {/* Profile Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate(-1)}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-sans">Profile</h1>
                    <p className="text-sm text-gray-500 mt-1">
                      {staff.firstName} {staff.lastName}
                    </p>
                  </div>
                </div>
              </div>

              {/* Main Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Left Column: Personal Info */}
                <div className="col-span-1 bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col items-center">
                  <div className="w-36 h-36 bg-gray-100 rounded-full flex items-center justify-center mb-6 overflow-hidden border border-gray-200 shadow-inner relative group">
                    <svg className="w-20 h-20 text-gray-300 transition-colors group-hover:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide text-center">
                    {`${staff.firstName} ${staff.lastName}`.toUpperCase()}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1 mb-8">{staff.designation}</p>

                  <div className="w-full space-y-4 text-sm">
                    {[
                      { label: "EMP NO.",    value: staff.employeeId },
                      { label: "PHONE",      value: staff.phone      },
                      { label: "GENDER",     value: staff.gender     },
                      { label: "DOB",        value: formatDate(staff.dateOfBirth) },
                      { label: "BLOOD GRP.", value: staff.bloodGroup },
                      { label: "AREA",       value: staff.address    },
                      { label: "CITY",       value: staff.city       },
                      { label: "STATE",      value: staff.state      },
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
                        { label: "JOINING DATE", value: formatDate(staff.joiningDate) },
                        { label: "DESIGNATION",  value: staff.designation             },
                        { label: "DEPARTMENT",   value: staff.department              },
                        { label: "STATUS",       value: staff.status === "ACTIVE" ? "Active" : staff.status === "ON_LEAVE" ? "On Leave" : staff.status },
                        { label: "BIO",          value: staff.bio                     },
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
                        { label: "EMAIL",     value: staff.email },
                        { label: "PHONE NO.", value: staff.phone },
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
            </>
          )}
        </main>
      </div>
    </div>
  )
}