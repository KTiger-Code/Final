# Student Course Management System API

ระบบจัดการนักเรียนและคอร์สเรียน พัฒนาด้วย Node.js, Express และ Supabase

## 📋 คุณสมบัติของระบบ

- ✅ จัดการข้อมูลนักเรียน (เพิ่ม/แก้ไข/ลบ/ค้นหา)
- ✅ จัดการข้อมูลคอร์สเรียน (เพิ่ม/แก้ไข/ลบ/ค้นหา)
- ✅ ลงทะเบียนนักเรียนเข้าเรียนคอร์ส
- ✅ ดูรายงานการลงทะเบียน
- ✅ RESTful API Design
- ✅ Database: Supabase (PostgreSQL)

## 🛠️ เทคโนโลยีที่ใช้

- **Node.js** - JavaScript Runtime
- **Express.js** - Web Framework
- **Supabase** - Backend as a Service (PostgreSQL Database)
- **CORS** - Cross-Origin Resource Sharing
- **dotenv** - Environment Variables Management

## 📦 การติดตั้ง

### 1. Clone โปรเจกต์

```bash
git clone <your-repository-url>
cd Final
```

### 2. ติดตั้ง Dependencies

```bash
npm install
```

### 3. ตั้งค่า Environment Variables

สร้างไฟล์ `.env` ในโฟลเดอร์หลัก และเพิ่มค่าดังนี้:

```env
SUPABASE_URL=your_supabase_url_here
SUPABASE_KEY=your_supabase_anon_key_here
PORT=3000
NODE_ENV=development
```

**วิธีหา Supabase URL และ Key:**
1. ไปที่ [Supabase Dashboard](https://supabase.com/dashboard)
2. เลือกโปรเจกต์ของคุณ
3. ไปที่ Settings > API
4. คัดลอก `URL` และ `anon/public key`

### 4. สร้างตารางในฐานข้อมูล Supabase

เข้าไปที่ SQL Editor ใน Supabase และรันคำสั่ง SQL ในไฟล์ `database.sql`

### 5. รันเซิร์ฟเวอร์

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

เซิร์ฟเวอร์จะรันที่ `http://localhost:3000`

## 📚 API Endpoints

### Students (นักเรียน)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/students` | ดึงข้อมูลนักเรียนทั้งหมด |
| GET | `/api/students/:id` | ดึงข้อมูลนักเรียนตาม ID |
| POST | `/api/students` | สร้างนักเรียนใหม่ |
| PUT | `/api/students/:id` | แก้ไขข้อมูลนักเรียน |
| DELETE | `/api/students/:id` | ลบนักเรียน |
| GET | `/api/students/:id/courses` | ดึงรายวิชาที่นักเรียนลงทะเบียน |

**Request Body (POST/PUT):**
```json
{
  "fullname": "สมชาย ใจดี",
  "email": "somchai@example.com",
  "major": "Computer Science"
}
```

### Courses (คอร์สเรียน)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/courses` | ดึงข้อมูลคอร์สทั้งหมด |
| GET | `/api/courses/:id` | ดึงข้อมูลคอร์สตาม ID |
| POST | `/api/courses` | สร้างคอร์สใหม่ |
| PUT | `/api/courses/:id` | แก้ไขข้อมูลคอร์ส |
| DELETE | `/api/courses/:id` | ลบคอร์ส |
| GET | `/api/courses/:id/students` | ดึงรายชื่อนักเรียนที่ลงทะเบียน |

**Request Body (POST/PUT):**
```json
{
  "name": "Database Systems",
  "description": "Introduction to database design and SQL",
  "credit": 3
}
```

### Enrollments (การลงทะเบียน)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/enrollments` | ดึงข้อมูลการลงทะเบียนทั้งหมด |
| GET | `/api/enrollments/:id` | ดึงข้อมูลการลงทะเบียนตาม ID |
| POST | `/api/enrollments` | ลงทะเบียนนักเรียนเข้าคอร์ส |
| DELETE | `/api/enrollments/:id` | ยกเลิกการลงทะเบียน |

**Request Body (POST):**
```json
{
  "student_id": 1,
  "course_id": 1
}
```

## 🧪 การทดสอบด้วย Postman

1. Import Postman Collection จากไฟล์ `postman_collection.json`
2. Import Environment จากไฟล์ `postman_environment.json`
3. แก้ไข Environment Variable `base_url` เป็น URL ของเซิร์ฟเวอร์ของคุณ
4. ทดสอบ API ตาม Test Cases ในไฟล์ `POSTMAN_GUIDE.md`

## 📖 โครงสร้างโปรเจกต์

```
Final/
├── config/
│   └── supabase.js          # Supabase configuration
├── routes/
│   ├── students.js          # Students routes
│   ├── courses.js           # Courses routes
│   └── enrollments.js       # Enrollments routes
├── diagrams/
│   ├── ERD.png              # Entity Relationship Diagram
│   └── UseCase.png          # Use Case Diagram
├── .env.example             # Environment variables template
├── .gitignore               # Git ignore file
├── database.sql             # Database schema
├── DOCUMENTATION.md         # Technical documentation
├── POSTMAN_GUIDE.md         # Postman testing guide
├── package.json             # Project dependencies
├── README.md                # This file
└── server.js                # Main server file
```

## 🚀 การ Deploy บน Render

1. สร้างบัญชีที่ [Render.com](https://render.com)
2. เชื่อมต่อ GitHub Repository
3. สร้าง Web Service ใหม่
4. ตั้งค่า Environment Variables (`SUPABASE_URL`, `SUPABASE_KEY`)
5. Deploy!

ดูรายละเอียดเพิ่มเติมในไฟล์ `DOCUMENTATION.md` หัวข้อ "6. Deployment"

## 📝 เอกสารเพิ่มเติม

- [DOCUMENTATION.md](./DOCUMENTATION.md) - เอกสารวิเคราะห์และออกแบบระบบ
- [POSTMAN_GUIDE.md](./POSTMAN_GUIDE.md) - คู่มือการทดสอบ API
- [database.sql](./database.sql) - SQL Schema สำหรับสร้างตาราง

## 👨‍💻 ผู้พัฒนา

นักศึกษา: Narongsak  
โครงการ: ข้อสอบปฏิบัติการสร้าง API และเชื่อมต่อฐานข้อมูล

## 📄 License

ISC

## 🔗 Links

- **GitHub Repository:** [Link to your repo]
- **API Deployment (Render):** [Link to deployed API]
- **CodeSandbox:** [Link to CodeSandbox]
- **Postman Collection:** [Link to Postman]

---

**หมายเหตุ:** อย่าลืมเปลี่ยน `SUPABASE_URL` และ `SUPABASE_KEY` ในไฟล์ `.env` ของคุณ!
