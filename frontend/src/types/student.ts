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
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: string
  address: string | null
  city: string | null
  state: string | null
  bloodGroup: string | null
  profileImage: string | null
  phoneNumber: string | null
  rollNumber: string | null
  sectionId: string
  userId: string
  section: Section
  user: StudentUser
}

export interface GetStudentsResponse {
  success: boolean
  data: Student[]
}