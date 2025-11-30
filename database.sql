-- ============================================
-- Student Course Management System - Database Schema
-- ============================================

-- Enable UUID extension (optional, if you want to use UUIDs)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Table: students
-- Description: เก็บข้อมูลนักเรียน
-- ============================================
CREATE TABLE IF NOT EXISTS students (
  id BIGSERIAL PRIMARY KEY,
  fullname VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  major VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Index for faster email lookup
CREATE INDEX idx_students_email ON students(email);

-- ============================================
-- Table: courses
-- Description: เก็บข้อมูลคอร์สเรียน
-- ============================================
CREATE TABLE IF NOT EXISTS courses (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  credit INTEGER NOT NULL CHECK (credit > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Index for faster course name lookup
CREATE INDEX idx_courses_name ON courses(name);

-- ============================================
-- Table: enrollments
-- Description: เก็บข้อมูลการลงทะเบียนเรียน (Junction Table)
-- ============================================
CREATE TABLE IF NOT EXISTS enrollments (
  id BIGSERIAL PRIMARY KEY,
  student_id BIGINT NOT NULL,
  course_id BIGINT NOT NULL,
  enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  
  -- Foreign Keys
  CONSTRAINT fk_student
    FOREIGN KEY (student_id) 
    REFERENCES students(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    
  CONSTRAINT fk_course
    FOREIGN KEY (course_id)
    REFERENCES courses(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  
  -- Unique constraint to prevent duplicate enrollments
  CONSTRAINT unique_enrollment UNIQUE (student_id, course_id)
);

-- Indexes for faster queries
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
CREATE INDEX idx_enrollments_date ON enrollments(enrollment_date);

-- ============================================
-- Sample Data (Optional - for testing)
-- ============================================

-- Insert sample students
INSERT INTO students (fullname, email, major) VALUES
  ('สมชาย ใจดี', 'somchai@example.com', 'Computer Science'),
  ('สมหญิง รักเรียน', 'somying@example.com', 'Information Technology'),
  ('ประยุทธ์ มั่นคง', 'prayuth@example.com', 'Software Engineering'),
  ('สุดา สวยงาม', 'suda@example.com', 'Computer Science')
ON CONFLICT (email) DO NOTHING;

-- Insert sample courses
INSERT INTO courses (name, description, credit) VALUES
  ('Database Systems', 'Introduction to database design, SQL, and database management systems', 3),
  ('Web Development', 'Learn HTML, CSS, JavaScript, and modern web frameworks', 3),
  ('Data Structures', 'Study of fundamental data structures and algorithms', 3),
  ('Mobile App Development', 'Build iOS and Android applications', 3),
  ('Cloud Computing', 'Introduction to cloud platforms like AWS, Azure, and GCP', 3)
ON CONFLICT DO NOTHING;

-- Insert sample enrollments
INSERT INTO enrollments (student_id, course_id) VALUES
  (1, 1), -- สมชาย เรียน Database
  (1, 2), -- สมชาย เรียน Web Dev
  (2, 1), -- สมหญิง เรียน Database
  (2, 3), -- สมหญิง เรียน Data Structures
  (3, 2), -- ประยุทธ์ เรียน Web Dev
  (3, 4), -- ประยุทธ์ เรียน Mobile App
  (4, 1), -- สุดา เรียน Database
  (4, 5)  -- สุดา เรียน Cloud Computing
ON CONFLICT (student_id, course_id) DO NOTHING;

-- ============================================
-- Useful Queries (for reference)
-- ============================================

-- Query 1: ดูนักเรียนทั้งหมดพร้อมจำนวนคอร์สที่ลงทะเบียน
-- SELECT 
--   s.id, 
--   s.fullname, 
--   s.email, 
--   s.major,
--   COUNT(e.id) as enrolled_courses
-- FROM students s
-- LEFT JOIN enrollments e ON s.id = e.student_id
-- GROUP BY s.id, s.fullname, s.email, s.major
-- ORDER BY enrolled_courses DESC;

-- Query 2: ดูคอร์สทั้งหมดพร้อมจำนวนนักเรียนที่ลงทะเบียน
-- SELECT 
--   c.id,
--   c.name,
--   c.credit,
--   COUNT(e.id) as student_count
-- FROM courses c
-- LEFT JOIN enrollments e ON c.id = e.course_id
-- GROUP BY c.id, c.name, c.credit
-- ORDER BY student_count DESC;

-- Query 3: ดูการลงทะเบียนทั้งหมดพร้อมรายละเอียด
-- SELECT 
--   e.id,
--   s.fullname as student_name,
--   s.email as student_email,
--   c.name as course_name,
--   c.credit,
--   e.enrollment_date
-- FROM enrollments e
-- JOIN students s ON e.student_id = s.id
-- JOIN courses c ON e.course_id = c.id
-- ORDER BY e.enrollment_date DESC;

-- Query 4: ดูคอร์สที่นักเรียนคนใดลงทะเบียน (แทน student_id ด้วย ID จริง)
-- SELECT 
--   c.id,
--   c.name,
--   c.description,
--   c.credit,
--   e.enrollment_date
-- FROM courses c
-- JOIN enrollments e ON c.id = e.course_id
-- WHERE e.student_id = 1;

-- Query 5: ดูนักเรียนที่ลงทะเบียนในคอร์สใด (แทน course_id ด้วย ID จริง)
-- SELECT 
--   s.id,
--   s.fullname,
--   s.email,
--   s.major,
--   e.enrollment_date
-- FROM students s
-- JOIN enrollments e ON s.id = e.student_id
-- WHERE e.course_id = 1;

-- ============================================
-- Row Level Security (Optional - for Supabase)
-- ============================================

-- Enable RLS
-- ALTER TABLE students ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- Create policies (Example - adjust based on your needs)
-- CREATE POLICY "Public students are viewable by everyone"
--   ON students FOR SELECT
--   USING (true);

-- CREATE POLICY "Public courses are viewable by everyone"
--   ON courses FOR SELECT
--   USING (true);

-- CREATE POLICY "Public enrollments are viewable by everyone"
--   ON enrollments FOR SELECT
--   USING (true);

-- ============================================
-- Cleanup (ใช้เมื่อต้องการลบตารางทั้งหมด)
-- ============================================
-- DROP TABLE IF EXISTS enrollments CASCADE;
-- DROP TABLE IF EXISTS students CASCADE;
-- DROP TABLE IF EXISTS courses CASCADE;
