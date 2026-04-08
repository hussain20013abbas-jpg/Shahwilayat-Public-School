export interface Student {
  id: number;
  name: string;
  roll_no: string;
  grade: string;
  class: string;
  section: string;
  parent_contact: string;
  parent_email?: string;
  emergency_contact?: string;
  academic_notes?: string;
  medical_notes?: string;
  photo_url?: string;
  cnic: string;
  computer_number?: string;
  password?: string;
  balance: number;
  attendance_percentage: number;
  transactions?: Transaction[];
  attendance?: AttendanceRecord[];
  grades?: AcademicRecord[];
}

export interface User {
  id: number;
  name: string;
  role: 'admin' | 'student' | 'canteen' | 'guest';
  student_id?: number;
  computer_number?: string;
}

export interface Transaction {
  id: number;
  student_id: number;
  amount: number;
  type: 'credit' | 'debit';
  fee_type: 'tuition' | 'bus' | 'activity' | 'canteen' | 'other';
  description: string;
  date: string;
  student_name?: string;
  roll_no?: string;
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  category: 'General' | 'Events' | 'Academics';
  date: string;
  image_url?: string;
  is_featured?: boolean;
}

export interface AttendanceRecord {
  id: number;
  student_id: number;
  date: string;
  status: 'Present' | 'Absent' | 'Late';
}

export interface AcademicRecord {
  id: number;
  student_id: number;
  subject: string;
  marks: number;
  total_marks: number;
  term: string;
}

export interface Syllabus {
  id: number;
  subject: string;
  grade: string;
  content: string;
  file_url?: string;
}

export interface Schedule {
  id: number;
  grade: string;
  day: string;
  time_slot: string;
  subject: string;
  teacher: string;
  location?: string;
  is_weekend?: boolean;
}

export interface OnlineClass {
  id: number;
  grade: string;
  subject: string;
  link: string;
  time: string;
}

export interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: 'academic' | 'extracurricular' | 'administrative' | 'holiday' | 'other';
}

export interface HomeworkClasswork {
  id: number;
  type: 'Homework' | 'Classwork';
  grade: string;
  class: string;
  section: string;
  subject: string;
  content: string;
  date_assigned: string;
  date_due?: string;
}

export interface Datesheet {
  id: number;
  exam_name: string;
  grade: string;
  subject: string;
  date: string;
  time: string;
}

export interface DashboardStats {
  totalStudents: number;
  totalBalance: number;
  recentTransactions: Transaction[];
}
