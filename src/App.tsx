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
  LogIn,
  Lock,
  User as UserIcon,
  Home,
  Phone,
  MessageSquare,
  Mail,
  CalendarDays,
  FileCheck,
  Clock,
  Book,
  ClipboardList,
  Award,
  Bell,
  Trash2,
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
  Copy,
  Bot,
  Sparkles,
  RefreshCw,
  Hash
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
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
import { VoiceChat } from './components/VoiceChat';
import { QRScanner } from './components/QRScanner';
import { Logo } from './components/Logo';

// Use relative path for API calls so it works automatically on Vercel and local dev
const BASE_URL = '';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

const ShahwilayatApp = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'students' | 'finance' | 'fees' | 'canteen' | 'news' | 'mail' | 'syllabus' | 'schedules' | 'online' | 'attendance' | 'homework' | 'datesheets' | 'results' | 'about' | 'admins' | 'profile' | 'ai' | 'events'>('dashboard');
  const [showLaunchpad, setShowLaunchpad] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [loginForm, setLoginForm] = useState({ username: '', password: '', email: '' });
  const [loginError, setLoginError] = useState('');
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [multipleProfiles, setMultipleProfiles] = useState<any[] | null>(null);
  const [serverStatus, setServerStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [syllabus, setSyllabus] = useState<Syllabus[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [feeStructures, setFeeStructures] = useState<any[]>([]);
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
  const [showAddFeeStructure, setShowAddFeeStructure] = useState(false);
  const [showAddMessage, setShowAddMessage] = useState(false);
  const [showReceipt, setShowReceipt] = useState<Transaction | null>(null);
  const [messageForm, setMessageForm] = useState({ receiver_id: '', title: '', content: '' });
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
  const [newStudent, setNewStudent] = useState({ name: '', roll_no: '', grade: '', class: '', section: '', parent_contact: '', parent_email: '', emergency_contact: '', academic_notes: '', medical_notes: '', photo_url: '', cnic: '', computer_number: '', password: '' });
  const [newTransaction, setNewTransaction] = useState({ student_id: '', amount: '', type: 'credit' as 'credit' | 'debit', fee_type: 'tuition' as any, description: '' });
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '', category: 'General' as any, target_role: 'all', image_url: '', is_featured: false });
  const [newGrade, setNewGrade] = useState({ subject: '', marks: '', total_marks: '', term: '' });
  const [newHomework, setNewHomework] = useState({ type: 'Homework' as 'Homework' | 'Classwork', grade: '', class: '', section: '', subject: '', content: '', date_due: '' });
  const [newDatesheet, setNewDatesheet] = useState({ exam_name: '', grade: '', subject: '', date: '', time: '' });
  const [newSyllabus, setNewSyllabus] = useState({ subject: '', grade: '', content: '', file_url: '' });
  const [newSchedule, setNewSchedule] = useState({ grade: '', day: 'Monday', time_slot: '', subject: '', teacher: '', location: '', is_weekend: false });
  const [newOnlineClass, setNewOnlineClass] = useState({ grade: '', subject: '', link: '', time: '' });
  const [newAdmin, setNewAdmin] = useState<{name: string, username: string, password: string, role: string, student_id?: number, teacher_id?: number}>({ name: '', username: '', password: '', role: 'admin' });
  const [newFeeStructure, setNewFeeStructure] = useState({ grade: '', amount: '', frequency: 'Monthly', description: '' });
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

  const [aiInput, setAiInput] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;
    
    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: aiInput,
      });
      setAiResponse(response.text || 'No response generated.');
    } catch (error) {
      console.error('AI Error:', error);
      setAiResponse('Error connecting to Gemini AI.');
    } finally {
      setIsAiLoading(false);
    }
  };

  useEffect(() => {
    const checkServer = async () => {
      try {
        const res = await fetch(`${BASE_URL}/health`);
        if (res.ok) setServerStatus('online');
        else setServerStatus('offline');
      } catch (e) {
        setServerStatus('offline');
      }
    };
    checkServer();
    const interval = setInterval(checkServer, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem('swps_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      if (parsedUser.role === 'student' && !window.location.hash) {
        setActiveTab('dashboard');
      }
    }
    
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      setActiveTab(hash as any);
    }
    
    const handleHashChange = () => {
      const newHash = window.location.hash.replace('#', '');
      if (newHash) {
        setActiveTab(newHash as any);
      }
    };
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (activeTab) {
      window.history.replaceState(null, '', `#${activeTab}`);
    }
  }, [activeTab]);

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
    
    const username = loginForm.username.trim();
    const password = loginForm.password.trim();

    try {
      const res = await fetch(`${BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
        localStorage.setItem('swps_user', JSON.stringify(userData));
        setShowLaunchpad(true);
        if (userData.role === 'student' && userData.student_id) {
          fetchStudentDetails(userData.student_id);
        }
      } else {
        let errorMessage = 'Invalid credentials';
        try {
          const errorData = await res.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          errorMessage = `Server error: ${res.status}. Please check if the server is running.`;
        }
        setLoginError(errorMessage);
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Connection error. The server might be offline or starting up. Please wait a moment and try again.');
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
        { key: 'stats', url: `${BASE_URL}/api/stats` },
        { key: 'students', url: `${BASE_URL}/api/students` },
        { key: 'announcements', url: `${BASE_URL}/api/announcements` },
        { key: 'syllabus', url: `${BASE_URL}/api/syllabus` },
        { key: 'schedules', url: `${BASE_URL}/api/schedules` },
        { key: 'onlineClasses', url: `${BASE_URL}/api/online-classes` },
        { key: 'homework', url: `${BASE_URL}/api/homework-classwork` },
        { key: 'datesheets', url: `${BASE_URL}/api/datesheets` },
        { key: 'transactions', url: `${BASE_URL}/api/transactions` },
        { key: 'admins', url: `${BASE_URL}/api/admins` },
        { key: 'teachers', url: `${BASE_URL}/api/teachers` },
        { key: 'messages', url: `${BASE_URL}/api/messages?userId=${user?.id}&role=${user?.role}` },
        { key: 'feeStructures', url: `${BASE_URL}/api/fee-structures` }
      ];
      
      const results = await Promise.all(endpoints.map(async (endpoint) => {
        try {
          const res = await fetch(endpoint.url);
          if (!res.ok) return null;
          const contentType = res.headers.get("content-type");
          if (!contentType || !contentType.includes("application/json")) return null;
          return await res.json();
        } catch (e) {
          console.error(`Failed to fetch ${endpoint.key}:`, e);
          return null;
        }
      }));

      if (results[0]) setStats(results[0]);
      if (results[1]) setStudents(results[1]);
      if (results[2]) setAnnouncements(results[2]);
      if (results[3]) setSyllabus(results[3]);
      if (results[4]) setSchedules(results[4]);
      if (results[5]) setOnlineClasses(results[5]);
      if (results[6]) setHomework(results[6]);
      if (results[7]) setDatesheets(results[7]);
      if (results[8]) setTransactions(results[8]);
      if (results[9]) setAdmins(results[9]);
      if (results[10]) setTeachers(results[10]);
      if (results[11]) setMessages(results[11]);
      if (results[12]) setFeeStructures(results[12]);
    } catch (error: any) {
      console.error('Error in fetchData:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFeeStructure = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/api/fee-structures`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFeeStructure)
      });
      if (res.ok) {
        setShowAddFeeStructure(false);
        setNewFeeStructure({ grade: '', amount: '', frequency: 'Monthly', description: '' });
        fetchData();
        showToast('Fee structure added successfully!');
      }
    } catch (error) {
      console.error('Error adding fee structure:', error);
    }
  };

  const handleDeleteFeeStructure = async (id: number) => {
    try {
      const res = await fetch(`${BASE_URL}/api/fee-structures/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
        showToast('Fee structure deleted!');
      }
    } catch (error) {
      console.error('Error deleting fee structure:', error);
    }
  };

  const handleSendFeeReminders = async (grade?: string) => {
    try {
      const res = await fetch(`${BASE_URL}/api/fee-reminders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grade })
      });
      if (res.ok) {
        const data = await res.json();
        showToast(`Sent ${data.count} reminders!`);
      }
    } catch (error) {
      console.error('Error sending reminders:', error);
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
        setNewStudent({ name: '', roll_no: '', grade: '', class: '', section: '', parent_contact: '', parent_email: '', emergency_contact: '', academic_notes: '', medical_notes: '', photo_url: '', cnic: '', computer_number: '', password: '' });
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
        setNewAnnouncement({ title: '', content: '', category: 'General' as any, target_role: 'all', image_url: '', is_featured: false });
        fetchData();
        showToast('Announcement published!');
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
        setNewSchedule({ grade: '', day: 'Monday', time_slot: '', subject: '', teacher: '', location: '', is_weekend: false });
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
        setNewAdmin({ name: '', username: '', password: '', role: 'admin', student_id: undefined, teacher_id: undefined });
        fetchData();
        showToast('Account created successfully!', 'success');
      } else {
        showToast(data.error || 'Failed to add admin', 'error');
      }
    } catch (error) {
      console.error('Error adding admin:', error);
      showToast('Connection error', 'error');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_id: user?.id,
          sender_role: user?.role,
          receiver_id: messageForm.receiver_id || null,
          title: messageForm.title,
          content: messageForm.content
        })
      });
      if (res.ok) {
        setShowAddMessage(false);
        setMessageForm({ receiver_id: '', title: '', content: '' });
        fetchData();
        showToast('Message sent successfully!', 'success');
      } else {
        const data = await res.json();
        showToast(data.error || 'Failed to send message', 'error');
      }
    } catch (error) {
      console.error('Error sending message:', error);
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

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return showToast('Passwords do not match', 'error');
    }
    try {
      const res = await fetch(`${BASE_URL}/api/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          role: user.role,
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword
        })
      });
      const data = await res.json();
      if (res.ok) {
        showToast('Password updated successfully');
        setShowPasswordChange(false);
        setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        showToast(data.error || 'Failed to update password', 'error');
      }
    } catch (err) {
      showToast('Connection error', 'error');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 py-12 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px]" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="premium-card mb-8">
            <div className="text-center mb-10">
              <div className="bg-slate-50 p-5 rounded-[2rem] shadow-inner inline-block mb-6 border border-slate-100">
                <Logo className="w-20 h-20" />
              </div>
              <h1 className="text-4xl font-black text-dark tracking-tighter mb-2">Shahwilayat</h1>
              <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[10px]">Public School Portal</p>
              
              <div className="flex items-center justify-center gap-2 mt-6">
                <div className={`w-2 h-2 rounded-full ${serverStatus === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  System {serverStatus === 'online' ? 'Online' : serverStatus === 'checking' ? 'Connecting...' : 'Offline'}
                </span>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Username
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                      required
                      type="text" 
                      className="input-premium pl-14"
                      placeholder="Enter Username"
                      value={loginForm.username}
                      onChange={e => setLoginForm({...loginForm, username: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                      required
                      type="password" 
                      className="input-premium pl-14"
                      placeholder="••••••••"
                      value={loginForm.password}
                      onChange={e => setLoginForm({...loginForm, password: e.target.value})}
                    />
                  </div>
                </div>
                
                {loginError && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600"
                  >
                    <AlertCircle size={18} />
                    <p className="text-xs font-bold">{loginError}</p>
                  </motion.div>
                )}

                <button type="submit" className="btn-premium w-full py-4 text-base">
                  Sign In to Portal
                </button>
              </form>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mt-12">
          {[
            { icon: Info, title: 'About Us', desc: 'A premier institution dedicated to academic excellence and holistic development.', color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { icon: MapPin, title: 'Location', desc: 'Block 13, Federal B Area, Karachi. Modern facilities in a secure environment.', color: 'text-cyan-600', bg: 'bg-cyan-50' },
            { icon: Globe, title: 'Website', desc: 'Visit our official website for admissions and academic programs.', color: 'text-rose-600', bg: 'bg-rose-50', link: 'https://shahwilayat.edu.pk/' }
          ].map((item, i) => (
            <motion.div 
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (i * 0.1) }}
              className="premium-card !p-6 flex flex-col items-center text-center group"
            >
              <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <item.icon size={28} />
              </div>
              <h4 className="font-black text-dark mb-2">{item.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">{item.desc}</p>
              {item.link && (
                <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-primary font-black text-[10px] uppercase tracking-widest hover:underline flex items-center gap-1">
                  Visit Site <ExternalLink size={12} />
                </a>
              )}
            </motion.div>
          ))}
        </div>

        <p className="text-center text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mt-16">
          © 2026 Shahwilayat Public School. All rights reserved.
        </p>
      </div>
    );
  }

  const apps = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['admin', 'student', 'canteen', 'teacher'], color: 'bg-indigo-500 text-white' },
    { id: 'events', icon: Calendar, label: 'Events', roles: ['admin', 'student', 'canteen', 'teacher'], color: 'bg-rose-500 text-white' },
    { id: 'students', icon: Users, label: 'Students', roles: ['admin', 'canteen', 'teacher'], color: 'bg-blue-500 text-white' },
    { id: 'fees', icon: FileCheck, label: 'Fee Management', roles: ['admin'], color: 'bg-emerald-500 text-white' },
    { id: 'finance', icon: Wallet, label: user?.role === 'student' ? 'My Wallet' : 'Finance', roles: ['admin', 'canteen', 'student'], color: 'bg-amber-500 text-white' },
    { id: 'canteen', icon: Coffee, label: 'Canteen', roles: ['admin', 'canteen'], color: 'bg-orange-500 text-white' },
    { id: 'admins', icon: Settings, label: 'Admins', roles: ['admin'], color: 'bg-slate-700 text-white' },
    { id: 'news', icon: Megaphone, label: 'News Feed', roles: ['admin', 'student', 'canteen', 'teacher'], color: 'bg-purple-500 text-white' },
    { id: 'mail', icon: Mail, label: 'Mailbox', roles: ['admin', 'student', 'teacher'], color: 'bg-cyan-500 text-white' },
    { id: 'attendance', icon: FileCheck, label: 'Attendance', roles: ['admin', 'student', 'teacher'], color: 'bg-green-500 text-white' },
    { id: 'homework', icon: ClipboardList, label: 'Homework', roles: ['admin', 'student', 'teacher'], color: 'bg-indigo-600 text-white' },
    { id: 'datesheets', icon: CalendarDays, label: 'Datesheets', roles: ['admin', 'student', 'teacher'], color: 'bg-rose-600 text-white' },
    { id: 'results', icon: Award, label: 'Results', roles: ['admin', 'student', 'teacher'], color: 'bg-amber-600 text-white' },
    { id: 'syllabus', icon: BookOpen, label: 'Syllabus', roles: ['admin', 'student', 'teacher'], color: 'bg-emerald-600 text-white' },
    { id: 'schedules', icon: Clock, label: 'Schedules', roles: ['admin', 'student', 'teacher'], color: 'bg-blue-600 text-white' },
    { id: 'online', icon: Video, label: 'Online Classes', roles: ['admin', 'student', 'teacher'], color: 'bg-cyan-600 text-white' },
    { id: 'ai', icon: Bot, label: 'AI Assistant', roles: ['admin', 'student', 'canteen', 'teacher'], color: 'bg-primary text-white' },
    { id: 'about', icon: Info, label: 'About Us', roles: ['admin', 'student', 'canteen', 'teacher'], color: 'bg-slate-800 text-white' },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col bg-mesh">
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        <header className="bg-white/60 backdrop-blur-xl border-b border-white/40 px-8 py-6 flex justify-between items-center sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowLaunchpad(true)}
              className="bg-white/80 p-2 rounded-xl border border-white/60 text-slate-400 hover:text-primary hover:bg-white hover:shadow-xl transition-all flex items-center gap-2 group backdrop-blur-md"
            >
              <Home size={18} className="group-hover:scale-110 transition-transform" />
            </button>
            <div className="h-6 w-px bg-slate-200 mx-1" />
            <h2 className="text-xl font-black text-dark tracking-tight">
              {showLaunchpad ? (
                <span className="gradient-text">Shahwilayat</span>
              ) : (
                <span className="capitalize">{activeTab}</span>
              )}
            </h2>
          </div>
          
          <div className="flex items-center gap-2">
            {user.role !== 'guest' && (
              <button 
                onClick={() => setShowPasswordChange(true)}
                className="p-2 bg-white/80 text-slate-400 rounded-xl hover:text-primary hover:bg-white transition-all border border-white/60 backdrop-blur-md"
                title="Change Password"
              >
                <Lock size={18} />
              </button>
            )}
            <button onClick={() => fetchData()} className="p-2 bg-white/80 text-slate-400 rounded-xl hover:text-primary hover:bg-white transition-all border border-white/60 backdrop-blur-md">
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
            <button 
              onClick={handleLogout}
              className="p-2 bg-rose-50/80 text-rose-600 rounded-xl hover:bg-rose-100 transition-all border border-rose-100/60 backdrop-blur-md"
              title="Sign Out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <div className="p-4 max-w-[1600px] mx-auto">
          {showLaunchpad ? (
            <div className="space-y-8 py-4">
              <div className="text-center space-y-4 max-w-2xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white p-4 rounded-[2rem] shadow-xl shadow-primary/10 inline-block mb-2 border border-white relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-[2rem] blur-xl group-hover:blur-2xl transition-all" />
                  <Logo className="w-16 h-16 relative z-10" />
                </motion.div>
                <div className="space-y-1">
                  <h1 className="text-3xl font-black text-dark tracking-tighter leading-tight">
                    Welcome, <span className="gradient-text">{user.name.split(' ')[0]}</span>
                  </h1>
                  <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[8px]">Shahwilayat Public School Portal</p>
                </div>
              </div>

              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-9 gap-4">
                {apps.filter(app => app.roles.includes(user.role)).map((app, i) => (
                  <motion.button
                    key={app.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.02 }}
                    whileHover={{ y: -5, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setActiveTab(app.id as any);
                      setShowLaunchpad(false);
                    }}
                    className="flex flex-col items-center gap-2 group"
                  >
                    <div className={`w-20 h-20 rounded-3xl ${app.color} flex items-center justify-center shadow-lg shadow-black/5 group-hover:shadow-primary/30 transition-all relative overflow-hidden border-2 border-white`}>
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                      <app.icon size={28} strokeWidth={2.5} className="relative z-10 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <span className="text-[9px] font-black text-slate-500 text-center uppercase tracking-wider group-hover:text-primary transition-colors block truncate w-full px-1">{app.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          ) : (
            <>
          {loading && !stats && (
            <div className="flex flex-col items-center justify-center py-32 space-y-6">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-slate-100 rounded-full" />
                <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0" />
              </div>
              <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs">Loading School Data...</p>
            </div>
          )}

          {!loading && serverStatus === 'offline' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="premium-card bg-rose-50 border-rose-100 text-center py-20"
            >
              <AlertCircle size={64} className="text-rose-500 mx-auto mb-6" />
              <h3 className="text-3xl font-black text-rose-900 mb-4">Connection Error</h3>
              <p className="text-rose-700 max-w-md mx-auto mb-8 font-medium">
                We're having trouble connecting to the school server. This might be due to maintenance or a temporary outage.
              </p>
              <button onClick={() => window.location.reload()} className="btn-premium bg-rose-600 hover:bg-rose-700">
                Retry Connection
              </button>
            </motion.div>
          )}

          {activeTab === 'profile' && user.role === 'student' && selectedStudent && (
            <div className="space-y-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-3xl font-black text-dark tracking-tight">Student Profile</h3>
                <div className="badge bg-primary/10 text-primary">Academic Year 2026</div>
              </div>
              <div className="premium-card">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-12">
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative w-40 h-40 rounded-full bg-white border-4 border-white shadow-2xl overflow-hidden flex-shrink-0">
                      <img 
                        src={selectedStudent.photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedStudent.name}`} 
                        alt="profile" 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  </div>
                  <div className="flex-1 space-y-8 text-center md:text-left">
                    <div>
                      <h4 className="text-4xl font-black text-dark tracking-tight mb-2">{selectedStudent.name}</h4>
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                        <span className="text-slate-400 font-bold flex items-center gap-2">
                          <Hash size={16} /> Roll No: {selectedStudent.roll_no}
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-200 hidden md:block" />
                        <span className="text-slate-400 font-bold flex items-center gap-2">
                          <UserIcon size={16} /> {selectedStudent.grade}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-slate-50">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Class & Section</p>
                        <p className="text-lg font-black text-dark">{selectedStudent.class} - {selectedStudent.section}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Parent Contact</p>
                        <p className="text-lg font-black text-dark">{selectedStudent.parent_contact || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Emergency Contact</p>
                        <p className="text-lg font-black text-dark">{selectedStudent.emergency_contact || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {(selectedStudent.academic_notes || selectedStudent.medical_notes) && (
                  <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 pt-12 border-t border-slate-50">
                    {selectedStudent.academic_notes && (
                      <div className="bg-indigo-50/50 p-8 rounded-3xl border border-indigo-100/50">
                        <h5 className="font-black text-indigo-900 mb-4 flex items-center gap-3">
                          <BookOpen size={20} className="text-indigo-600" /> Academic Notes
                        </h5>
                        <p className="text-indigo-800/80 text-sm leading-relaxed font-medium">{selectedStudent.academic_notes}</p>
                      </div>
                    )}
                    {selectedStudent.medical_notes && (
                      <div className="bg-rose-50/50 p-8 rounded-3xl border border-rose-100/50">
                        <h5 className="font-black text-rose-900 mb-4 flex items-center gap-3">
                          <AlertCircle size={20} className="text-rose-600" /> Medical Notes
                        </h5>
                        <p className="text-rose-800/80 text-sm leading-relaxed font-medium">{selectedStudent.medical_notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-8 max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <Sparkles className="text-indigo-600" size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Shah Wilayat Public School AI Assistant</h3>
                  <p className="text-gray-500">Ask me anything about your studies, schedule, or general knowledge.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 min-h-[400px] flex flex-col">
                  <div className="flex-1 overflow-y-auto mb-6 space-y-4">
                    {aiResponse ? (
                      <div className="bg-gray-50 rounded-2xl p-6 prose prose-indigo max-w-none">
                        <div className="whitespace-pre-wrap text-gray-700">{aiResponse}</div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4 py-12">
                        <Bot size={48} className="text-gray-300" />
                        <p>How can I help you today?</p>
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleAiSubmit} className="relative">
                    <input
                      type="text"
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                      placeholder="Ask Gemini something..."
                      className="w-full pl-6 pr-16 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      disabled={isAiLoading}
                    />
                    <button
                      type="submit"
                      disabled={isAiLoading || !aiInput.trim()}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-xl hover:bg-accent transition-colors disabled:opacity-50"
                    >
                      {isAiLoading ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
                    </button>
                  </form>
                </div>
                
                <div className="md:col-span-1">
                  <VoiceChat />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dashboard' && (user.role === 'guest' || stats) && (
            <div className="space-y-12">
              {/* Welcome Section */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <h3 className="text-4xl font-black text-dark tracking-tight mb-2">
                    Welcome back, {user.name.split(' ')[0]}!
                  </h3>
                  <p className="text-slate-400 font-bold flex items-center gap-2">
                    <Calendar size={18} /> {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                {user.role === 'admin' && (
                  <button 
                    onClick={() => setShowAddStudent(true)}
                    className="btn-premium"
                  >
                    <Plus size={20} /> Add New Student
                  </button>
                )}
              </div>

              {user.role === 'student' && selectedStudent ? (
                <div className="space-y-12">
                  {/* Debit Card Style Balance Card */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <motion.div 
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="lg:col-span-2 bg-gradient-to-br from-primary via-secondary to-dark p-12 rounded-[3.5rem] text-white shadow-2xl shadow-primary/20 relative overflow-hidden aspect-[1.586/1] flex flex-col justify-between group"
                    >
                      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl group-hover:bg-white/20 transition-all duration-1000" />
                      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400/20 rounded-full -ml-40 -mb-40 blur-2xl group-hover:bg-indigo-400/30 transition-all duration-1000" />
                      
                      <div className="relative z-10 flex justify-between items-start">
                        <div>
                          <p className="text-indigo-100 text-[10px] font-black uppercase tracking-[0.4em] mb-2 opacity-80">Shahwilayat Public School</p>
                          <h2 className="text-3xl font-black tracking-tight">STUDENT SMART CARD</h2>
                        </div>
                        <div className="bg-white/20 p-5 rounded-3xl backdrop-blur-xl border border-white/20 shadow-inner">
                          <Logo className="w-10 h-10 text-white" />
                        </div>
                      </div>

                      <div className="relative z-10">
                        <div className="flex items-center gap-8 mb-12">
                          <div className="w-16 h-12 bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 rounded-xl shadow-inner border border-amber-200/40 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 translate-x-[-100%] animate-[shimmer_2s_infinite]" />
                          </div>
                          <div className="flex gap-8 text-4xl font-mono tracking-[0.3em] text-white drop-shadow-2xl">
                            <span>{selectedStudent?.roll_no?.substring(0, 4) || '0000'}</span>
                            <span>{selectedStudent?.roll_no?.substring(4, 8) || '0000'}</span>
                            <span>{selectedStudent?.roll_no?.substring(8, 12) || '0000'}</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-[10px] text-indigo-200 uppercase font-black tracking-[0.3em] mb-2 opacity-80">Card Holder</p>
                            <p className="text-2xl font-black tracking-tight uppercase drop-shadow-md">{selectedStudent?.name}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] text-indigo-200 uppercase font-black tracking-[0.3em] mb-2 opacity-80">Current Balance</p>
                            <p className="text-4xl font-black drop-shadow-2xl">Rs. {selectedStudent?.balance?.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div 
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="premium-card flex flex-col justify-center items-center text-center relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />
                      <div className="w-24 h-24 bg-indigo-50 text-primary rounded-[2.5rem] flex items-center justify-center mb-8 shadow-inner">
                        <Wallet size={48} />
                      </div>
                      <h3 className="text-2xl font-black text-dark mb-2 tracking-tight">Wallet Status</h3>
                      <div className="badge bg-emerald-50 text-emerald-600 mb-10">
                        ACTIVE & VERIFIED
                      </div>
                      <div className="w-full space-y-4">
                        {[
                          { label: 'Roll Number', value: selectedStudent?.roll_no },
                          { label: 'Computer ID', value: selectedStudent?.computer_number || 'N/A' },
                          { label: 'Class', value: `${selectedStudent?.class}-${selectedStudent?.section}` },
                          { label: 'Attendance', value: `${selectedStudent?.attendance_percentage?.toFixed(1)}%`, color: 'text-primary' },
                        ].map((row, idx) => (
                          <div key={idx} className="flex justify-between items-center text-sm p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <span className="text-slate-400 font-bold">{row.label}</span>
                            <span className={`font-black ${row.color || 'text-dark'}`}>{row.value}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </div>

                  {/* Quick Actions Grid */}
                  <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-8">
                    {[
                      { label: 'Notices', icon: Megaphone, color: 'bg-indigo-50 text-indigo-600', tab: 'news' },
                      { label: 'Canteen', icon: Coffee, color: 'bg-orange-50 text-orange-600', tab: 'canteen' },
                      { label: 'Homework', icon: BookOpen, color: 'bg-emerald-50 text-emerald-600', tab: 'homework' },
                      { label: 'Attendance', icon: Calendar, color: 'bg-amber-50 text-amber-600', tab: 'attendance' },
                      { label: 'Syllabus', icon: Book, color: 'bg-purple-50 text-purple-600', tab: 'syllabus' },
                      { label: 'Schedule', icon: Clock, color: 'bg-primary/10 text-primary', tab: 'schedules' },
                      { label: 'Finance', icon: Wallet, color: 'bg-emerald-50 text-emerald-600', tab: 'finance' },
                      { label: 'Online', icon: Video, color: 'bg-cyan-50 text-cyan-600', tab: 'online' },
                      { label: 'Results', icon: Award, color: 'bg-rose-50 text-rose-600', tab: 'results' },
                    ].map((item, i) => (
                      <motion.button
                        key={item.label}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ y: -12, scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => item.tab && setActiveTab(item.tab as any)}
                        className="flex flex-col items-center gap-4 group"
                      >
                        <div className={`w-20 h-20 rounded-[2rem] ${item.color} flex items-center justify-center shadow-2xl shadow-black/5 group-hover:shadow-primary/20 transition-all relative overflow-hidden`}>
                          <div className="absolute inset-0 bg-white/30 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                          <item.icon size={32} strokeWidth={2.5} className="relative z-10" />
                        </div>
                        <span className="text-[10px] font-black text-slate-500 text-center uppercase tracking-widest group-hover:text-primary transition-colors">{item.label}</span>
                      </motion.button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Recent Transactions for Student */}
                    <div className="premium-card">
                      <div className="flex justify-between items-center mb-8">
                        <h3 className="font-black text-dark text-xl tracking-tight">Recent Spending</h3>
                        <button onClick={() => setActiveTab('finance')} className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline">View All</button>
                      </div>
                      <div className="space-y-4">
                        {transactions.filter(t => t.student_id === selectedStudent.id).slice(0, 4).map((tx) => (
                          <div key={`${tx.id}-${tx.date}`} className="flex items-center justify-between p-5 bg-slate-50 rounded-3xl border border-slate-100 transition-all hover:bg-white hover:shadow-lg group">
                            <div className="flex items-center gap-5">
                              <div className={`p-4 rounded-2xl ${tx.type === 'credit' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'} group-hover:scale-110 transition-transform`}>
                                {tx.type === 'credit' ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                              </div>
                              <div>
                                <p className="text-sm font-black text-dark">{tx.description}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{new Date(tx.date).toLocaleDateString()} • {tx.fee_type}</p>
                              </div>
                            </div>
                            <span className={`font-black text-base ${tx.type === 'credit' ? 'text-emerald-600' : 'text-rose-600'}`}>
                              {tx.type === 'credit' ? '+' : '-'} Rs. {tx.amount?.toLocaleString()}
                            </span>
                          </div>
                        ))}
                        {transactions.filter(t => t.student_id === selectedStudent.id).length === 0 && (
                          <div className="text-center py-12">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                              <History className="text-slate-200" size={40} />
                            </div>
                            <p className="text-slate-400 font-bold">No transactions yet</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Upcoming Classes for Student */}
                    <div className="premium-card">
                      <div className="flex justify-between items-center mb-8">
                        <h3 className="font-black text-dark text-xl tracking-tight">Next Classes</h3>
                        <button onClick={() => setActiveTab('online')} className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline">Full Schedule</button>
                      </div>
                      <div className="space-y-4">
                        {onlineClasses.filter(c => c.grade === selectedStudent.grade).slice(0, 4).map((oc) => (
                          <div key={oc.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-3xl border border-slate-100 transition-all hover:bg-white hover:shadow-lg group">
                            <div className="flex items-center gap-5">
                              <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:scale-110 transition-transform">
                                <Video size={20} />
                              </div>
                              <div>
                                <p className="text-sm font-black text-dark">{oc.subject}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                                  {new Date(oc.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {oc.teacher_name}
                                </p>
                              </div>
                            </div>
                            <a href={oc.link} target="_blank" rel="noopener noreferrer" className="btn-premium !px-4 !py-2 !text-[10px] !rounded-xl">
                              JOIN
                            </a>
                          </div>
                        ))}
                        {onlineClasses.filter(c => c.grade === selectedStudent.grade).length === 0 && (
                          <div className="text-center py-12">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                              <MonitorPlay className="text-slate-200" size={40} />
                            </div>
                            <p className="text-slate-400 font-bold">No classes scheduled</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {user.role === 'admin' && (
                    <>
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-r from-indigo-600 to-primary p-12 rounded-[3.5rem] text-white shadow-2xl shadow-primary/20 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
                        <div className="relative z-10 flex items-center gap-8">
                          <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center text-white backdrop-blur-xl border border-white/20 shadow-inner">
                            <Globe size={40} />
                          </div>
                          <div>
                            <h3 className="text-3xl font-black tracking-tight mb-2">Share School Portal</h3>
                            <p className="text-indigo-100 font-medium opacity-80">Give students and staff instant access to their digital portal.</p>
                          </div>
                        </div>
                        <div className="relative z-10 flex items-center gap-3 bg-white/10 p-3 rounded-2xl border border-white/20 backdrop-blur-xl w-full md:w-auto flex-1 max-w-xl">
                          <input 
                            type="text" 
                            readOnly 
                            value={window.location.href} 
                            className="bg-transparent text-sm text-white w-full outline-none px-4 font-mono truncate"
                          />
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(window.location.href);
                              showToast('Link copied to clipboard!');
                            }}
                            className="p-4 bg-white text-primary rounded-xl shadow-xl hover:scale-105 transition-all flex-shrink-0"
                            title="Copy Link"
                          >
                            <Copy size={20} />
                          </button>
                        </div>
                      </motion.div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                        {[
                          { label: 'Total Students', value: stats?.totalStudents || 0, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                          { label: 'Total Balance', value: `Rs. ${stats?.totalBalance?.toLocaleString() || 0}`, icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                          { label: 'Announcements', value: announcements.length, icon: Megaphone, color: 'text-rose-600', bg: 'bg-rose-50' },
                          { label: 'Online Classes', value: onlineClasses.length, icon: Video, color: 'text-cyan-600', bg: 'bg-cyan-50' },
                        ].map((stat, i) => (
                          <motion.div 
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="premium-card group"
                          >
                            <div className={`w-16 h-16 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                              <stat.icon size={32} />
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{stat.label}</p>
                            <h4 className="text-4xl font-black text-dark tracking-tight">{stat.value.toLocaleString()}</h4>
                          </motion.div>
                        ))}
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                        <div className="premium-card">
                          <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-black text-dark tracking-tight">Recent Transactions</h3>
                            <button onClick={() => setActiveTab('finance')} className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline">View All</button>
                          </div>
                          <div className="space-y-4">
                            {stats?.recentTransactions?.slice(0, 5).map((tx) => (
                              <div key={`${tx.id}-${tx.date}`} className="flex items-center justify-between p-5 bg-slate-50 rounded-3xl border border-slate-100 transition-all hover:bg-white hover:shadow-lg group">
                                <div className="flex items-center gap-5">
                                  <div className={`p-4 rounded-2xl ${tx.type === 'credit' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'} group-hover:scale-110 transition-transform`}>
                                    {tx.type === 'credit' ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                                  </div>
                                  <div>
                                    <p className="text-sm font-black text-dark">{tx.student_name}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{new Date(tx.date).toLocaleDateString()}</p>
                                  </div>
                                </div>
                                <span className={`font-black text-base ${tx.type === 'credit' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                  {tx.type === 'credit' ? '+' : '-'} Rs. {tx.amount?.toLocaleString() ?? '0'}
                                </span>
                              </div>
                            ))}
                            {stats?.recentTransactions?.length === 0 && (
                              <div className="text-center py-12">
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                  <History className="text-slate-200" size={40} />
                                </div>
                                <p className="text-slate-400 font-bold">No recent transactions</p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="premium-card">
                          <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-black text-dark tracking-tight">Upcoming Classes</h3>
                            <button onClick={() => setActiveTab('online')} className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline">View All</button>
                          </div>
                          <div className="space-y-4">
                            {onlineClasses.slice(0, 5).map((oc) => (
                              <div key={oc.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-3xl border border-slate-100 transition-all hover:bg-white hover:shadow-lg group">
                                <div className="flex items-center gap-5">
                                  <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:scale-110 transition-transform">
                                    <Video size={20} />
                                  </div>
                                  <div>
                                    <p className="text-sm font-black text-dark">{oc.subject}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Grade {oc.grade} • {new Date(oc.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                  </div>
                                </div>
                                <a href={oc.link} target="_blank" rel="noopener noreferrer" className="btn-premium !px-4 !py-2 !text-[10px] !rounded-xl">
                                  JOIN
                                </a>
                              </div>
                            ))}
                            {onlineClasses.length === 0 && (
                              <div className="text-center py-12">
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                  <MonitorPlay className="text-slate-200" size={40} />
                                </div>
                                <p className="text-slate-400 font-bold">No classes scheduled</p>
                              </div>
                            )}
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
                  {user.role === 'canteen' && (
                    <div className="space-y-8">
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-r from-orange-500 to-amber-500 p-8 rounded-[3rem] text-white shadow-2xl shadow-orange-500/20 relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -mr-40 -mt-40 blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-400/20 rounded-full -ml-32 -mb-32 blur-2xl" />
                        
                        <div className="relative z-10">
                          <h2 className="text-4xl font-black tracking-tight mb-4">Canteen Dashboard</h2>
                          <p className="text-orange-100 text-lg max-w-2xl leading-relaxed mb-8">
                            Manage canteen inventory, process student payments, and view daily sales.
                          </p>
                          
                          <div className="flex flex-wrap gap-4">
                            <button onClick={() => setActiveTab('canteen')} className="bg-white text-orange-600 px-6 py-3 rounded-xl font-bold hover:bg-orange-50 transition-colors shadow-lg">
                              Open Canteen POS
                            </button>
                            <button onClick={() => setShowQRScanner(true)} className="bg-white/20 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/30 transition-colors backdrop-blur-md border border-white/20">
                              Scan QR Code
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  )}
                  {user.role === 'guest' && (
                    <div className="space-y-12">
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gradient-to-br from-primary via-accent to-secondary p-12 rounded-[4rem] text-white shadow-2xl shadow-primary/30 relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-white/10 rounded-full -mr-80 -mt-80 blur-[100px] animate-pulse" />
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400/20 rounded-full -ml-48 -mb-48 blur-[80px]" />
                        
                        <div className="relative z-10 text-center lg:text-left">
                          <motion.span 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-block px-4 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-[0.3em] mb-6 border border-white/20"
                          >
                            Welcome to the Future of Education
                          </motion.span>
                          <motion.h2 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-5xl lg:text-7xl font-black tracking-tighter mb-8 leading-[0.9]"
                          >
                            Shahwilayat <br /> Public School
                          </motion.h2>
                          <motion.p 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-indigo-50 text-xl max-w-2xl leading-relaxed mb-12 font-medium opacity-90"
                          >
                            Step into our digital portal. Stay updated with real-time news, upcoming events, and explore our academic excellence.
                          </motion.p>
                          
                          <motion.div 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="flex flex-wrap justify-center lg:justify-start gap-6"
                          >
                            <button onClick={() => setActiveTab('events')} className="bg-white text-primary px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest hover:scale-110 transition-all shadow-2xl shadow-black/20">
                              Explore Events
                            </button>
                            <button onClick={() => setActiveTab('news')} className="bg-white/10 text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest hover:bg-white/20 transition-all backdrop-blur-xl border border-white/20">
                              Latest News
                            </button>
                          </motion.div>
                        </div>
                      </motion.div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                          { title: 'Academic Calendar', desc: 'View important dates and schedules.', icon: Calendar, color: 'bg-blue-500', tab: 'schedules' },
                          { title: 'Exam Portal', desc: 'Check datesheets and result updates.', icon: Award, color: 'bg-rose-500', tab: 'datesheets' },
                          { title: 'Public Notices', desc: 'Stay informed with school announcements.', icon: Megaphone, color: 'bg-amber-500', tab: 'news' },
                        ].map((feature, i) => (
                          <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 + (i * 0.1) }}
                            whileHover={{ y: -10 }}
                            onClick={() => feature.tab && setActiveTab(feature.tab as any)}
                            className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-slate-200/50 cursor-pointer group"
                          >
                            <div className={`w-20 h-20 ${feature.color} text-white rounded-[2rem] flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform`}>
                              <feature.icon size={36} />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">{feature.title}</h3>
                            <p className="text-gray-500 font-medium leading-relaxed">{feature.desc}</p>
                          </motion.div>
                        ))}
                      </div>

                      <div className="bg-white p-12 rounded-[4rem] border border-gray-100 shadow-2xl shadow-slate-200/50 flex flex-col lg:flex-row items-center gap-12">
                        <div className="flex-1 text-center lg:text-left">
                          <h3 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter">Join Our Community</h3>
                          <p className="text-gray-500 text-lg font-medium mb-8">Share this portal with parents and students to keep everyone connected.</p>
                          <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-[2rem] border border-gray-200">
                            <input 
                              type="text" 
                              readOnly 
                              value={window.location.href} 
                              className="bg-transparent text-sm text-gray-600 w-full outline-none px-4 font-mono truncate font-bold"
                            />
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                showToast('Link copied to clipboard!');
                              }}
                              className="p-4 bg-primary text-white rounded-2xl hover:scale-110 transition-transform shadow-lg shadow-primary/30"
                              title="Copy Link"
                            >
                              <Copy size={24} />
                            </button>
                          </div>
                        </div>
                        <div className="w-full lg:w-1/3 aspect-square bg-gradient-to-br from-primary/5 to-accent/5 rounded-[3rem] flex items-center justify-center relative overflow-hidden">
                          <div className="absolute inset-0 flex items-center justify-center opacity-10">
                            <Logo className="w-64 h-64" />
                          </div>
                          <QrCode size={120} className="text-primary relative z-10" />
                        </div>
                      </div>
                    </div>
                  )}
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

        {activeTab === 'mail' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Mail & Messages</h3>
                <p className="text-gray-500 text-sm">Communication center for students and staff</p>
              </div>
              <button 
                onClick={() => setShowAddMessage(true)}
                className="bg-primary text-white px-6 py-2.5 rounded-xl flex items-center gap-2 hover:bg-accent transition-all shadow-lg shadow-primary/20"
              >
                <Plus size={20} /> New Message
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Inbox</h4>
                <div className="space-y-3">
                  {messages.map((msg) => (
                    <motion.div 
                      key={msg.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-6 rounded-2xl border transition-all ${msg.is_read ? 'bg-white border-gray-100' : 'bg-indigo-50/30 border-indigo-100 shadow-sm'}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${msg.sender_role === 'admin' ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'}`}>
                            {msg.sender_role === 'admin' ? <Settings size={18} /> : <Users size={18} />}
                          </div>
                          <div>
                            <h5 className="font-bold text-gray-900">{msg.title}</h5>
                            <p className="text-xs text-gray-400">From: {msg.sender_role === 'admin' ? 'School Administration' : 'Staff'}</p>
                          </div>
                        </div>
                        <span className="text-[10px] text-gray-400 font-medium">{new Date(msg.date).toLocaleString()}</span>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed pl-13">{msg.content}</p>
                    </motion.div>
                  ))}
                  {messages.length === 0 && (
                    <div className="p-12 text-center text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
                      Your inbox is empty.
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Info size={18} className="text-primary" />
                    Quick Help
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    Need assistance? Send a message to the administration or check the news feed for general announcements.
                  </p>
                  <button 
                    onClick={() => setActiveTab('news')}
                    className="w-full py-3 bg-gray-50 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-100 transition-all border border-gray-100"
                  >
                    View News Feed
                  </button>
                </div>
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
                          admin.role === 'admin' ? 'bg-purple-50 text-purple-600' : 
                          admin.role === 'teacher' ? 'bg-blue-50 text-blue-600' :
                          admin.role === 'student' ? 'bg-emerald-50 text-emerald-600' :
                          'bg-amber-50 text-amber-600'
                        }`}>
                          {admin.role}
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
                    <th className="px-6 py-4 font-medium">Location</th>
                    <th className="px-6 py-4 font-medium">Type</th>
                    <th className="px-6 py-4 font-medium">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {schedules
                    .filter(sch => user.role === 'admin' || sch.grade === user.grade || sch.grade === selectedStudent?.grade)
                    .map((sch) => (
                    <tr key={sch.id} className="even:bg-gray-50/50 hover:bg-indigo-50/30 transition-all">
                      <td className="px-6 py-4 font-medium text-gray-900">{sch.day}</td>
                      <td className="px-6 py-4 text-gray-500 text-sm">{sch.time_slot}</td>
                      <td className="px-6 py-4 text-gray-900 font-medium">{sch.subject}</td>
                      <td className="px-6 py-4 text-gray-500 text-sm">{sch.teacher}</td>
                      <td className="px-6 py-4 text-gray-500 text-sm">{sch.location || 'N/A'}</td>
                      <td className="px-6 py-4 text-gray-500 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${sch.is_weekend ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          {sch.is_weekend ? 'Weekend' : 'Weekday'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-sm">{sch.grade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {schedules.filter(sch => user.role === 'admin' || sch.grade === user.grade || sch.grade === selectedStudent?.grade).length === 0 && (
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
          <div className="space-y-8">
            <div className="flex justify-between items-center bg-gradient-to-r from-indigo-600 to-primary p-8 rounded-3xl text-white shadow-xl shadow-primary/20">
              <div>
                <h2 className="text-3xl font-black tracking-tight mb-2">Homework & Classwork</h2>
                <p className="text-indigo-100 font-medium">Track assignments and academic progress</p>
              </div>
              {user.role === 'admin' && (
                <button 
                  onClick={() => setShowAddHomework(true)}
                  className="bg-white text-primary px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
                >
                  <Plus size={18} className="inline mr-2" /> Add New Work
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {homework
                .filter(h => user.role === 'admin' || (h.grade === user.grade && h.class === user.class && h.section === user.section))
                .map((h, i) => (
                <motion.div 
                  key={h.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="premium-card group"
                >
                  <div className="flex justify-between items-start mb-6">
                    <span className={`badge ${
                      h.type === 'Homework' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {h.type}
                    </span>
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <Calendar size={14} /> {new Date(h.date_assigned).toLocaleDateString()}
                    </div>
                  </div>
                  <h4 className="text-xl font-black text-dark mb-2 group-hover:text-primary transition-colors">{h.subject}</h4>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Grade {h.grade} • {h.class}-{h.section}</p>
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-6">
                    <p className="text-slate-600 text-sm leading-relaxed font-medium">{h.content}</p>
                  </div>
                  {h.date_due && (
                    <div className="flex items-center gap-3 text-xs font-black text-rose-500 bg-rose-50 p-4 rounded-xl border border-rose-100">
                      <Clock size={16} /> 
                      <span className="uppercase tracking-widest">Due: {new Date(h.date_due).toLocaleDateString()}</span>
                    </div>
                  )}
                </motion.div>
              ))}
              {homework.filter(h => user.role === 'admin' || (h.grade === user.grade && h.class === user.class && h.section === user.section)).length === 0 && (
                <div className="col-span-full py-32 text-center bg-white/50 rounded-[3rem] border-2 border-dashed border-slate-200 backdrop-blur-sm">
                  <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ClipboardList className="text-slate-300" size={48} />
                  </div>
                  <p className="text-slate-400 font-black uppercase tracking-widest">No homework or classwork assigned yet</p>
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
                  Block 13, Federal B Area, Karachi, Pakistan. <br />
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

        {activeTab === 'events' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center bg-gradient-to-r from-rose-500 to-accent p-8 rounded-[2.5rem] text-white shadow-xl shadow-rose-500/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
              <div className="relative z-10">
                <h2 className="text-3xl font-black tracking-tight mb-2">Upcoming Events</h2>
                <p className="text-rose-100 font-medium opacity-80">Stay updated with school activities and important dates</p>
              </div>
              <div className="relative z-10 bg-white/20 p-5 rounded-3xl backdrop-blur-xl border border-white/20 shadow-inner">
                <Calendar size={32} className="text-white" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Events will be populated by admin */}
              <div className="col-span-full py-32 text-center bg-white/50 rounded-[3rem] border-2 border-dashed border-slate-200 backdrop-blur-sm">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar size={48} className="text-slate-300" />
                </div>
                <p className="text-slate-400 font-black uppercase tracking-widest">No upcoming events scheduled</p>
                <p className="text-slate-300 text-xs mt-2 font-bold uppercase tracking-widest">Check back later for updates</p>
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

        {activeTab === 'fees' && user.role === 'admin' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Fee Management</h2>
                <p className="text-gray-500">Define structures, track payments, and send reminders.</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => handleSendFeeReminders()}
                  className="flex items-center gap-2 bg-warning text-white px-6 py-3 rounded-2xl font-bold hover:opacity-90 transition-all shadow-lg shadow-warning/30"
                >
                  <Bell size={20} />
                  Send All Reminders
                </button>
                <button 
                  onClick={() => setShowAddFeeStructure(true)}
                  className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/30"
                >
                  <Plus size={20} />
                  Add Fee Structure
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <FileText className="text-primary" />
                    Fee Structures
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left border-b border-gray-100">
                          <th className="pb-4 font-bold text-gray-600">Grade</th>
                          <th className="pb-4 font-bold text-gray-600">Amount</th>
                          <th className="pb-4 font-bold text-gray-600">Frequency</th>
                          <th className="pb-4 font-bold text-gray-600">Description</th>
                          <th className="pb-4 font-bold text-gray-600 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {feeStructures.map((fee) => (
                          <tr key={fee.id} className="hover:bg-gray-50 transition-colors">
                            <td className="py-4 font-medium">{fee.grade}</td>
                            <td className="py-4 text-primary font-bold">Rs. {fee.amount}</td>
                            <td className="py-4">
                              <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-bold uppercase">
                                {fee.frequency}
                              </span>
                            </td>
                            <td className="py-4 text-gray-500 text-sm">{fee.description}</td>
                            <td className="py-4 text-right">
                              <button 
                                onClick={() => handleDeleteFeeStructure(fee.id)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 size={18} />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {feeStructures.length === 0 && (
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-gray-400">No fee structures defined yet.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <History className="text-success" />
                    Recent Fee Payments
                  </h3>
                  <div className="space-y-4">
                    {transactions.filter(t => t.type === 'fee').slice(0, 10).map((t) => {
                      const student = students.find(s => s.id === t.student_id);
                      return (
                        <div key={t.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all group">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                              <UserIcon size={24} className="text-gray-400" />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">{student?.name || 'Unknown Student'}</p>
                              <p className="text-xs text-gray-500">{new Date(t.date).toLocaleDateString()} • {t.fee_type}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="font-black text-success">Rs. {t.amount}</p>
                              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Paid</p>
                            </div>
                            <button 
                              onClick={() => setShowReceipt(t)}
                              className="p-2 bg-white text-primary rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-all"
                              title="View Receipt"
                            >
                              <Printer size={18} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-br from-primary to-accent rounded-3xl p-6 text-white shadow-xl shadow-primary/20">
                  <h3 className="text-xl font-bold mb-4">Quick Stats</h3>
                  <div className="space-y-4">
                    <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                      <p className="text-white/70 text-sm">Total Fees Collected</p>
                      <p className="text-2xl font-black">Rs. {transactions.filter(t => t.type === 'fee').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}</p>
                    </div>
                    <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                      <p className="text-white/70 text-sm">Outstanding Balance</p>
                      <p className="text-2xl font-black">Rs. {Math.abs(students.reduce((sum, s) => sum + (s.balance < 0 ? s.balance : 0), 0)).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6">
                  <h3 className="text-xl font-bold mb-4">Send Reminders</h3>
                  <p className="text-sm text-gray-500 mb-4">Send automated reminders to parents with outstanding balances.</p>
                  <div className="space-y-3">
                    {['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'].map(grade => (
                      <button 
                        key={grade}
                        onClick={() => handleSendFeeReminders(grade)}
                        className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-primary/5 hover:text-primary transition-all group"
                      >
                        <span className="font-medium">{grade}</span>
                        <ChevronRight size={16} className="text-gray-400 group-hover:text-primary" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
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
      </>
      )}
      </div>
    </main>

      {/* Modals */}
      <AnimatePresence>
        {showPasswordChange && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl border border-white"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-dark tracking-tight">Change Password</h3>
                <button onClick={() => setShowPasswordChange(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Password</label>
                  <input 
                    type="password" 
                    required 
                    className="input-premium"
                    value={passwordForm.oldPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, oldPassword: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Password</label>
                  <input 
                    type="password" 
                    required 
                    className="input-premium"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                  <input 
                    type="password" 
                    required 
                    className="input-premium"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                  />
                </div>
                <button type="submit" className="btn-premium w-full py-4 mt-4">
                  Update Password
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {showAddFeeStructure && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-gray-900">Add Fee Structure</h3>
                <button onClick={() => setShowAddFeeStructure(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleAddFeeStructure} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Grade</label>
                  <input 
                    type="text" 
                    required 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    value={newFeeStructure.grade}
                    onChange={(e) => setNewFeeStructure({...newFeeStructure, grade: e.target.value})}
                    placeholder="e.g. Grade 1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Amount (Rs.)</label>
                  <input 
                    type="number" 
                    required 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    value={newFeeStructure.amount}
                    onChange={(e) => setNewFeeStructure({...newFeeStructure, amount: e.target.value})}
                    placeholder="e.g. 5000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Frequency</label>
                  <select 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    value={newFeeStructure.frequency}
                    onChange={(e) => setNewFeeStructure({...newFeeStructure, frequency: e.target.value})}
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                  <textarea 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all h-24 resize-none"
                    value={newFeeStructure.description}
                    onChange={(e) => setNewFeeStructure({...newFeeStructure, description: e.target.value})}
                    placeholder="Optional details..."
                  />
                </div>
                <button type="submit" className="w-full bg-primary text-white py-4 rounded-2xl font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/30 mt-4">
                  Save Fee Structure
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {showReceipt && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-accent to-secondary"></div>
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-3">
                  <Logo className="w-10 h-10" />
                  <div>
                    <h3 className="text-xl font-black text-gray-900">Fee Receipt</h3>
                    <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Shahwilayat Public School</p>
                  </div>
                </div>
                <button onClick={() => setShowReceipt(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-wider mb-1">Receipt No.</p>
                    <p className="font-mono font-bold">#REC-{showReceipt.id.toString().padStart(6, '0')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-wider mb-1">Date</p>
                    <p className="font-bold">{new Date(showReceipt.date).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Student Name</span>
                    <span className="font-bold text-gray-900">{students.find(s => s.id === showReceipt.student_id)?.name || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Grade/Class</span>
                    <span className="font-bold text-gray-900">{students.find(s => s.id === showReceipt.student_id)?.grade || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Fee Type</span>
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold">{showReceipt.fee_type || 'General Fee'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Description</span>
                    <span className="text-gray-900">{showReceipt.description || 'Monthly Tuition Fee'}</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-bold text-gray-900">Total Amount Paid</span>
                    <span className="text-2xl font-black text-success">Rs. {showReceipt.amount}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 text-center mt-8 italic">This is a computer-generated receipt and does not require a signature.</p>
                </div>

                <button 
                  onClick={() => window.print()}
                  className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all mt-4"
                >
                  <Printer size={20} />
                  Print Receipt
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showAddStudent && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-primary text-white">
                <div>
                  <h3 className="text-xl font-bold">Add New Student</h3>
                  <p className="text-white/70 text-xs mt-1 font-medium">Enter student details to create a new profile</p>
                </div>
                <button onClick={() => setShowAddStudent(false)} className="bg-white/10 p-2 rounded-xl text-white hover:bg-white/20 transition-colors">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleAddStudent} className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative group">
                      <div className="w-32 h-32 rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden transition-all group-hover:border-primary/50">
                        {isUploadingPhoto ? (
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        ) : newStudent.photo_url ? (
                          <img src={newStudent.photo_url} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <Camera className="text-slate-300" size={40} />
                        )}
                      </div>
                      <label className="absolute inset-0 flex items-center justify-center bg-primary/60 opacity-0 group-hover:opacity-100 transition-all cursor-pointer rounded-3xl backdrop-blur-[2px]">
                        <Camera className="text-white" size={28} />
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => handleFileChange(e, (url) => setNewStudent({...newStudent, photo_url: url}))}
                        />
                      </label>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Student Photo</p>
                  </div>
                  <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                    <div className="sm:col-span-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Full Name</label>
                      <input 
                        required
                        type="text" 
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm font-bold text-slate-700"
                        placeholder="e.g. Muhammad Ali"
                        value={newStudent.name}
                        onChange={e => setNewStudent({...newStudent, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Roll Number</label>
                      <input 
                        required
                        type="text" 
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm font-bold text-slate-700"
                        placeholder="Roll No"
                        value={newStudent.roll_no}
                        onChange={e => setNewStudent({...newStudent, roll_no: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Computer No</label>
                      <input 
                        required
                        type="text" 
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm font-bold text-slate-700"
                        placeholder="Comp No"
                        value={newStudent.computer_number}
                        onChange={e => setNewStudent({...newStudent, computer_number: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Grade</label>
                      <input 
                        required
                        type="text" 
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm font-bold text-slate-700"
                        placeholder="e.g. 10"
                        value={newStudent.grade}
                        onChange={e => setNewStudent({...newStudent, grade: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Class & Section</label>
                      <div className="flex gap-2">
                        <input 
                          required
                          type="text" 
                          className="w-1/2 px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm font-bold text-slate-700"
                          placeholder="Class"
                          value={newStudent.class}
                          onChange={e => setNewStudent({...newStudent, class: e.target.value})}
                        />
                        <input 
                          required
                          type="text" 
                          className="w-1/2 px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm font-bold text-slate-700"
                          placeholder="Sec"
                          value={newStudent.section}
                          onChange={e => setNewStudent({...newStudent, section: e.target.value})}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">CNIC / ID</label>
                      <input 
                        required
                        type="text" 
                        placeholder="42101-XXXXXXX-X"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm font-bold text-slate-700"
                        value={newStudent.cnic}
                        onChange={e => setNewStudent({...newStudent, cnic: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Parent Contact</label>
                      <input 
                        required
                        type="text" 
                        placeholder="Contact Number"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm font-bold text-slate-700"
                        value={newStudent.parent_contact}
                        onChange={e => setNewStudent({...newStudent, parent_contact: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setShowAddStudent(false)}
                    className="flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 hover:bg-slate-100 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="flex-[2] py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    Register Student
                  </button>
                </div>
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
                    <div>
                      <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Emergency Contact</p>
                      <p className="text-gray-900 font-medium">{selectedStudent.emergency_contact || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                {(selectedStudent.academic_notes || selectedStudent.medical_notes) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedStudent.academic_notes && (
                      <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100/50">
                        <h5 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
                          <BookOpen size={18} className="text-indigo-600" /> Academic Notes
                        </h5>
                        <p className="text-indigo-800/80 text-sm leading-relaxed">{selectedStudent.academic_notes}</p>
                      </div>
                    )}
                    {selectedStudent.medical_notes && (
                      <div className="bg-rose-50/50 p-6 rounded-2xl border border-rose-100/50">
                        <h5 className="font-bold text-rose-900 mb-2 flex items-center gap-2">
                          <AlertCircle size={18} className="text-rose-600" /> Medical Notes
                        </h5>
                        <p className="text-rose-800/80 text-sm leading-relaxed">{selectedStudent.medical_notes}</p>
                      </div>
                    )}
                  </div>
                )}

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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none"
                      value={newSchedule.location}
                      onChange={e => setNewSchedule({...newSchedule, location: e.target.value})}
                      placeholder="e.g. Room 101"
                    />
                  </div>
                  <div className="flex items-center mt-6">
                    <input 
                      type="checkbox" 
                      id="is_weekend"
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      checked={newSchedule.is_weekend}
                      onChange={e => setNewSchedule({...newSchedule, is_weekend: e.target.checked})}
                    />
                    <label htmlFor="is_weekend" className="ml-2 block text-sm text-gray-900">
                      Weekend Class
                    </label>
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
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-indigo-600 text-white">
                <div>
                  <h3 className="text-xl font-bold">Create User Account</h3>
                  <p className="text-indigo-100 text-xs mt-1 font-medium">Assign roles and credentials for new users</p>
                </div>
                <button onClick={() => setShowAddAdmin(false)} className="bg-white/10 p-2 rounded-xl text-white hover:bg-white/20 transition-colors">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleAddAdmin} className="p-8 space-y-5">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Full Name</label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-sm font-bold text-slate-700"
                    placeholder="e.g. Admin User"
                    value={newAdmin.name}
                    onChange={e => setNewAdmin({...newAdmin, name: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Username</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-sm font-bold text-slate-700"
                      placeholder="Username"
                      value={newAdmin.username}
                      onChange={e => setNewAdmin({...newAdmin, username: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Password</label>
                    <input 
                      required
                      type="password" 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-sm font-bold text-slate-700"
                      placeholder="••••••••"
                      value={newAdmin.password}
                      onChange={e => setNewAdmin({...newAdmin, password: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Account Role</label>
                  <select 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-sm font-bold text-slate-700 appearance-none cursor-pointer"
                    value={newAdmin.role}
                    onChange={e => setNewAdmin({...newAdmin, role: e.target.value})}
                  >
                    <option value="admin">Administrator</option>
                    <option value="teacher">Teacher</option>
                    <option value="student">Student</option>
                    <option value="canteen">Canteen Staff</option>
                  </select>
                </div>

                {newAdmin.role === 'student' && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Link Student Profile</label>
                    <select 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-sm font-bold text-slate-700 appearance-none cursor-pointer"
                      value={newAdmin.student_id || ''}
                      onChange={e => setNewAdmin({...newAdmin, student_id: parseInt(e.target.value)})}
                    >
                      <option value="">Select Student</option>
                      {students.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.roll_no})</option>
                      ))}
                    </select>
                  </motion.div>
                )}

                {newAdmin.role === 'teacher' && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Link Teacher Profile</label>
                    <select 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-sm font-bold text-slate-700 appearance-none cursor-pointer"
                      value={newAdmin.teacher_id || ''}
                      onChange={e => setNewAdmin({...newAdmin, teacher_id: parseInt(e.target.value)})}
                    >
                      <option value="">Select Teacher</option>
                      {teachers.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </motion.div>
                )}

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setShowAddAdmin(false)}
                    className="flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 hover:bg-slate-100 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="flex-[2] py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    Create Account
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {showAddMessage && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Send New Message</h3>
                <button onClick={() => setShowAddMessage(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleSendMessage} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Recipient</label>
                  <select 
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none"
                    value={messageForm.receiver_id}
                    onChange={e => setMessageForm({...messageForm, receiver_id: e.target.value})}
                  >
                    <option value="">All Students (Announcement)</option>
                    {user.role === 'admin' && students.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.roll_no})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none"
                    value={messageForm.title}
                    onChange={e => setMessageForm({...messageForm, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea 
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none resize-none"
                    value={messageForm.content}
                    onChange={e => setMessageForm({...messageForm, content: e.target.value})}
                  />
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all mt-4 flex items-center justify-center gap-2">
                  <Mail size={20} /> Send Message
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
