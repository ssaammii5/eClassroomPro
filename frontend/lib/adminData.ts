export interface StudentAddress {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
}

export type StudentProgramType =
    | "Undergraduate"
    | "Postgraduate"
    | "Post Graduate Diploma"
    | "M.Phil"
    | "PhD";

export interface StudentDetails {
    fathersName: string;
    mothersName: string;
    dateOfBirth: string;
    mobile: string;
    nationality: string;
    studentId: string;
    regNo: string;
    department: string;
    currentProgram: StudentProgramType;
    session: string;
    semesterSession: string; // Combined format: "January-June/2026"
    address: StudentAddress;
}

export interface AdminUser {
    id: number;
    name: string;
    email: string;
    role: "Admin" | "Teacher" | "Student";
    isActive: boolean;
    createdAt: string;
    studentDetails?: StudentDetails;
}

export interface AdminCourse {
    id: number;
    name: string;
    subject: string;
    teacherId: number | null;
    teacherName: string | null;
    studentCount: number;
    session: string;
    isActive: boolean;
}

export interface AdminAssignment {
    id: number;
    courseId: number;
    courseName: string;
    title: string;
    description: string;
    deadline: string;
    maxMarks: number;
    status: "Draft" | "Published" | "Archived";
    createdById: number;
    createdBy: string;
    createdAt: string;
    submissionCount: number;
}

export interface AdminSubmission {
    id: number;
    assignmentId: number;
    assignmentTitle: string;
    courseId: number;
    courseName: string;
    studentId: number;
    studentName: string;
    status: "Submitted" | "Graded" | "Pending";
    marks: number | null;
    feedback: string | null;
    submittedAt: string;
}

export interface AppSetting {
    key: string;
    value: string;
    description: string;
    category: "General" | "Notifications" | "Grading" | "Security";
}

export const adminUsers: AdminUser[] = [
    { id: 1, name: "Admin User", email: "admin@eclassroompro.com", role: "Admin", isActive: true, createdAt: "2024-01-01" },
    { id: 2, name: "Md. Mahbubur Rahman", email: "mahbubur@eclassroompro.com", role: "Teacher", isActive: true, createdAt: "2024-01-05" },
    { id: 3, name: "Prof. Dr. Abdul Masud", email: "abdul.masud@eclassroompro.com", role: "Teacher", isActive: true, createdAt: "2024-01-05" },
    { id: 4, name: "Farjana Sultana Mim", email: "farjana@eclassroompro.com", role: "Teacher", isActive: true, createdAt: "2024-01-10" },
    { id: 5, name: "Chinmay Bepery", email: "chinmay@eclassroompro.com", role: "Teacher", isActive: false, createdAt: "2024-01-12" },
    {
        id: 6, name: "Md. Samiur Rahman", email: "samiurinfo@gmail.com", role: "Student", isActive: true, createdAt: "2024-02-01",
        studentDetails: {
            fathersName: "Father Name Here", mothersName: "Mother Name Here", dateOfBirth: "2002-05-15",
            mobile: "+880 1712-345678", nationality: "Bangladeshi", studentId: "201-15-0000", regNo: "1234567890",
            department: "Computer Science and Engineering", currentProgram: "Undergraduate", session: "2021-2022",
            semesterSession: "January-June/2022",
            address: { street: "House 12, Road 5, Dhanmondi", city: "Dhaka", state: "Dhaka Division", zip: "1205", country: "Bangladesh" },
        },
    },
    {
        id: 7, name: "Habibur Rahman Khan Ratin", email: "ratin@eclassroompro.com", role: "Student", isActive: true, createdAt: "2024-02-01",
        studentDetails: {
            fathersName: "Khan Rahman", mothersName: "Rehana Begum", dateOfBirth: "2001-11-02",
            mobile: "+880 1813-224455", nationality: "Bangladeshi", studentId: "201-15-1101", regNo: "1234567891",
            department: "Computer Science and Engineering", currentProgram: "Undergraduate", session: "2021-2022",
            semesterSession: "July-December/2022",
            address: { street: "House 7, Mirpur DOHS", city: "Dhaka", state: "Dhaka Division", zip: "1216", country: "Bangladesh" },
        },
    },
    {
        id: 8, name: "Iffat Ara Babli", email: "iffat@eclassroompro.com", role: "Student", isActive: true, createdAt: "2024-02-01",
        studentDetails: {
            fathersName: "Abdul Karim", mothersName: "Rashida Khatun", dateOfBirth: "2002-03-21",
            mobile: "+880 1911-335566", nationality: "Bangladeshi", studentId: "201-15-1204", regNo: "1234567892",
            department: "Computer Science and Engineering", currentProgram: "Undergraduate", session: "2021-2022",
            semesterSession: "January-June/2023",
            address: { street: "Flat B4, Banani Road 11", city: "Dhaka", state: "Dhaka Division", zip: "1213", country: "Bangladesh" },
        },
    },
    {
        id: 9, name: "Partha Bhakta", email: "partha@eclassroompro.com", role: "Student", isActive: true, createdAt: "2024-02-05",
        studentDetails: {
            fathersName: "Nirmal Bhakta", mothersName: "Shikha Bhakta", dateOfBirth: "2000-12-09",
            mobile: "+880 1614-778899", nationality: "Bangladeshi", studentId: "202-16-0342", regNo: "1234567893",
            department: "Computer Science and Engineering", currentProgram: "Postgraduate", session: "2023-2024",
            semesterSession: "July-December/2023",
            address: { street: "House 22, GEC Circle", city: "Chattogram", state: "Chattogram Division", zip: "4000", country: "Bangladesh" },
        },
    },
    {
        id: 10, name: "Md. Kaium Al Sifat Bhuiyan", email: "kaium@eclassroompro.com", role: "Student", isActive: false, createdAt: "2024-02-10",
        studentDetails: {
            fathersName: "Sifat Bhuiyan", mothersName: "Salma Bhuiyan", dateOfBirth: "2001-07-30",
            mobile: "+880 1515-667788", nationality: "Bangladeshi", studentId: "202-16-0455", regNo: "1234567894",
            department: "Computer Science and Engineering", currentProgram: "Postgraduate", session: "2023-2024",
            semesterSession: "January-June/2024",
            address: { street: "House 3, Zindabazar", city: "Sylhet", state: "Sylhet Division", zip: "3100", country: "Bangladesh" },
        },
    },
];

export const adminCourses: AdminCourse[] = [
    { id: 1, name: "CIT-6102: Advanced Algorithms", subject: "MS in CSIT", teacherId: 3, teacherName: "Prof. Dr. Abdul Masud", studentCount: 32, session: "January-June 2025", isActive: true },
    { id: 2, name: "CIT-5103: Symbolic Machines", subject: "MS in CSIT", teacherId: 3, teacherName: "Prof. Dr. Abdul Masud", studentCount: 28, session: "January-June 2025", isActive: true },
    { id: 3, name: "CIT-5109 Natural Language Processing", subject: "MS in CSIT", teacherId: 4, teacherName: "Farjana Sultana Mim", studentCount: 25, session: "January-June 2025", isActive: true },
    { id: 4, name: "CIT 6105: Information Security", subject: "MS in CSIT", teacherId: 2, teacherName: "Md. Mahbubur Rahman", studentCount: 30, session: "January-June 2024", isActive: true },
    { id: 5, name: "CIT 5101: Computer Networks", subject: "MS in CSIT", teacherId: 2, teacherName: "Md. Mahbubur Rahman", studentCount: 27, session: "January-June 2023", isActive: false },
    { id: 6, name: "CCE 423: Cryptography and Network Security", subject: "B.Sc in CCE", teacherId: null, teacherName: null, studentCount: 40, session: "2019-2020", isActive: true },
];

export const adminAssignments: AdminAssignment[] = [
    { id: 1, courseId: 4, courseName: "CIT 6105: Information Security", title: "CIT-6105 Research Assignment", description: "Follow IEEE Conference Paper format", deadline: "2025-09-16", maxMarks: 100, status: "Published", createdById: 2, createdBy: "Md. Mahbubur Rahman", createdAt: "2025-10-04", submissionCount: 18 },
    { id: 2, courseId: 4, courseName: "CIT 6105: Information Security", title: "Lab 1 - Substitution Cipher", description: "Implement Caesar and Vigenère ciphers", deadline: "2025-07-30", maxMarks: 50, status: "Published", createdById: 2, createdBy: "Md. Mahbubur Rahman", createdAt: "2025-07-20", submissionCount: 28 },
    { id: 3, courseId: 4, courseName: "CIT 6105: Information Security", title: "Quiz 1 - Classical Ciphers", description: "10 multiple-choice questions", deadline: "2025-07-12", maxMarks: 10, status: "Published", createdById: 2, createdBy: "Md. Mahbubur Rahman", createdAt: "2025-07-05", submissionCount: 30 },
    { id: 4, courseId: 1, courseName: "CIT-6102: Advanced Algorithms", title: "Quiz 2 - Hashing", description: "Hash functions and collision resolution", deadline: "2025-08-20", maxMarks: 20, status: "Published", createdById: 3, createdBy: "Prof. Dr. Abdul Masud", createdAt: "2025-08-10", submissionCount: 12 },
    { id: 5, courseId: 3, courseName: "CIT-5109 Natural Language Processing", title: "CIT-6109 Research Work", description: "NLP research paper analysis", deadline: "2025-08-16", maxMarks: 100, status: "Published", createdById: 4, createdBy: "Farjana Sultana Mim", createdAt: "2025-08-01", submissionCount: 8 },
    { id: 6, courseId: 1, courseName: "CIT-6102: Advanced Algorithms", title: "Assignment on Dynamic Programming", description: "Solve DP problems", deadline: "2025-09-01", maxMarks: 50, status: "Draft", createdById: 3, createdBy: "Prof. Dr. Abdul Masud", createdAt: "2025-08-15", submissionCount: 0 },
];

export const adminSubmissions: AdminSubmission[] = [
    { id: 1, assignmentId: 2, assignmentTitle: "Lab 1 - Substitution Cipher", courseId: 4, courseName: "CIT 6105: Information Security", studentId: 6, studentName: "Md. Samiur Rahman", status: "Graded", marks: 45, feedback: "Good implementation. Minor issues with edge cases.", submittedAt: "2025-07-28" },
    { id: 2, assignmentId: 2, assignmentTitle: "Lab 1 - Substitution Cipher", courseId: 4, courseName: "CIT 6105: Information Security", studentId: 7, studentName: "Habibur Rahman Khan Ratin", status: "Graded", marks: 42, feedback: "Well done. Consider adding more test cases.", submittedAt: "2025-07-29" },
    { id: 3, assignmentId: 2, assignmentTitle: "Lab 1 - Substitution Cipher", courseId: 4, courseName: "CIT 6105: Information Security", studentId: 8, studentName: "Iffat Ara Babli", status: "Submitted", marks: null, feedback: null, submittedAt: "2025-07-30" },
    { id: 4, assignmentId: 3, assignmentTitle: "Quiz 1 - Classical Ciphers", courseId: 4, courseName: "CIT 6105: Information Security", studentId: 6, studentName: "Md. Samiur Rahman", status: "Graded", marks: 9, feedback: "Excellent understanding.", submittedAt: "2025-07-11" },
    { id: 5, assignmentId: 1, assignmentTitle: "CIT-6105 Research Assignment", courseId: 4, courseName: "CIT 6105: Information Security", studentId: 6, studentName: "Md. Samiur Rahman", status: "Pending", marks: null, feedback: null, submittedAt: "" },
    { id: 6, assignmentId: 4, assignmentTitle: "Quiz 2 - Hashing", courseId: 1, courseName: "CIT-6102: Advanced Algorithms", studentId: 6, studentName: "Md. Samiur Rahman", status: "Submitted", marks: null, feedback: null, submittedAt: "2025-08-19" },
    { id: 7, assignmentId: 5, assignmentTitle: "CIT-6109 Research Work", courseId: 3, courseName: "CIT-5109 Natural Language Processing", studentId: 9, studentName: "Partha Bhakta", status: "Graded", marks: 88, feedback: "Thorough analysis. Good references.", submittedAt: "2025-08-14" },
];

export const appSettings: AppSetting[] = [
    { key: "site_name", value: "eClassroomPro", description: "The display name of the application", category: "General" },
    { key: "max_file_size_mb", value: "10", description: "Maximum file upload size in MB", category: "General" },
    { key: "allowed_file_types", value: "pdf,doc,docx,zip,txt", description: "Comma-separated list of allowed file types", category: "General" },
    { key: "email_notifications_enabled", value: "true", description: "Enable email notifications for assignments", category: "Notifications" },
    { key: "due_date_reminder_hours", value: "24", description: "Hours before deadline to send reminder", category: "Notifications" },
    { key: "grade_notification_enabled", value: "true", description: "Notify students when graded", category: "Notifications" },
    { key: "max_marks_default", value: "100", description: "Default maximum marks for assignments", category: "Grading" },
    { key: "allow_late_submission", value: "false", description: "Allow submissions after deadline", category: "Grading" },
    { key: "late_submission_penalty_percent", value: "10", description: "Percentage penalty for late submissions", category: "Grading" },
    { key: "session_timeout_minutes", value: "60", description: "Session timeout in minutes", category: "Security" },
    { key: "password_min_length", value: "8", description: "Minimum password length", category: "Security" },
    { key: "enable_two_factor_auth", value: "false", description: "Require 2FA for all users", category: "Security" },
];

export function getAdminStats() {
    return {
        totalUsers: adminUsers.length,
        activeUsers: adminUsers.filter((u) => u.isActive).length,
        totalTeachers: adminUsers.filter((u) => u.role === "Teacher").length,
        totalStudents: adminUsers.filter((u) => u.role === "Student").length,
        totalCourses: adminCourses.length,
        activeCourses: adminCourses.filter((c) => c.isActive).length,
        totalAssignments: adminAssignments.length,
        publishedAssignments: adminAssignments.filter((a) => a.status === "Published").length,
        totalSubmissions: adminSubmissions.length,
        gradedSubmissions: adminSubmissions.filter((s) => s.status === "Graded").length,
        pendingSubmissions: adminSubmissions.filter((s) => s.status === "Submitted").length,
    };
}