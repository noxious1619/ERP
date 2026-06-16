import { useState } from "react"
import AdminSidebar from "../../../../components/Admin/sidebar"
import AdminNavbar from "../../../../components/Admin/Navbar"
import ConfigureStep from "../../../../components/Admin/Academics/Exams/Date sheet/ConfigureStep"
import ScheduleStep from "../../../../components/Admin/Academics/Exams/Date sheet/ScheduleStep"
import type { ScheduleRow } from "../../../../components/Admin/Academics/Exams/Date sheet/ScheduleStep"
import PreviewStep from "../../../../components/Admin/Academics/Exams/Date sheet/PreviewStep"
import { Calendar, Settings, Eye, CheckCircle2, X } from "lucide-react"

export default function Datesheet() {
  const [activeStep, setActiveStep] = useState<number>(1)
  
  // Datesheet Form State
  const [title, setTitle] = useState("")
  const [academicYear, setAcademicYear] = useState("2024-25")
  const [reportingTime, setReportingTime] = useState("")
  const [instructions, setInstructions] = useState("")
  const [selectedClasses, setSelectedClasses] = useState<string[]>([])
  const [selectedSections, setSelectedSections] = useState<string[]>([])
  
  const [scheduleRows, setScheduleRows] = useState<ScheduleRow[]>([
    {
      id: "1",
      date: "",
      subject: "",
      timeSlot: "09:00 AM - 12:00 PM",
      duration: "3 Hours",
      maxMarks: "100",
      invigilator: ""
    }
  ])

  // Success Modal state
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)

  const handleStepClick = (stepNum: number) => {
    setActiveStep(stepNum)
  }

  const handlePublish = () => {
    setIsSuccessModalOpen(true)
  }

  const handleReset = () => {
    setTitle("")
    setAcademicYear("2024-25")
    setReportingTime("")
    setInstructions("")
    setSelectedClasses([])
    setSelectedSections([])
    setScheduleRows([
      {
        id: "1",
        date: "",
        subject: "",
        timeSlot: "09:00 AM - 12:00 PM",
        duration: "3 Hours",
        maxMarks: "100",
        invigilator: ""
      }
    ])
    setActiveStep(1)
    setIsSuccessModalOpen(false)
  }

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      {/* Sidebar navigation */}
      <AdminSidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Navbar */}
        <AdminNavbar />

        <main className="flex-1 overflow-auto p-6">
          <div className="flex flex-col gap-5 max-w-7xl mx-auto pb-12">
            
            {/* Header Title Section (Outside Card) */}
            <div className="flex flex-col gap-0.5">
              <h1 className="text-xl font-bold text-gray-950 tracking-tight">
                Date Sheet
              </h1>
              <p className="text-[11px] text-gray-500 font-medium">
                Create standardized date sheet
              </p>
            </div>

            {/* Unified Main Card Wrapper */}
            <div className="w-full bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
              
              {/* Card Header Block */}
              <div className="p-5 flex items-center justify-between border-b border-gray-100 bg-white">
                <div className="flex items-center gap-3">
                  {/* Calendar Icon inside a light blue square box */}
                  <div className="w-10 h-10 rounded-lg bg-blue-50/60 flex items-center justify-center border border-blue-100 shrink-0">
                    <Calendar className="h-5 w-5 text-[#4285F4]" />
                  </div>
                  <div className="flex flex-col">
                    <h2 className="text-[15px] font-bold text-gray-950 leading-snug">
                      Exam Datesheet Generator
                    </h2>
                    <p className="text-[11px] text-gray-500 font-medium">
                      Configure, schedule, and publish your exam timetable
                    </p>
                  </div>
                </div>

                {/* Badge showing Datesheet Title on the right */}
                <span className="px-3.5 py-1.5 bg-blue-50 text-[#4285F4] border border-blue-100 rounded-full text-[11px] font-bold tracking-wide uppercase">
                  {title || "Annual"}
                </span>
              </div>

              {/* Stepper Tabs Bar */}
              <div className="border-b border-gray-200 px-5 flex items-center gap-6 text-sm font-semibold text-gray-500 bg-white">
                {/* Tab 1: Configure */}
                <button
                  onClick={() => handleStepClick(1)}
                  className={`flex items-center gap-2 py-3 border-b-2 font-bold text-[12px] cursor-pointer focus:outline-none transition ${
                    activeStep === 1
                      ? "border-[#4285F4] text-[#4285F4]"
                      : "border-transparent text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <Settings className="h-3.5 w-3.5" /> 1. Configure
                </button>

                {/* Tab 2: Schedule */}
                <button
                  onClick={() => handleStepClick(2)}
                  className={`flex items-center gap-2 py-3 border-b-2 font-bold text-[12px] cursor-pointer focus:outline-none transition ${
                    activeStep === 2
                      ? "border-[#4285F4] text-[#4285F4]"
                      : "border-transparent text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <Calendar className="h-3.5 w-3.5" /> 2. Schedule
                </button>

                {/* Tab 3: Preview */}
                <button
                  onClick={() => handleStepClick(3)}
                  className={`flex items-center gap-2 py-3 border-b-2 font-bold text-[12px] cursor-pointer focus:outline-none transition ${
                    activeStep === 3
                      ? "border-[#4285F4] text-[#4285F4]"
                      : "border-transparent text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <Eye className="h-3.5 w-3.5" /> 3. Preview & Publish
                </button>
              </div>

              {/* Step Content Area */}
              <div className="p-6">
                {activeStep === 1 && (
                  <ConfigureStep
                    title={title}
                    setTitle={setTitle}
                    academicYear={academicYear}
                    setAcademicYear={setAcademicYear}
                    reportingTime={reportingTime}
                    setReportingTime={setReportingTime}
                    instructions={instructions}
                    setInstructions={setInstructions}
                    selectedClasses={selectedClasses}
                    setSelectedClasses={setSelectedClasses}
                    selectedSections={selectedSections}
                    setSelectedSections={setSelectedSections}
                    onNext={() => setActiveStep(2)}
                  />
                )}

                {activeStep === 2 && (
                  <ScheduleStep
                    scheduleRows={scheduleRows}
                    setScheduleRows={setScheduleRows}
                    onBack={() => setActiveStep(1)}
                    onNext={() => setActiveStep(3)}
                  />
                )}

                {activeStep === 3 && (
                  <PreviewStep
                    title={title}
                    academicYear={academicYear}
                    reportingTime={reportingTime}
                    instructions={instructions}
                    selectedClasses={selectedClasses}
                    selectedSections={selectedSections}
                    scheduleRows={scheduleRows}
                    onBack={() => setActiveStep(2)}
                    onPublish={handlePublish}
                  />
                )}
              </div>

            </div>

          </div>
        </main>
      </div>

      {/* Success Modal */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-xs" onClick={() => setIsSuccessModalOpen(false)} />
          
          {/* Modal Container */}
          <div className="bg-white rounded-3xl border border-gray-100 max-w-md w-full p-8 shadow-2xl relative z-10 flex flex-col items-center text-center animate-in fade-in-50 zoom-in-95 duration-200">
            {/* Close Button */}
            <button 
              onClick={() => setIsSuccessModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-700 rounded-lg transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Check Circle Icon */}
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-5 border border-green-100">
              <CheckCircle2 className="h-9 w-9 text-green-500" />
            </div>

            {/* Success Details */}
            <h3 className="text-xl font-bold text-gray-950 mb-2">
              Datesheet Published!
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              The datesheet <strong className="text-gray-800">"{title}"</strong> for session <strong className="text-gray-800">{academicYear}</strong> has been successfully generated and published. Students and staff of selected classes will be notified.
            </p>

            {/* Class Details summary box inside modal */}
            <div className="w-full bg-gray-50 rounded-2xl p-4 border border-gray-100 mb-6 text-left text-xs text-gray-600 flex flex-col gap-2 font-medium">
              <div className="flex justify-between border-b border-gray-150 pb-2">
                <span>Classes Notified:</span>
                <span className="text-gray-950 font-bold">{selectedClasses.join(", ")}</span>
              </div>
              <div className="flex justify-between border-b border-gray-150 pb-2">
                <span>Sections:</span>
                <span className="text-gray-950 font-bold">{selectedSections.join(", ")}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Scheduled Exams:</span>
                <span className="text-gray-950 font-bold">{scheduleRows.length} Papers</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2.5 w-full">
              <button
                onClick={handleReset}
                className="w-full py-3 bg-[#4285F4] hover:bg-blue-600 text-white font-semibold text-sm rounded-xl transition shadow-md shadow-blue-500/10 cursor-pointer"
              >
                Create Another Datesheet
              </button>
              <button
                onClick={() => setIsSuccessModalOpen(false)}
                className="w-full py-3 bg-white hover:bg-gray-50 border border-gray-250 text-gray-700 font-semibold text-sm rounded-xl transition cursor-pointer"
              >
                Close Window
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
