# System Architecture Diagram - Mermaid Code

## วิธีใช้งาน:
1. คัดลอกโค้ด Mermaid ด้านล่าง
2. ไปที่ https://mermaid.live/
3. Paste โค้ดและ Export เป็น PNG

---

## 1. System Architecture Overview

```mermaid
graph TB
    subgraph "Client Layer"
        A[Postman/API Client]
        B[Web Browser]
        C[Mobile App]
    end
    
    subgraph "API Layer - Render Cloud"
        D[Express.js Server<br/>Node.js Runtime]
        E[Router Layer]
        F[Controller Layer]
    end
    
    subgraph "Database Layer - Supabase"
        G[(PostgreSQL Database)]
        H[Supabase API]
        I[Authentication Service]
    end
    
    subgraph "External Services"
        J[GitHub Repository]
        K[CodeSandbox]
    end
    
    A --> D
    B --> D
    C --> D
    
    D --> E
    E --> F
    F --> H
    H --> G
    
    D -.->|Deploy| J
    J -.->|Sync| K
    
    style D fill:#90EE90
    style G fill:#87CEEB
    style J fill:#FFB6C1
```

---

## 2. API Request Flow Architecture

```mermaid
flowchart LR
    A[Client Request] --> B{CORS<br/>Middleware}
    B -->|Allowed| C{JSON<br/>Parser}
    B -->|Denied| X1[403 Forbidden]
    
    C --> D{Route<br/>Matching}
    D -->|/api/students| E1[Students Controller]
    D -->|/api/courses| E2[Courses Controller]
    D -->|/api/enrollments| E3[Enrollments Controller]
    D -->|Not Found| X2[404 Not Found]
    
    E1 --> F[Supabase Client]
    E2 --> F
    E3 --> F
    
    F --> G[(Database)]
    
    G -->|Success| H[Format Response]
    G -->|Error| I[Error Handler]
    
    H --> J[200/201 Response]
    I --> K[400/404/500 Response]
    
    J --> Z[Client]
    K --> Z
    X1 --> Z
    X2 --> Z
    
    style A fill:#E1F5FE
    style G fill:#C8E6C9
    style Z fill:#FFE0B2
```

---

## 3. Database Schema Architecture

```mermaid
graph TB
    subgraph "Application Tables"
        A[students<br/>id, fullname, email, major]
        B[courses<br/>id, name, description, credit]
        C[enrollments<br/>id, student_id, course_id]
    end
    
    subgraph "Relationships"
        D[One-to-Many<br/>students → enrollments]
        E[One-to-Many<br/>courses → enrollments]
        F[Many-to-Many<br/>students ↔ courses]
    end
    
    subgraph "Constraints"
        G[Primary Keys<br/>Auto-increment IDs]
        H[Foreign Keys<br/>CASCADE on DELETE]
        I[Unique Constraints<br/>email UNIQUE]
    end
    
    A --> D
    B --> E
    D --> C
    E --> C
    D --> F
    E --> F
    
    A -.-> G
    B -.-> G
    C -.-> G
    
    C -.-> H
    A -.-> I
    
    style A fill:#FFCCBC
    style B fill:#C5CAE9
    style C fill:#B2DFDB
```

---

## 4. Deployment Architecture

```mermaid
graph TB
    subgraph "Development Environment"
        A[Local Machine<br/>VS Code]
        B[Git Repository<br/>Local]
    end
    
    subgraph "Version Control"
        C[GitHub Repository<br/>Main Branch]
        D[Feature Branches]
    end
    
    subgraph "Cloud Deployment - Render"
        E[Build Process<br/>npm install]
        F[Container<br/>Node.js Runtime]
        G[Running Server<br/>Port 3000]
    end
    
    subgraph "Database - Supabase"
        H[(Production DB<br/>PostgreSQL)]
        I[Connection Pool]
    end
    
    subgraph "Monitoring & Logs"
        J[Render Logs]
        K[Supabase Logs]
    end
    
    A -->|git push| B
    B --> C
    C -->|Auto Deploy| E
    D -->|Pull Request| C
    
    E --> F
    F --> G
    
    G <-->|SQL Queries| I
    I <--> H
    
    G -.->|Write| J
    H -.->|Write| K
    
    style C fill:#FFE082
    style G fill:#A5D6A7
    style H fill:#81D4FA
```

---

## 5. RESTful API Architecture

```mermaid
graph LR
    A[HTTP Methods] --> B[GET<br/>Read]
    A --> C[POST<br/>Create]
    A --> D[PUT<br/>Update]
    A --> E[DELETE<br/>Remove]
    
    B --> F[/api/students<br/>/api/courses<br/>/api/enrollments]
    C --> F
    D --> F
    E --> F
    
    F --> G{Route Handler}
    
    G --> H[Query Database]
    H --> I{Response}
    
    I -->|Success| J[200 OK<br/>201 Created]
    I -->|Not Found| K[404 Not Found]
    I -->|Bad Request| L[400 Bad Request]
    I -->|Server Error| M[500 Internal Error]
    
    style A fill:#E1BEE7
    style F fill:#FFCCBC
    style I fill:#B2DFDB
```

---

## 6. Project Structure Diagram

```mermaid
graph TB
    A[student-course-api/]
    
    A --> B[config/]
    A --> C[routes/]
    A --> D[diagrams/]
    A --> E[Files]
    
    B --> B1[supabase.js]
    
    C --> C1[students.js]
    C --> C2[courses.js]
    C --> C3[enrollments.js]
    
    D --> D1[ERD.png]
    D --> D2[UseCase.png]
    D --> D3[*.md mermaid files]
    
    E --> E1[server.js]
    E --> E2[package.json]
    E --> E3[.env]
    E --> E4[README.md]
    E --> E5[DOCUMENTATION.md]
    E --> E6[POSTMAN_GUIDE.md]
    E --> E7[database.sql]
    
    style A fill:#FFE082
    style B fill:#B2DFDB
    style C fill:#FFCCBC
    style D fill:#C5CAE9
    style E fill:#F8BBD0
```

---

## 7. MVC Pattern Architecture (Simplified)

```mermaid
graph TB
    subgraph "Client/View Layer"
        A[Postman/Frontend]
    end
    
    subgraph "Controller Layer"
        B[Routes<br/>students.js, courses.js, enrollments.js]
        C[Business Logic<br/>Validation, Error Handling]
    end
    
    subgraph "Model Layer"
        D[Supabase Client<br/>Database Queries]
        E[(Database Tables<br/>students, courses, enrollments)]
    end
    
    A <-->|HTTP Request/Response| B
    B <--> C
    C <--> D
    D <--> E
    
    style A fill:#E3F2FD
    style B fill:#FFF9C4
    style C fill:#FFE0B2
    style D fill:#C8E6C9
    style E fill:#B2DFDB
```

---

## 8. Data Flow Diagram

```mermaid
flowchart TD
    A[User Input] -->|1. HTTP Request| B[Express Server]
    B -->|2. Route to Handler| C{Validate Input}
    
    C -->|Invalid| D[Return 400 Error]
    C -->|Valid| E[Supabase Query]
    
    E -->|3. Execute SQL| F[(Database)]
    
    F -->|4. Return Data| G{Check Result}
    
    G -->|Success| H[Format JSON Response]
    G -->|Error| I[Error Handler]
    
    H -->|5. Send Response| J[Client receives 200/201]
    I -->|5. Send Error| K[Client receives 4xx/5xx]
    
    D --> K
    
    style A fill:#E8F5E9
    style F fill:#BBDEFB
    style J fill:#C8E6C9
    style K fill:#FFCDD2
```

---

## 9. Security & Authentication Architecture (Future Enhancement)

```mermaid
graph TB
    A[Client Request] --> B{Has Valid Token?}
    
    B -->|No Token| C[Return 401 Unauthorized]
    B -->|Invalid Token| D[Return 403 Forbidden]
    B -->|Valid Token| E[Extract User Info]
    
    E --> F{Check Permissions}
    
    F -->|Admin| G[Full Access<br/>All CRUD Operations]
    F -->|Student| H[Limited Access<br/>Own Data Only]
    F -->|Instructor| I[Read Access<br/>Course Data]
    
    G --> J[Process Request]
    H --> J
    I --> J
    
    J --> K[(Database)]
    K --> L[Return Response]
    
    style A fill:#E1F5FE
    style B fill:#FFF9C4
    style K fill:#C8E6C9
    style L fill:#B2DFDB
```

---

## 10. CI/CD Pipeline Architecture

```mermaid
graph LR
    A[Developer<br/>Local Code] -->|git push| B[GitHub Repository]
    
    B -->|Webhook Trigger| C[Render Build]
    
    C --> D{Run Tests}
    D -->|Failed| E[Build Failed<br/>Notify Developer]
    D -->|Passed| F[npm install]
    
    F --> G[Build Container]
    G --> H[Deploy to Production]
    
    H --> I[Health Check]
    I -->|Healthy| J[Live on Render]
    I -->|Unhealthy| K[Rollback Previous Version]
    
    J -->|Monitor| L[Logs & Metrics]
    
    style A fill:#FFE0B2
    style B fill:#C5CAE9
    style H fill:#A5D6A7
    style J fill:#81C784
```

---

## สรุป Architecture Components:

### 1. **Frontend Layer**
- Postman (API Testing)
- Web/Mobile Apps (Future)

### 2. **Backend Layer**
- Express.js Server
- RESTful API Routes
- Business Logic

### 3. **Database Layer**
- Supabase (PostgreSQL)
- Connection Pool
- Query Optimization

### 4. **Deployment**
- GitHub (Version Control)
- Render (Cloud Hosting)
- Environment Variables

### 5. **Monitoring**
- Server Logs
- Database Logs
- Error Tracking

---

## Export Instructions:

1. เข้า https://mermaid.live/
2. Paste โค้ดที่ต้องการ
3. คลิก "Actions" > "Export as PNG/SVG"
4. บันทึกไฟล์ตามชื่อ diagram
5. ใส่ใน folder `diagrams/`

---

**หมายเหตุ:** Architecture diagrams เหล่านี้จะช่วยให้เข้าใจภาพรวมของระบบได้ดีขึ้น เหมาะสำหรับการนำเสนอหรือเอกสารประกอบ
