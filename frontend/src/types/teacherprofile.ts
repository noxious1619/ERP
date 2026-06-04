export interface TeacherSubject {
  id: string;
  name: string;
  code: string;
  class: { id: string; name: string };
}

export interface TeacherSection {
  id: string;
  name: string;
  academicClass: { id: string; name: string };
}

export interface TeacherClassTeacherOf {
  id: string;
  name: string;
  academicClass: { name: string };
}

export interface TeacherProfileData {
  id: string;
  firstName: string;
  lastName: string;
  employeeId: string;
  designation: string;
  gender: string | null;
  dateOfBirth: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  bloodGroup: string | null;
  qualification: string | null;
  specialization: string | null;
  experience: number | null;
  bio: string | null;
  joiningDate: string;
  status: string;
  email: string | null;
  user: { id: string; email: string };
  subjects: TeacherSubject[];           // the one subject they own
  sections: TeacherSection[];           // sections they teach in
  classTeacherOf: TeacherClassTeacherOf | null;
}