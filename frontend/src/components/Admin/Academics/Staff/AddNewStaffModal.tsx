"use client"

import { X, Upload, Link as LinkIcon } from "lucide-react"

interface AddNewStaffModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AddNewStaffModal({ isOpen, onClose }: AddNewStaffModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-xl my-6 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900">Add New Staff</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <form className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Employee ID</label>
              <input
                type="text"
                placeholder="Enter ID"
                className="w-full rounded-lg border border-gray-200 bg-white p-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Employee Name</label>
              <input
                type="text"
                placeholder="Enter Name"
                className="w-full rounded-lg border border-gray-200 bg-white p-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Role</label>
              <select className="w-full rounded-lg border border-gray-200 bg-white p-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                <option value="">Select Role</option>
                <option value="Teacher">Teacher</option>
                <option value="Principal">Principal</option>
                <option value="Accountant">Accountant</option>
                <option value="Front Desk">Front Desk</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Subject Assigned (if applicable)</label>
              <input
                type="text"
                placeholder="Enter Subject"
                className="w-full rounded-lg border border-gray-200 bg-white p-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Class Assigned (if applicable)</label>
              <input
                type="text"
                placeholder="Enter Class"
                className="w-full rounded-lg border border-gray-200 bg-white p-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Contact</label>
              <input
                type="text"
                placeholder="Enter Contact"
                className="w-full rounded-lg border border-gray-200 bg-white p-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Status</label>
              <select className="w-full rounded-lg border border-gray-200 bg-white p-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                <option value="">Select Status</option>
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Add Photo</label>
              <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 py-8 transition-colors hover:bg-gray-50">
                <Upload className="mb-2 h-8 w-8 text-gray-400" />
                <p className="text-sm text-gray-500 mb-1">PDFs, Images, or Links</p>
                <p className="text-sm text-gray-600">
                  <span className="text-blue-600 font-medium cursor-pointer hover:underline">Click to upload</span> or drag and drop
                </p>
              </div>
              <button 
                type="button" 
                className="mt-3 flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                <LinkIcon className="h-4 w-4" />
                Add Link
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 p-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-200 bg-white py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
          >
            Cancel
          </button>
          <button className="flex-1 rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700">
            Add New Staff
          </button>
        </div>
      </div>
    </div>
  )
}