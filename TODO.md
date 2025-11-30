# ขั้นตอนการทำโปรเจกต์ Student Course Management System

## 📋 สิ่งที่ต้องทำทั้งหมด

### ✅ สิ่งที่สร้างไว้แล้ว

ฉันได้สร้างไฟล์และโค้ดให้ครบแล้ว:

1. ✅ **Backend API** (Node.js + Express)
   - `server.js` - Main server file
   - `routes/students.js` - Student CRUD endpoints
   - `routes/courses.js` - Course CRUD endpoints
   - `routes/enrollments.js` - Enrollment endpoints
   - `config/supabase.js` - Database connection

2. ✅ **Database**
   - `database.sql` - SQL สำหรับสร้างตารางบน Supabase

3. ✅ **เอกสาร**
   - `README.md` - คู่มือการใช้งาน
   - `DOCUMENTATION.md` - เอกสารวิเคราะห์และออกแบบ
   - `POSTMAN_GUIDE.md` - คู่มือทดสอบ API
   - `.env.example` - Template สำหรับ environment variables

---

## 🚀 ขั้นตอนที่คุณต้องทำต่อ

### 1️⃣ ติดตั้ง Dependencies

เปิด Terminal ใน VS Code และรันคำสั่ง:

```bash
npm install
```

---

### 2️⃣ สร้างฐานข้อมูลบน Supabase

#### ขั้นตอน:

1. **ไปที่ [Supabase](https://supabase.com)**
   - Sign up / Login
   - สร้าง Project ใหม่

2. **สร้างตาราง**
   - ไปที่ SQL Editor
   - คัดลอกโค้ดทั้งหมดจากไฟล์ `database.sql`
   - Paste และ Run

3. **คัดลอก Credentials**
   - ไปที่ Settings > API
   - คัดลอก:
     - `Project URL` (SUPABASE_URL)
     - `anon/public key` (SUPABASE_KEY)

---

### 3️⃣ ตั้งค่า Environment Variables

สร้างไฟล์ `.env` ในโฟลเดอร์หลัก:

```bash
# คัดลอกจาก .env.example
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_KEY=your_anon_key_here
PORT=3000
NODE_ENV=development
```

---

### 4️⃣ ทดสอบรัน Server

```bash
npm start
```

เปิดเบราว์เซอร์ไปที่: `http://localhost:3000`

ควรเห็น:
```json
{
  "message": "Welcome to Student Course Management System API",
  "version": "1.0.0",
  "endpoints": {
    "students": "/api/students",
    "courses": "/api/courses",
    "enrollments": "/api/enrollments"
  }
}
```

---

### 5️⃣ ทดสอบ API ด้วย Postman

1. **ดาวน์โหลด Postman:** [https://www.postman.com](https://www.postman.com)

2. **ทดสอบ API ตามคู่มือ** `POSTMAN_GUIDE.md`:
   - GET all students
   - POST create student
   - PUT update student
   - DELETE student
   - ทำเช่นเดียวกันกับ courses และ enrollments

3. **Export Postman Collection**
   - คลิก Collection > ... > Export
   - บันทึกเป็น `postman_collection.json`

---

### 6️⃣ สร้าง ERD และ Use Case Diagram

**เครื่องมือแนะนำ:**
- [Draw.io](https://app.diagrams.net/)
- [dbdiagram.io](https://dbdiagram.io/)
- [Lucidchart](https://www.lucidchart.com/)

**สร้างไฟล์:**
- `diagrams/ERD.png` - Entity Relationship Diagram
- `diagrams/UseCase.png` - Use Case Diagram

**ตัวอย่าง ERD ดูได้จาก** `DOCUMENTATION.md` ส่วน 1.3

---

### 7️⃣ Upload โปรเจกต์ขึ้น GitHub

```bash
# Initialize Git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Student Course Management System"

# Create repository on GitHub (ทำบนเว็บ GitHub)
# จากนั้นเชื่อมต่อ:
git remote add origin https://github.com/YOUR_USERNAME/student-course-api.git

# Push
git branch -M main
git push -u origin main
```

**อย่าลืม:** ไฟล์ `.env` จะไม่ถูก push ขึ้น GitHub (อยู่ใน .gitignore)

---

### 8️⃣ Deploy บน Render

#### ขั้นตอน:

1. **ไปที่ [Render.com](https://render.com)**
   - Sign up with GitHub

2. **สร้าง Web Service**
   - คลิก "New +" > "Web Service"
   - เชื่อมต่อ GitHub Repository
   - ตั้งค่า:
     ```
     Name: student-course-api
     Environment: Node
     Build Command: npm install
     Start Command: npm start
     ```

3. **ตั้งค่า Environment Variables**
   ```
   SUPABASE_URL=your_url
   SUPABASE_KEY=your_key
   PORT=3000
   NODE_ENV=production
   ```

4. **Deploy**
   - คลิก "Create Web Service"
   - รอ 3-5 นาที
   - ได้ URL เช่น: `https://student-course-api-xxxx.onrender.com`

---

### 9️⃣ Upload โปรเจกต์ไปยัง CodeSandbox (Optional)

1. **ไปที่ [CodeSandbox.io](https://codesandbox.io)**
2. **Import from GitHub**
   - เชื่อมต่อ GitHub
   - เลือก Repository
   - จะได้ URL เช่น: `https://codesandbox.io/s/xxxxx`

---

## 📦 สิ่งที่ต้องส่ง

### ✅ Checklist ก่อนส่งงาน:

- [ ] 1. **GitHub Repository**
  - มี README.md ครบถ้วน
  - มี DOCUMENTATION.md
  - มี POSTMAN_GUIDE.md
  - มี database.sql
  - Code สมบูรณ์

- [ ] 2. **URL CodeSandbox**
  - Import จาก GitHub แล้ว

- [ ] 3. **Postman Collection + Environment**
  - Export Collection (.json)
  - Export Environment (.json)

- [ ] 4. **URL Render (Deployed Backend)**
  - ทดสอบ API ด้วย Postman ได้

- [ ] 5. **ERD, Use Case Diagram**
  - `diagrams/ERD.png`
  - `diagrams/UseCase.png`

---

## 📝 รายละเอียดที่ต้องส่ง

### 1. GitHub Repository Link
```
https://github.com/YOUR_USERNAME/student-course-api
```

### 2. CodeSandbox URL
```
https://codesandbox.io/s/xxxxx
```

### 3. Render Deployment URL
```
https://student-course-api-xxxx.onrender.com
```

### 4. Postman Files
- `postman_collection.json`
- `postman_environment.json`

### 5. Diagrams
- `diagrams/ERD.png`
- `diagrams/UseCase.png`

---

## 🎯 คะแนนประเมิน (ตัวอย่าง)

1. **API Development (30%)**
   - CRUD endpoints ครบถ้วน
   - RESTful design ถูกต้อง
   - Error handling

2. **Database Design (20%)**
   - ERD ชัดเจน
   - Normalization ถูกต้อง
   - Foreign Keys ครบ

3. **Documentation (20%)**
   - README ครบถ้วน
   - API documentation ชัดเจน
   - Use Case & ERD

4. **Testing (15%)**
   - Postman Collection ครบ
   - Test Cases ครบทุก endpoint

5. **Deployment (15%)**
   - Deploy สำเร็จ
   - API ใช้งานได้

---

## 🆘 หากเจอปัญหา

### ปัญหา 1: npm install ไม่ผ่าน
```bash
# ลบ node_modules และลองใหม่
rm -rf node_modules
npm install
```

### ปัญหา 2: Server ไม่ทำงาน
- ตรวจสอบ `.env` มีค่าครบหรือไม่
- ตรวจสอบ Supabase URL และ Key ถูกต้องหรือไม่

### ปัญหา 3: Database error
- ตรวจสอบว่ารัน `database.sql` บน Supabase แล้ว
- ตรวจสอบ Connection string

### ปัญหา 4: Render deploy ไม่สำเร็จ
- ตรวจสอบ logs ใน Render Dashboard
- ตรวจสอบ Environment Variables

---

## 📚 เอกสารอ้างอิง

- [Express.js Documentation](https://expressjs.com/)
- [Supabase Documentation](https://supabase.com/docs)
- [Postman Documentation](https://learning.postman.com/)
- [Render Documentation](https://render.com/docs)
- [RESTful API Design](https://restfulapi.net/)

---

## 💡 Tips เพิ่มเติม

1. **ทำ Git commit บ่อยๆ** - แต่ละฟีเจอร์ commit แยก
2. **เขียน commit message ที่ชัดเจน** - อธิบายว่าเปลี่ยนอะไร
3. **ทดสอบก่อน deploy** - ให้แน่ใจว่า local ทำงานได้
4. **เก็บ secrets ปลอดภัย** - อย่า commit .env ขึ้น GitHub
5. **อ่าน Error messages** - ช่วยแก้ปัญหาได้เร็วขึ้น

---

**Good luck! 🚀**

หากมีคำถาม สามารถถามได้เลย!
