"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"

interface FilterSelectProps {
  label: string
  options: string[]
  onChange?: (val: string) => void
}

function FilterSelect({ label, options, onChange }: FilterSelectProps) {
  const [open, setOpen]         = useState(false)
  const [selected, setSelected] = useState("")
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const choose = (opt: string) => {
    setSelected(opt)
    setOpen(false)
    onChange?.(opt)
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 items-center gap-2 rounded-lg border border-gray-200 bg-white pl-3 pr-2.5 text-sm text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span>{selected || label}</span>
        <ChevronDown className={`h-3.5 w-3.5 text-gray-400 transition-transform duration-150 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <ul className="absolute left-0 top-[calc(100%+6px)] z-50 min-w-[10rem] rounded-xl border border-gray-200 bg-white py-1.5 shadow-lg">
          {options.map((opt) => (
            <li key={opt}>
              <button
                type="button"
                onClick={() => choose(opt)}
                className={[
                  "w-full rounded-lg px-3 py-1.5 text-left text-sm transition-colors",
                  selected === opt
                    ? "bg-blue-50 font-medium text-blue-600"
                    : "text-gray-700 hover:bg-gray-50",
                ].join(" ")}
              >
                {opt}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

interface StudentFiltersProps {
  onSectionChange?: (val: string) => void
}

export default function StudentFilters({ onSectionChange }: StudentFiltersProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <FilterSelect label="All Classes"         options={["Class 8", "Class 9", "Class 10", "Class 11"]} />
      <FilterSelect label="All Section"         options={["Section A", "Section B", "Section C"]} onChange={onSectionChange} />
      <FilterSelect label="All Gender"          options={["Male", "Female"]} />
      <FilterSelect label="All Status"          options={["Active", "On Leave", "Inactive"]} />
      <FilterSelect label="All Admission Years" options={["2024", "2023", "2022", "2021"]} />
    </div>
  )
}