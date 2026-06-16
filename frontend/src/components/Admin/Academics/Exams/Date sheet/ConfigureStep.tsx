import { useState } from "react"
import type { Dispatch, SetStateAction } from "react"
import { ChevronDown, Check, X, GraduationCap, ClipboardList, AlignLeft } from "lucide-react"

interface ConfigureStepProps {
  title: string
  setTitle: (val: string) => void
  academicYear: string
  setAcademicYear: (val: string) => void
  reportingTime: string
  setReportingTime: (val: string) => void
  instructions: string
  setInstructions: (val: string) => void
  selectedClasses: string[]
  setSelectedClasses: Dispatch<SetStateAction<string[]>>
  selectedSections: string[]
  setSelectedSections: Dispatch<SetStateAction<string[]>>
  onNext: () => void
}

const AVAILABLE_CLASSES = ["Class 7", "Class 8", "Class 9", "Class 10"]
const AVAILABLE_SECTIONS = ["Section A", "Section B", "Section C", "Section D"]

export default function ConfigureStep({
  title,
  setTitle,
  academicYear,
  setAcademicYear,
  reportingTime,
  setReportingTime,
  instructions,
  setInstructions,
  selectedClasses,
  setSelectedClasses,
  selectedSections,
  setSelectedSections,
  onNext
}: ConfigureStepProps) {
  const [showClassDropdown, setShowClassDropdown] = useState(false)
  const [showSectionDropdown, setShowSectionDropdown] = useState(false)

  const toggleClassSelection = (cls: string) => {
    setSelectedClasses(prev => 
      prev.includes(cls) ? prev.filter(c => c !== cls) : [...prev, cls]
    )
  }

  const toggleSectionSelection = (sec: string) => {
    setSelectedSections(prev => 
      prev.includes(sec) ? prev.filter(s => s !== sec) : [...prev, sec]
    )
  }

  const handleNextClick = () => {
    onNext()
  }

  return (
    <div className="flex flex-col gap-6">
      
      {/* 1. Datesheet Information Card */}
      <div className="border border-gray-200 rounded-xl p-5 bg-white">
        <div className="flex items-center gap-2 mb-6">
          <ClipboardList className="h-5 w-5 text-[#4285F4]" />
          <h3 className="font-bold text-gray-800 text-[14px]">Datesheet Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Datesheet Title */}
          <div className="relative mt-1">
            <label className="absolute -top-2 left-3.5 bg-white px-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider z-10">
              Datesheet Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Annual"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-[#4285F4] focus:border-[#4285F4] font-medium text-gray-800 bg-white transition"
            />
          </div>

          {/* Academic Year */}
          <div className="relative mt-1">
            <label className="absolute -top-2 left-3.5 bg-white px-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider z-10">
              Academic Year <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-[#4285F4] focus:border-[#4285F4] font-medium text-gray-800 transition bg-white cursor-pointer appearance-none"
              >
                <option value="2024-25">2024-25</option>
                <option value="2025-26">2025-26</option>
                <option value="2026-27">2026-27</option>
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Reporting Time */}
          <div className="relative mt-1">
            <label className="absolute -top-2 left-3.5 bg-white px-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider z-10">
              Reporting Time
            </label>
            <input
              type="text"
              value={reportingTime}
              onChange={(e) => setReportingTime(e.target.value)}
              placeholder="e.g. 30 minutes before exam"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-[#4285F4] focus:border-[#4285F4] font-medium text-gray-800 bg-white transition"
            />
          </div>
        </div>
      </div>

      {/* 2. Middle Row: Classes/Sections and Instructions side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Applicable Classes & Sections Card */}
        <div className="border border-gray-200 rounded-xl p-5 bg-white flex flex-col justify-between min-h-[200px]">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="h-5 w-5 text-[#4285F4]" />
            <h3 className="font-bold text-gray-800 text-[14px]">Applicable Classes & Sections</h3>
          </div>

          <div className="flex flex-col gap-5 flex-1 justify-center">
            {/* Classes Dropdown */}
            <div className="relative">
              <label className="absolute -top-2 left-3.5 bg-white px-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider z-10">
                Classes <span className="text-red-500">*</span>
              </label>
              
              <div 
                onClick={() => setShowClassDropdown(!showClassDropdown)}
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 min-h-[46px] text-sm focus:outline-none flex flex-wrap gap-1.5 items-center justify-between cursor-pointer hover:border-gray-300 transition bg-white"
              >
                {selectedClasses.length === 0 ? (
                  <span className="text-gray-400 font-medium">Select classes</span>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedClasses.map(cls => (
                      <span 
                        key={cls}
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleClassSelection(cls)
                        }}
                        className="inline-flex items-center gap-1 bg-blue-50 text-[#4285F4] border border-blue-100 px-2 py-0.5 rounded-lg text-xs font-semibold hover:bg-blue-100 transition"
                      >
                        {cls} <X className="h-3 w-3" />
                      </span>
                    ))}
                  </div>
                )}
                <ChevronDown className="h-4 w-4 text-gray-400 shrink-0 mr-0.5" />
              </div>

              {/* Class Dropdown Overlay */}
              {showClassDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowClassDropdown(false)} />
                  <div className="absolute top-[102%] left-0 w-full bg-white border border-gray-150 shadow-lg rounded-lg py-1.5 z-20 max-h-48 overflow-y-auto">
                    {AVAILABLE_CLASSES.map(cls => {
                      const isSelected = selectedClasses.includes(cls)
                      return (
                        <div
                          key={cls}
                          onClick={() => toggleClassSelection(cls)}
                          className={`flex items-center justify-between px-4 py-2 text-sm font-medium cursor-pointer transition ${
                            isSelected 
                              ? "bg-blue-50/75 text-[#4285F4]" 
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <span>{cls}</span>
                          {isSelected && <Check className="h-4 w-4" />}
                        </div>
                      )
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Sections Dropdown */}
            <div className="relative">
              <label className="absolute -top-2 left-3.5 bg-white px-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider z-10">
                Sections <span className="text-red-500">*</span>
              </label>

              <div 
                onClick={() => setShowSectionDropdown(!showSectionDropdown)}
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 min-h-[46px] text-sm focus:outline-none flex flex-wrap gap-1.5 items-center justify-between cursor-pointer hover:border-gray-300 transition bg-white"
              >
                {selectedSections.length === 0 ? (
                  <span className="text-gray-400 font-medium">Select sections</span>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedSections.map(sec => (
                      <span 
                        key={sec}
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleSectionSelection(sec)
                        }}
                        className="inline-flex items-center gap-1 bg-blue-50 text-[#4285F4] border border-blue-100 px-2 py-0.5 rounded-lg text-xs font-semibold hover:bg-blue-100 transition"
                      >
                        {sec} <X className="h-3 w-3" />
                      </span>
                    ))}
                  </div>
                )}
                <ChevronDown className="h-4 w-4 text-gray-400 shrink-0 mr-0.5" />
              </div>

              {/* Section Dropdown Overlay */}
              {showSectionDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowSectionDropdown(false)} />
                  <div className="absolute top-[102%] left-0 w-full bg-white border border-gray-150 shadow-lg rounded-lg py-1.5 z-20 max-h-48 overflow-y-auto">
                    {AVAILABLE_SECTIONS.map(sec => {
                      const isSelected = selectedSections.includes(sec)
                      return (
                        <div
                          key={sec}
                          onClick={() => toggleSectionSelection(sec)}
                          className={`flex items-center justify-between px-4 py-2 text-sm font-medium cursor-pointer transition ${
                            isSelected 
                              ? "bg-blue-50/75 text-[#4285F4]" 
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <span>{sec}</span>
                          {isSelected && <Check className="h-4 w-4" />}
                        </div>
                      )
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Instructions Card */}
        <div className="border border-gray-200 rounded-xl p-5 bg-white flex flex-col min-h-[200px]">
          <div className="flex items-center gap-2 mb-4">
            <AlignLeft className="h-5 w-5 text-[#4285F4]" />
            <h3 className="font-bold text-gray-800 text-[14px]">Instructions</h3>
          </div>

          <div className="relative flex-1 flex flex-col justify-center">
            <label className="absolute -top-2 left-3.5 bg-white px-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider z-10">
              Instructions List
            </label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Candidates must bring admit cards. Calculators not allowed."
              rows={4}
              className="w-full border border-gray-200 rounded-lg px-4 py-3.5 text-sm placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-[#4285F4] focus:border-[#4285F4] font-medium text-gray-800 transition resize-none flex-1"
            />
          </div>
        </div>

      </div>

      {/* 3. Bottom Footer Navigation */}
      <div className="flex justify-start pt-4 border-t border-gray-100">
        <button
          onClick={handleNextClick}
          className="px-6 py-3 bg-[#4285F4] hover:bg-blue-600 text-white font-semibold text-xs rounded-lg transition shadow-md shadow-blue-500/10 cursor-pointer uppercase tracking-wider"
        >
          NEXT: SCHEDULE EXAMS →
        </button>
      </div>
    </div>
  )
}
