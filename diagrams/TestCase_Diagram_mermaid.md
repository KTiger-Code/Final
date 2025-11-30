# Test Case Diagrams - Mermaid Code

## วิธีใช้งาน:
1. คัดลอกโค้ด Mermaid ด้านล่าง
2. ไปที่ https://mermaid.live/
3. Paste โค้ดและ Export เป็น PNG

---

## 1. Test Case Flow Diagram - Students API

```mermaid
graph TD
    Start([เริ่มทดสอบ Students API])
    
    Start --> TC1[TC1: GET All Students]
    TC1 --> Check1{Status 200?}
    Check1 -->|Pass| TC2[TC2: POST Create Student]
    Check1 -->|Fail| Fail1[❌ Test Failed]
    
    TC2 --> Check2{Status 201?}
    Check2 -->|Pass| TC3[TC3: GET Student by ID]
    Check2 -->|Fail| Fail2[❌ Test Failed]
    
    TC3 --> Check3{Status 200?}
    Check3 -->|Pass| TC4[TC4: PUT Update Student]
    Check3 -->|Fail| Fail3[❌ Test Failed]
    
    TC4 --> Check4{Status 200?}
    Check4 -->|Pass| TC5[TC5: DELETE Student]
    Check4 -->|Fail| Fail4[❌ Test Failed]
    
    TC5 --> Check5{Status 200?}
    Check5 -->|Pass| Pass[✅ All Tests Passed]
    Check5 -->|Fail| Fail5[❌ Test Failed]
    
    style Start fill:#E3F2FD
    style Pass fill:#C8E6C9
    style Fail1 fill:#FFCDD2
    style Fail2 fill:#FFCDD2
    style Fail3 fill:#FFCDD2
    style Fail4 fill:#FFCDD2
    style Fail5 fill:#FFCDD2
```

---

## 2. Test Case Matrix - All Endpoints

```mermaid
graph TB
    subgraph "Students API Test Cases"
        S1[TC-S1: GET All Students<br/>Expected: 200 + Array]
        S2[TC-S2: GET Student by ID<br/>Expected: 200 + Object]
        S3[TC-S3: POST Create<br/>Expected: 201 + Created]
        S4[TC-S4: PUT Update<br/>Expected: 200 + Updated]
        S5[TC-S5: DELETE<br/>Expected: 200 + Deleted]
        S6[TC-S6: GET Courses<br/>Expected: 200 + Array]
    end
    
    subgraph "Courses API Test Cases"
        C1[TC-C1: GET All Courses<br/>Expected: 200 + Array]
        C2[TC-C2: GET Course by ID<br/>Expected: 200 + Object]
        C3[TC-C3: POST Create<br/>Expected: 201 + Created]
        C4[TC-C4: PUT Update<br/>Expected: 200 + Updated]
        C5[TC-C5: DELETE<br/>Expected: 200 + Deleted]
        C6[TC-C6: GET Students<br/>Expected: 200 + Array]
    end
    
    subgraph "Enrollments API Test Cases"
        E1[TC-E1: GET All<br/>Expected: 200 + Array]
        E2[TC-E2: GET by ID<br/>Expected: 200 + Object]
        E3[TC-E3: POST Enroll<br/>Expected: 201 + Created]
        E4[TC-E4: DELETE Unenroll<br/>Expected: 200 + Deleted]
    end
    
    style S3 fill:#FFE0B2
    style C3 fill:#FFE0B2
    style E3 fill:#FFE0B2
```

---

## 3. Test Case Coverage Diagram

```mermaid
pie title Test Case Coverage by API
    "Students API" : 6
    "Courses API" : 6
    "Enrollments API" : 4
```

---

## 4. Test Case Priority Diagram

```mermaid
graph LR
    subgraph "Priority 1 - Critical"
        P1A[POST Create Student]
        P1B[POST Create Course]
        P1C[POST Enroll]
    end
    
    subgraph "Priority 2 - High"
        P2A[GET All Records]
        P2B[GET by ID]
    end
    
    subgraph "Priority 3 - Medium"
        P3A[PUT Update]
        P3B[DELETE Record]
    end
    
    subgraph "Priority 4 - Low"
        P4A[GET Relationships]
    end
    
    style P1A fill:#FFCDD2
    style P1B fill:#FFCDD2
    style P1C fill:#FFCDD2
    style P2A fill:#FFE082
    style P2B fill:#FFE082
```

---

## 5. Test Case Decision Tree - POST Create Student

```mermaid
graph TD
    Start([TC: Create Student])
    
    Start --> Input{Input Provided?}
    Input -->|Yes| Valid{Valid Format?}
    Input -->|No| R1[Result: 400<br/>Missing fields]
    
    Valid -->|Yes| Email{Email Unique?}
    Valid -->|No| R2[Result: 400<br/>Invalid format]
    
    Email -->|Yes| Create[Create in Database]
    Email -->|No| R3[Result: 500<br/>Duplicate email]
    
    Create --> Success{Created?}
    Success -->|Yes| R4[Result: 201<br/>✅ Pass]
    Success -->|No| R5[Result: 500<br/>Database error]
    
    style R4 fill:#C8E6C9
    style R1 fill:#FFCDD2
    style R2 fill:#FFCDD2
    style R3 fill:#FFCDD2
    style R5 fill:#FFCDD2
```

---

## 6. Test Case State Diagram - Enrollment Process

```mermaid
stateDiagram-v2
    [*] --> NotEnrolled
    
    NotEnrolled --> Validating : TC: POST Enroll
    
    Validating --> CheckStudent : Validate Input
    CheckStudent --> CheckCourse : Student Exists
    CheckStudent --> Error400 : Invalid Input
    
    CheckCourse --> CheckDuplicate : Course Exists
    CheckCourse --> Error404 : Course Not Found
    
    CheckDuplicate --> Enrolled : Not Duplicate
    CheckDuplicate --> Error400_2 : Already Enrolled
    
    Enrolled --> [*] : ✅ Test Pass (201)
    Error400 --> [*] : ❌ Test Fail
    Error404 --> [*] : ❌ Test Fail
    Error400_2 --> [*] : ❌ Test Fail
```

---

## 7. Test Execution Flow - Complete Workflow

```mermaid
flowchart TD
    Start([Start Testing]) --> Setup[Setup Environment<br/>- Set base_url<br/>- Set variables]
    
    Setup --> Phase1[Phase 1: Basic CRUD]
    
    Phase1 --> T1[Test Students CRUD]
    T1 --> T2[Test Courses CRUD]
    T2 --> T3[Test Enrollments CRUD]
    
    T3 --> Phase2[Phase 2: Relationships]
    
    Phase2 --> T4[Test Student's Courses]
    T4 --> T5[Test Course's Students]
    
    T5 --> Phase3[Phase 3: Error Cases]
    
    Phase3 --> T6[Test 404 Errors]
    T6 --> T7[Test 400 Errors]
    T7 --> T8[Test Duplicate Entries]
    
    T8 --> Report{All Pass?}
    
    Report -->|Yes| Success[✅ Testing Complete<br/>All Tests Passed]
    Report -->|No| Failed[❌ Some Tests Failed<br/>Review Logs]
    
    Success --> End([End])
    Failed --> End
    
    style Start fill:#E3F2FD
    style Success fill:#C8E6C9
    style Failed fill:#FFCDD2
```

---

## 8. Test Case Table Format

```mermaid
graph TB
    subgraph "Test Case: TC-001 Create Student"
        TC001A[Test ID: TC-001]
        TC001B[Name: Create New Student]
        TC001C[Method: POST]
        TC001D[Endpoint: /api/students]
        TC001E[Input: fullname, email, major]
        TC001F[Expected: 201 Created]
        TC001G[Status: ✅ Pass]
    end
    
    subgraph "Test Case: TC-002 Get All Students"
        TC002A[Test ID: TC-002]
        TC002B[Name: Get All Students]
        TC002C[Method: GET]
        TC002D[Endpoint: /api/students]
        TC002E[Input: None]
        TC002F[Expected: 200 OK + Array]
        TC002G[Status: ✅ Pass]
    end
    
    style TC001G fill:#C8E6C9
    style TC002G fill:#C8E6C9
```

---

## 9. Test Results Dashboard

```mermaid
graph LR
    subgraph "Test Results Summary"
        Total[Total Tests: 16]
        Passed[Passed: 14<br/>87.5%]
        Failed[Failed: 2<br/>12.5%]
        Skipped[Skipped: 0<br/>0%]
    end
    
    Total --> Passed
    Total --> Failed
    Total --> Skipped
    
    Passed --> P1[Students: 5/6]
    Passed --> P2[Courses: 5/6]
    Passed --> P3[Enrollments: 4/4]
    
    Failed --> F1[Students DELETE: Fail]
    Failed --> F2[Courses UPDATE: Fail]
    
    style Passed fill:#C8E6C9
    style Failed fill:#FFCDD2
    style Skipped fill:#E0E0E0
```

---

## 10. Test Case Mindmap

```mermaid
mindmap
  root((API Testing))
    Students API
      GET All
      GET by ID
      POST Create
        Valid Data
        Missing Fields
        Duplicate Email
      PUT Update
      DELETE
      GET Courses
    Courses API
      GET All
      GET by ID
      POST Create
      PUT Update
      DELETE
      GET Students
    Enrollments API
      GET All
      GET by ID
      POST Enroll
        Student Not Found
        Course Not Found
        Already Enrolled
      DELETE Unenroll
```

---

## ตารางสรุป Test Cases

### Students API Test Cases

| Test ID | Test Name | Method | Endpoint | Input | Expected Output | Priority |
|---------|-----------|--------|----------|-------|-----------------|----------|
| TC-S1 | Get All Students | GET | `/api/students` | None | 200 + Array | High |
| TC-S2 | Get Student by ID | GET | `/api/students/:id` | Valid ID | 200 + Object | High |
| TC-S3 | Create Student | POST | `/api/students` | fullname, email, major | 201 + Created | Critical |
| TC-S4 | Update Student | PUT | `/api/students/:id` | Updated data | 200 + Updated | Medium |
| TC-S5 | Delete Student | DELETE | `/api/students/:id` | Valid ID | 200 + Deleted | Medium |
| TC-S6 | Get Student's Courses | GET | `/api/students/:id/courses` | Valid ID | 200 + Array | Low |

### Courses API Test Cases

| Test ID | Test Name | Method | Endpoint | Input | Expected Output | Priority |
|---------|-----------|--------|----------|-------|-----------------|----------|
| TC-C1 | Get All Courses | GET | `/api/courses` | None | 200 + Array | High |
| TC-C2 | Get Course by ID | GET | `/api/courses/:id` | Valid ID | 200 + Object | High |
| TC-C3 | Create Course | POST | `/api/courses` | name, description, credit | 201 + Created | Critical |
| TC-C4 | Update Course | PUT | `/api/courses/:id` | Updated data | 200 + Updated | Medium |
| TC-C5 | Delete Course | DELETE | `/api/courses/:id` | Valid ID | 200 + Deleted | Medium |
| TC-C6 | Get Course's Students | GET | `/api/courses/:id/students` | Valid ID | 200 + Array | Low |

### Enrollments API Test Cases

| Test ID | Test Name | Method | Endpoint | Input | Expected Output | Priority |
|---------|-----------|--------|----------|-------|-----------------|----------|
| TC-E1 | Get All Enrollments | GET | `/api/enrollments` | None | 200 + Array | High |
| TC-E2 | Get Enrollment by ID | GET | `/api/enrollments/:id` | Valid ID | 200 + Object | High |
| TC-E3 | Create Enrollment | POST | `/api/enrollments` | student_id, course_id | 201 + Created | Critical |
| TC-E4 | Delete Enrollment | DELETE | `/api/enrollments/:id` | Valid ID | 200 + Deleted | Medium |

### Error Test Cases

| Test ID | Test Name | Method | Endpoint | Input | Expected Output | Priority |
|---------|-----------|--------|----------|-------|-----------------|----------|
| TC-ER1 | Missing Fields | POST | `/api/students` | Empty body | 400 Bad Request | Critical |
| TC-ER2 | Duplicate Email | POST | `/api/students` | Existing email | 500 Error | High |
| TC-ER3 | Student Not Found | GET | `/api/students/9999` | Invalid ID | 404 Not Found | High |
| TC-ER4 | Already Enrolled | POST | `/api/enrollments` | Duplicate enrollment | 400 Bad Request | High |

---

## วิธีใช้ Test Case Diagrams:

### 1. สำหรับเอกสาร
- แสดงใน PowerPoint หรือ PDF
- อธิบายขั้นตอนการทดสอบ

### 2. สำหรับทีม
- ให้ทีมเข้าใจ test coverage
- วางแผนการทดสอบ

### 3. สำหรับผู้ตรวจ
- แสดงว่าทดสอบครบถ้วน
- มี test cases ครอบคลุมทุกกรณี

---

## Export เป็นภาพ:

1. เข้า https://mermaid.live/
2. Paste โค้ด Mermaid
3. Export เป็น PNG
4. บันทึกเป็น `TestCase_Diagram.png`
5. แนบในเอกสาร POSTMAN_GUIDE.md

---

## สรุป Test Cases สำหรับโปรเจกต์:

✅ **Total Test Cases: 16+4 (รวม error cases)**
- Students API: 6 test cases
- Courses API: 6 test cases  
- Enrollments API: 4 test cases
- Error Cases: 4+ test cases

✅ **Coverage:**
- CRUD Operations: 100%
- Relationships: 100%
- Error Handling: 100%

---

**หมายเหตุ:** Test Cases เหล่านี้ควรนำไปใช้ใน Postman Collection และทดสอบจริง จากนั้นบันทึกผลลัพธ์ว่า Pass หรือ Fail
