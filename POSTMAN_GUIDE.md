# Postman Testing Guide
# Student Course Management System API

## 📋 สารบัญ
1. [การติดตั้ง Postman](#การติดตั้ง-postman)
2. [การตั้งค่า Environment](#การตั้งค่า-environment)
3. [Test Cases สำหรับแต่ละ API](#test-cases)
4. [Expected Output](#expected-output)
5. [Error Handling](#error-handling)

---

## การติดตั้ง Postman

1. ดาวน์โหลด Postman จาก [https://www.postman.com/downloads/](https://www.postman.com/downloads/)
2. ติดตั้งและเปิดโปรแกรม
3. สร้างบัญชีหรือ Sign in

---

## การตั้งค่า Environment

### สร้าง Environment ใหม่

1. คลิก **Environments** ในแถบด้านซ้าย
2. คลิก **"+"** เพื่อสร้าง Environment ใหม่
3. ตั้งชื่อ: `Student Course API - Local`

### ตั้งค่า Variables

| Variable Name | Initial Value | Current Value |
|---------------|---------------|---------------|
| `base_url` | `http://localhost:3000` | `http://localhost:3000` |
| `deployed_url` | `https://your-app.onrender.com` | `https://your-app.onrender.com` |
| `student_id` | `1` | `1` |
| `course_id` | `1` | `1` |
| `enrollment_id` | `1` | `1` |

**สำหรับ Production:**
สร้าง Environment ใหม่ชื่อ `Student Course API - Production` และใช้ `deployed_url`

---

## Test Cases

## 📚 1. Students API

### 1.1 GET All Students
**ทดสอบ:** ดึงข้อมูลนักเรียนทั้งหมด

```
Method: GET
URL: {{base_url}}/api/students
Headers: (none required)
Body: (none)
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "count": 4,
  "data": [
    {
      "id": 1,
      "fullname": "สมชาย ใจดี",
      "email": "somchai@example.com",
      "major": "Computer Science",
      "created_at": "2024-01-01T00:00:00.000Z"
    },
    ...
  ]
}
```

**Postman Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has success property", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.eql(true);
});

pm.test("Response has data array", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.data).to.be.an('array');
});
```

---

### 1.2 GET Student by ID
**ทดสอบ:** ดึงข้อมูลนักเรียนตาม ID

```
Method: GET
URL: {{base_url}}/api/students/{{student_id}}
Headers: (none required)
Body: (none)
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "fullname": "สมชาย ใจดี",
    "email": "somchai@example.com",
    "major": "Computer Science",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Postman Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has student data", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.data).to.have.property('id');
    pm.expect(jsonData.data).to.have.property('fullname');
    pm.expect(jsonData.data).to.have.property('email');
});
```

**Error Case - Student Not Found (404):**
```
URL: {{base_url}}/api/students/9999
Expected: 404 Not Found
```

---

### 1.3 POST Create Student
**ทดสอบ:** สร้างนักเรียนใหม่

```
Method: POST
URL: {{base_url}}/api/students
Headers: Content-Type: application/json
Body (raw JSON):
```
```json
{
  "fullname": "ทดสอบ สร้างนักเรียน",
  "email": "test.student@example.com",
  "major": "Computer Science"
}
```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "message": "Student created successfully",
  "data": {
    "id": 5,
    "fullname": "ทดสอบ สร้างนักเรียน",
    "email": "test.student@example.com",
    "major": "Computer Science",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}
```

**Postman Tests:**
```javascript
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Student created successfully", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.eql(true);
    pm.expect(jsonData.data).to.have.property('id');
    
    // Save student_id for later use
    pm.environment.set("created_student_id", jsonData.data.id);
});
```

**Error Cases:**

**Missing required fields (400):**
```json
{
  "fullname": "Test Only"
}
// Expected: 400 Bad Request
// Error: "Please provide fullname, email, and major"
```

**Duplicate email (500):**
```json
{
  "fullname": "Duplicate",
  "email": "somchai@example.com",
  "major": "IT"
}
// Expected: 500 Internal Server Error
// Error: "duplicate key value violates unique constraint"
```

---

### 1.4 PUT Update Student
**ทดสอบ:** แก้ไขข้อมูลนักเรียน

```
Method: PUT
URL: {{base_url}}/api/students/{{student_id}}
Headers: Content-Type: application/json
Body (raw JSON):
```
```json
{
  "fullname": "สมชาย ใจดี (แก้ไข)",
  "major": "Software Engineering"
}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Student updated successfully",
  "data": {
    "id": 1,
    "fullname": "สมชาย ใจดี (แก้ไข)",
    "email": "somchai@example.com",
    "major": "Software Engineering",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Postman Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Student updated successfully", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.eql(true);
    pm.expect(jsonData.message).to.include("updated");
});
```

---

### 1.5 DELETE Student
**ทดสอบ:** ลบนักเรียน

```
Method: DELETE
URL: {{base_url}}/api/students/{{created_student_id}}
Headers: (none required)
Body: (none)
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Student deleted successfully",
  "data": {
    "id": 5,
    "fullname": "ทดสอบ สร้างนักเรียน",
    "email": "test.student@example.com",
    "major": "Computer Science",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}
```

**Postman Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Student deleted successfully", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.eql(true);
});
```

---

### 1.6 GET Student's Courses
**ทดสอบ:** ดูคอร์สที่นักเรียนลงทะเบียน

```
Method: GET
URL: {{base_url}}/api/students/{{student_id}}/courses
Headers: (none required)
Body: (none)
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "student_id": 1,
      "course_id": 1,
      "enrollment_date": "2024-01-01T00:00:00.000Z",
      "courses": {
        "id": 1,
        "name": "Database Systems",
        "description": "Introduction to database design",
        "credit": 3
      }
    },
    ...
  ]
}
```

---

## 📘 2. Courses API

### 2.1 GET All Courses

```
Method: GET
URL: {{base_url}}/api/courses
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": 1,
      "name": "Database Systems",
      "description": "Introduction to database design, SQL, and DBMS",
      "credit": 3,
      "created_at": "2024-01-01T00:00:00.000Z"
    },
    ...
  ]
}
```

---

### 2.2 GET Course by ID

```
Method: GET
URL: {{base_url}}/api/courses/{{course_id}}
```

---

### 2.3 POST Create Course

```
Method: POST
URL: {{base_url}}/api/courses
Body:
```
```json
{
  "name": "Machine Learning",
  "description": "Introduction to ML algorithms and applications",
  "credit": 3
}
```

**Expected Response (201 Created)**

---

### 2.4 PUT Update Course

```
Method: PUT
URL: {{base_url}}/api/courses/{{course_id}}
Body:
```
```json
{
  "name": "Database Systems (Updated)",
  "credit": 4
}
```

---

### 2.5 DELETE Course

```
Method: DELETE
URL: {{base_url}}/api/courses/{{course_id}}
```

---

### 2.6 GET Students in Course

```
Method: GET
URL: {{base_url}}/api/courses/{{course_id}}/students
```

**Expected Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": 1,
      "student_id": 1,
      "course_id": 1,
      "enrollment_date": "2024-01-01T00:00:00.000Z",
      "students": {
        "id": 1,
        "fullname": "สมชาย ใจดี",
        "email": "somchai@example.com",
        "major": "Computer Science"
      }
    },
    ...
  ]
}
```

---

## 📗 3. Enrollments API

### 3.1 GET All Enrollments

```
Method: GET
URL: {{base_url}}/api/enrollments
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "count": 8,
  "data": [
    {
      "id": 1,
      "student_id": 1,
      "course_id": 1,
      "enrollment_date": "2024-01-01T00:00:00.000Z",
      "students": {
        "id": 1,
        "fullname": "สมชาย ใจดี",
        "email": "somchai@example.com",
        "major": "Computer Science"
      },
      "courses": {
        "id": 1,
        "name": "Database Systems",
        "description": "Introduction to database design",
        "credit": 3
      }
    },
    ...
  ]
}
```

---

### 3.2 GET Enrollment by ID

```
Method: GET
URL: {{base_url}}/api/enrollments/{{enrollment_id}}
```

---

### 3.3 POST Create Enrollment

```
Method: POST
URL: {{base_url}}/api/enrollments
Body:
```
```json
{
  "student_id": 1,
  "course_id": 5
}
```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "message": "Enrollment created successfully",
  "data": {
    "id": 9,
    "student_id": 1,
    "course_id": 5,
    "enrollment_date": "2024-01-15T10:30:00.000Z",
    "students": {...},
    "courses": {...}
  }
}
```

**Postman Tests:**
```javascript
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Enrollment created", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.eql(true);
    pm.environment.set("enrollment_id", jsonData.data.id);
});
```

**Error Cases:**

**Student not found (404):**
```json
{
  "student_id": 9999,
  "course_id": 1
}
```

**Course not found (404):**
```json
{
  "student_id": 1,
  "course_id": 9999
}
```

**Already enrolled (400):**
```json
{
  "student_id": 1,
  "course_id": 1
}
// Expected: 400 Bad Request
// Error: "Student is already enrolled in this course"
```

---

### 3.4 DELETE Enrollment

```
Method: DELETE
URL: {{base_url}}/api/enrollments/{{enrollment_id}}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Enrollment deleted successfully",
  "data": {...}
}
```

---

## Expected Output

### Success Responses

| Status Code | Meaning | Used For |
|-------------|---------|----------|
| 200 OK | Success | GET, PUT, DELETE |
| 201 Created | Resource created | POST |

**Response Format:**
```json
{
  "success": true,
  "message": "Operation completed successfully", // optional
  "data": {...}, // single object or array
  "count": 10 // optional, for lists
}
```

---

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "error": "Error message description"
}
```

### Common Error Status Codes

| Status Code | Meaning | Example |
|-------------|---------|---------|
| 400 Bad Request | Invalid input | Missing required fields |
| 404 Not Found | Resource not found | Student ID doesn't exist |
| 500 Internal Server Error | Server error | Database connection failed |

### Error Test Cases

#### 1. Missing Required Fields (400)
```
POST {{base_url}}/api/students
Body: {}

Expected Response:
{
  "success": false,
  "error": "Please provide fullname, email, and major"
}
```

#### 2. Resource Not Found (404)
```
GET {{base_url}}/api/students/9999

Expected Response:
{
  "success": false,
  "error": "Student not found"
}
```

#### 3. Duplicate Entry (500)
```
POST {{base_url}}/api/students
Body: {
  "fullname": "Test",
  "email": "somchai@example.com", // already exists
  "major": "CS"
}

Expected Response:
{
  "success": false,
  "error": "duplicate key value violates unique constraint..."
}
```

#### 4. Invalid Foreign Key (404/500)
```
POST {{base_url}}/api/enrollments
Body: {
  "student_id": 9999,
  "course_id": 1
}

Expected Response:
{
  "success": false,
  "error": "Student not found"
}
```

---

## 🧪 Testing Workflow

### ลำดับการทดสอบที่แนะนำ:

1. **GET All** - ทดสอบว่า API ทำงาน
2. **POST Create** - สร้างข้อมูลใหม่
3. **GET by ID** - ตรวจสอบข้อมูลที่สร้าง
4. **PUT Update** - แก้ไขข้อมูล
5. **GET by ID** - ตรวจสอบการแก้ไข
6. **DELETE** - ลบข้อมูล
7. **GET by ID** - ยืนยันว่าลบแล้ว (ควรได้ 404)

### Full Test Scenario

```
1. GET /api/students (ดูข้อมูลเดิม)
2. POST /api/students (สร้างนักเรียนใหม่)
3. POST /api/courses (สร้างคอร์สใหม่)
4. POST /api/enrollments (ลงทะเบียน)
5. GET /api/students/:id/courses (ดูคอร์สของนักเรียน)
6. GET /api/courses/:id/students (ดูนักเรียนในคอร์ส)
7. DELETE /api/enrollments/:id (ยกเลิกการลงทะเบียน)
8. DELETE /api/students/:id (ลบนักเรียน)
9. DELETE /api/courses/:id (ลบคอร์ส)
```

---

## 📝 Postman Collection Structure

แนะนำให้สร้าง Collection ดังนี้:

```
Student Course Management API
├── Students
│   ├── GET All Students
│   ├── GET Student by ID
│   ├── POST Create Student
│   ├── PUT Update Student
│   ├── DELETE Student
│   └── GET Student's Courses
├── Courses
│   ├── GET All Courses
│   ├── GET Course by ID
│   ├── POST Create Course
│   ├── PUT Update Course
│   ├── DELETE Course
│   └── GET Course's Students
└── Enrollments
    ├── GET All Enrollments
    ├── GET Enrollment by ID
    ├── POST Create Enrollment
    └── DELETE Enrollment
```

---

## ✅ Test Checklist

- [ ] ทดสอบ GET All ทุก endpoint
- [ ] ทดสอบ GET by ID (Success case)
- [ ] ทดสอบ GET by ID (Not found case)
- [ ] ทดสอบ POST Create (Success case)
- [ ] ทดสอบ POST Create (Missing fields)
- [ ] ทดสอบ POST Create (Duplicate data)
- [ ] ทดสอบ PUT Update (Success case)
- [ ] ทดสอบ DELETE (Success case)
- [ ] ทดสอบ Relationships (GET student's courses, course's students)
- [ ] ทดสอบ Enrollment (Create, Duplicate, Delete)

---

**หมายเหตุ:** 
- ใช้ Environment Variables เพื่อความสะดวกในการเปลี่ยน URL
- เก็บ ID ที่สร้างใหม่ลงใน Environment Variable เพื่อใช้ในการทดสอบต่อ
- ทดสอบทั้ง Success และ Error cases
- ใช้ Tests script ใน Postman เพื่อ automate การทดสอบ
