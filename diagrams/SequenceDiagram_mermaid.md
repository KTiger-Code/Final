# Sequence Diagram - Mermaid Code
## (เพิ่มเติม - แสดงการทำงานของ API)

## วิธีใช้งาน:
1. คัดลอกโค้ด Mermaid ด้านล่าง
2. ไปที่ https://mermaid.live/
3. Paste โค้ดและ Export เป็น PNG

---

## 1. Sequence Diagram - สร้างนักเรียน (Create Student)

```mermaid
sequenceDiagram
    participant Client as Client/Postman
    participant API as Express Server
    participant Route as Students Route
    participant DB as Supabase Database
    
    Client->>+API: POST /api/students
    Note over Client,API: Body: {fullname, email, major}
    
    API->>+Route: Handle POST request
    Route->>Route: Validate input data
    
    alt ข้อมูลไม่ครบ
        Route-->>API: 400 Bad Request
        API-->>Client: Error: Missing fields
    else ข้อมูลครบถ้วน
        Route->>+DB: INSERT INTO students
        
        alt อีเมลซ้ำ
            DB-->>Route: Error: Duplicate email
            Route-->>API: 500 Internal Error
            API-->>Client: Error: Email exists
        else สำเร็จ
            DB-->>-Route: Return student data
            Route-->>-API: 201 Created
            API-->>-Client: Success + student data
        end
    end
```

---

## 2. Sequence Diagram - ลงทะเบียนเรียน (Create Enrollment)

```mermaid
sequenceDiagram
    participant Client as Client/Postman
    participant API as Express Server
    participant Route as Enrollments Route
    participant DB as Supabase Database
    
    Client->>+API: POST /api/enrollments
    Note over Client,API: Body: {student_id, course_id}
    
    API->>+Route: Handle POST request
    Route->>Route: Validate input
    
    Route->>+DB: Check if student exists
    DB-->>-Route: Student data or null
    
    alt นักเรียนไม่มี
        Route-->>API: 404 Not Found
        API-->>Client: Error: Student not found
    else นักเรียนมี
        Route->>+DB: Check if course exists
        DB-->>-Route: Course data or null
        
        alt คอร์สไม่มี
            Route-->>API: 404 Not Found
            API-->>Client: Error: Course not found
        else คอร์สมี
            Route->>+DB: Check if already enrolled
            DB-->>-Route: Enrollment or null
            
            alt ลงทะเบียนแล้ว
                Route-->>API: 400 Bad Request
                API-->>Client: Error: Already enrolled
            else ยังไม่ได้ลงทะเบียน
                Route->>+DB: INSERT INTO enrollments
                DB-->>-Route: Enrollment data with joins
                Route-->>-API: 201 Created
                API-->>-Client: Success + enrollment data
            end
        end
    end
```

---

## 3. Sequence Diagram - ดึงคอร์สของนักเรียน (Get Student's Courses)

```mermaid
sequenceDiagram
    participant Client as Client/Postman
    participant API as Express Server
    participant Route as Students Route
    participant DB as Supabase Database
    
    Client->>+API: GET /api/students/:id/courses
    
    API->>+Route: Handle GET request
    Route->>+DB: SELECT enrollments with JOIN courses
    Note over Route,DB: WHERE student_id = :id
    
    DB-->>-Route: Array of enrollments with course data
    Route-->>-API: 200 OK
    API-->>-Client: Success + courses data
```

---

## 4. Sequence Diagram - แก้ไขนักเรียน (Update Student)

```mermaid
sequenceDiagram
    participant Client as Client/Postman
    participant API as Express Server
    participant Route as Students Route
    participant DB as Supabase Database
    
    Client->>+API: PUT /api/students/:id
    Note over Client,API: Body: {fullname, email, major}
    
    API->>+Route: Handle PUT request
    Route->>Route: Build update object
    
    Route->>+DB: UPDATE students WHERE id = :id
    
    alt นักเรียนไม่พบ
        DB-->>Route: No rows updated
        Route-->>API: 404 Not Found
        API-->>Client: Error: Student not found
    else อัพเดทสำเร็จ
        DB-->>-Route: Updated student data
        Route-->>-API: 200 OK
        API-->>-Client: Success + updated data
    end
```

---

## 5. Sequence Diagram - ลบนักเรียน (Delete Student)

```mermaid
sequenceDiagram
    participant Client as Client/Postman
    participant API as Express Server
    participant Route as Students Route
    participant DB as Supabase Database
    
    Client->>+API: DELETE /api/students/:id
    
    API->>+Route: Handle DELETE request
    Route->>+DB: DELETE FROM students WHERE id = :id
    
    Note over DB: CASCADE delete enrollments too
    
    alt นักเรียนไม่พบ
        DB-->>Route: No rows deleted
        Route-->>API: 404 Not Found
        API-->>Client: Error: Student not found
    else ลบสำเร็จ
        DB-->>-Route: Deleted student data
        Route-->>-API: 200 OK
        API-->>-Client: Success + deleted data
    end
```

---

## 6. Sequence Diagram - Complete Enrollment Flow

```mermaid
sequenceDiagram
    actor Student as นักเรียน
    participant UI as Frontend/App
    participant API as Backend API
    participant Auth as Authentication
    participant DB as Database
    participant Email as Email Service
    
    Student->>+UI: เลือกคอร์สที่ต้องการลงทะเบียน
    UI->>+API: POST /api/enrollments
    
    API->>+Auth: Verify user token
    Auth-->>-API: User authenticated
    
    API->>API: Validate enrollment data
    
    API->>+DB: Check student exists
    DB-->>-API: Student found
    
    API->>+DB: Check course available
    DB-->>-API: Course available (seats left)
    
    API->>+DB: Check already enrolled
    DB-->>-API: Not enrolled yet
    
    API->>+DB: Create enrollment record
    DB-->>-API: Enrollment created
    
    par Send notifications
        API->>+Email: Send confirmation email
        Email-->>-API: Email sent
    and Update course stats
        API->>+DB: Update course enrollment count
        DB-->>-API: Count updated
    end
    
    API-->>-UI: 201 Created + enrollment data
    UI-->>-Student: แสดงข้อความลงทะเบียนสำเร็จ
```

---

## 7. Sequence Diagram - API Error Handling Flow

```mermaid
sequenceDiagram
    participant Client
    participant API as Express Server
    participant Middleware as Error Handler
    participant Logger as Logging Service
    
    Client->>+API: Request to endpoint
    
    API->>API: Process request
    
    alt Request successful
        API-->>Client: 200/201 Success response
    else Validation error
        API->>+Middleware: Throw validation error
        Middleware->>Logger: Log error details
        Middleware-->>-API: Format error response
        API-->>Client: 400 Bad Request
    else Not found
        API->>+Middleware: Throw not found error
        Middleware->>Logger: Log error
        Middleware-->>-API: Format error response
        API-->>Client: 404 Not Found
    else Database error
        API->>+Middleware: Throw database error
        Middleware->>Logger: Log critical error
        Middleware-->>-API: Format error response
        API-->>Client: 500 Internal Server Error
    end
    
    deactivate API
```

---

## 8. Sequence Diagram - Full CRUD Workflow

```mermaid
sequenceDiagram
    participant Admin as เจ้าหน้าที่
    participant System as API System
    participant DB as Database
    
    Note over Admin,DB: CREATE - สร้างข้อมูล
    Admin->>+System: POST /api/students
    System->>+DB: INSERT
    DB-->>-System: Created
    System-->>-Admin: 201 + data
    
    Note over Admin,DB: READ - อ่านข้อมูล
    Admin->>+System: GET /api/students
    System->>+DB: SELECT *
    DB-->>-System: All records
    System-->>-Admin: 200 + data array
    
    Note over Admin,DB: UPDATE - แก้ไขข้อมูล
    Admin->>+System: PUT /api/students/:id
    System->>+DB: UPDATE WHERE id
    DB-->>-System: Updated
    System-->>-Admin: 200 + updated data
    
    Note over Admin,DB: DELETE - ลบข้อมูล
    Admin->>+System: DELETE /api/students/:id
    System->>+DB: DELETE WHERE id
    DB-->>-System: Deleted
    System-->>-Admin: 200 + deleted data
```

---

## การใช้งาน Sequence Diagrams:

1. **สำหรับเอกสาร** - แสดงให้เห็น flow การทำงานของระบบ
2. **สำหรับทีม** - ช่วยให้เข้าใจการทำงานร่วมกัน
3. **สำหรับ Debug** - ติดตาม flow หาจุดที่เกิด error
4. **สำหรับนำเสนอ** - อธิบายการทำงานให้ผู้อื่นเข้าใจ

---

## Export เป็นภาพ:

1. ไปที่ https://mermaid.live/
2. Paste โค้ด Mermaid
3. คลิก "Actions" > "PNG" หรือ "SVG"
4. บันทึกเป็น `SequenceDiagram_CreateStudent.png` ฯลฯ
