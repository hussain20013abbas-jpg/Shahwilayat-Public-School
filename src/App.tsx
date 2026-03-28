import React, { useState, useEffect, Component, ReactNode } from 'react';
import { 
  Users, 
  Wallet, 
  Plus, 
  Search, 
  ArrowUpRight, 
  ArrowDownLeft, 
  History, 
  GraduationCap,
  LayoutDashboard,
  Settings,
  ChevronRight,
  X,
  Megaphone,
  BookOpen,
  Calendar,
  Video,
  Info,
  CheckCircle2,
  FileText,
  Printer,
  Menu,
  ChevronLeft,
  LogOut,
  Lock,
  User as UserIcon,
  Home,
  Phone,
  MessageSquare,
  CalendarDays,
  FileCheck,
  Clock,
  Book,
  ClipboardList,
  Award,
  Library as LibraryIcon,
  Building2,
  MonitorPlay,
  Camera,
  Coffee,
  ShoppingCart,
  Save,
  Globe,
  Gift,
  PieChart,
  AlertCircle,
  MapPin,
  ExternalLink,
  Loader2,
  QrCode,
  Copy
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Student, Transaction, DashboardStats, Announcement, Syllabus, Schedule, OnlineClass, User, HomeworkClasswork, Datesheet } from './types';

import { 
  PieChart as RePieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as ReTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { ChatBot } from './components/ChatBot';
import { QRScanner } from './components/QRScanner';

const BASE_URL = process.env.APP_URL || '';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

const ShahwilayatApp = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'students' | 'finance' | 'canteen' | 'news' | 'syllabus' | 'schedules' | 'online' | 'attendance' | 'homework' | 'datesheets' | 'results' | 'about' | 'admins'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [loginForm, setLoginForm] = useState({ username: '', password: '', type: 'student' as 'admin' | 'student' });
  const [loginError, setLoginError] = useState('');
  const [multipleProfiles, setMultipleProfiles] = useState<any[] | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [syllabus, setSyllabus] = useState<Syllabus[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [onlineClasses, setOnlineClasses] = useState<OnlineClass[]>([]);
  const [homework, setHomework] = useState<HomeworkClasswork[]>([]);
  const [datesheets, setDatesheets] = useState<Datesheet[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showAddAnnouncement, setShowAddAnnouncement] = useState(false);
  const [showAddGrade, setShowAddGrade] = useState(false);
  const [showAddHomework, setShowAddHomework] = useState(false);
  const [showAddDatesheet, setShowAddDatesheet] = useState(false);
  const [showAddSyllabus, setShowAddSyllabus] = useState(false);
  const [showSyllabusConfirm, setShowSyllabusConfirm] = useState(false);
  const [showAddSchedule, setShowAddSchedule] = useState(false);
  const [showAddOnlineClass, setShowAddOnlineClass] = useState(false);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showTopUp, setShowTopUp] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [topUpProcessing, setTopUpProcessing] = useState(false);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [loading, setLoading] = useState(true);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Form states
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', roll_no: '', grade: '', class: '', section: '', parent_contact: '', parent_email: '', photo_url: '', cnic: '', computer_number: '', password: '' });
  const [newTransaction, setNewTransaction] = useState({ student_id: '', amount: '', type: 'credit' as 'credit' | 'debit', fee_type: 'tuition' as any, description: '' });
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '', category: 'General' as any, image_url: '', is_featured: false });
  const [newGrade, setNewGrade] = useState({ subject: '', marks: '', total_marks: '', term: '' });
  const [newHomework, setNewHomework] = useState({ type: 'Homework' as 'Homework' | 'Classwork', grade: '', class: '', section: '', subject: '', content: '', date_due: '' });
  const [newDatesheet, setNewDatesheet] = useState({ exam_name: '', grade: '', subject: '', date: '', time: '' });
  const [newSyllabus, setNewSyllabus] = useState({ subject: '', grade: '', content: '', file_url: '' });
  const [newSchedule, setNewSchedule] = useState({ grade: '', day: 'Monday', time_slot: '', subject: '', teacher: '' });
  const [newOnlineClass, setNewOnlineClass] = useState({ grade: '', subject: '', link: '', time: '' });
  const [newAdmin, setNewAdmin] = useState({ name: '', username: '', password: '', role: 'admin' });
  const [resetForm, setResetForm] = useState({ type: 'student' as 'student' | 'admin' | 'canteen', identifier: '', verification: '', new_password: '' });
  const [resetMessage, setResetMessage] = useState({ text: '', type: 'success' as 'success' | 'error' });
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceFilters, setAttendanceFilters] = useState({ grade: '', class: '', section: '' });
  const [attendanceRecords, setAttendanceRecords] = useState<Record<number, 'Present' | 'Absent' | 'Late'>>({});
  const [attendanceReport, setAttendanceReport] = useState<any[]>([]);
  const [attendanceView, setAttendanceView] = useState<'mark' | 'report'>('mark');
  const [financeFilters, setFinanceFilters] = useState({ student_id: '', start_date: '', end_date: '' });
  const [studentFilters, setStudentFilters] = useState({ grade: '', class: '', section: '' });
  const [canteenSearch, setCanteenSearch] = useState('');
  const [canteenStudent, setCanteenStudent] = useState<Student | null>(null);
  const [canteenAmount, setCanteenAmount] = useState('');
  const [canteenProcessing, setCanteenProcessing] = useState(false);
  const [canteenPassword, setCanteenPassword] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('swps_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      if (parsedUser.role === 'student') {
        setActiveTab('dashboard');
      }
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchData();
      if (user.role === 'student' && user.student_id) {
        fetchStudentDetails(user.student_id);
      }
    }
  }, [user]);

  const fetchStudentDetails = async (id: number) => {
    try {
      const res = await fetch(`${BASE_URL}/api/students/${id}`);
      const data = await res.json();
      setSelectedStudent(data);
    } catch (error) {
      console.error('Error fetching student details:', error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch(`${BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });
      if (res.ok) {
        const userData = await res.json();
        if (userData.multiple) {
          setMultipleProfiles(userData.profiles);
          return;
        }
        setUser(userData);
        localStorage.setItem('swps_user', JSON.stringify(userData));
        if (userData.role === 'student' && userData.student_id) {
          fetchStudentDetails(userData.student_id);
        }
      } else {
        const errorData = await res.json();
        setLoginError(errorData.error || 'Invalid credentials');
      }
    } catch (error) {
      setLoginError('Connection error. Please try again.');
    }
  };

  const handleSelectProfile = (profile: any) => {
    const userData = { 
      id: profile.id, 
      name: profile.name, 
      role: 'student', 
      student_id: profile.id,
      grade: profile.grade,
      class: profile.class,
      section: profile.section,
      balance: profile.balance
    };
    setUser(userData);
    localStorage.setItem('swps_user', JSON.stringify(userData));
    fetchStudentDetails(profile.id);
    setMultipleProfiles(null);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetMessage({ text: '', type: 'success' });
    try {
      const res = await fetch(`${BASE_URL}/api/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resetForm)
      });
      const data = await res.json();
      if (res.ok) {
        setResetMessage({ text: 'Password reset successful! You can now login.', type: 'success' });
        setTimeout(() => {
          setShowResetPassword(false);
          setResetForm({ type: 'student', identifier: '', verification: '', new_password: '' });
          setResetMessage({ text: '', type: 'success' });
        }, 3000);
      } else {
        setResetMessage({ text: data.error || 'Failed to reset password', type: 'error' });
      }
    } catch (error) {
      setResetMessage({ text: 'Connection error. Please try again.', type: 'error' });
    }
  };

  const downloadStatement = () => {
    if (!user || !selectedStudent) return;
    
    const studentTransactions = transactions.filter(t => t.student_id === user.student_id);
    let content = `SHAHWILAYAT PUBLIC SCHOOL\n`;
    content += `FINANCIAL STATEMENT\n`;
    content += `====================================\n`;
    content += `Student: ${selectedStudent.name}\n`;
    content += `Roll No: ${selectedStudent.roll_no}\n`;
    content += `Class: ${selectedStudent.class}-${selectedStudent.section}\n`;
    content += `Current Balance: Rs. ${selectedStudent.balance}\n`;
    content += `Generated On: ${new Date().toLocaleString()}\n`;
    content += `====================================\n\n`;
    content += `DATE       | TYPE   | FEE TYPE | AMOUNT | DESCRIPTION\n`;
    content += `-----------|--------|----------|--------|------------------\n`;
    
    studentTransactions.forEach(t => {
      const date = new Date(t.date).toLocaleDateString().padEnd(10);
      const type = t.type.toUpperCase().padEnd(6);
      const feeType = (t.fee_type || 'other').toUpperCase().padEnd(8);
      const amount = `Rs. ${t.amount}`.padEnd(6);
      content += `${date} | ${type} | ${feeType} | ${amount} | ${t.description}\n`;
    });
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Statement_${selectedStudent.roll_no}_${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Statement downloaded successfully');
  };

  const handleLogout = () => {
    setUser(null);
    setSelectedStudent(null);
    localStorage.removeItem('swps_user');
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingPhoto(true);
      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          setter(reader.result as string);
          setIsUploadingPhoto(false);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error reading file:', error);
        setIsUploadingPhoto(false);
      }
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoints = [
        `${BASE_URL}/api/stats`,
        `${BASE_URL}/api/students`,
        `${BASE_URL}/api/announcements`,
        `${BASE_URL}/api/syllabus`,
        `${BASE_URL}/api/schedules`,
        `${BASE_URL}/api/online-classes`,
        `${BASE_URL}/api/homework-classwork`,
        `${BASE_URL}/api/datesheets`,
        `${BASE_URL}/api/transactions`,
        `${BASE_URL}/api/admins`
      ];
      
      const results = await Promise.all(endpoints.map(url => fetch(url)));
      
      const data = await Promise.all(results.map(async (res, index) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`API error on ${endpoints[index]}: ${res.status} ${text.substring(0, 100)}`);
        }
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await res.text();
          throw new Error(`Expected JSON from ${endpoints[index]} but got ${contentType}: ${text.substring(0, 100)}`);
        }
        return res.json();
      }));

      setStats(data[0]);
      setStudents(data[1]);
      setAnnouncements(data[2]);
      setSyllabus(data[3]);
      setSchedules(data[4]);
      setOnlineClasses(data[5]);
      setHomework(data[6]);
      setDatesheets(data[7]);
      setTransactions(data[8]);
      setAdmins(data[9]);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      setLoginError(error.message); // Show error in UI if needed
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/api/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent)
      });
      if (res.ok) {
        setShowAddStudent(false);
        setNewStudent({ name: '', roll_no: '', grade: '', class: '', section: '', parent_contact: '', parent_email: '', photo_url: '', cnic: '', computer_number: '', password: '' });
        fetchData();
      }
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    const studentId = selectedStudent?.id || parseInt(newTransaction.student_id);
    if (!studentId) return;
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: studentId,
          amount: parseFloat(newTransaction.amount),
          type: newTransaction.type,
          fee_type: newTransaction.fee_type,
          description: newTransaction.description
        })
      });
      if (res.ok) {
        setShowAddTransaction(false);
        setNewTransaction({ student_id: '', amount: '', type: 'credit', fee_type: 'tuition', description: '' });
        fetchData();
        if (selectedStudent) {
          const studentRes = await fetch(`${BASE_URL}/api/students/${selectedStudent.id}`);
          const studentData = await studentRes.json();
          setSelectedStudent(studentData);
        }
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const handleAddAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/api/announcements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAnnouncement)
      });
      if (res.ok) {
        setShowAddAnnouncement(false);
        setNewAnnouncement({ title: '', content: '', category: 'General', image_url: '', is_featured: false });
        fetchData();
      }
    } catch (error) {
      console.error('Error adding announcement:', error);
    }
  };

  const handleAddGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    try {
      const res = await fetch(`${BASE_URL}/api/academic-records`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: selectedStudent.id,
          subject: newGrade.subject,
          marks: parseFloat(newGrade.marks),
          total_marks: parseFloat(newGrade.total_marks),
          term: newGrade.term
        })
      });
      if (res.ok) {
        setShowAddGrade(false);
        setNewGrade({ subject: '', marks: '', total_marks: '', term: '' });
        const studentRes = await fetch(`/api/students/${selectedStudent.id}`);
        const studentData = await studentRes.json();
        setSelectedStudent(studentData);
      }
    } catch (error) {
      console.error('Error adding grade:', error);
    }
  };

  const handleSaveAttendance = async () => {
    const records = Object.entries(attendanceRecords).map(([student_id, status]) => ({
      student_id: parseInt(student_id),
      status
    }));

    if (records.length === 0) {
      showToast('Please mark attendance for at least one student.', 'error');
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/attendance/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ records, date: attendanceDate })
      });
      if (res.ok) {
        showToast('Attendance saved successfully!');
        fetchData();
      }
    } catch (error) {
      console.error('Error saving attendance:', error);
    }
  };

  const fetchAttendanceReport = async () => {
    try {
      const params = new URLSearchParams({
        date: attendanceDate,
        ...attendanceFilters
      });
      const res = await fetch(`${BASE_URL}/api/attendance/report?${params.toString()}`);
      const data = await res.json();
      setAttendanceReport(data);
    } catch (error) {
      console.error('Error fetching attendance report:', error);
    }
  };

  const handleCanteenSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find(s => s.roll_no === canteenSearch);
    if (student) {
      setCanteenStudent(student);
    } else {
      showToast('Student not found with this computer number', 'error');
    }
  };

  const handleCanteenPurchase = async () => {
    if (!canteenStudent || !canteenAmount || isNaN(Number(canteenAmount))) return;
    
    const amount = Number(canteenAmount);
    if (amount > (canteenStudent.balance || 0)) {
      showToast('Insufficient balance!', 'error');
      return;
    }

    setCanteenProcessing(true);
    try {
      const res = await fetch(`${BASE_URL}/api/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: canteenStudent.id,
          amount: amount,
          type: 'debit',
          fee_type: 'canteen',
          description: 'Canteen Snack Purchase',
          password: canteenPassword
        })
      });
      if (res.ok) {
        showToast('Purchase successful!');
        setCanteenAmount('');
        setCanteenPassword('');
        // Refresh student data to get updated balance
        const updatedRes = await fetch(`${BASE_URL}/api/students/${canteenStudent.id}`);
        const updatedData = await updatedRes.json();
        setCanteenStudent(updatedData);
        fetchData();
      } else {
        const data = await res.json();
        showToast(data.error || 'Purchase failed', 'error');
      }
    } catch (error) {
      console.error('Error processing canteen purchase:', error);
      showToast('An error occurred', 'error');
    } finally {
      setCanteenProcessing(false);
    }
  };

  const handleAddHomework = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/api/homework-classwork`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newHomework)
      });
      if (res.ok) {
        setShowAddHomework(false);
        setNewHomework({ type: 'Homework', grade: '', class: '', section: '', subject: '', content: '', date_due: '' });
        fetchData();
      }
    } catch (error) {
      console.error('Error adding homework:', error);
    }
  };

  const handleAddDatesheet = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/api/datesheets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDatesheet)
      });
      if (res.ok) {
        setShowAddDatesheet(false);
        setNewDatesheet({ exam_name: '', grade: '', subject: '', date: '', time: '' });
        fetchData();
      }
    } catch (error) {
      console.error('Error adding datesheet:', error);
    }
  };

  const handleAddSyllabus = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSyllabusConfirm(true);
  };

  const confirmAddSyllabus = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/syllabus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSyllabus)
      });
      if (res.ok) {
        setShowAddSyllabus(false);
        setShowSyllabusConfirm(false);
        setNewSyllabus({ subject: '', grade: '', content: '', file_url: '' });
        fetchData();
        showToast('Syllabus uploaded successfully!', 'success');
      }
    } catch (error) {
      console.error('Error adding syllabus:', error);
      showToast('Failed to upload syllabus.', 'error');
    }
  };

  const handleAddSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/api/schedules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSchedule)
      });
      if (res.ok) {
        setShowAddSchedule(false);
        setNewSchedule({ grade: '', day: 'Monday', time_slot: '', subject: '', teacher: '' });
        fetchData();
      }
    } catch (error) {
      console.error('Error adding schedule:', error);
    }
  };

  const handleAddOnlineClass = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/api/online-classes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOnlineClass)
      });
      if (res.ok) {
        setShowAddOnlineClass(false);
        setNewOnlineClass({ grade: '', subject: '', link: '', time: '' });
        fetchData();
      }
    } catch (error) {
      console.error('Error adding online class:', error);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/api/admins`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAdmin)
      });
      const data = await res.json();
      if (res.ok) {
        setShowAddAdmin(false);
        setNewAdmin({ name: '', username: '', password: '', role: 'admin' });
        fetchData();
        showToast('Admin added successfully!', 'success');
      } else {
        showToast(data.error || 'Failed to add admin', 'error');
      }
    } catch (error) {
      console.error('Error adding admin:', error);
      showToast('Connection error', 'error');
    }
  };

  const handleDeleteAdmin = async (id: number) => {
    try {
      const res = await fetch(`${BASE_URL}/api/admins/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
        showToast('Admin deleted successfully!', 'success');
      }
    } catch (error) {
      console.error('Error deleting admin:', error);
    }
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         s.roll_no.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGrade = !studentFilters.grade || s.grade === studentFilters.grade;
    const matchesClass = !studentFilters.class || s.class === studentFilters.class;
    const matchesSection = !studentFilters.section || s.section === studentFilters.section;
    return matchesSearch && matchesGrade && matchesClass && matchesSection;
  });

  const filteredTransactions = transactions.filter(t => {
    const matchesStudent = !financeFilters.student_id || t.student_id.toString() === financeFilters.student_id;
    const matchesStartDate = !financeFilters.start_date || new Date(t.date) >= new Date(financeFilters.start_date);
    const matchesEndDate = !financeFilters.end_date || new Date(t.date) <= new Date(financeFilters.end_date + 'T23:59:59');
    const matchesSearch = !searchQuery || 
      t.student_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      t.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStudent && matchesStartDate && matchesEndDate && matchesSearch;
  });

  const financeSummary = filteredTransactions.reduce((acc, t) => {
    const amount = t.amount ?? 0;
    if (t.type === 'credit') acc.totalCredit += amount;
    else acc.totalDebit += amount;
    return acc;
  }, { totalCredit: 0, totalDebit: 0 });

  const studentFinanceBreakdown = transactions
    .filter(t => t.student_id === user?.student_id && t.type === 'debit')
    .reduce((acc: Record<string, number>, t) => {
      const type = t.fee_type || 'other';
      acc[type] = (acc[type] || 0) + (t.amount || 0);
      return acc;
    }, {});

  const handleTopUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.student_id || !topUpAmount || parseFloat(topUpAmount) <= 0) return;

    setTopUpProcessing(true);
    try {
      const response = await fetch(`${BASE_URL}/api/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: user.student_id,
          amount: parseFloat(topUpAmount),
          type: 'credit',
          fee_type: 'other',
          description: 'Wallet Top Up (Online Deposit)'
        })
      });

      if (response.ok) {
        showToast('Wallet topped up successfully!');
        setShowTopUp(false);
        setTopUpAmount('');
        fetchStudentDetails(user.student_id);
      } else {
        const data = await response.json();
        showToast(data.error || 'Failed to top up wallet', 'error');
      }
    } catch (err) {
      showToast('Network error', 'error');
    } finally {
      setTopUpProcessing(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 mb-8">
            <div className="text-center mb-8">
              <div className="bg-white p-4 rounded-2xl shadow-sm inline-block mb-6 border border-gray-100">
                <img 
                  src="https://shahwilayat.edu.pk/wp-content/uploads/2021/08/logo-shahwilayat.png" 
                  alt="SWPS Logo" 
                  className="w-24 h-24 object-contain"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://picsum.photos/seed/school/100/100";
                  }}
                />
              </div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Shahwilayat Public School</h1>
              <p className="bg-secondary text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] inline-block mt-2 shadow-sm">Excellence in Education</p>
            </div>

            {multipleProfiles ? (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900">Choose Your Profile</h3>
                  <p className="text-sm text-gray-500 mt-1">Multiple students found for this CNIC</p>
                </div>
                <div className="grid gap-4">
                  {multipleProfiles.map(profile => (
                    <button
                      key={profile.id}
                      onClick={() => handleSelectProfile(profile)}
                      className="w-full p-5 bg-white border-2 border-gray-100 rounded-3xl hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-100 transition-all text-left flex items-center gap-5 group relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full -mr-12 -mt-12 group-hover:bg-indigo-100 transition-colors" />
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl group-hover:bg-primary group-hover:text-white transition-all relative z-10">
                        {profile.photo_url ? (
                          <img src={profile.photo_url} alt={profile.name} className="w-full h-full object-cover rounded-2xl" />
                        ) : (
                          profile.name.charAt(0)
                        )}
                      </div>
                      <div className="relative z-10">
                        <p className="font-bold text-gray-900 text-lg">{profile.name}</p>
                        <p className="text-sm text-gray-500 font-medium">Class: {profile.class}-{profile.section}</p>
                        <div className="flex gap-2 mt-1">
                          <p className="text-xs text-primary font-bold">Roll: {profile.roll_no}</p>
                          <p className="text-xs text-emerald-600 font-bold">Comp: {profile.computer_number || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="ml-auto w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-indigo-50 transition-all relative z-10">
                        <ChevronRight className="text-gray-400 group-hover:text-primary" size={20} />
                      </div>
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => setMultipleProfiles(null)}
                  className="w-full py-3 text-center text-sm text-gray-500 font-bold hover:text-indigo-600 transition-colors"
                >
                  ← Back to Login
                </button>
              </div>
            ) : (
              <>
                <div className="flex p-1 bg-gray-100 rounded-xl mb-6">
                  <button 
                    onClick={() => setLoginForm({...loginForm, type: 'student'})}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${loginForm.type === 'student' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:bg-gray-200'}`}
                  >
                    Student
                  </button>
                  <button 
                    onClick={() => setLoginForm({...loginForm, type: 'admin'})}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${loginForm.type === 'admin' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:bg-gray-200'}`}
                  >
                    Admin
                  </button>
                  <button 
                    onClick={() => setLoginForm({...loginForm, type: 'canteen'})}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${loginForm.type === 'canteen' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:bg-gray-200'}`}
                  >
                    Canteen
                  </button>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {loginForm.type === 'student' ? 'CNIC Number' : loginForm.type === 'canteen' ? 'Username' : 'Username'}
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        required
                        type="text" 
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        placeholder={loginForm.type === 'student' ? '12345-1234567-1' : loginForm.type === 'canteen' ? 'canteen' : 'admin'}
                        value={loginForm.username}
                        onChange={e => setLoginForm({...loginForm, username: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        required
                        type="password" 
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        placeholder="••••••••"
                        value={loginForm.password}
                        onChange={e => setLoginForm({...loginForm, password: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  {loginError && (
                    <p className="text-red-500 text-xs font-medium text-center">{loginError}</p>
                  )}

                  <div className="flex justify-end">
                    <button 
                      type="button"
                      onClick={() => setShowResetPassword(true)}
                      className="text-xs text-indigo-600 hover:underline font-medium"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <button type="submit" className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-accent transition-all shadow-lg shadow-primary/20 mt-2">
                    Sign In
                  </button>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <button 
                      type="button"
                      onClick={() => {
                        setLoginForm({ username: 'admin', password: 'admin123', type: 'admin' });
                        setTimeout(() => {
                          const form = document.querySelector('form') as HTMLFormElement;
                          if (form) form.requestSubmit();
                        }, 100);
                      }}
                      className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all flex justify-center items-center gap-2"
                    >
                      <UserIcon size={18} /> Guest Login (Admin)
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-gray-100 w-full max-w-md flex flex-col items-center gap-2 mb-8"
        >
          <div className="flex items-center gap-2 text-gray-600 font-medium text-sm">
            <Globe size={16} className="text-primary" />
            Public App Link
          </div>
          <div className="flex items-center gap-2 w-full bg-gray-50 p-2 rounded-xl border border-gray-200">
            <input 
              type="text" 
              readOnly 
              value={window.location.href} 
              className="bg-transparent text-xs text-gray-500 w-full outline-none px-2 font-mono truncate"
            />
            <button 
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                showToast('Link copied to clipboard!');
              }}
              className="p-2 bg-white rounded-lg shadow-sm border border-gray-200 text-gray-600 hover:text-primary hover:border-primary transition-colors flex-shrink-0"
              title="Copy Link"
            >
              <Copy size={16} />
            </button>
            <a 
              href={window.location.href} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 bg-primary text-white rounded-lg shadow-sm hover:bg-accent transition-colors flex-shrink-0"
              title="Open in new tab"
            >
              <ExternalLink size={16} />
            </a>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100"
          >
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-4">
              <Info size={24} />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">About Us</h4>
            <p className="text-sm text-gray-500 leading-relaxed">
              Shahwilayat Public School is a premier educational institution dedicated to academic excellence and holistic development. Founded with a vision to nurture future leaders, we provide a supportive and challenging environment for our students.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100"
          >
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4">
              <MapPin size={24} />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Location</h4>
            <p className="text-sm text-gray-500 leading-relaxed">
              Block 13, Gulistan-e-Jauhar, Karachi, Pakistan. <br />
              Our campus is equipped with modern facilities and a secure environment for all students.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100"
          >
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-4">
              <Globe size={24} />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Website</h4>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              Visit our official website for more information about admissions, events, and academic programs.
            </p>
            <a 
              href="https://shahwilayat.edu.pk/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary font-bold text-sm hover:underline flex items-center gap-1"
            >
              shahwilayat.edu.pk <ExternalLink size={14} />
            </a>
          </motion.div>
        </div>

        <p className="text-center text-gray-400 text-xs mt-12">
          © 2026 Shahwilayat Public School. All rights reserved.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 256 : 80 }}
        className="bg-white border-r border-gray-200 flex flex-col relative"
      >
        <div className="p-6 flex items-center gap-3">
          <div className="bg-white p-1 rounded-lg shadow-sm">
            <img 
              src="https://shahwilayat.edu.pk/wp-content/uploads/2021/08/logo-shahwilayat.png" 
              alt="SWPS Logo" 
              className="w-8 h-8 object-contain"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://picsum.photos/seed/school/100/100";
              }}
            />
          </div>
          <div className={`flex flex-col ${!isSidebarOpen && 'hidden'}`}>
            <h1 className="font-bold text-gray-900 leading-tight">Shahwilayat Public School</h1>
            <span className="bg-secondary text-primary px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest inline-block w-fit">Excellence</span>
          </div>
        </div>

        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-3 top-20 bg-white border border-gray-200 rounded-full p-1 shadow-sm hover:bg-gray-50 z-10"
        >
          {isSidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            ...(user.role === 'admin' ? [
              { id: 'students', icon: Users, label: 'Students' },
              { id: 'finance', icon: Wallet, label: 'Finance' },
              { id: 'canteen', icon: Coffee, label: 'Canteen' },
              { id: 'admins', icon: Settings, label: 'Manage Admins' },
            ] : user.role === 'canteen' ? [
              { id: 'canteen', icon: Coffee, label: 'Canteen' },
              { id: 'finance', icon: Wallet, label: 'Finance' },
            ] : [
              { id: 'finance', icon: Wallet, label: 'My Wallet' },
            ]),
            { id: 'news', icon: Megaphone, label: 'News Feed' },
            { id: 'attendance', icon: FileCheck, label: 'Attendance' },
            { id: 'homework', icon: ClipboardList, label: 'Homework' },
            { id: 'datesheets', icon: CalendarDays, label: 'Datesheets' },
            { id: 'results', icon: Award, label: 'Results' },
            { id: 'syllabus', icon: BookOpen, label: 'Syllabus' },
            { id: 'schedules', icon: Calendar, label: 'Schedules' },
            { id: 'online', icon: Video, label: 'Online Classes' },
            { id: 'about', icon: Info, label: 'About Us' },
            { id: 'scan', icon: QrCode, label: 'Scan QR Code', onClick: () => setShowQRScanner(true) },
          ].map((item: any) => (
            <button 
              key={item.id}
              onClick={() => item.onClick ? item.onClick() : setActiveTab(item.id as any)}
              title={!isSidebarOpen ? item.label : ''}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-primary/10 text-primary font-medium' : 'text-gray-500 hover:bg-gray-50'} ${!isSidebarOpen && 'justify-center px-0'}`}
            >
              <item.icon size={20} />
              {isSidebarOpen && <span className="font-bold">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all ${!isSidebarOpen && 'justify-center px-0'}`}
          >
            <LogOut size={20} />
            {isSidebarOpen && 'Sign Out'}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center sticky top-0 z-20">
          <div className="flex items-center gap-4">
            {user.role === 'student' && (
              <button onClick={handleLogout} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                <LogOut size={24} />
              </button>
            )}
            <h2 className="text-xl font-bold text-gray-900 capitalize">{activeTab}</h2>
          </div>
          
          <div className="flex items-center gap-4">
            {user.role === 'student' ? (
              <>
                <button onClick={() => setActiveTab('dashboard')} className="text-primary p-2 hover:bg-primary/10 rounded-lg transition-colors">
                  <Home size={24} />
                </button>
                <button className="text-primary p-2 hover:bg-primary/10 rounded-lg transition-colors">
                  <Users size={24} />
                </button>
                <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-white shadow-sm overflow-hidden">
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
                    alt="profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="relative hidden md:block">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search anything..." 
                    className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
            {user.role === 'admin' && (
              <button 
                onClick={() => setShowAddStudent(true)}
                className="bg-primary text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-accent transition-all shadow-lg shadow-primary/20"
              >
                <Plus size={18} />
                Add Student
              </button>
            )}
              </>
            )}
          </div>
        </header>

        <div className="p-6 md:p-8">
          {activeTab === 'dashboard' && stats && (
            <div className="space-y-8">
              {user.role === 'student' && selectedStudent ? (
                <div className="space-y-8">
                  {/* Debit Card Style Balance Card */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-gradient-to-br from-primary via-accent to-black p-8 rounded-[3rem] text-white shadow-2xl shadow-primary/20 relative overflow-hidden aspect-[1.586/1] flex flex-col justify-between">
                      <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -mr-40 -mt-40 blur-3xl" />
                      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/20 rounded-full -ml-32 -mb-32 blur-2xl" />
                      
                      <div className="relative z-10 flex justify-between items-start">
                        <div>
                          <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Shahwilayat Public School</p>
                          <h2 className="text-xl font-black tracking-tight">STUDENT DEBIT CARD</h2>
                        </div>
                        <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-xl border border-white/20">
                          <Globe size={24} className="text-indigo-100" />
                        </div>
                      </div>

                      <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-8">
                          <div className="w-12 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg shadow-inner border border-amber-300/30" />
                          <div className="flex gap-4 text-2xl font-mono tracking-[0.2em] text-indigo-50">
                            <span>{selectedStudent?.roll_no?.substring(0, 4) || '0000'}</span>
                            <span>{selectedStudent?.roll_no?.substring(4, 8) || '0000'}</span>
                            <span>{selectedStudent?.roll_no?.substring(8, 12) || '0000'}</span>
                            <span>{selectedStudent?.roll_no?.substring(12) || '0000'}</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-[10px] text-indigo-200 uppercase font-black tracking-wider mb-1">Card Holder</p>
                            <p className="text-lg font-black tracking-tight uppercase">{selectedStudent?.name}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] text-indigo-200 uppercase font-black tracking-wider mb-1">Current Balance</p>
                            <p className="text-2xl font-black">Rs. {selectedStudent?.balance?.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col justify-center items-center text-center">
                      <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mb-4 shadow-sm">
                        <Wallet size={40} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Wallet Status</h3>
                      <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm mb-6">
                        <CheckCircle2 size={16} />
                        Active & Verified
                      </div>
                      <div className="w-full space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500 font-medium">Roll Number</span>
                          <span className="text-gray-900 font-bold">{selectedStudent?.roll_no}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500 font-medium">Computer ID</span>
                          <span className="text-gray-900 font-bold">{selectedStudent?.computer_number || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500 font-medium">Class</span>
                          <span className="text-gray-900 font-bold">{selectedStudent?.class}-{selectedStudent?.section}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500 font-medium">Attendance</span>
                          <span className="text-gray-900 font-bold">{selectedStudent?.attendance_percentage?.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions Grid */}
                  <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-4">
                    {[
                      { label: 'Notices', icon: Megaphone, color: 'bg-blue-50 text-blue-600', tab: 'news' },
                      { label: 'Canteen', icon: Coffee, color: 'bg-orange-50 text-orange-600', tab: 'dashboard' },
                      { label: 'Homework', icon: BookOpen, color: 'bg-green-50 text-green-600', tab: 'homework' },
                      { label: 'Attendance', icon: Calendar, color: 'bg-amber-50 text-amber-600', tab: 'attendance' },
                      { label: 'Syllabus', icon: Book, color: 'bg-purple-50 text-purple-600', tab: 'syllabus' },
                      { label: 'Schedule', icon: Clock, color: 'bg-primary/10 text-primary', tab: 'schedules' },
                      { label: 'Finance', icon: Wallet, color: 'bg-emerald-50 text-emerald-600', tab: 'finance' },
                      { label: 'Online', icon: Video, color: 'bg-cyan-50 text-cyan-600', tab: 'online' },
                      { label: 'Results', icon: Award, color: 'bg-rose-50 text-rose-600', tab: 'results' },
                    ].map((item, i) => (
                      <motion.button
                        key={item.tab}
                        whileHover={{ y: -5, scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => item.tab && setActiveTab(item.tab as any)}
                        className="flex flex-col items-center gap-2 group"
                      >
                        <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl ${item.color} flex items-center justify-center shadow-sm group-hover:shadow-md transition-all`}>
                          <item.icon size={24} md:size={28} strokeWidth={2} />
                        </div>
                        <span className="text-[10px] md:text-xs font-bold text-gray-600 text-center">{item.label}</span>
                      </motion.button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Transactions for Student */}
                    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-900 text-lg">Recent Spending</h3>
                        <button onClick={() => setActiveTab('finance')} className="text-indigo-600 text-xs font-bold hover:underline">View All</button>
                      </div>
                      <div className="space-y-4">
                        {transactions.filter(t => t.student_id === selectedStudent.id).slice(0, 4).map((tx) => (
                          <div key={`${tx.id}-${tx.date}`} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100/50">
                            <div className="flex items-center gap-4">
                              <div className={`p-3 rounded-xl ${tx.type === 'credit' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                                {tx.type === 'credit' ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-gray-900">{tx.description}</p>
                                <p className="text-[10px] text-gray-400 font-medium">{new Date(tx.date).toLocaleDateString()} • {tx.fee_type}</p>
                              </div>
                            </div>
                            <span className={`font-bold text-sm ${tx.type === 'credit' ? 'text-emerald-600' : 'text-rose-600'}`}>
                              {tx.type === 'credit' ? '+' : '-'} Rs. {tx.amount?.toLocaleString()}
                            </span>
                          </div>
                        ))}
                        {transactions.filter(t => t.student_id === selectedStudent.id).length === 0 && (
                          <div className="text-center py-8">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                              <History className="text-gray-300" size={32} />
                            </div>
                            <p className="text-gray-400 text-sm">No transactions yet</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Upcoming Classes for Student */}
                    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-900 text-lg">Next Classes</h3>
                        <button onClick={() => setActiveTab('online')} className="text-primary text-xs font-bold hover:underline">Full Schedule</button>
                      </div>
                      <div className="space-y-4">
                        {onlineClasses.filter(c => c.grade === selectedStudent.grade).slice(0, 4).map((oc) => (
                          <div key={oc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100/50">
                            <div className="flex items-center gap-4">
                              <div className="p-3 bg-primary/20 text-primary rounded-xl">
                                <Video size={18} />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-gray-900">{oc.subject}</p>
                                <p className="text-[10px] text-gray-400 font-medium">
                                  {new Date(oc.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {oc.teacher_name}
                                </p>
                              </div>
                            </div>
                            <a href={oc.link} target="_blank" rel="noopener noreferrer" className="bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-accent transition-all">
                              JOIN
                            </a>
                          </div>
                        ))}
                        {onlineClasses.filter(c => c.grade === selectedStudent.grade).length === 0 && (
                          <div className="text-center py-8">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                              <MonitorPlay className="text-gray-300" size={32} />
                            </div>
                            <p className="text-gray-400 text-sm">No classes scheduled</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {user.role === 'admin' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-3xl border border-indigo-100 shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
                          <Globe size={24} />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">Share School Portal</h3>
                          <p className="text-sm text-gray-600">Share this link with students and staff to give them access.</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-indigo-100 shadow-sm w-full md:w-auto flex-1 max-w-md">
                        <input 
                          type="text" 
                          readOnly 
                          value={window.location.href} 
                          className="bg-transparent text-sm text-gray-600 w-full outline-none px-2 font-mono truncate"
                        />
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            showToast('Link copied to clipboard!');
                          }}
                          className="p-2 bg-indigo-50 rounded-lg text-indigo-600 hover:bg-indigo-100 transition-colors flex-shrink-0"
                          title="Copy Link"
                        >
                          <Copy size={18} />
                        </button>
                        <a 
                          href={window.location.href} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex-shrink-0"
                          title="Open in new tab"
                        >
                          <ExternalLink size={18} />
                        </a>
                      </div>
                    </motion.div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { label: 'Total Students', value: stats.totalStudents, icon: Users, color: 'bg-blue-50 text-blue-600' },
                      { label: 'Total Balance', value: `Rs. ${stats.totalBalance?.toLocaleString() ?? '0'}`, icon: Wallet, color: 'bg-emerald-50 text-emerald-600' },
                      { label: 'Pending Fees', value: 'Rs. 45,000', icon: History, color: 'bg-red-50 text-red-600' },
                      { label: 'News Items', value: announcements.length, icon: Megaphone, color: 'bg-purple-50 text-purple-600' },
                    ].map((stat, i) => (
                      <motion.div 
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className={`p-3 rounded-xl ${stat.color}`}>
                            <stat.icon size={24} />
                          </div>
                        </div>
                        <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
                      </motion.div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-900">Recent Transactions</h3>
                        <button onClick={() => setActiveTab('finance')} className="text-indigo-600 text-xs font-bold hover:underline">View All</button>
                      </div>
                      <div className="space-y-4">
                        {stats.recentTransactions.slice(0, 5).map((tx) => (
                          <div key={`${tx.id}-${tx.date}`} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${tx.type === 'credit' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                                {tx.type === 'credit' ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{tx.student_name}</p>
                                <p className="text-xs text-gray-500">{new Date(tx.date).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <span className={`font-bold text-sm ${tx.type === 'credit' ? 'text-emerald-600' : 'text-red-600'}`}>
                              {tx.type === 'credit' ? '+' : '-'} Rs. {tx.amount?.toLocaleString() ?? '0'}
                            </span>
                          </div>
                        ))}
                        {stats.recentTransactions.length === 0 && <p className="text-center text-gray-400 py-4">No recent transactions</p>}
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-900">Upcoming Classes</h3>
                        <button onClick={() => setActiveTab('online')} className="text-primary text-xs font-bold hover:underline">View All</button>
                      </div>
                      <div className="space-y-4">
                        {onlineClasses.slice(0, 5).map((oc) => (
                          <div key={oc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-primary/20 text-primary rounded-lg">
                                <Video size={16} />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{oc.subject}</p>
                                <p className="text-xs text-gray-500">Grade {oc.grade} • {new Date(oc.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                              </div>
                            </div>
                            <a href={oc.link} target="_blank" rel="noopener noreferrer" className="text-primary text-xs font-bold hover:underline">JOIN</a>
                          </div>
                        ))}
                        {onlineClasses.length === 0 && <p className="text-center text-gray-400 py-4">No classes scheduled</p>}
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-900">Latest News</h3>
                        <button onClick={() => setActiveTab('news')} className="text-primary text-xs font-bold hover:underline">Read Feed</button>
                      </div>
                      <div className="space-y-4">
                        {announcements.slice(0, 5).map((ann) => (
                          <div key={ann.id} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl group cursor-pointer hover:bg-white hover:shadow-sm transition-all" onClick={() => setActiveTab('news')}>
                            <div className={`p-2 rounded-lg shrink-0 ${
                              ann.category === 'Events' ? 'bg-purple-100 text-purple-600' :
                              ann.category === 'Academics' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                            }`}>
                              <Megaphone size={16} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-gray-900 truncate group-hover:text-primary transition-colors">{ann.title}</p>
                              <p className="text-xs text-gray-500 line-clamp-1">{ann.content}</p>
                              <p className="text-[10px] text-gray-400 mt-1">{new Date(ann.date).toLocaleDateString()}</p>
                            </div>
                          </div>
                        ))}
                        {announcements.length === 0 && <p className="text-center text-gray-400 py-4">No news items posted</p>}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'canteen' && (
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Canteen Management</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                      <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Search size={18} className="text-primary" />
                        Find Student by Computer No
                      </h4>
                      <form onSubmit={handleCanteenSearch} className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="Enter Computer No..." 
                          className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                          value={canteenSearch}
                          onChange={e => setCanteenSearch(e.target.value)}
                        />
                        <button type="submit" className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-accent transition-all">
                          Search
                        </button>
                      </form>
                    </div>

                    {canteenStudent && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-primary/5 p-6 rounded-2xl border border-primary/10"
                      >
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-primary font-bold text-2xl shadow-sm">
                            {canteenStudent.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 text-lg">{canteenStudent.name}</h4>
                            <p className="text-sm text-gray-500">Computer No: {canteenStudent.roll_no}</p>
                            <p className="text-sm font-bold text-primary mt-1">Balance: Rs. {canteenStudent.balance?.toLocaleString()}</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Purchase Amount (Rs.)</label>
                            <input 
                              type="number" 
                              placeholder="0.00" 
                              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold text-lg"
                              value={canteenAmount}
                              onChange={e => setCanteenAmount(e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Student Password (to confirm)</label>
                            <input 
                              type="password" 
                              placeholder="••••••••" 
                              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                              value={canteenPassword}
                              onChange={e => setCanteenPassword(e.target.value)}
                            />
                          </div>
                          <button 
                            onClick={handleCanteenPurchase}
                            disabled={canteenProcessing || !canteenAmount || !canteenPassword}
                            className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-accent transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                          >
                            {canteenProcessing ? 'Processing...' : 'Complete Purchase'}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <History size={18} className="text-indigo-600" />
                      Recent Canteen Sales
                    </h4>
                    <div className="space-y-3">
                      {transactions.filter(t => t.fee_type === 'canteen').slice(0, 10).map(tx => (
                        <div key={`${tx.id}-${tx.date}`} className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                          <div>
                            <p className="text-sm font-bold text-gray-900">{tx.student_name}</p>
                            <p className="text-[10px] text-gray-400">{new Date(tx.date).toLocaleString()}</p>
                          </div>
                          <span className="font-bold text-rose-600 text-sm">- Rs. {tx.amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        {activeTab === 'news' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">School News Feed</h3>
                <p className="text-gray-500 text-sm">Stay updated with the latest happenings at SWPS</p>
              </div>
              {user.role === 'admin' && (
                <button 
                  onClick={() => setShowAddAnnouncement(true)}
                  className="bg-primary text-white px-6 py-2.5 rounded-xl flex items-center gap-2 hover:bg-accent transition-all shadow-lg shadow-primary/20"
                >
                  <Plus size={20} /> Create Post
                </button>
              )}
            </div>

            {announcements.some(a => a.is_featured) && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <Award size={16} className="text-amber-500" /> Featured Stories
                </h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {announcements.filter(a => a.is_featured).map((ann) => (
                    <motion.div 
                      key={ann.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="group relative bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row h-full"
                    >
                      <div className="md:w-2/5 h-48 md:h-auto relative overflow-hidden">
                        <img 
                          src={ann.image_url || `https://picsum.photos/seed/${ann.id}/600/400`} 
                          alt={ann.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="bg-secondary text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg">
                            Featured
                          </span>
                        </div>
                      </div>
                      <div className="p-6 md:w-3/5 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-center mb-3">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              ann.category === 'Events' ? 'bg-purple-50 text-purple-600' :
                              ann.category === 'Academics' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                            }`}>
                              {ann.category}
                            </span>
                            <span className="text-xs text-gray-400 font-medium">{new Date(ann.date).toLocaleDateString()}</span>
                          </div>
                          <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">{ann.title}</h4>
                          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{ann.content}</p>
                        </div>
                        <button className="mt-4 text-primary text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
                          Read More <ChevronRight size={16} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Latest Updates</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {announcements.filter(a => !a.is_featured).map((ann) => (
                  <motion.div 
                    key={ann.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col group"
                  >
                    {ann.image_url && (
                      <div className="h-40 overflow-hidden">
                        <img 
                          src={ann.image_url} 
                          alt={ann.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex justify-between items-center mb-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          ann.category === 'Events' ? 'bg-purple-50 text-purple-600' :
                          ann.category === 'Academics' ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-600'
                        }`}>
                          {ann.category}
                        </span>
                        <span className="text-xs text-gray-400">{new Date(ann.date).toLocaleDateString()}</span>
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">{ann.title}</h4>
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 flex-1">{ann.content}</p>
                      <button className="mt-4 text-primary text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
                        Read Full Story <ChevronRight size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
                {announcements.filter(a => !a.is_featured).length === 0 && (
                  <div className="col-span-full p-12 text-center text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
                    No recent updates to show.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'admins' && user.role === 'admin' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Admin Management</h3>
                <p className="text-gray-500 text-sm">Manage school administrators and canteen staff accounts</p>
              </div>
              <button 
                onClick={() => setShowAddAdmin(true)}
                className="bg-primary text-white px-6 py-2.5 rounded-xl flex items-center gap-2 hover:bg-accent transition-all shadow-lg shadow-primary/20"
              >
                <Plus size={20} /> Add New Admin
              </button>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Username</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {admins.map((admin) => (
                    <tr key={admin.id} className="even:bg-gray-50/50 hover:bg-primary/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                            {admin.name.charAt(0)}
                          </div>
                          <span className="font-bold text-gray-900">{admin.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{admin.username}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          admin.role === 'admin' ? 'bg-purple-50 text-purple-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                          {admin.role === 'admin' ? 'Administrator' : 'Canteen Staff'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {admin.username !== 'admin' && (
                          <button 
                            onClick={() => handleDeleteAdmin(admin.id)}
                            className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                            title="Delete Admin"
                          >
                            <X size={18} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'syllabus' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <h3 className="font-bold text-gray-900">Course Syllabus</h3>
              {user.role === 'admin' && (
                <button 
                  onClick={() => setShowAddSyllabus(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition-all text-sm"
                >
                  <Plus size={16} /> Add Syllabus
                </button>
              )}
            </div>
            <div className="divide-y divide-gray-50">
              {syllabus
                .filter(s => user.role === 'admin' || s.grade === user.grade)
                .map((s) => (
                <div key={s.id} className="p-6 flex justify-between items-center hover:bg-gray-50 transition-all">
                  <div>
                    <h4 className="font-bold text-gray-900">{s.subject}</h4>
                    <p className="text-sm text-gray-500">Grade: {s.grade}</p>
                    <p className="text-sm text-gray-600 mt-2">{s.content}</p>
                  </div>
                  {s.file_url ? (
                    <a 
                      href={s.file_url} 
                      download={`${s.subject}_Syllabus_Grade_${s.grade}.pdf`}
                      className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-2"
                    >
                      <FileText size={18} /> Download PDF
                    </a>
                  ) : (
                    <span className="text-gray-400 text-xs italic flex items-center gap-2">
                      <FileText size={18} /> No PDF attached
                    </span>
                  )}
                </div>
              ))}
              {syllabus.filter(s => user.role === 'admin' || s.grade === user.grade).length === 0 && (
                <div className="p-12 text-center text-gray-400">No syllabus available for your grade.</div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'schedules' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <h3 className="font-bold text-gray-900">Class Schedules</h3>
              {user.role === 'admin' && (
                <button 
                  onClick={() => setShowAddSchedule(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition-all text-sm"
                >
                  <Plus size={16} /> Add Schedule
                </button>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-medium">Day</th>
                    <th className="px-6 py-4 font-medium">Time</th>
                    <th className="px-6 py-4 font-medium">Subject</th>
                    <th className="px-6 py-4 font-medium">Teacher</th>
                    <th className="px-6 py-4 font-medium">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {schedules
                    .filter(sch => user.role === 'admin' || sch.grade === user.grade)
                    .map((sch) => (
                    <tr key={sch.id} className="even:bg-gray-50/50 hover:bg-indigo-50/30 transition-all">
                      <td className="px-6 py-4 font-medium text-gray-900">{sch.day}</td>
                      <td className="px-6 py-4 text-gray-500 text-sm">{sch.time_slot}</td>
                      <td className="px-6 py-4 text-gray-900 font-medium">{sch.subject}</td>
                      <td className="px-6 py-4 text-gray-500 text-sm">{sch.teacher}</td>
                      <td className="px-6 py-4 text-gray-500 text-sm">{sch.grade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {schedules.filter(sch => user.role === 'admin' || sch.grade === user.grade).length === 0 && (
                <div className="p-12 text-center text-gray-400">No schedules set for your grade.</div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'online' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Online Classes</h3>
              {user.role === 'admin' && (
                <button 
                  onClick={() => setShowAddOnlineClass(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition-all"
                >
                  <Plus size={18} /> New Class
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {onlineClasses
              .filter(oc => user.role === 'admin' || oc.grade === user.grade)
              .map((oc) => (
              <div key={oc.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                    <Video size={20} />
                  </div>
                  <span className="text-xs font-bold text-red-600 uppercase tracking-wider">Live Class</span>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-1">{oc.subject}</h4>
                <p className="text-sm text-gray-500 mb-4">Grade {oc.grade} • {oc.time ? new Date(oc.time).toLocaleString() : 'N/A'}</p>
                <a 
                  href={oc.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full bg-primary text-white py-2 rounded-xl font-medium hover:bg-accent transition-all flex items-center justify-center gap-2"
                >
                  Join Meeting
                </a>
              </div>
            ))}
            {onlineClasses.filter(oc => user.role === 'admin' || oc.grade === user.grade).length === 0 && (
              <div className="col-span-full p-12 text-center text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
                No online classes scheduled for your grade.
              </div>
            )}
          </div>
        </div>
      )}

        {activeTab === 'attendance' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex p-1 bg-gray-100 rounded-xl w-full md:w-auto">
                  <button 
                    onClick={() => setAttendanceView('mark')}
                    className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all ${attendanceView === 'mark' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500'}`}
                  >
                    Mark Attendance
                  </button>
                  <button 
                    onClick={() => {
                      setAttendanceView('report');
                      fetchAttendanceReport();
                    }}
                    className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all ${attendanceView === 'report' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500'}`}
                  >
                    Attendance Report
                  </button>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <Calendar size={20} className="text-gray-400" />
                  <input 
                    type="date" 
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-primary/20 w-full"
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {attendanceView === 'mark' ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex flex-wrap gap-4 items-center justify-between bg-indigo-50/30">
                  <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex gap-4">
                      <select 
                        className="bg-white border border-gray-200 rounded-xl px-4 py-2 outline-none text-sm"
                        value={attendanceFilters.grade}
                        onChange={(e) => setAttendanceFilters({...attendanceFilters, grade: e.target.value})}
                      >
                        <option value="">All Grades</option>
                        {[...new Set(students.map(s => s.grade))].map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                      <select 
                        className="bg-white border border-gray-200 rounded-xl px-4 py-2 outline-none text-sm"
                        value={attendanceFilters.class}
                        onChange={(e) => setAttendanceFilters({...attendanceFilters, class: e.target.value})}
                      >
                        <option value="">All Classes</option>
                        {[...new Set(students.map(s => s.class))].map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    
                    <div className="h-8 w-px bg-gray-200 mx-2 hidden md:block"></div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-500 uppercase">Bulk Mark:</span>
                      <div className="flex gap-1">
                        {['Present', 'Absent', 'Late'].map((status) => (
                          <button
                            key={status}
                            onClick={() => {
                              const filtered = students.filter(s => 
                                (!attendanceFilters.grade || s.grade === attendanceFilters.grade) && 
                                (!attendanceFilters.class || s.class === attendanceFilters.class)
                              );
                              const newRecords = { ...attendanceRecords };
                              filtered.forEach(s => {
                                newRecords[s.id] = status as any;
                              });
                              setAttendanceRecords(newRecords);
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                              status === 'Present' ? 'border-emerald-200 text-emerald-600 hover:bg-emerald-50' :
                              status === 'Absent' ? 'border-red-200 text-red-600 hover:bg-red-50' :
                              'border-amber-200 text-amber-600 hover:bg-amber-50'
                            } bg-white`}
                          >
                            All {status}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={handleSaveAttendance}
                    className="bg-primary text-white px-6 py-2 rounded-xl font-bold hover:bg-accent transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
                  >
                    <Save size={18} /> Save Attendance
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                        <th className="px-6 py-4 font-medium">Student Name</th>
                        <th className="px-6 py-4 font-medium">Computer Number</th>
                        <th className="px-6 py-4 font-medium">Class</th>
                        <th className="px-6 py-4 font-medium text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {students
                        .filter(s => (!attendanceFilters.grade || s.grade === attendanceFilters.grade) && (!attendanceFilters.class || s.class === attendanceFilters.class))
                        .map((student) => (
                        <tr key={student.id} className="even:bg-gray-50/50 hover:bg-indigo-50/30 transition-all">
                          <td className="px-6 py-4 font-medium text-gray-900">{student.name}</td>
                          <td className="px-6 py-4 text-gray-500 text-sm">{student.roll_no}</td>
                          <td className="px-6 py-4 text-gray-500 text-sm">{student.class}-{student.section}</td>
                          <td className="px-6 py-4">
                            <div className="flex justify-center gap-2">
                              {['Present', 'Absent', 'Late'].map((status) => (
                                <button
                                  key={status}
                                  onClick={() => setAttendanceRecords({
                                    ...attendanceRecords,
                                    [student.id]: status as any
                                  })}
                                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                                    attendanceRecords[student.id] === status
                                      ? status === 'Present' ? 'bg-emerald-100 text-emerald-600' :
                                        status === 'Absent' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                                      : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                  }`}
                                >
                                  {status}
                                </button>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                  <h3 className="font-bold text-gray-900">Attendance Report - {new Date(attendanceDate).toLocaleDateString()}</h3>
                  <button 
                    onClick={fetchAttendanceReport}
                    className="text-primary hover:underline text-sm font-bold flex items-center gap-2"
                  >
                    <Search size={16} /> Refresh Report
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                        <th className="px-6 py-4 font-medium">Student Name</th>
                        <th className="px-6 py-4 font-medium">Computer Number</th>
                        <th className="px-6 py-4 font-medium">Class</th>
                        <th className="px-6 py-4 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {attendanceReport.map((record, i) => (
                        <tr key={record.id} className="even:bg-gray-50/50 hover:bg-indigo-50/30 transition-all">
                          <td className="px-6 py-4 font-medium text-gray-900">{record.student_name}</td>
                          <td className="px-6 py-4 text-gray-500 text-sm">{record.roll_no}</td>
                          <td className="px-6 py-4 text-gray-500 text-sm">{record.class}-{record.section}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              record.status === 'Present' ? 'bg-emerald-50 text-emerald-600' :
                              record.status === 'Absent' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                            }`}>
                              {record.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {attendanceReport.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-6 py-12 text-center text-gray-400">No records found for this date.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'homework' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Homework & Classwork</h3>
              {user.role === 'admin' && (
                <button 
                  onClick={() => setShowAddHomework(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition-all"
                >
                  <Plus size={18} /> Add Work
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {homework
                .filter(h => user.role === 'admin' || (h.grade === user.grade && h.class === user.class && h.section === user.section))
                .map((h) => (
                <motion.div 
                  key={h.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      h.type === 'Homework' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {h.type}
                    </span>
                    <span className="text-xs text-gray-400">Assigned: {new Date(h.date_assigned).toLocaleDateString()}</span>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">{h.subject}</h4>
                  <p className="text-xs text-gray-500 mb-3">Grade {h.grade} • {h.class}-{h.section}</p>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{h.content}</p>
                  {h.date_due && (
                    <div className="flex items-center gap-2 text-xs font-bold text-red-500">
                      <Clock size={14} /> Due: {new Date(h.date_due).toLocaleDateString()}
                    </div>
                  )}
                </motion.div>
              ))}
              {homework.filter(h => user.role === 'admin' || (h.grade === user.grade && h.class === user.class && h.section === user.section)).length === 0 && (
                <div className="col-span-full p-12 text-center text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
                  No homework or classwork assigned yet.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'datesheets' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <h3 className="font-bold text-gray-900">Exam Datesheets</h3>
              {user.role === 'admin' && (
                <button 
                  onClick={() => setShowAddDatesheet(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition-all text-sm"
                >
                  <Plus size={16} /> Add Exam
                </button>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-medium">Exam Name</th>
                    <th className="px-6 py-4 font-medium">Grade</th>
                    <th className="px-6 py-4 font-medium">Subject</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {datesheets
                    .filter(d => user.role === 'admin' || d.grade === user.grade)
                    .map((d) => (
                    <tr key={d.id} className="even:bg-gray-50/50 hover:bg-indigo-50/30 transition-all">
                      <td className="px-6 py-4 font-bold text-gray-900">{d.exam_name}</td>
                      <td className="px-6 py-4 text-gray-500 text-sm">{d.grade}</td>
                      <td className="px-6 py-4 text-primary font-medium">{d.subject}</td>
                      <td className="px-6 py-4 text-gray-500 text-sm">{new Date(d.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-gray-500 text-sm">{d.time}</td>
                    </tr>
                  ))}
                  {datesheets.filter(d => user.role === 'admin' || d.grade === user.grade).length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-400">No datesheets available for your grade.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'results' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Academic Results</h3>
              <p className="text-gray-500 text-sm">View your performance across all terms and subjects.</p>
            </div>

            {selectedStudent ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Award size={18} className="text-indigo-600" />
                    Subject-wise Performance
                  </h4>
                  <div className="space-y-4">
                    {selectedStudent?.grades?.map((g) => (
                      <div key={g.id} className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-gray-900">{g.subject}</span>
                          <span className="text-xs font-bold text-primary uppercase">{g.term}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                          <div 
                            className="bg-indigo-600 h-2 rounded-full transition-all duration-1000" 
                            style={{ width: `${(g.marks / g.total_marks) * 100}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Marks Obtained: {g.marks}</span>
                          <span>Total: {g.total_marks}</span>
                        </div>
                      </div>
                    ))}
                    {!selectedStudent?.grades?.length && <p className="text-center text-gray-400 py-8">No results available yet.</p>}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <History size={18} className="text-emerald-600" />
                    Result Summary
                  </h4>
                  <div className="space-y-4">
                    <div className="p-6 bg-emerald-50 rounded-2xl text-center">
                      <p className="text-emerald-600 text-sm font-bold uppercase tracking-wider mb-1">Overall Percentage</p>
                      <h2 className="text-4xl font-bold text-emerald-700">
                        {selectedStudent?.grades?.length 
                          ? (selectedStudent.grades.reduce((acc, g) => acc + (g.marks / g.total_marks), 0) / selectedStudent.grades.length * 100).toFixed(1)
                          : '0.0'}%
                      </h2>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-xl text-center">
                        <p className="text-gray-500 text-xs mb-1">Total Subjects</p>
                        <p className="text-xl font-bold text-gray-900">{selectedStudent?.grades?.length || 0}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl text-center">
                        <p className="text-gray-500 text-xs mb-1">Attendance</p>
                        <p className="text-xl font-bold text-gray-900">{selectedStudent?.attendance_percentage?.toFixed(1) || '0.0'}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white p-12 text-center text-gray-400 rounded-2xl border border-dashed border-gray-200">
                {user.role === 'admin' 
                  ? 'Please select a student from the "Students" tab to view or manage their results.'
                  : 'Loading your results...'}
              </div>
            )}
          </div>
        )}

        {activeTab === 'about' && (
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-gray-900">About Shahwilayat Public School</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Shahwilayat Public School is committed to providing a nurturing environment where students can achieve academic excellence and personal growth. Our mission is to empower the next generation with knowledge, values, and skills to lead a meaningful life.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <GraduationCap size={32} />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Excellence</h4>
                <p className="text-gray-500 text-sm">Striving for the highest standards in education and character.</p>
              </div>
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Users size={32} />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Community</h4>
                <p className="text-gray-500 text-sm">Building strong bonds between students, teachers, and parents.</p>
              </div>
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
                <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <LayoutDashboard size={32} />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Innovation</h4>
                <p className="text-gray-500 text-sm">Embracing modern technology for a better learning experience.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                  <MapPin size={24} />
                </div>
                <h4 className="font-bold text-gray-900 mb-2 text-xl">Our Location</h4>
                <p className="text-gray-500 leading-relaxed">
                  Block 13, Gulistan-e-Jauhar, Karachi, Pakistan. <br />
                  Our campus is equipped with modern facilities and a secure environment for all students.
                </p>
              </div>
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                  <Globe size={24} />
                </div>
                <h4 className="font-bold text-gray-900 mb-2 text-xl">Official Website</h4>
                <p className="text-gray-500 leading-relaxed mb-6">
                  Visit our official website for more information about admissions, events, and academic programs.
                </p>
                <a 
                  href="https://shahwilayat.edu.pk/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-accent transition-all shadow-lg shadow-primary/10"
                >
                  Visit Website <ExternalLink size={18} />
                </a>
              </div>
            </div>

            <div className="bg-primary rounded-3xl p-8 text-white shadow-xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-white/20 rounded-2xl">
                  <Globe size={32} />
                </div>
                <h3 className="text-2xl font-bold">Always Accessible</h3>
              </div>
              <p className="text-indigo-100 leading-relaxed mb-6">
                Our portal is designed to be available 24/7. You can access it from anywhere using your unique URL. Whether you're at school or at home, your data is always secure and up-to-date.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/10 p-4 rounded-2xl border border-white/20">
                  <h5 className="font-bold mb-1">Persistent Access</h5>
                  <p className="text-sm text-indigo-100">The app stays open and accessible via its URL even when you're away.</p>
                </div>
                <div className="bg-white/10 p-4 rounded-2xl border border-white/20">
                  <h5 className="font-bold mb-1">Secure Login</h5>
                  <p className="text-sm text-indigo-100">Use your Computer Number and Password to access your personal wallet.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <>
            <div className="mb-6 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-wrap gap-4 items-center">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search students by name or roll no..." 
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <select 
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 outline-none text-sm focus:ring-2 focus:ring-indigo-500/20"
                  value={studentFilters.grade}
                  onChange={(e) => setStudentFilters({...studentFilters, grade: e.target.value})}
                >
                  <option value="">All Grades</option>
                  {[...new Set(students.map(s => s.grade))].sort().map(g => <option key={g} value={g}>{g}</option>)}
                </select>
                <select 
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 outline-none text-sm focus:ring-2 focus:ring-indigo-500/20"
                  value={studentFilters.class}
                  onChange={(e) => setStudentFilters({...studentFilters, class: e.target.value})}
                >
                  <option value="">All Classes</option>
                  {[...new Set(students.map(s => s.class))].sort().map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select 
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 outline-none text-sm focus:ring-2 focus:ring-indigo-500/20"
                  value={studentFilters.section}
                  onChange={(e) => setStudentFilters({...studentFilters, section: e.target.value})}
                >
                  <option value="">All Sections</option>
                  {[...new Set(students.map(s => s.section))].sort().map(sec => <option key={sec} value={sec}>{sec}</option>)}
                </select>
                {(studentFilters.grade || studentFilters.class || studentFilters.section || searchQuery) && (
                  <button 
                    onClick={() => {
                      setStudentFilters({ grade: '', class: '', section: '' });
                      setSearchQuery('');
                    }}
                    className="text-primary text-sm font-bold hover:underline"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">Student Name</th>
                  <th className="px-6 py-4 font-medium">Roll No</th>
                  <th className="px-6 py-4 font-medium">Computer No</th>
                  <th className="px-6 py-4 font-medium">Class</th>
                  <th className="px-6 py-4 font-medium">Section</th>
                  <th className="px-6 py-4 font-medium">Balance</th>
                  <th className="px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="even:bg-gray-50/50 hover:bg-primary/5 transition-all group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs overflow-hidden border border-gray-100">
                          {student.photo_url ? (
                            <img src={student.photo_url} alt={student.name} className="w-full h-full object-cover" />
                          ) : (
                            student.name?.charAt(0) || '?'
                          )}
                        </div>
                        <span className="font-medium text-gray-900">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm font-mono">{student.roll_no}</td>
                    <td className="px-6 py-4 text-gray-500 text-sm font-mono">{student.computer_number || 'N/A'}</td>
                    <td className="px-6 py-4 text-gray-500 text-sm">{student.class}</td>
                    <td className="px-6 py-4 text-gray-500 text-sm">{student.section}</td>
                    <td className="px-6 py-4">
                      <span className={`font-bold ${(student.balance ?? 0) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        Rs. {student.balance?.toLocaleString() ?? '0'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={async () => {
                            const res = await fetch(`${BASE_URL}/api/students/${student.id}`);
                            const data = await res.json();
                            setSelectedStudent(data);
                          }}
                          className="text-primary hover:text-accent font-medium text-sm flex items-center gap-1"
                        >
                          View Details <ChevronRight size={16} />
                        </button>
                        {user.role === 'admin' && (
                          <button 
                            onClick={() => {
                              setSelectedStudent(student);
                              setShowAddTransaction(true);
                            }}
                            className="text-emerald-600 hover:text-emerald-800 font-medium text-sm flex items-center gap-1"
                          >
                            <Plus size={14} /> Transaction
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredStudents.length === 0 && (
              <div className="p-12 text-center text-gray-400">No students found</div>
            )}
          </div>
          </>
        )}

        {activeTab === 'finance' && (
          <div className="space-y-6">
            {user.role === 'admin' ? (
              <>
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-900">Financial Overview</h3>
                  <div className="flex gap-2">
                    <button 
                      onClick={async () => {
                        if (confirm('Are you sure you want to distribute the current surplus (Total Credit - Total Debit) among all stakeholders?')) {
                          try {
                            const res = await fetch(`${BASE_URL}/api/distribute-surplus`, { method: 'POST' });
                            const data = await res.json();
                            if (res.ok) {
                              showToast(`Successfully distributed Rs. ${data.amount} among ${data.count} recipients.`);
                              fetchData();
                            } else {
                              showToast(data.error, 'error');
                            }
                          } catch (err) {
                            showToast('Failed to distribute surplus', 'error');
                          }
                        }
                      }}
                      className="bg-emerald-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
                    >
                      <Gift size={18} /> Distribute Surplus
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedStudent(null);
                        setShowAddTransaction(true);
                      }}
                      className="bg-primary text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-accent transition-all shadow-lg shadow-primary/20"
                    >
                      <Plus size={18} /> New Entry
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <p className="text-gray-500 text-sm mb-1">Total Credit</p>
                    <h3 className="text-2xl font-bold text-emerald-600">Rs. {financeSummary.totalCredit?.toLocaleString() ?? '0'}</h3>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <p className="text-gray-500 text-sm mb-1">Total Debit</p>
                    <h3 className="text-2xl font-bold text-red-600">Rs. {financeSummary.totalDebit?.toLocaleString() ?? '0'}</h3>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <p className="text-gray-500 text-sm mb-1">Net Balance</p>
                    <h3 className={`text-2xl font-bold ${(financeSummary.totalCredit - financeSummary.totalDebit) >= 0 ? 'text-indigo-600' : 'text-red-600'}`}>
                      Rs. {(financeSummary.totalCredit - financeSummary.totalDebit)?.toLocaleString() ?? '0'}
                    </h3>
                  </div>
                </div>
              </>
            ) : (
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm text-center">
                  <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                    <Wallet size={40} />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900">My Wallet</h3>
                  <p className="text-gray-500 text-sm">Manage your school funds and spending</p>
                  
                  <div className="mt-8 p-6 bg-gray-50 rounded-3xl border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Available Balance</p>
                    <h2 className="text-4xl font-black text-primary">Rs. {selectedStudent?.balance?.toLocaleString() ?? '0'}</h2>
                    <button 
                      onClick={() => setShowTopUp(true)}
                      className="mt-4 w-full bg-primary text-white py-3 rounded-2xl font-bold hover:bg-accent transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                    >
                      <Plus size={20} /> Top Up Wallet
                    </button>
                  </div>
                </div>

                {Object.keys(studentFinanceBreakdown).length > 0 && (
                  <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <h4 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <PieChart className="text-indigo-600" size={20} /> Spending Breakdown
                    </h4>
                    <div className="h-64 mb-8">
                      <ResponsiveContainer width="100%" height="100%">
                        <RePieChart>
                          <Pie
                            data={Object.entries(studentFinanceBreakdown).map(([name, value]) => ({ name, value }))}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {Object.entries(studentFinanceBreakdown).map((_, index) => (
                              <Cell key={`cell-${index}`} fill={['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index % 5]} />
                            ))}
                          </Pie>
                          <ReTooltip />
                        </RePieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(studentFinanceBreakdown).map(([type, amount], index) => (
                        <div key={type} className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index % 5] }}></div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{type}</p>
                          </div>
                          <p className="text-lg font-black text-gray-900">Rs. {amount.toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button 
                  onClick={downloadStatement}
                  className="w-full bg-white border-2 border-primary text-primary py-4 rounded-2xl font-bold hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
                >
                  <FileText size={20} /> Download Statement
                </button>

                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                  <h4 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <History className="text-indigo-600" size={20} /> Transaction History
                  </h4>
                  <div className="space-y-4">
                    {transactions.filter(t => t.student_id === user.student_id).map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100/50">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${tx.type === 'credit' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                            {tx.type === 'credit' ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{tx.description}</p>
                            <p className="text-[10px] text-gray-400 font-medium">{new Date(tx.date).toLocaleDateString()} • {tx.fee_type}</p>
                          </div>
                        </div>
                        <span className={`font-bold text-sm ${tx.type === 'credit' ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {tx.type === 'credit' ? '+' : '-'} Rs. {tx.amount?.toLocaleString()}
                        </span>
                      </div>
                    ))}
                    {transactions.filter(t => t.student_id === user.student_id).length === 0 && (
                      <div className="text-center py-12 text-gray-400">No transactions yet</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {user.role === 'admin' && (
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-500 mb-1 uppercase">Filter by Student</label>
                    <select 
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                      value={financeFilters.student_id}
                      onChange={e => setFinanceFilters({...financeFilters, student_id: e.target.value})}
                    >
                      <option value="">All Students</option>
                      {students.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.roll_no})</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-500 mb-1 uppercase">Start Date</label>
                    <input 
                      type="date" 
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                      value={financeFilters.start_date}
                      onChange={e => setFinanceFilters({...financeFilters, start_date: e.target.value})}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-500 mb-1 uppercase">End Date</label>
                    <input 
                      type="date" 
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                      value={financeFilters.end_date}
                      onChange={e => setFinanceFilters({...financeFilters, end_date: e.target.value})}
                    />
                  </div>
                  <div className="flex items-end">
                    <button 
                      onClick={() => setFinanceFilters({ student_id: '', start_date: '', end_date: '' })}
                      className="px-4 py-2 text-gray-500 hover:text-indigo-600 text-sm font-medium"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                        <th className="px-6 py-4 font-medium">Date</th>
                        <th className="px-6 py-4 font-medium">Student</th>
                        <th className="px-6 py-4 font-medium">Type</th>
                        <th className="px-6 py-4 font-medium">Fee Type</th>
                        <th className="px-6 py-4 font-medium">Amount</th>
                        <th className="px-6 py-4 font-medium">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredTransactions.map((tx, index) => (
                        <tr key={`${tx.id}-${index}`} className="even:bg-gray-50/50 hover:bg-indigo-50/30 transition-all">
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {new Date(tx.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-medium text-gray-900">{tx.student_name}</p>
                            <p className="text-xs text-gray-500">{tx.roll_no}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                              tx.type === 'credit' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                            }`}>
                              {tx.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 capitalize">{tx.fee_type}</td>
                          <td className={`px-6 py-4 font-bold ${tx.type === 'credit' ? 'text-emerald-600' : 'text-red-600'}`}>
                            Rs. {tx.amount?.toLocaleString() ?? '0'}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">{tx.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredTransactions.length === 0 && (
                    <div className="p-12 text-center text-gray-400">No transactions found</div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        </div>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {showAddStudent && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-primary text-white">
                <h3 className="text-xl font-bold">Add New Student</h3>
                <button onClick={() => setShowAddStudent(false)} className="text-white/80 hover:text-white">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleAddStudent} className="p-6 space-y-4">
                <div className="flex justify-center mb-4">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-2xl bg-gray-100 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
                      {isUploadingPhoto ? (
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      ) : newStudent.photo_url ? (
                        <img src={newStudent.photo_url} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <Camera className="text-gray-400" size={32} />
                      )}
                    </div>
                    <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-2xl">
                      <Camera className="text-white" size={24} />
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => handleFileChange(e, (url) => setNewStudent({...newStudent, photo_url: url}))}
                      />
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                    value={newStudent.name}
                    onChange={e => setNewStudent({...newStudent, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                      value={newStudent.roll_no}
                      onChange={e => setNewStudent({...newStudent, roll_no: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Computer Number</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                      value={newStudent.computer_number}
                      onChange={e => setNewStudent({...newStudent, computer_number: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                      value={newStudent.grade}
                      onChange={e => setNewStudent({...newStudent, grade: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                      value={newStudent.class}
                      onChange={e => setNewStudent({...newStudent, class: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                      value={newStudent.section}
                      onChange={e => setNewStudent({...newStudent, section: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CNIC Number</label>
                    <input 
                      required
                      type="text" 
                      placeholder="42101-XXXXXXX-X"
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none"
                      value={newStudent.cnic}
                      onChange={e => setNewStudent({...newStudent, cnic: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input 
                      required
                      type="password" 
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none"
                      value={newStudent.password}
                      onChange={e => setNewStudent({...newStudent, password: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Parent Contact</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none"
                      value={newStudent.parent_contact}
                      onChange={e => setNewStudent({...newStudent, parent_contact: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Parent Email</label>
                    <input 
                      type="email" 
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none"
                      value={newStudent.parent_email}
                      onChange={e => setNewStudent({...newStudent, parent_email: e.target.value})}
                    />
                  </div>
                </div>
                <button type="submit" className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-accent transition-all mt-4 shadow-lg shadow-primary/20">
                  Register Student
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {selectedStudent && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[80vh] flex flex-col overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-primary text-white">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center font-bold text-xl overflow-hidden border-2 border-white/30">
                    {selectedStudent.photo_url ? (
                      <img src={selectedStudent.photo_url} alt={selectedStudent.name} className="w-full h-full object-cover" />
                    ) : (
                      selectedStudent.name?.charAt(0) || '?'
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{selectedStudent.name}</h3>
                    <p className="text-primary-100 text-sm">Roll: {selectedStudent.roll_no} • Comp: {selectedStudent.computer_number || 'N/A'} • Class: {selectedStudent.class}-{selectedStudent.section}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedStudent(null)} className="text-white/80 hover:text-white">
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <p className="text-gray-500 text-sm font-medium">Current Balance</p>
                    <p className={`text-2xl font-bold mt-1 ${(selectedStudent.balance ?? 0) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      Rs. {selectedStudent.balance?.toLocaleString() ?? '0'}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <p className="text-gray-500 text-sm font-medium">Attendance</p>
                    <p className="text-2xl font-bold mt-1 text-primary">
                      {selectedStudent.attendance_percentage?.toFixed(1)}%
                    </p>
                  </div>
                  <div className="flex flex-col justify-center gap-2">
                    {user.role === 'admin' && (
                      <>
                        <button 
                          onClick={() => setShowAddTransaction(true)}
                          className="bg-primary text-white py-2 rounded-xl font-medium hover:bg-accent transition-all flex items-center justify-center gap-2"
                        >
                          <Plus size={18} /> New Transaction
                        </button>
                        <button 
                          onClick={() => setShowAddGrade(true)}
                          className="bg-emerald-600 text-white py-2 rounded-xl font-medium hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                        >
                          <Plus size={18} /> Add Grade
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Phone size={18} className="text-primary" />
                    Contact Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Parent Contact</p>
                      <p className="text-gray-900 font-medium">{selectedStudent.parent_contact || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Parent Email</p>
                      <p className="text-gray-900 font-medium">{selectedStudent.parent_email || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                {user.role === 'admin' && (
                  <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
                    <h4 className="font-bold text-primary mb-4 flex items-center gap-2">
                      <Lock size={18} />
                      Login Credentials
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-primary text-xs font-bold uppercase tracking-wider mb-1">CNIC (Username)</p>
                        <div className="flex items-center justify-between bg-white px-4 py-2 rounded-xl border border-primary/10">
                          <code className="text-sm font-mono text-primary">{selectedStudent.cnic}</code>
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(selectedStudent.cnic);
                              showToast('CNIC copied to clipboard');
                            }}
                            className="text-primary/40 hover:text-primary"
                          >
                            <Printer size={16} />
                          </button>
                        </div>
                      </div>
                      <div>
                        <p className="text-primary text-xs font-bold uppercase tracking-wider mb-1">Password</p>
                        <div className="flex items-center justify-between bg-white px-4 py-2 rounded-xl border border-primary/10">
                          <code className="text-sm font-mono text-primary">{selectedStudent.password}</code>
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(selectedStudent.password);
                              showToast('Password copied to clipboard');
                            }}
                            className="text-primary/40 hover:text-primary"
                          >
                            <Printer size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <History size={18} className="text-indigo-600" />
                      Financial History
                    </h4>
                    <div className="space-y-3">
                      {selectedStudent.transactions?.map((tx: Transaction) => (
                        <div key={tx.id} className="p-4 bg-white border border-gray-100 rounded-xl flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${tx.type === 'credit' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                              {tx.type === 'credit' ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{tx.description}</p>
                              <p className="text-xs text-gray-400 capitalize">{tx.fee_type} • {new Date(tx.date).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold text-sm ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                              {tx.type === 'credit' ? '+' : '-'} Rs. {tx.amount?.toLocaleString() ?? '0'}
                            </p>
                            <button className="text-[10px] text-indigo-600 hover:underline flex items-center gap-1 ml-auto">
                              <Printer size={10} /> Receipt
                            </button>
                          </div>
                        </div>
                      ))}
                      {!selectedStudent.transactions?.length && (
                        <p className="text-center text-gray-400 py-8">No transactions found</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <CheckCircle2 size={18} className="text-emerald-600" />
                      Academic Performance
                    </h4>
                    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500">
                          <tr>
                            <th className="px-4 py-2 font-medium">Subject</th>
                            <th className="px-4 py-2 font-medium">Marks</th>
                            <th className="px-4 py-2 font-medium">Term</th>
                            <th className="px-4 py-2 font-medium">Grade</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {selectedStudent.grades?.map((g) => {
                            const percentage = (g.marks / g.total_marks) * 100;
                            let grade = 'F';
                            if (percentage >= 90) grade = 'A+';
                            else if (percentage >= 80) grade = 'A';
                            else if (percentage >= 70) grade = 'B';
                            else if (percentage >= 60) grade = 'C';
                            else if (percentage >= 50) grade = 'D';
                            
                            return (
                              <tr key={g.id} className="even:bg-gray-50/50 hover:bg-indigo-50/30 transition-all">
                                <td className="px-4 py-2 font-medium">{g.subject}</td>
                                <td className="px-4 py-2">
                                  <div className="flex flex-col">
                                    <span>{g.marks}/{g.total_marks}</span>
                                    <span className="text-[10px] text-gray-400">{percentage.toFixed(1)}%</span>
                                  </div>
                                </td>
                                <td className="px-4 py-2 text-gray-500">{g.term}</td>
                                <td className="px-4 py-2">
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    grade.startsWith('A') ? 'bg-emerald-50 text-emerald-600' :
                                    grade === 'B' ? 'bg-blue-50 text-blue-600' :
                                    grade === 'C' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                                  }`}>
                                    {grade}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                      {!selectedStudent.grades?.length && (
                        <p className="text-center text-gray-400 py-8">No academic records yet.</p>
                      )}
                    </div>
                  </div>

                  <div className="lg:col-span-2">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Calendar size={18} className="text-blue-600" />
                      Attendance History
                    </h4>
                    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500">
                          <tr>
                            <th className="px-4 py-2 font-medium">Date</th>
                            <th className="px-4 py-2 font-medium">Status</th>
                            <th className="px-4 py-2 font-medium">Cumulative %</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {selectedStudent.attendance?.map((a, index, array) => {
                            // Calculate cumulative percentage up to this point (array is DESC by date)
                            const recordsFromThisPoint = array.slice(index);
                            const presentCount = recordsFromThisPoint.filter(r => r.status === 'Present').length;
                            const cumulativePercentage = (presentCount / recordsFromThisPoint.length) * 100;
                            
                            return (
                              <tr key={a.id} className="even:bg-gray-50/50 hover:bg-indigo-50/30 transition-all">
                                <td className="px-4 py-2 font-medium">{new Date(a.date).toLocaleDateString()}</td>
                                <td className="px-4 py-2">
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    a.status === 'Present' ? 'bg-emerald-50 text-emerald-600' :
                                    a.status === 'Absent' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                                  }`}>
                                    {a.status}
                                  </span>
                                </td>
                                <td className="px-4 py-2 text-gray-500 font-medium">{cumulativePercentage.toFixed(1)}%</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                      {(!selectedStudent.attendance || selectedStudent.attendance.length === 0) && (
                        <p className="text-center text-gray-400 py-8">No attendance records found.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {showAddGrade && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Add Academic Record</h3>
                <button onClick={() => setShowAddGrade(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleAddGrade} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                    value={newGrade.subject}
                    onChange={e => setNewGrade({...newGrade, subject: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Marks Obtained</label>
                    <input 
                      required
                      type="number" 
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                      value={newGrade.marks}
                      onChange={e => setNewGrade({...newGrade, marks: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Marks</label>
                    <input 
                      required
                      type="number" 
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                      value={newGrade.total_marks}
                      onChange={e => setNewGrade({...newGrade, total_marks: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Term / Semester</label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. Mid Term 2024"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none"
                    value={newGrade.term}
                    onChange={e => setNewGrade({...newGrade, term: e.target.value})}
                  />
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all mt-4">
                  Save Record
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {showAddHomework && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Assign Work</h3>
                <button onClick={() => setShowAddHomework(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleAddHomework} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select 
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none"
                      value={newHomework.type}
                      onChange={e => setNewHomework({...newHomework, type: e.target.value as any})}
                    >
                      <option value="Homework">Homework</option>
                      <option value="Classwork">Classwork</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none"
                      value={newHomework.subject}
                      onChange={e => setNewHomework({...newHomework, subject: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none"
                      value={newHomework.grade}
                      onChange={e => setNewHomework({...newHomework, grade: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none"
                      value={newHomework.class}
                      onChange={e => setNewHomework({...newHomework, class: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none"
                      value={newHomework.section}
                      onChange={e => setNewHomework({...newHomework, section: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content / Instructions</label>
                  <textarea 
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none"
                    value={newHomework.content}
                    onChange={e => setNewHomework({...newHomework, content: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date (Optional)</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none"
                    value={newHomework.date_due}
                    onChange={e => setNewHomework({...newHomework, date_due: e.target.value})}
                  />
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all mt-4">
                  Assign Work
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {showAddDatesheet && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Add Exam Schedule</h3>
                <button onClick={() => setShowAddDatesheet(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleAddDatesheet} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Exam Name</label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. Final Exams 2024"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none"
                    value={newDatesheet.exam_name}
                    onChange={e => setNewDatesheet({...newDatesheet, exam_name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none"
                      value={newDatesheet.grade}
                      onChange={e => setNewDatesheet({...newDatesheet, grade: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none"
                      value={newDatesheet.subject}
                      onChange={e => setNewDatesheet({...newDatesheet, subject: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input 
                      required
                      type="date" 
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none"
                      value={newDatesheet.date}
                      onChange={e => setNewDatesheet({...newDatesheet, date: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. 09:00 AM - 12:00 PM"
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none"
                      value={newDatesheet.time}
                      onChange={e => setNewDatesheet({...newDatesheet, time: e.target.value})}
                    />
                  </div>
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all mt-4">
                  Add to Datesheet
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {showAddSyllabus && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Add Syllabus</h3>
                <button onClick={() => setShowAddSyllabus(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleAddSyllabus} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none"
                    value={newSyllabus.subject}
                    onChange={e => setNewSyllabus({...newSyllabus, subject: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none"
                    value={newSyllabus.grade}
                    onChange={e => setNewSyllabus({...newSyllabus, grade: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content Summary</label>
                  <textarea 
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none"
                    value={newSyllabus.content}
                    onChange={e => setNewSyllabus({...newSyllabus, content: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Upload PDF Syllabus</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-indigo-500 transition-colors group">
                    <div className="space-y-1 text-center">
                      <FileText className="mx-auto h-12 w-12 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                          <span>{newSyllabus.file_url ? 'Change PDF' : 'Upload a file'}</span>
                          <input 
                            type="file" 
                            accept="application/pdf" 
                            className="sr-only" 
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setNewSyllabus({...newSyllabus, file_url: reader.result as string});
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PDF up to 10MB</p>
                      {newSyllabus.file_url && (
                        <div className="mt-2 text-xs text-emerald-600 font-bold flex items-center justify-center gap-1">
                          <CheckCircle2 size={14} /> PDF Attached
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all mt-4">
                  Save Syllabus
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {showSyllabusConfirm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[70] p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100"
            >
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText size={40} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Review Syllabus Upload</h3>
                <p className="text-gray-500 mb-8">Please confirm the details before finalizing the upload.</p>
                
                <div className="bg-gray-50 rounded-2xl p-6 text-left space-y-4 mb-8">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Subject</span>
                    <p className="text-gray-900 font-bold">{newSyllabus.subject}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Grade</span>
                    <p className="text-gray-900 font-bold">{newSyllabus.grade}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Content Summary</span>
                    <p className="text-gray-600 text-sm line-clamp-2">{newSyllabus.content}</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">PDF Attached</span>
                    {newSyllabus.file_url ? (
                      <span className="text-emerald-600 font-bold text-sm flex items-center gap-1">
                        <CheckCircle2 size={16} /> Yes
                      </span>
                    ) : (
                      <span className="text-amber-600 font-bold text-sm flex items-center gap-1">
                        <AlertCircle size={16} /> No
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setShowSyllabusConfirm(false)}
                    className="w-full py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-all border border-gray-100"
                  >
                    Go Back
                  </button>
                  <button 
                    onClick={confirmAddSyllabus}
                    className="w-full py-4 rounded-2xl font-bold text-white bg-primary hover:bg-accent shadow-lg shadow-primary/20 transition-all"
                  >
                    Confirm & Save
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {showAddSchedule && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Add Class Schedule</h3>
                <button onClick={() => setShowAddSchedule(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleAddSchedule} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
                    <select 
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none"
                      value={newSchedule.day}
                      onChange={e => setNewSchedule({...newSchedule, day: e.target.value})}
                    >
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none"
                      value={newSchedule.grade}
                      onChange={e => setNewSchedule({...newSchedule, grade: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time Slot</label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. 08:00 AM - 08:45 AM"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none"
                    value={newSchedule.time_slot}
                    onChange={e => setNewSchedule({...newSchedule, time_slot: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none"
                      value={newSchedule.subject}
                      onChange={e => setNewSchedule({...newSchedule, subject: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Teacher</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none"
                      value={newSchedule.teacher}
                      onChange={e => setNewSchedule({...newSchedule, teacher: e.target.value})}
                    />
                  </div>
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all mt-4">
                  Save Schedule
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {showAddOnlineClass && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Schedule Online Class</h3>
                <button onClick={() => setShowAddOnlineClass(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleAddOnlineClass} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none"
                      value={newOnlineClass.grade}
                      onChange={e => setNewOnlineClass({...newOnlineClass, grade: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none"
                      value={newOnlineClass.subject}
                      onChange={e => setNewOnlineClass({...newOnlineClass, subject: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Link</label>
                  <input 
                    required
                    type="url" 
                    placeholder="https://zoom.us/j/..."
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none"
                    value={newOnlineClass.link}
                    onChange={e => setNewOnlineClass({...newOnlineClass, link: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                  <input 
                    required
                    type="datetime-local" 
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none"
                    value={newOnlineClass.time}
                    onChange={e => setNewOnlineClass({...newOnlineClass, time: e.target.value})}
                  />
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all mt-4">
                  Schedule Class
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {showAddAdmin && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Add New Admin</h3>
                <button onClick={() => setShowAddAdmin(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleAddAdmin} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none"
                    value={newAdmin.name}
                    onChange={e => setNewAdmin({...newAdmin, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none"
                    value={newAdmin.username}
                    onChange={e => setNewAdmin({...newAdmin, username: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input 
                    required
                    type="password" 
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none"
                    value={newAdmin.password}
                    onChange={e => setNewAdmin({...newAdmin, password: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select 
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none"
                    value={newAdmin.role}
                    onChange={e => setNewAdmin({...newAdmin, role: e.target.value})}
                  >
                    <option value="admin">Administrator</option>
                    <option value="canteen">Canteen Staff</option>
                  </select>
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all mt-4">
                  Create Account
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {showAddTransaction && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">New Transaction</h3>
                <button onClick={() => setShowAddTransaction(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleAddTransaction} className="p-6 space-y-4">
                {!selectedStudent && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Student</label>
                    <select 
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none"
                      value={newTransaction.student_id}
                      onChange={e => setNewTransaction({...newTransaction, student_id: e.target.value})}
                    >
                      <option value="">Choose a student...</option>
                      {students.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.roll_no})</option>
                      ))}
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount (Rs.)</label>
                  <input 
                    required
                    type="number" 
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none"
                    value={newTransaction.amount}
                    onChange={e => setNewTransaction({...newTransaction, amount: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      type="button"
                      onClick={() => setNewTransaction({...newTransaction, type: 'credit'})}
                      className={`py-2 rounded-xl font-medium transition-all ${newTransaction.type === 'credit' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-500'}`}
                    >
                      Deposit
                    </button>
                    <button 
                      type="button"
                      onClick={() => setNewTransaction({...newTransaction, type: 'debit'})}
                      className={`py-2 rounded-xl font-medium transition-all ${newTransaction.type === 'debit' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-500'}`}
                    >
                      Withdraw / Fee
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fee Type</label>
                  <select 
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none"
                    value={newTransaction.fee_type}
                    onChange={e => setNewTransaction({...newTransaction, fee_type: e.target.value as any})}
                  >
                    <option value="tuition">Tuition Fee</option>
                    <option value="bus">Bus Fee</option>
                    <option value="activity">Activity Fee</option>
                    <option value="canteen">Canteen</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. Monthly Fee, Library Deposit"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none"
                    value={newTransaction.description}
                    onChange={e => setNewTransaction({...newTransaction, description: e.target.value})}
                  />
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all mt-4">
                  Complete Transaction
                </button>
              </form>
            </motion.div>
          </div>
        )}
        {showAddAnnouncement && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Post Announcement</h3>
                <button onClick={() => setShowAddAnnouncement(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleAddAnnouncement} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none"
                    value={newAnnouncement.title}
                    onChange={e => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select 
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none"
                      value={newAnnouncement.category}
                      onChange={e => setNewAnnouncement({...newAnnouncement, category: e.target.value as any})}
                    >
                      <option value="General">General</option>
                      <option value="Events">Events</option>
                      <option value="Academics">Academics</option>
                    </select>
                  </div>
                  <div className="flex items-end pb-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 text-indigo-600 rounded"
                        checked={newAnnouncement.is_featured}
                        onChange={e => setNewAnnouncement({...newAnnouncement, is_featured: e.target.checked})}
                      />
                      <span className="text-sm font-medium text-gray-700">Featured Story</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (Optional)</label>
                  <input 
                    type="url" 
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none"
                    value={newAnnouncement.image_url}
                    onChange={e => setNewAnnouncement({...newAnnouncement, image_url: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                  <textarea 
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none"
                    value={newAnnouncement.content}
                    onChange={e => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                  />
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all mt-4">
                  Publish Story
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {showResetPassword && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Reset Password</h3>
                <button onClick={() => setShowResetPassword(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleResetPassword} className="p-6 space-y-4">
                <div className="flex p-1 bg-gray-100 rounded-xl mb-4">
                  <button 
                    type="button"
                    onClick={() => setResetForm({...resetForm, type: 'student'})}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${resetForm.type === 'student' ? 'bg-white text-primary shadow-sm' : 'text-gray-500'}`}
                  >
                    Student
                  </button>
                  <button 
                    type="button"
                    onClick={() => setResetForm({...resetForm, type: 'admin'})}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${resetForm.type === 'admin' ? 'bg-white text-primary shadow-sm' : 'text-gray-500'}`}
                  >
                    Admin
                  </button>
                  <button 
                    type="button"
                    onClick={() => setResetForm({...resetForm, type: 'canteen'})}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${resetForm.type === 'canteen' ? 'bg-white text-primary shadow-sm' : 'text-gray-500'}`}
                  >
                    Canteen
                  </button>
                </div>

                <p className="text-xs text-gray-500 mb-4">
                  {resetForm.type === 'student' 
                    ? 'Provide your CNIC and Parent Contact number to reset your password.' 
                    : `Provide your ${resetForm.type} username to reset your password.`}
                </p>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {resetForm.type === 'student' ? 'CNIC Number' : 'Username'}
                  </label>
                  <input 
                    required
                    type="text" 
                    placeholder={resetForm.type === 'student' ? '12345-1234567-1' : 'Enter username'}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none"
                    value={resetForm.identifier}
                    onChange={e => setResetForm({...resetForm, identifier: e.target.value})}
                  />
                </div>

                {resetForm.type === 'student' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Parent Contact</label>
                    <input 
                      required
                      type="text" 
                      placeholder="0300-XXXXXXX"
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none"
                      value={resetForm.verification}
                      onChange={e => setResetForm({...resetForm, verification: e.target.value})}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input 
                    required
                    type="password" 
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none"
                    value={resetForm.new_password}
                    onChange={e => setResetForm({...resetForm, new_password: e.target.value})}
                  />
                </div>

                {resetMessage.text && (
                  <p className={`text-xs font-medium text-center ${resetMessage.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {resetMessage.text}
                  </p>
                )}

                <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all mt-4">
                  Reset Password
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {showQRScanner && (
          <QRScanner 
            onScan={(text) => {
              setShowQRScanner(false);
              showToast(`Scanned: ${text}`);
              // Handle the scan result here
            }}
            onClose={() => setShowQRScanner(false)}
          />
        )}

        {showTopUp && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-primary text-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Wallet size={20} />
                  </div>
                  <h3 className="text-xl font-bold">Top Up Wallet</h3>
                </div>
                <button onClick={() => setShowTopUp(false)} className="text-white/70 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleTopUp} className="p-8 space-y-6">
                <div className="text-center mb-6">
                  <p className="text-sm text-gray-500 mb-2">Current Balance</p>
                  <h4 className="text-3xl font-black text-gray-900">Rs. {selectedStudent?.balance?.toLocaleString() ?? '0'}</h4>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Amount to Add (Rs.)</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">Rs.</div>
                    <input 
                      required
                      type="number" 
                      min="100"
                      step="100"
                      placeholder="Enter amount"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-lg font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                      value={topUpAmount}
                      onChange={e => setTopUpAmount(e.target.value)}
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-2 font-medium italic">* Minimum top up amount is Rs. 100</p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[500, 1000, 2000].map(amount => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setTopUpAmount(amount.toString())}
                      className="py-2 px-4 border-2 border-gray-100 rounded-xl text-sm font-bold text-gray-600 hover:border-primary hover:text-primary transition-all"
                    >
                      +{amount}
                    </button>
                  ))}
                </div>

                <button 
                  type="submit" 
                  disabled={topUpProcessing || !topUpAmount || parseFloat(topUpAmount) < 100}
                  className="w-full bg-primary text-white py-4 rounded-2xl font-black hover:bg-accent transition-all shadow-xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {topUpProcessing ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                  {topUpProcessing ? 'Processing...' : 'Confirm Deposit'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
        {toast && (
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl shadow-2xl z-[100] flex items-center gap-3 font-bold text-sm ${
                toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
              }`}
            >
              {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              {toast.message}
            </motion.div>
          )}
      </AnimatePresence>
      <ChatBot studentData={selectedStudent} userType={user?.role || null} />
    </div>
  );
};

export default function App() {
  return <ShahwilayatApp />;
}
