export interface TeachingAssignment {
  id: string;
  subject: {
    id: string;
    name: string;
    code: string;
  };
  section: {
    id: string;
    name: string;
    academicClass: { id: string; name: string };
  };
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
  teachingAssignments: TeachingAssignment[];  // replaces subjects + sections
  classTeacherOf: TeacherClassTeacherOf | null;
}