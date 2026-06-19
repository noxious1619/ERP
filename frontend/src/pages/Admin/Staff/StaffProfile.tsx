import AdminSidebar from "../../../components/Admin/sidebar"
import AdminNavbar from "../../../components/Admin/Navbar"

export default function StaffProfile() {
  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
      <AdminSidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminNavbar />

        <main className="flex-1 overflow-auto p-6">
          
          {/* Profile Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-sans">Profile</h1>
              <p className="text-sm text-gray-500 mt-1">Dr. Anjali Verma</p>
            </div>
            <button className="rounded-lg bg-[#4285F4] px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-600 transition shadow-sm flex items-center gap-1">
              <span>+</span> Features
            </button>
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
              
              <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">DR. ANJALI VERMA</h2>
              <p className="text-sm text-gray-500 mt-1 mb-8">High School Teacher (Maths)</p>
              
              <div className="w-full space-y-4 text-sm">
                <div className="grid grid-cols-[100px_1fr] gap-4">
                  <span className="text-gray-400 text-xs font-semibold tracking-wider uppercase">UID</span>
                  <span className="font-semibold text-gray-900">2151651654646651656</span>
                </div>
                <div className="grid grid-cols-[100px_1fr] gap-4">
                  <span className="text-gray-400 text-xs font-semibold tracking-wider uppercase">ADMI NO.</span>
                  <span className="font-semibold text-gray-900">15500</span>
                </div>
                <div className="grid grid-cols-[100px_1fr] gap-4">
                  <span className="text-gray-400 text-xs font-semibold tracking-wider uppercase">PHONE</span>
                  <span className="font-semibold text-gray-900">96765 07252</span>
                </div>
                <div className="grid grid-cols-[100px_1fr] gap-4">
                  <span className="text-gray-400 text-xs font-semibold tracking-wider uppercase">GENDER</span>
                  <span className="font-semibold text-gray-900">Female</span>
                </div>
                <div className="grid grid-cols-[100px_1fr] gap-4">
                  <span className="text-gray-400 text-xs font-semibold tracking-wider uppercase">DOB</span>
                  <span className="font-semibold text-gray-900">12-10-2011</span>
                </div>
                <div className="grid grid-cols-[100px_1fr] gap-4">
                  <span className="text-gray-400 text-xs font-semibold tracking-wider uppercase">BLOOD GRP.</span>
                  <span className="font-semibold text-gray-900">B +ve</span>
                </div>
                <div className="grid grid-cols-[100px_1fr] gap-4">
                  <span className="text-gray-400 text-xs font-semibold tracking-wider uppercase">AREA</span>
                  <span className="font-semibold text-gray-900 leading-relaxed">Block no. 405 Abc resi. krishna park main road, KKV chowk, 150ft ringroad</span>
                </div>
                <div className="grid grid-cols-[100px_1fr] gap-4">
                  <span className="text-gray-400 text-xs font-semibold tracking-wider uppercase">CITY</span>
                  <span className="font-semibold text-gray-900">Surat</span>
                </div>
                <div className="grid grid-cols-[100px_1fr] gap-4">
                  <span className="text-gray-400 text-xs font-semibold tracking-wider uppercase">STATE</span>
                  <span className="font-semibold text-gray-900">Gujarat</span>
                </div>
              </div>
            </div>

            {/* Right Column: Professional, Contact & Attendance Info */}
            <div className="col-span-2 flex flex-col gap-6">
              
              {/* Professional Info */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-8 text-center">Professional Information</h3>
                
                <div className="space-y-6 text-sm max-w-xl mx-auto">
                  <div className="grid grid-cols-4 gap-4">
                    <span className="text-gray-400 uppercase text-xs font-semibold tracking-wider col-span-1 mt-0.5">JOINING DATE</span>
                    <span className="col-span-3 font-semibold text-gray-900">15/5/2025</span>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <span className="text-gray-400 uppercase text-xs font-semibold tracking-wider col-span-1 mt-0.5">DESIGNATION</span>
                    <span className="col-span-3 font-semibold text-gray-900">Senior Secondary Teacher</span>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <span className="text-gray-400 uppercase text-xs font-semibold tracking-wider col-span-1 mt-0.5">QUALIFICATION</span>
                    <span className="col-span-3 font-semibold text-gray-900">B.Ed.</span>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <span className="text-gray-400 uppercase text-xs font-semibold tracking-wider col-span-1 mt-0.5">EXPERIENCE</span>
                    <span className="col-span-3 font-semibold text-gray-900">2 years</span>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <span className="text-gray-400 uppercase text-xs font-semibold tracking-wider col-span-1 mt-0.5">SUB ASSIGNED</span>
                    <span className="col-span-3 font-semibold text-gray-900">Math</span>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <span className="text-gray-400 uppercase text-xs font-semibold tracking-wider col-span-1 mt-0.5">CLASSES ASSIGNED</span>
                    <span className="col-span-3 font-semibold text-gray-900">Math – 10(A), 11(A), 12(A)</span>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-8 text-center">Contact</h3>
                <div className="space-y-6 text-sm max-w-xl mx-auto">
                  <div className="grid grid-cols-4 gap-4">
                    <span className="text-gray-400 uppercase text-xs font-semibold tracking-wider col-span-1 mt-0.5">EMAIL</span>
                    <span className="col-span-3 font-semibold text-gray-900">anjaliverma013@gmail.com</span>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <span className="text-gray-400 uppercase text-xs font-semibold tracking-wider col-span-1 mt-0.5">PHONE NO.</span>
                    <span className="col-span-3 font-semibold text-gray-900">96765 07252</span>
                  </div>
                </div>
              </div>

              {/* Attendance Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col relative overflow-hidden h-[220px]">
                <div className="flex justify-between items-start z-10">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Attendance</h3>
                    <div className="mt-4 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 bg-blue-500 rounded-full inline-block"></span>
                        <span className="text-xs text-gray-600 font-medium">Present</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 bg-red-600 rounded-full inline-block"></span>
                        <span className="text-xs text-gray-600 font-medium">Absent</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 bg-gray-400 rounded-full inline-block"></span>
                        <span className="text-xs text-gray-600 font-medium">Holiday</span>
                      </div>
                    </div>
                  </div>

                  {/* Pills Container */}
                  <div className="flex items-end gap-3 mr-4">
                    {/* Present Pill */}
                    <div className="flex flex-col items-center">
                      <div className="w-9 bg-[#4285F4] rounded-full flex items-end justify-center pb-3 text-white text-xs font-bold shadow-sm" style={{ height: '100px' }}>
                        75%
                      </div>
                    </div>
                    {/* Absent Pill */}
                    <div className="flex flex-col items-center">
                      <div className="w-9 bg-red-600 rounded-full flex items-end justify-center pb-3 text-white text-xs font-bold shadow-sm" style={{ height: '56px' }}>
                        15%
                      </div>
                    </div>
                    {/* Holiday Pill */}
                    <div className="flex flex-col items-center">
                      <div className="w-9 bg-gray-400 rounded-full flex items-end justify-center pb-3 text-white text-xs font-bold shadow-sm" style={{ height: '36px' }}>
                        10%
                      </div>
                    </div>
                  </div>
                </div>

                {/* SVG Line Chart at the bottom of the card */}
                <div className="absolute inset-x-0 bottom-0 h-20 w-full pointer-events-none">
                  <svg className="w-full h-full" viewBox="0 0 500 80" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="attendance-chart-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4285F4" stopOpacity="0.25"/>
                        <stop offset="100%" stopColor="#4285F4" stopOpacity="0"/>
                      </linearGradient>
                    </defs>
                    {/* Wavy line */}
                    <path 
                      d="M 0 70 Q 120 70 200 45 T 400 30 T 500 45" 
                      fill="none" 
                      stroke="#4285F4" 
                      strokeWidth="2.5"
                    />
                    {/* Gradient area */}
                    <path 
                      d="M 0 70 Q 120 70 200 45 T 400 30 T 500 45 L 500 80 L 0 80 Z" 
                      fill="url(#attendance-chart-grad)"
                    />
                  </svg>
                  {/* Axis labels */}
                  <span className="absolute bottom-2 left-4 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Jan</span>
                  <span className="absolute bottom-2 left-[64%] text-[10px] font-semibold text-gray-400 uppercase tracking-wider">May</span>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
