import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use /tmp for Vercel serverless environment compatibility
const dbPath = process.env.VERCEL ? '/tmp/school.db' : 'school.db';
const db = new Database(dbPath);

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    roll_no TEXT UNIQUE NOT NULL,
    grade TEXT NOT NULL,
    class TEXT NOT NULL,
    section TEXT NOT NULL,
    parent_contact TEXT,
    parent_email TEXT,
    emergency_contact TEXT,
    academic_notes TEXT,
    medical_notes TEXT,
    photo_url TEXT,
    cnic TEXT NOT NULL,
    computer_number TEXT,
    password TEXT NOT NULL,
    balance REAL DEFAULT 0,
    attendance_percentage REAL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    balance REAL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS canteen_staff (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    student_id INTEGER,
    balance REAL DEFAULT 0
  );

  -- Insert default admin if not exists
  INSERT OR IGNORE INTO admins (name, username, password, role) VALUES ('Administrator', 'admin', 'admin123', 'admin');
  INSERT OR IGNORE INTO canteen_staff (name, username, password) VALUES ('Canteen Manager', 'canteen', 'canteen123');

  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    type TEXT CHECK(type IN ('credit', 'debit')) NOT NULL,
    fee_type TEXT CHECK(fee_type IN ('tuition', 'bus', 'activity', 'canteen', 'other')) DEFAULT 'other',
    description TEXT,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id)
  );

  CREATE TABLE IF NOT EXISTS announcements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT CHECK(category IN ('General', 'Events', 'Academics')) NOT NULL,
    date DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    date DATE NOT NULL,
    status TEXT CHECK(status IN ('Present', 'Absent', 'Late')) NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(id)
  );

  CREATE TABLE IF NOT EXISTS academic_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    subject TEXT NOT NULL,
    marks INTEGER NOT NULL,
    total_marks INTEGER NOT NULL,
    term TEXT NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(id)
  );

  CREATE TABLE IF NOT EXISTS syllabus (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject TEXT NOT NULL,
    grade TEXT NOT NULL,
    content TEXT NOT NULL,
    file_url TEXT
  );

  CREATE TABLE IF NOT EXISTS schedules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    grade TEXT NOT NULL,
    day TEXT NOT NULL,
    time_slot TEXT NOT NULL,
    subject TEXT NOT NULL,
    teacher TEXT NOT NULL,
    location TEXT,
    is_weekend BOOLEAN DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS online_classes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    grade TEXT NOT NULL,
    subject TEXT NOT NULL,
    link TEXT NOT NULL,
    time DATETIME NOT NULL
  );

  CREATE TABLE IF NOT EXISTS homework_classwork (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT CHECK(type IN ('Homework', 'Classwork')) NOT NULL,
    grade TEXT NOT NULL,
    class TEXT NOT NULL,
    section TEXT NOT NULL,
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    date_assigned DATE DEFAULT CURRENT_DATE,
    date_due DATE
  );

  CREATE TABLE IF NOT EXISTS datesheets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    exam_name TEXT NOT NULL,
    grade TEXT NOT NULL,
    subject TEXT NOT NULL,
    date DATE NOT NULL,
    time TEXT NOT NULL
  );
`);

// Migration: Add missing columns if they don't exist
try {
  db.exec("ALTER TABLE admins ADD COLUMN balance REAL DEFAULT 0");
} catch (e) {}
try {
  db.exec("ALTER TABLE canteen_staff ADD COLUMN balance REAL DEFAULT 0");
} catch (e) {}
try {
  db.exec("ALTER TABLE canteen_staff ADD COLUMN student_id INTEGER");
} catch (e) {}

try {
  const tableInfo = db.prepare("PRAGMA table_info(students)").all();
  const columns = (tableInfo as any[]).map((c: any) => c.name);
  console.log("Current columns in students table:", columns);
  
  if (!columns.includes('cnic')) {
    try {
      console.log("Adding cnic column...");
      db.exec("ALTER TABLE students ADD COLUMN cnic TEXT DEFAULT ''");
      db.exec("CREATE UNIQUE INDEX IF NOT EXISTS idx_students_cnic ON students(cnic) WHERE cnic != ''");
    } catch (e) {
      console.error("Error adding cnic column:", e);
    }
  }
  
  if (!columns.includes('grade')) {
    try {
      console.log("Adding grade column...");
      db.exec("ALTER TABLE students ADD COLUMN grade TEXT DEFAULT ''");
    } catch (e) {
      console.error("Error adding grade column:", e);
    }
  }
  
  if (!columns.includes('password')) {
    try {
      console.log("Adding password column...");
      db.exec("ALTER TABLE students ADD COLUMN password TEXT DEFAULT 'password123'");
    } catch (e) {
      console.error("Error adding password column:", e);
    }
  }

  if (!columns.includes('parent_contact')) {
    try {
      console.log("Adding parent_contact column...");
      db.exec("ALTER TABLE students ADD COLUMN parent_contact TEXT DEFAULT ''");
    } catch (e) {
      console.error("Error adding parent_contact column:", e);
    }
  }

  if (!columns.includes('parent_email')) {
    try {
      console.log("Adding parent_email column...");
      db.exec("ALTER TABLE students ADD COLUMN parent_email TEXT DEFAULT ''");
    } catch (e) {
      console.error("Error adding parent_email column:", e);
    }
  }

  if (!columns.includes('photo_url')) {
    try {
      console.log("Adding photo_url column...");
      db.exec("ALTER TABLE students ADD COLUMN photo_url TEXT DEFAULT ''");
    } catch (e) {
      console.error("Error adding photo_url column:", e);
    }
  }

  if (!columns.includes('emergency_contact')) {
    try {
      db.exec("ALTER TABLE students ADD COLUMN emergency_contact TEXT DEFAULT ''");
    } catch (e) {}
  }
  if (!columns.includes('academic_notes')) {
    try {
      db.exec("ALTER TABLE students ADD COLUMN academic_notes TEXT DEFAULT ''");
    } catch (e) {}
  }
  if (!columns.includes('medical_notes')) {
    try {
      db.exec("ALTER TABLE students ADD COLUMN medical_notes TEXT DEFAULT ''");
    } catch (e) {}
  }
} catch (err) {
  console.error("Migration error:", err);
}

try {
  const scheduleInfo = db.prepare("PRAGMA table_info(schedules)").all();
  const scheduleCols = (scheduleInfo as any[]).map((c: any) => c.name);
  if (!scheduleCols.includes('location')) {
    db.exec("ALTER TABLE schedules ADD COLUMN location TEXT DEFAULT ''");
  }
  if (!scheduleCols.includes('is_weekend')) {
    db.exec("ALTER TABLE schedules ADD COLUMN is_weekend BOOLEAN DEFAULT 0");
  }
} catch (err) {}

const app = express();

async function startServer() {
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Health check route - ALWAYS available
  app.get("/health", (req, res) => {
    res.json({ 
      status: "ok", 
      mode: process.env.NODE_ENV,
      cwd: process.cwd(),
      timestamp: new Date().toISOString()
    });
  });

  // API Routes
  app.post("/api/login", (req, res) => {
    try {
      const { username, password, type } = req.body;
      
      if (type === 'admin') {
        const admin = db.prepare("SELECT * FROM admins WHERE username = ?").get(username) as any;
        if (!admin) {
          return res.status(401).json({ error: "Admin username not found" });
        }
        if (admin.password !== password) {
          return res.status(401).json({ error: "Incorrect admin password" });
        }
        return res.json({ id: admin.id, name: admin.name, role: 'admin', balance: admin.balance });
      } else if (type === 'canteen') {
        const staff = db.prepare("SELECT * FROM canteen_staff WHERE username = ?").get(username) as any;
        if (!staff) {
          return res.status(401).json({ error: "Canteen staff username not found" });
        }
        if (staff.password !== password) {
          return res.status(401).json({ error: "Incorrect canteen staff password" });
        }
        return res.json({ id: staff.id, name: staff.name, role: 'canteen', balance: staff.balance });
      } else {
        const students = db.prepare("SELECT * FROM students WHERE cnic = ?").all(username) as any[];
        if (students.length === 0) {
          return res.status(401).json({ error: "Student CNIC not found" });
        }
        
        // Check if any student with this CNIC has the correct password
        const validStudents = students.filter(s => s.password === password);
        if (validStudents.length === 0) {
          return res.status(401).json({ error: "Incorrect student password" });
        }

        if (validStudents.length > 1) {
          // Multiple profiles found for this CNIC/Password
          return res.json({ 
            multiple: true, 
            profiles: validStudents.map(s => ({ id: s.id, name: s.name, grade: s.grade, class: s.class, section: s.section, computer_number: s.computer_number, balance: s.balance })) 
          });
        }

        const student = validStudents[0];
        return res.json({ 
          id: student.id, 
          name: student.name, 
          role: 'student', 
          student_id: student.id, 
          computer_number: student.computer_number,
          balance: student.balance,
          grade: student.grade,
          class: student.class,
          section: student.section
        });
      }
    } catch (err: any) {
      res.status(500).json({ error: "Server error during login" });
    }
  });

  // Admin Management Routes
  app.get("/api/admins", (req, res) => {
    try {
      const admins = db.prepare("SELECT id, name, username, role, balance FROM admins").all();
      res.json(admins);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admins", (req, res) => {
    try {
      const { name, username, password, role } = req.body;
      const result = db.prepare("INSERT INTO admins (name, username, password, role) VALUES (?, ?, ?, ?)").run(name, username, password, role || 'admin');
      res.json({ id: result.lastInsertRowid, success: true });
    } catch (err: any) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ error: "Username already exists" });
      }
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/admins/:id", (req, res) => {
    try {
      const { id } = req.params;
      db.prepare("DELETE FROM admins WHERE id = ?").run(id);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/reset-password", (req, res) => {
    const { type, identifier, verification, new_password } = req.body;
    try {
      if (type === 'student') {
        const student = db.prepare("SELECT * FROM students WHERE cnic = ? AND parent_contact = ?").get(identifier, verification) as any;
        if (!student) {
          return res.status(404).json({ error: "Student not found with these details" });
        }
        db.prepare("UPDATE students SET password = ? WHERE id = ?").run(new_password, student.id);
        res.json({ message: "Password reset successful" });
      } else if (type === 'admin') {
        const admin = db.prepare("SELECT * FROM admins WHERE username = ?").get(identifier) as any;
        if (!admin) {
          return res.status(404).json({ error: "Admin not found" });
        }
        db.prepare("UPDATE admins SET password = ? WHERE id = ?").run(new_password, admin.id);
        res.json({ message: "Password reset successful" });
      } else if (type === 'canteen') {
        const staff = db.prepare("SELECT * FROM canteen_staff WHERE username = ?").get(identifier) as any;
        if (!staff) {
          return res.status(404).json({ error: "Canteen staff not found" });
        }
        db.prepare("UPDATE canteen_staff SET password = ? WHERE id = ?").run(new_password, staff.id);
        res.json({ message: "Password reset successful" });
      } else {
        // Fallback for old client code
        const { cnic, parent_contact } = req.body;
        if (cnic && parent_contact) {
          const student = db.prepare("SELECT * FROM students WHERE cnic = ? AND parent_contact = ?").get(cnic, parent_contact) as any;
          if (!student) {
            return res.status(404).json({ error: "Student not found with these details" });
          }
          db.prepare("UPDATE students SET password = ? WHERE id = ?").run(new_password, student.id);
          return res.json({ message: "Password reset successful" });
        }
        res.status(400).json({ error: "Invalid request" });
      }
    } catch (err: any) {
      res.status(500).json({ error: "Failed to reset password" });
    }
  });

  app.get("/api/students", (req, res) => {
    try {
      const students = db.prepare("SELECT id, name, roll_no, grade, class, section, parent_contact, parent_email, photo_url, cnic, computer_number, balance, attendance_percentage FROM students").all();
      res.json(students);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/students/:id", (req, res) => {
    try {
      const student = db.prepare("SELECT id, name, roll_no, grade, class, section, parent_contact, parent_email, photo_url, cnic, computer_number, balance, attendance_percentage FROM students WHERE id = ?").get(req.params.id);
      if (!student) return res.status(404).json({ error: "Student not found" });
      const transactions = db.prepare("SELECT * FROM transactions WHERE student_id = ? ORDER BY date DESC").all(req.params.id);
      const attendance = db.prepare("SELECT * FROM attendance WHERE student_id = ? ORDER BY date DESC").all(req.params.id);
      const grades = db.prepare("SELECT * FROM academic_records WHERE student_id = ?").all(req.params.id);
      res.json({ ...student, transactions, attendance, grades });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/students", (req, res) => {
    const { name, roll_no, grade, class: className, section, parent_contact, parent_email, emergency_contact, academic_notes, medical_notes, photo_url, cnic, computer_number, password } = req.body;
    try {
      const info = db.prepare("INSERT INTO students (name, roll_no, grade, class, section, parent_contact, parent_email, emergency_contact, academic_notes, medical_notes, photo_url, cnic, computer_number, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").run(name, roll_no, grade, className, section, parent_contact, parent_email, emergency_contact, academic_notes, medical_notes, photo_url, cnic, computer_number, password || 'password123');
      res.json({ id: info.lastInsertRowid });
    } catch (err) {
      res.status(400).json({ error: "Roll number already exists" });
    }
  });

  app.get("/api/transactions", (req, res) => {
    try {
      const { student_id, start_date, end_date } = req.query;
      let query = `
        SELECT t.*, s.name as student_name, s.roll_no 
        FROM transactions t 
        JOIN students s ON t.student_id = s.id 
        WHERE 1=1
      `;
      const params: any[] = [];

      if (student_id) {
        query += " AND t.student_id = ?";
        params.push(student_id);
      }
      if (start_date) {
        query += " AND t.date >= ?";
        params.push(start_date);
      }
      if (end_date) {
        query += " AND t.date <= ?";
        params.push(end_date);
      }

      query += " ORDER BY t.date DESC";
      const transactions = db.prepare(query).all(...params);
      res.json(transactions);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/transactions", (req, res) => {
    const { student_id, amount, type, fee_type, description, password } = req.body;
    
    try {
      if (fee_type === 'canteen' && type === 'debit' && description === 'Canteen Snack Purchase') {
        const student = db.prepare("SELECT password FROM students WHERE id = ?").get(student_id) as any;
        if (!student || student.password !== password) {
          return res.status(401).json({ error: "Incorrect student password for canteen purchase" });
        }
      }

      const transaction = db.transaction(() => {
        db.prepare("INSERT INTO transactions (student_id, amount, type, fee_type, description) VALUES (?, ?, ?, ?, ?)").run(student_id, amount, type, fee_type, description);
        
        if (type === 'credit') {
          db.prepare("UPDATE students SET balance = balance + ? WHERE id = ?").run(amount, student_id);
        } else {
          db.prepare("UPDATE students SET balance = balance - ? WHERE id = ?").run(amount, student_id);
        }
      });

      transaction();
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Transaction failed" });
    }
  });

  // Announcements
  app.get("/api/announcements", (req, res) => {
    try {
      const announcements = db.prepare("SELECT * FROM announcements ORDER BY date DESC").all();
      res.json(announcements);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/announcements", (req, res) => {
    try {
      const { title, content, category } = req.body;
      db.prepare("INSERT INTO announcements (title, content, category) VALUES (?, ?, ?)").run(title, content, category);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Attendance
  app.post("/api/attendance", (req, res) => {
    try {
      const { student_id, date, status } = req.body;
      db.prepare("INSERT INTO attendance (student_id, date, status) VALUES (?, ?, ?)").run(student_id, date, status);
      
      // Update percentage
      const stats = db.prepare("SELECT COUNT(*) as total, SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) as present FROM attendance WHERE student_id = ?").get(student_id);
      const percentage = (stats.present / stats.total) * 100;
      db.prepare("UPDATE students SET attendance_percentage = ? WHERE id = ?").run(percentage, student_id);
      
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/attendance/bulk", (req, res) => {
    const { records, date } = req.body; // records: [{student_id, status}]
    const insert = db.prepare("INSERT INTO attendance (student_id, date, status) VALUES (?, ?, ?)");
    const updatePercentage = db.prepare(`
      UPDATE students 
      SET attendance_percentage = (
        SELECT (SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) * 100.0 / COUNT(*))
        FROM attendance 
        WHERE student_id = ?
      )
      WHERE id = ?
    `);

    const transaction = db.transaction((records, date) => {
      for (const record of records) {
        // Delete existing for that day if any
        db.prepare("DELETE FROM attendance WHERE student_id = ? AND date = ?").run(record.student_id, date);
        insert.run(record.student_id, date, record.status);
        updatePercentage.run(record.student_id, record.student_id);
      }
    });

    try {
      transaction(records, date);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/attendance/report", (req, res) => {
    try {
      const { date, grade, class: className, section } = req.query;
      let query = `
        SELECT a.*, s.name as student_name, s.roll_no, s.class, s.section, s.grade
        FROM attendance a
        JOIN students s ON a.student_id = s.id
        WHERE 1=1
      `;
      const params: any[] = [];

      if (date) {
        query += " AND a.date = ?";
        params.push(date);
      }
      if (grade) {
        query += " AND s.grade = ?";
        params.push(grade);
      }
      if (className) {
        query += " AND s.class = ?";
        params.push(className);
      }
      if (section) {
        query += " AND s.section = ?";
        params.push(section);
      }

      const report = db.prepare(query).all(...params);
      res.json(report);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Syllabus
  app.get("/api/syllabus", (req, res) => {
    try {
      const syllabus = db.prepare("SELECT * FROM syllabus").all();
      res.json(syllabus);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/syllabus", (req, res) => {
    try {
      const { subject, grade, content, file_url } = req.body;
      db.prepare("INSERT INTO syllabus (subject, grade, content, file_url) VALUES (?, ?, ?, ?)").run(subject, grade, content, file_url);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Online Classes
  app.get("/api/online-classes", (req, res) => {
    try {
      const classes = db.prepare("SELECT * FROM online_classes").all();
      res.json(classes);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/online-classes", (req, res) => {
    try {
      const { grade, subject, link, time } = req.body;
      db.prepare("INSERT INTO online_classes (grade, subject, link, time) VALUES (?, ?, ?, ?)").run(grade, subject, link, time);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Schedules
  app.get("/api/schedules", (req, res) => {
    try {
      const schedules = db.prepare("SELECT * FROM schedules").all();
      res.json(schedules);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/schedules", (req, res) => {
    try {
      const { grade, day, time_slot, subject, teacher, location, is_weekend } = req.body;
      db.prepare("INSERT INTO schedules (grade, day, time_slot, subject, teacher, location, is_weekend) VALUES (?, ?, ?, ?, ?, ?, ?)").run(grade, day, time_slot, subject, teacher, location || '', is_weekend ? 1 : 0);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/academic-records", (req, res) => {
    try {
      const { student_id, subject, marks, total_marks, term } = req.body;
      db.prepare("INSERT INTO academic_records (student_id, subject, marks, total_marks, term) VALUES (?, ?, ?, ?, ?)").run(student_id, subject, marks, total_marks, term);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/stats", (req, res) => {
    try {
      const totalStudents = db.prepare("SELECT COUNT(*) as count FROM students").get().count;
      const totalBalance = db.prepare("SELECT SUM(balance) as total FROM students").get().total || 0;
      const recentTransactions = db.prepare(`
        SELECT t.*, s.name as student_name 
        FROM transactions t 
        JOIN students s ON t.student_id = s.id 
        ORDER BY t.date DESC LIMIT 5
      `).all();
      
      res.json({ totalStudents, totalBalance, recentTransactions });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Homework & Classwork
  app.get("/api/homework-classwork", (req, res) => {
    try {
      const { grade, class: className, section, type } = req.query;
      let query = "SELECT * FROM homework_classwork WHERE 1=1";
      const params: any[] = [];
      if (grade) { query += " AND grade = ?"; params.push(grade); }
      if (className) { query += " AND class = ?"; params.push(className); }
      if (section) { query += " AND section = ?"; params.push(section); }
      if (type) { query += " AND type = ?"; params.push(type); }
      query += " ORDER BY date_assigned DESC";
      const data = db.prepare(query).all(...params);
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/homework-classwork", (req, res) => {
    try {
      const { type, grade, class: className, section, subject, content, date_due } = req.body;
      db.prepare(`
        INSERT INTO homework_classwork (type, grade, class, section, subject, content, date_due)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(type, grade, className, section, subject, content, date_due);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Datesheets
  app.get("/api/datesheets", (req, res) => {
    try {
      const { grade } = req.query;
      let query = "SELECT * FROM datesheets WHERE 1=1";
      const params: any[] = [];
      if (grade) { query += " AND grade = ?"; params.push(grade); }
      query += " ORDER BY date ASC";
      const data = db.prepare(query).all(...params);
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/datesheets", (req, res) => {
    try {
      const { exam_name, grade, subject, date, time } = req.body;
      db.prepare(`
        INSERT INTO datesheets (exam_name, grade, subject, date, time)
        VALUES (?, ?, ?, ?, ?)
      `).run(exam_name, grade, subject, date, time);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Global error handler for API
  app.use("/api", (err: any, req: any, res: any, next: any) => {
    console.error("API Error:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  });

  // Vite middleware for development
  const isDev = process.env.NODE_ENV === "development" || !process.env.NODE_ENV;
  const distPath = path.join(__dirname, "dist");
  const indexExists = fs.existsSync(path.join(distPath, "index.html"));
  
  console.log("Environment Check:", {
    NODE_ENV: process.env.NODE_ENV,
    isDev,
    distPath,
    indexExists
  });

  if (isDev && !indexExists) {
    console.log("Starting in DEVELOPMENT mode with Vite");
    try {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } catch (e) {
      console.error("Failed to start Vite server:", e);
    }
  } else {
    console.log("Starting in PRODUCTION/STATIC mode");
    if (!indexExists) {
      console.warn("WARNING: index.html not found in dist folder!");
    }
    serveStatic(app);
  }

  // Distribute surplus among students, teachers, admins, and canteen staff
  app.post('/api/distribute-surplus', (req, res) => {
    try {
      // 1. Calculate surplus
      const summary = db.prepare(`
        SELECT 
          SUM(CASE WHEN type = 'credit' THEN amount ELSE 0 END) as totalCredit,
          SUM(CASE WHEN type = 'debit' THEN amount ELSE 0 END) as totalDebit
        FROM transactions
      `).get() as { totalCredit: number, totalDebit: number };

      const surplus = (summary.totalCredit || 0) - (summary.totalDebit || 0);

      if (surplus <= 0) {
        return res.status(400).json({ error: 'No surplus available for distribution' });
      }

      // 2. Get all recipients
      const students = db.prepare('SELECT id FROM students').all() as { id: number }[];
      const admins = db.prepare('SELECT id FROM admins').all() as { id: number }[];
      const canteenStaff = db.prepare('SELECT id FROM canteen_staff').all() as { id: number }[];

      const totalRecipients = students.length + admins.length + canteenStaff.length;

      if (totalRecipients === 0) {
        return res.status(400).json({ error: 'No recipients found' });
      }

      const share = Math.floor(surplus / totalRecipients);

      if (share <= 0) {
        return res.status(400).json({ error: 'Surplus too small to distribute' });
      }

      // 3. Distribute (Update balances and record transactions)
      const distribute = db.transaction(() => {
        const now = new Date().toISOString();
        
        // For students
        const updateStudent = db.prepare('UPDATE students SET balance = balance + ? WHERE id = ?');
        const insertTx = db.prepare(`
          INSERT INTO transactions (student_id, amount, type, fee_type, date, description)
          VALUES (?, ?, 'credit', 'other', ?, 'Surplus distribution share')
        `);

        for (const s of students) {
          updateStudent.run(share, s.id);
          insertTx.run(s.id, share, now);
        }

        // For admins
        const updateAdmin = db.prepare('UPDATE admins SET balance = balance + ? WHERE id = ?');
        for (const a of admins) {
          updateAdmin.run(share, a.id);
        }

        // For canteen staff
        const updateStaff = db.prepare('UPDATE canteen_staff SET balance = balance + ? WHERE id = ?');
        for (const cs of canteenStaff) {
          updateStaff.run(share, cs.id);
        }
      });

      distribute();

      res.json({ amount: surplus, share, count: totalRecipients });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Error handling middleware
  app.use((err: any, req: any, res: any, next: any) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong! Please try again later." });
  });

  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
}

function serveStatic(app: any) {
  const distPath = path.join(__dirname, "dist");
  console.log("Serving static files from:", distPath);
  app.use(express.static(distPath));
  app.get("*", (req: any, res: any) => {
    const indexPath = path.join(distPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send("Frontend not built. Please wait or run build.");
    }
  });
}

startServer();

export default app;
