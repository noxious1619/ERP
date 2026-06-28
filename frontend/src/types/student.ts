export interface AcademicClass {
  id: string
  name: string
  displayName?: string
}

export interface Section {
  id: string
  name: string
  academicClass: AcademicClass
}

export interface StudentUser {
  email: string
}

export interface Student {
  id: string
  admissionNumber: string
  rollNumber?: string

  firstName: string
  lastName: string

  gender: string

  phoneNumber?: string
  profileImage?: string

  isActive: boolean
  createdAt: string

  section?: {
    id: string
    name: string

    academicClass?: {
      id: string
      name: string
    }
  }
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface GetStudentsResponse {
  success: boolean
  data: Student[]
  pagination: Pagination
  stats?: {
    total: number
    active: number
    inactive: number
    newThisMonth: number
  }
}