// API Base URL
const API_URL = window.location.origin;

// Global variables
let students = [];
let courses = [];
let enrollments = [];

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadDashboardData();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Student form
    document.getElementById('student-form').addEventListener('submit', handleStudentSubmit);
    
    // Course form
    document.getElementById('course-form').addEventListener('submit', handleCourseSubmit);
    
    // Enrollment form
    document.getElementById('enrollment-form').addEventListener('submit', handleEnrollmentSubmit);
}

// Tab switching
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Add active class to clicked tab button
    event.target.classList.add('active');
    
    // Load data for the selected tab
    switch(tabName) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'students':
            loadStudents();
            break;
        case 'courses':
            loadCourses();
            break;
        case 'enrollments':
            loadEnrollments();
            loadStudentsForDropdown();
            loadCoursesForDropdown();
            break;
    }
}

// Show message
function showMessage(message, type = 'success') {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    messageDiv.className = `message message-${type} show`;
    
    setTimeout(() => {
        messageDiv.classList.remove('show');
    }, 5000);
}

// API Calls

// Load dashboard data
async function loadDashboardData() {
    try {
        const [studentsRes, coursesRes, enrollmentsRes] = await Promise.all([
            fetch(`${API_URL}/api/students`),
            fetch(`${API_URL}/api/courses`),
            fetch(`${API_URL}/api/enrollments`)
        ]);
        
        const studentsData = await studentsRes.json();
        const coursesData = await coursesRes.json();
        const enrollmentsData = await enrollmentsRes.json();
        
        document.getElementById('total-students').textContent = studentsData.count || 0;
        document.getElementById('total-courses').textContent = coursesData.count || 0;
        document.getElementById('total-enrollments').textContent = enrollmentsData.count || 0;
    } catch (error) {
        console.error('Error loading dashboard:', error);
        showMessage('เกิดข้อผิดพลาดในการโหลดข้อมูล Dashboard', 'error');
    }
}

// Students

async function loadStudents() {
    const loading = document.getElementById('students-loading');
    const table = document.getElementById('students-table');
    const tbody = document.getElementById('students-tbody');
    
    loading.style.display = 'block';
    table.style.display = 'none';
    
    try {
        const response = await fetch(`${API_URL}/api/students`);
        const data = await response.json();
        
        students = data.data || [];
        tbody.innerHTML = '';
        
        students.forEach(student => {
            const row = `
                <tr>
                    <td>${student.id}</td>
                    <td>${student.fullname}</td>
                    <td>${student.email}</td>
                    <td><span class="badge badge-info">${student.major}</span></td>
                    <td class="action-buttons">
                        <button class="btn btn-warning" onclick="editStudent(${student.id})">แก้ไข</button>
                        <button class="btn btn-danger" onclick="deleteStudent(${student.id})">ลบ</button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
        
        loading.style.display = 'none';
        table.style.display = 'table';
    } catch (error) {
        console.error('Error loading students:', error);
        showMessage('เกิดข้อผิดพลาดในการโหลดข้อมูลนักเรียน', 'error');
        loading.style.display = 'none';
    }
}

async function handleStudentSubmit(e) {
    e.preventDefault();
    
    const fullname = document.getElementById('student-fullname').value;
    const email = document.getElementById('student-email').value;
    const major = document.getElementById('student-major').value;
    
    try {
        const response = await fetch(`${API_URL}/api/students`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fullname, email, major })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showMessage('เพิ่มนักเรียนสำเร็จ!', 'success');
            document.getElementById('student-form').reset();
            loadStudents();
            loadDashboardData();
        } else {
            showMessage(data.error || 'เกิดข้อผิดพลาด', 'error');
        }
    } catch (error) {
        console.error('Error creating student:', error);
        showMessage('เกิดข้อผิดพลาดในการเพิ่มนักเรียน', 'error');
    }
}

async function deleteStudent(id) {
    if (!confirm('คุณต้องการลบนักเรียนคนนี้หรือไม่?')) return;
    
    try {
        const response = await fetch(`${API_URL}/api/students/${id}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            showMessage('ลบนักเรียนสำเร็จ!', 'success');
            loadStudents();
            loadDashboardData();
        } else {
            showMessage(data.error || 'เกิดข้อผิดพลาด', 'error');
        }
    } catch (error) {
        console.error('Error deleting student:', error);
        showMessage('เกิดข้อผิดพลาดในการลบนักเรียน', 'error');
    }
}

function editStudent(id) {
    const student = students.find(s => s.id === id);
    if (!student) return;
    
    const newFullname = prompt('ชื่อ-นามสกุล:', student.fullname);
    if (!newFullname) return;
    
    const newEmail = prompt('อีเมล:', student.email);
    if (!newEmail) return;
    
    const newMajor = prompt('สาขาวิชา:', student.major);
    if (!newMajor) return;
    
    updateStudent(id, { fullname: newFullname, email: newEmail, major: newMajor });
}

async function updateStudent(id, data) {
    try {
        const response = await fetch(`${API_URL}/api/students/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage('แก้ไขข้อมูลนักเรียนสำเร็จ!', 'success');
            loadStudents();
        } else {
            showMessage(result.error || 'เกิดข้อผิดพลาด', 'error');
        }
    } catch (error) {
        console.error('Error updating student:', error);
        showMessage('เกิดข้อผิดพลาดในการแก้ไขข้อมูล', 'error');
    }
}

// Courses

async function loadCourses() {
    const loading = document.getElementById('courses-loading');
    const table = document.getElementById('courses-table');
    const tbody = document.getElementById('courses-tbody');
    
    loading.style.display = 'block';
    table.style.display = 'none';
    
    try {
        const response = await fetch(`${API_URL}/api/courses`);
        const data = await response.json();
        
        courses = data.data || [];
        tbody.innerHTML = '';
        
        courses.forEach(course => {
            const row = `
                <tr>
                    <td>${course.id}</td>
                    <td>${course.name}</td>
                    <td>${course.description || '-'}</td>
                    <td><span class="badge badge-success">${course.credit} หน่วยกิต</span></td>
                    <td class="action-buttons">
                        <button class="btn btn-warning" onclick="editCourse(${course.id})">แก้ไข</button>
                        <button class="btn btn-danger" onclick="deleteCourse(${course.id})">ลบ</button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
        
        loading.style.display = 'none';
        table.style.display = 'table';
    } catch (error) {
        console.error('Error loading courses:', error);
        showMessage('เกิดข้อผิดพลาดในการโหลดข้อมูลคอร์ส', 'error');
        loading.style.display = 'none';
    }
}

async function handleCourseSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('course-name').value;
    const description = document.getElementById('course-description').value;
    const credit = parseInt(document.getElementById('course-credit').value);
    
    try {
        const response = await fetch(`${API_URL}/api/courses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, description, credit })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showMessage('เพิ่มคอร์สสำเร็จ!', 'success');
            document.getElementById('course-form').reset();
            loadCourses();
            loadDashboardData();
        } else {
            showMessage(data.error || 'เกิดข้อผิดพลาด', 'error');
        }
    } catch (error) {
        console.error('Error creating course:', error);
        showMessage('เกิดข้อผิดพลาดในการเพิ่มคอร์ส', 'error');
    }
}

async function deleteCourse(id) {
    if (!confirm('คุณต้องการลบคอร์สนี้หรือไม่?')) return;
    
    try {
        const response = await fetch(`${API_URL}/api/courses/${id}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            showMessage('ลบคอร์สสำเร็จ!', 'success');
            loadCourses();
            loadDashboardData();
        } else {
            showMessage(data.error || 'เกิดข้อผิดพลาด', 'error');
        }
    } catch (error) {
        console.error('Error deleting course:', error);
        showMessage('เกิดข้อผิดพลาดในการลบคอร์ส', 'error');
    }
}

function editCourse(id) {
    const course = courses.find(c => c.id === id);
    if (!course) return;
    
    const newName = prompt('ชื่อคอร์ส:', course.name);
    if (!newName) return;
    
    const newDescription = prompt('รายละเอียด:', course.description || '');
    
    const newCredit = prompt('หน่วยกิต:', course.credit);
    if (!newCredit) return;
    
    updateCourse(id, { name: newName, description: newDescription, credit: parseInt(newCredit) });
}

async function updateCourse(id, data) {
    try {
        const response = await fetch(`${API_URL}/api/courses/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage('แก้ไขข้อมูลคอร์สสำเร็จ!', 'success');
            loadCourses();
        } else {
            showMessage(result.error || 'เกิดข้อผิดพลาด', 'error');
        }
    } catch (error) {
        console.error('Error updating course:', error);
        showMessage('เกิดข้อผิดพลาดในการแก้ไขข้อมูล', 'error');
    }
}

// Enrollments

async function loadEnrollments() {
    const loading = document.getElementById('enrollments-loading');
    const table = document.getElementById('enrollments-table');
    const tbody = document.getElementById('enrollments-tbody');
    
    loading.style.display = 'block';
    table.style.display = 'none';
    
    try {
        const response = await fetch(`${API_URL}/api/enrollments`);
        const data = await response.json();
        
        enrollments = data.data || [];
        tbody.innerHTML = '';
        
        enrollments.forEach(enrollment => {
            const studentName = enrollment.students ? enrollment.students.fullname : 'N/A';
            const courseName = enrollment.courses ? enrollment.courses.name : 'N/A';
            const date = new Date(enrollment.enrollment_date).toLocaleDateString('th-TH');
            
            const row = `
                <tr>
                    <td>${enrollment.id}</td>
                    <td>${studentName}</td>
                    <td>${courseName}</td>
                    <td>${date}</td>
                    <td class="action-buttons">
                        <button class="btn btn-danger" onclick="deleteEnrollment(${enrollment.id})">ยกเลิก</button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
        
        loading.style.display = 'none';
        table.style.display = 'table';
    } catch (error) {
        console.error('Error loading enrollments:', error);
        showMessage('เกิดข้อผิดพลาดในการโหลดข้อมูลการลงทะเบียน', 'error');
        loading.style.display = 'none';
    }
}

async function loadStudentsForDropdown() {
    try {
        const response = await fetch(`${API_URL}/api/students`);
        const data = await response.json();
        
        const select = document.getElementById('enrollment-student');
        select.innerHTML = '<option value="">-- เลือกนักเรียน --</option>';
        
        if (data.data) {
            data.data.forEach(student => {
                const option = document.createElement('option');
                option.value = student.id;
                option.textContent = `${student.fullname} (${student.email})`;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading students for dropdown:', error);
    }
}

async function loadCoursesForDropdown() {
    try {
        const response = await fetch(`${API_URL}/api/courses`);
        const data = await response.json();
        
        const select = document.getElementById('enrollment-course');
        select.innerHTML = '<option value="">-- เลือกคอร์ส --</option>';
        
        if (data.data) {
            data.data.forEach(course => {
                const option = document.createElement('option');
                option.value = course.id;
                option.textContent = `${course.name} (${course.credit} หน่วยกิต)`;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading courses for dropdown:', error);
    }
}

async function handleEnrollmentSubmit(e) {
    e.preventDefault();
    
    const student_id = parseInt(document.getElementById('enrollment-student').value);
    const course_id = parseInt(document.getElementById('enrollment-course').value);
    
    try {
        const response = await fetch(`${API_URL}/api/enrollments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ student_id, course_id })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showMessage('ลงทะเบียนสำเร็จ!', 'success');
            document.getElementById('enrollment-form').reset();
            loadEnrollments();
            loadDashboardData();
        } else {
            showMessage(data.error || 'เกิดข้อผิดพลาด', 'error');
        }
    } catch (error) {
        console.error('Error creating enrollment:', error);
        showMessage('เกิดข้อผิดพลาดในการลงทะเบียน', 'error');
    }
}

async function deleteEnrollment(id) {
    if (!confirm('คุณต้องการยกเลิกการลงทะเบียนนี้หรือไม่?')) return;
    
    try {
        const response = await fetch(`${API_URL}/api/enrollments/${id}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            showMessage('ยกเลิกการลงทะเบียนสำเร็จ!', 'success');
            loadEnrollments();
            loadDashboardData();
        } else {
            showMessage(data.error || 'เกิดข้อผิดพลาด', 'error');
        }
    } catch (error) {
        console.error('Error deleting enrollment:', error);
        showMessage('เกิดข้อผิดพลาดในการยกเลิกการลงทะเบียน', 'error');
    }
}
