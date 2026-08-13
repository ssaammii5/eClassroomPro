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
    semesterSession: string;
    address: StudentAddress;
}

export type TeacherDesignation =
    | "Professor"
    | "Associate Professor"
    | "Assistant Professor"
    | "Senior Lecturer"
    | "Lecturer";

export interface TeacherDetails {
    teacherId: string;
    designation: TeacherDesignation;
    department: string;
}

export const TEACHER_DEPARTMENTS = [
    "CSE",
    "EEE",
    "BBA",
    "English",
    "Economics",
    "Law",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Architecture",
    "Civil Engineering",
    "Mechanical Engineering",
] as const;

// ===== ACADEMICS DATA =====

export interface AcademicProgram {
    id: number;
    name: string;
    description: string;
}

export interface AcademicSemester {
    id: number;
    name: string;
}

export interface AcademicDepartment {
    id: number;
    name: string;
    code: string;
}

export const academicPrograms: AcademicProgram[] = [
    { id: 1, name: "Undergraduate", description: "Bachelor's degree programs (4 years)" },
    { id: 2, name: "Postgraduate", description: "Master's degree programs (2 years)" },
    { id: 3, name: "Post Graduate Diploma", description: "Postgraduate diploma programs (1 year)" },
    { id: 4, name: "M.Phil", description: "Master of Philosophy research program" },
    { id: 5, name: "PhD", description: "Doctoral research program" },
];

export const academicDepartments: AcademicDepartment[] = [
    { id: 1, name: "Computer Science and Engineering", code: "CSE" },
    { id: 2, name: "Electrical and Electronic Engineering", code: "EEE" },
    { id: 3, name: "Business Administration", code: "BBA" },
    { id: 4, name: "English", code: "ENG" },
    { id: 5, name: "Economics", code: "ECO" },
    { id: 6, name: "Law", code: "LAW" },
    { id: 7, name: "Mathematics", code: "MTH" },
    { id: 8, name: "Physics", code: "PHY" },
    { id: 9, name: "Chemistry", code: "CHM" },
    { id: 10, name: "Architecture", code: "ARCH" },
    { id: 11, name: "Civil Engineering", code: "CE" },
    { id: 12, name: "Mechanical Engineering", code: "ME" },
];

export const academicSemesters: AcademicSemester[] = [
    { id: 1, name: "January-June/2023" },
    { id: 2, name: "July-December/2023" },
    { id: 3, name: "January-June/2024" },
    { id: 4, name: "July-December/2024" },
    { id: 5, name: "January-June/2025" },
    { id: 6, name: "July-December/2025" },
    { id: 7, name: "January-June/2026" },
    { id: 8, name: "July-December/2026" },
];

export interface AdminUser {
    id: number;
    name: string;
    email: string;
    role: "Admin" | "Teacher" | "Student";
    isActive: boolean;
    createdAt: string;
    studentDetails?: StudentDetails;
    teacherDetails?: TeacherDetails;
}

/* ─── Course Catalog: structured by program + department ─── */
export interface CourseCatalogItem {
    name: string;
    program: string;
    department: string;
}

export const COURSE_CATALOG: CourseCatalogItem[] = [
    { name: "CIT-6102: Advanced Algorithms", program: "Postgraduate", department: "CSE" },
    { name: "CIT-5103: Symbolic Machines", program: "Postgraduate", department: "CSE" },
    { name: "CIT-5109: Natural Language Processing", program: "Postgraduate", department: "CSE" },
    { name: "CIT-6105: Information Security", program: "Postgraduate", department: "CSE" },
    { name: "CIT-5101: Computer Networks", program: "Postgraduate", department: "CSE" },
    { name: "CSE 415: Operating Systems", program: "Undergraduate", department: "CSE" },
    { name: "CSE 416: Computer Architecture", program: "Undergraduate", department: "CSE" },
    { name: "CSE 417: Database Systems", program: "Undergraduate", department: "CSE" },
    { name: "CSE 418: Software Engineering", program: "Undergraduate", department: "CSE" },
    { name: "CCE 423: Cryptography and Network Security", program: "Undergraduate", department: "CSE" },
    { name: "EEE 301: Circuit Analysis", program: "Undergraduate", department: "EEE" },
    { name: "EEE 302: Digital Electronics", program: "Undergraduate", department: "EEE" },
    { name: "EEE 401: Control Systems", program: "Undergraduate", department: "EEE" },
    { name: "EEE 501: Power Electronics", program: "Postgraduate", department: "EEE" },
    { name: "BBA 201: Principles of Management", program: "Undergraduate", department: "BBA" },
    { name: "BBA 301: Marketing Management", program: "Undergraduate", department: "BBA" },
    { name: "BBA 401: Strategic Management", program: "Postgraduate", department: "BBA" },
    { name: "ENG 101: English Composition", program: "Undergraduate", department: "English" },
    { name: "ENG 201: Advanced English", program: "Undergraduate", department: "English" },
    { name: "ENG 301: English Literature", program: "Postgraduate", department: "English" },
    { name: "ECO 101: Microeconomics", program: "Undergraduate", department: "Economics" },
    { name: "ECO 201: Macroeconomics", program: "Undergraduate", department: "Economics" },
    { name: "LAW 101: Introduction to Law", program: "Undergraduate", department: "Law" },
    { name: "MTH 101: Calculus I", program: "Undergraduate", department: "Mathematics" },
    { name: "MTH 201: Linear Algebra", program: "Undergraduate", department: "Mathematics" },
    { name: "PHY 101: Physics I", program: "Undergraduate", department: "Physics" },
    { name: "CHM 101: Chemistry I", program: "Undergraduate", department: "Chemistry" },
];

/* ─── Preassigned Sessions ─── */
export const AVAILABLE_SESSIONS: string[] = [
    "January-June/2023",
    "July-December/2023",
    "January-June/2024",
    "July-December/2024",
    "January-June/2025",
    "July-December/2025",
    "January-June/2026",
    "July-December/2026",
];

/* ─── AdminCourse Interface ─── */
export interface AdminCourse {
    id: number;
    name: string;
    program: string;
    department: string;
    teacherIds: number[];
    studentIds: number[];
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
    /* ─── Admin ─── */
    { id: 1, name: "Admin User", email: "admin@eclassroompro.com", role: "Admin", isActive: true, createdAt: "2024-01-01" },

    /* ─── Teachers ─── */
    {
        id: 2, name: "Md. Mahbubur Rahman", email: "mahbubur@eclassroompro.com", role: "Teacher", isActive: true, createdAt: "2024-01-05",
        teacherDetails: { teacherId: "FAC-2001", designation: "Assistant Professor", department: "CSE" },
    },
    {
        id: 3, name: "Prof. Dr. Abdul Masud", email: "abdul.masud@eclassroompro.com", role: "Teacher", isActive: true, createdAt: "2024-01-05",
        teacherDetails: { teacherId: "FAC-2002", designation: "Professor", department: "CSE" },
    },
    {
        id: 4, name: "Farjana Sultana Mim", email: "farjana@eclassroompro.com", role: "Teacher", isActive: true, createdAt: "2024-01-10",
        teacherDetails: { teacherId: "FAC-2003", designation: "Lecturer", department: "CSE" },
    },
    {
        id: 5, name: "Chinmay Bepery", email: "chinmay@eclassroompro.com", role: "Teacher", isActive: false, createdAt: "2024-01-12",
        teacherDetails: { teacherId: "FAC-2004", designation: "Associate Professor", department: "EEE" },
    },
    {
        id: 41, name: "Dr. Rafiqul Islam", email: "rafiqul@eclassroompro.com", role: "Teacher", isActive: true, createdAt: "2024-01-15",
        teacherDetails: { teacherId: "FAC-2005", designation: "Professor", department: "EEE" },
    },
    {
        id: 42, name: "Dr. Nasreen Akter", email: "nasreen@eclassroompro.com", role: "Teacher", isActive: true, createdAt: "2024-01-18",
        teacherDetails: { teacherId: "FAC-2006", designation: "Associate Professor", department: "BBA" },
    },
    {
        id: 43, name: "Prof. Kamal Hossain", email: "kamal@eclassroompro.com", role: "Teacher", isActive: true, createdAt: "2024-01-20",
        teacherDetails: { teacherId: "FAC-2007", designation: "Professor", department: "English" },
    },
    {
        id: 44, name: "Dr. Salma Khatun", email: "salma.k@eclassroompro.com", role: "Teacher", isActive: true, createdAt: "2024-02-01",
        teacherDetails: { teacherId: "FAC-2008", designation: "Assistant Professor", department: "Economics" },
    },
    {
        id: 45, name: "Adv. Shahidul Islam", email: "shahidul@eclassroompro.com", role: "Teacher", isActive: true, createdAt: "2024-02-05",
        teacherDetails: { teacherId: "FAC-2009", designation: "Senior Lecturer", department: "Law" },
    },
    {
        id: 46, name: "Dr. Anisur Rahman", email: "anisur@eclassroompro.com", role: "Teacher", isActive: true, createdAt: "2024-02-10",
        teacherDetails: { teacherId: "FAC-2010", designation: "Assistant Professor", department: "Mathematics" },
    },

    /* ═══════════ STUDENTS ═══════════ */

    /* ─── CSE Undergraduate: January-June/2022 ─── */
    {
        id: 6, name: "Md. Samiur Rahman", email: "samiurinfo@gmail.com", role: "Student", isActive: true, createdAt: "2024-02-01",
        studentDetails: {
            fathersName: "Father Name Here", mothersName: "Mother Name Here", dateOfBirth: "2002-05-15",
            mobile: "+880 1712-345678", nationality: "Bangladeshi", studentId: "201-15-0000", regNo: "1234567890",
            department: "CSE", currentProgram: "Undergraduate", session: "2021-2022", semesterSession: "January-June/2022",
            address: { street: "House 12, Road 5, Dhanmondi", city: "Dhaka", state: "Dhaka Division", zip: "1205", country: "Bangladesh" },
        },
    },
    {
        id: 7, name: "Habibur Rahman Khan Ratin", email: "ratin@eclassroompro.com", role: "Student", isActive: true, createdAt: "2024-02-01",
        studentDetails: {
            fathersName: "Khan Rahman", mothersName: "Rehana Begum", dateOfBirth: "2001-11-02",
            mobile: "+880 1813-224455", nationality: "Bangladeshi", studentId: "201-15-1101", regNo: "1234567891",
            department: "CSE", currentProgram: "Undergraduate", session: "2021-2022", semesterSession: "January-June/2022",
            address: { street: "House 7, Mirpur DOHS", city: "Dhaka", state: "Dhaka Division", zip: "1216", country: "Bangladesh" },
        },
    },

    /* ─── CSE Undergraduate: July-December/2022 ─── */
    {
        id: 8, name: "Iffat Ara Babli", email: "iffat@eclassroompro.com", role: "Student", isActive: true, createdAt: "2024-02-01",
        studentDetails: {
            fathersName: "Abdul Karim", mothersName: "Rashida Khatun", dateOfBirth: "2002-03-21",
            mobile: "+880 1911-335566", nationality: "Bangladeshi", studentId: "201-15-1204", regNo: "1234567892",
            department: "CSE", currentProgram: "Undergraduate", session: "2021-2022", semesterSession: "July-December/2022",
            address: { street: "Flat B4, Banani Road 11", city: "Dhaka", state: "Dhaka Division", zip: "1213", country: "Bangladesh" },
        },
    },
    {
        id: 11, name: "Tanvir Ahmed", email: "tanvir.ahmed@eclassroompro.com", role: "Student", isActive: true, createdAt: "2024-02-05",
        studentDetails: {
            fathersName: "Abdul Ahmed", mothersName: "Fatema Ahmed", dateOfBirth: "2001-08-14",
            mobile: "+880 1715-667788", nationality: "Bangladeshi", studentId: "201-15-1305", regNo: "1234567893",
            department: "CSE", currentProgram: "Undergraduate", session: "2021-2022", semesterSession: "July-December/2022",
            address: { street: "House 33, Road 2, Uttara", city: "Dhaka", state: "Dhaka Division", zip: "1230", country: "Bangladesh" },
        },
    },
    {
        id: 12, name: "Sumaiya Islam", email: "sumaiya.islam@eclassroompro.com", role: "Student", isActive: true, createdAt: "2024-02-05",
        studentDetails: {
            fathersName: "Mohammad Islam", mothersName: "Ayesha Islam", dateOfBirth: "2002-01-25",
            mobile: "+880 1816-778899", nationality: "Bangladeshi", studentId: "201-15-1406", regNo: "1234567894",
            department: "CSE", currentProgram: "Undergraduate", session: "2021-2022", semesterSession: "July-December/2022",
            address: { street: "House 18, Road 9, Mohammadpur", city: "Dhaka", state: "Dhaka Division", zip: "1207", country: "Bangladesh" },
        },
    },

    /* ─── CSE Undergraduate: January-June/2023 ─── */
    {
        id: 13, name: "Arif Hossain", email: "arif.hossain@eclassroompro.com", role: "Student", isActive: true, createdAt: "2024-02-10",
        studentDetails: {
            fathersName: "Kamal Hossain", mothersName: "Salma Hossain", dateOfBirth: "2001-06-10",
            mobile: "+880 1917-889900", nationality: "Bangladeshi", studentId: "201-15-1507", regNo: "1234567895",
            department: "CSE", currentProgram: "Undergraduate", session: "2021-2022", semesterSession: "January-June/2023",
            address: { street: "House 45, Road 3, Mirpur 10", city: "Dhaka", state: "Dhaka Division", zip: "1216", country: "Bangladesh" },
        },
    },
    {
        id: 14, name: "Nusrat Jahan", email: "nusrat.jahan@eclassroompro.com", role: "Student", isActive: true, createdAt: "2024-02-10",
        studentDetails: {
            fathersName: "Shafiq Jahan", mothersName: "Rahima Jahan", dateOfBirth: "2002-09-18",
            mobile: "+880 1618-990011", nationality: "Bangladeshi", studentId: "201-15-1608", regNo: "1234567896",
            department: "CSE", currentProgram: "Undergraduate", session: "2021-2022", semesterSession: "January-June/2023",
            address: { street: "Flat C2, Road 14, Gulshan 2", city: "Dhaka", state: "Dhaka Division", zip: "1212", country: "Bangladesh" },
        },
    },
    {
        id: 15, name: "Mehedi Hasan", email: "mehedi.hasan@eclassroompro.com", role: "Student", isActive: true, createdAt: "2024-02-10",
        studentDetails: {
            fathersName: "Abdul Hasan", mothersName: "Khatun Hasan", dateOfBirth: "2001-12-05",
            mobile: "+880 1519-001122", nationality: "Bangladeshi", studentId: "201-15-1709", regNo: "1234567897",
            department: "CSE", currentProgram: "Undergraduate", session: "2021-2022", semesterSession: "January-June/2023",
            address: { street: "House 8, Road 6, Bashundhara", city: "Dhaka", state: "Dhaka Division", zip: "1229", country: "Bangladesh" },
        },
    },

    /* ─── CSE Undergraduate: July-December/2023 ─── */
    {
        id: 16, name: "Farhana Akter", email: "farhana.akter@eclassroompro.com", role: "Student", isActive: true, createdAt: "2024-03-01",
        studentDetails: {
            fathersName: "Abul Akter", mothersName: "Nasrin Akter", dateOfBirth: "2002-04-22",
            mobile: "+880 1720-112233", nationality: "Bangladeshi", studentId: "201-15-1810", regNo: "1234567898",
            department: "CSE", currentProgram: "Undergraduate", session: "2021-2022", semesterSession: "July-December/2023",
            address: { street: "House 22, Road 1, Motijheel", city: "Dhaka", state: "Dhaka Division", zip: "1000", country: "Bangladesh" },
        },
    },
    {
        id: 17, name: "Shakil Khan", email: "shakil.khan@eclassroompro.com", role: "Student", isActive: true, createdAt: "2024-03-01",
        studentDetails: {
            fathersName: "Rafiq Khan", mothersName: "Sultana Khan", dateOfBirth: "2001-07-30",
            mobile: "+880 1821-223344", nationality: "Bangladeshi", studentId: "201-15-1911", regNo: "1234567899",
            department: "CSE", currentProgram: "Undergraduate", session: "2021-2022", semesterSession: "July-December/2023",
            address: { street: "House 15, Road 8, Khilgaon", city: "Dhaka", state: "Dhaka Division", zip: "1219", country: "Bangladesh" },
        },
    },

    /* ─── CSE Undergraduate: January-June/2024 ─── */
    {
        id: 18, name: "Rima Sultana", email: "rima.sultana@eclassroompro.com", role: "Student", isActive: true, createdAt: "2024-03-05",
        studentDetails: {
            fathersName: "Jamal Sultana", mothersName: "Hosne Ara", dateOfBirth: "2002-11-12",
            mobile: "+880 1922-334455", nationality: "Bangladeshi", studentId: "201-15-2012", regNo: "1234567900",
            department: "CSE", currentProgram: "Undergraduate", session: "2021-2022", semesterSession: "January-June/2024",
            address: { street: "House 5, Road 12, Farmgate", city: "Dhaka", state: "Dhaka Division", zip: "1215", country: "Bangladesh" },
        },
    },
    {
        id: 19, name: "Jubair Alam", email: "jubair.alam@eclassroompro.com", role: "Student", isActive: true, createdAt: "2024-03-05",
        studentDetails: {
            fathersName: "Nurul Alam", mothersName: "Shirin Alam", dateOfBirth: "2001-03-08",
            mobile: "+880 1623-445566", nationality: "Bangladeshi", studentId: "201-15-2113", regNo: "1234567901",
            department: "CSE", currentProgram: "Undergraduate", session: "2021-2022", semesterSession: "January-June/2024",
            address: { street: "House 28, Road 4, Badda", city: "Dhaka", state: "Dhaka Division", zip: "1212", country: "Bangladesh" },
        },
    },
    {
        id: 20, name: "Tasnim Ferdous", email: "tasnim.ferdous@eclassroompro.com", role: "Student", isActive: true, createdAt: "2024-03-05",
        studentDetails: {
            fathersName: "Abdul Ferdous", mothersName: "Rokeya Ferdous", dateOfBirth: "2002-06-28",
            mobile: "+880 1524-556677", nationality: "Bangladeshi", studentId: "201-15-2214", regNo: "1234567902",
            department: "CSE", currentProgram: "Undergraduate", session: "2021-2022", semesterSession: "January-June/2024",
            address: { street: "Flat A3, Road 7, Adabor", city: "Dhaka", state: "Dhaka Division", zip: "1207", country: "Bangladesh" },
        },
    },

    /* ─── CSE Undergraduate: July-December/2024 ─── */
    {
        id: 21, name: "Sabbir Rahman", email: "sabbir.rahman@eclassroompro.com", role: "Student", isActive: true, createdAt: "2024-04-01",
        studentDetails: {
            fathersName: "Mokbul Rahman", mothersName: "Amina Rahman", dateOfBirth: "2002-02-14",
            mobile: "+880 1725-667788", nationality: "Bangladeshi", studentId: "201-15-2315", regNo: "1234567903",
            department: "CSE", currentProgram: "Undergraduate", session: "2021-2022", semesterSession: "July-December/2024",
            address: { street: "House 9, Road 15, Lalmatia", city: "Dhaka", state: "Dhaka Division", zip: "1207", country: "Bangladesh" },
        },
    },
    {
        id: 22, name: "Ayesha Siddika", email: "ayesha.siddika@eclassroompro.com", role: "Student", isActive: true, createdAt: "2024-04-01",
        studentDetails: {
            fathersName: "Abdur Siddika", mothersName: "Halima Siddika", dateOfBirth: "2001-10-20",
            mobile: "+880 1826-778899", nationality: "Bangladeshi", studentId: "201-15-2416", regNo: "1234567904",
            department: "CSE", currentProgram: "Undergraduate", session: "2021-2022", semesterSession: "July-December/2024",
            address: { street: "House 14, Road 3, Rampura", city: "Dhaka", state: "Dhaka Division", zip: "1219", country: "Bangladesh" },
        },
    },

    /* ─── CSE Postgraduate: July-December/2023 ─── */
    {
        id: 9, name: "Partha Bhakta", email: "partha@eclassroompro.com", role: "Student", isActive: true, createdAt: "2024-02-05",
        studentDetails: {
            fathersName: "Nirmal Bhakta", mothersName: "Shikha Bhakta", dateOfBirth: "2000-12-09",
            mobile: "+880 1614-778899", nationality: "Bangladeshi", studentId: "202-16-0342", regNo: "1234567893",
            department: "CSE", currentProgram: "Postgraduate", session: "2023-2024", semesterSession: "July-December/2023",
            address: { street: "House 22, GEC Circle", city: "Chattogram", state: "Chattogram Division", zip: "4000", country: "Bangladesh" },
        },
    },
    {
        id: 23, name: "Rakibul Hasan", email: "rakibul.hasan@eclassroompro.com", role: "Student", isActive: true, createdAt: "2024-04-05",
        studentDetails: {
            fathersName: "Abdul Hasan", mothersName: "Shahida Hasan", dateOfBirth: "1999-05-15",
            mobile: "+880 1927-889900", nationality: "Bangladeshi", studentId: "202-16-0443", regNo: "1234567905",
            department: "CSE", currentProgram: "Postgraduate", session: "2023-2024", semesterSession: "July-December/2023",
            address: { street: "House 3, Road 11, Dhanmondi", city: "Dhaka", state: "Dhaka Division", zip: "1205", country: "Bangladesh" },
        },
    },
    {
        id: 24, name: "Sharmin Sultana", email: "sharmin.sultana@eclassroompro.com", role: "Student", isActive: true, createdAt: "2024-04-05",
        studentDetails: {
            fathersName: "Kamal Sultana", mothersName: "Nasrin Sultana", dateOfBirth: "1998-09-22",
            mobile: "+880 1628-990011", nationality: "Bangladeshi", studentId: "202-16-0544", regNo: "1234567906",
            department: "CSE", currentProgram: "Postgraduate", session: "2023-2024", semesterSession: "July-December/2023",
            address: { street: "House 7, Road 5, Banani", city: "Dhaka", state: "Dhaka Division", zip: "1213", country: "Bangladesh" },
        },
    },

    /* ─── CSE Postgraduate: January-June/2024 ─── */
    {
        id: 10, name: "Md. Kaium Al Sifat Bhuiyan", email: "kaium@eclassroompro.com", role: "Student", isActive: false, createdAt: "2024-02-10",
        studentDetails: {
            fathersName: "Sifat Bhuiyan", mothersName: "Salma Bhuiyan", dateOfBirth: "2001-07-30",
            mobile: "+880 1515-667788", nationality: "Bangladeshi", studentId: "202-16-0455", regNo: "1234567894",
            department: "CSE", currentProgram: "Postgraduate", session: "2023-2024", semesterSession: "January-June/2024",
            address: { street: "House 3, Zindabazar", city: "Sylhet", state: "Sylhet Division", zip: "3100", country: "Bangladesh" },
        },
    },
    {
        id: 25, name: "Imran Hossain", email: "imran.hossain@eclassroompro.com", role: "Student", isActive: true, createdAt: "2024-04-10",
        studentDetails: {
            fathersName: "Abdul Hossain", mothersName: "Rahima Hossain", dateOfBirth: "1999-11-08",
            mobile: "+880 1729-001122", nationality: "Bangladeshi", studentId: "202-16-0656", regNo: "1234567907",
            department: "CSE", currentProgram: "Postgraduate", session: "2023-2024", semesterSession: "January-June/2024",
            address: { street: "House 11, Road 6, Uttara", city: "Dhaka", state: "Dhaka Division", zip: "1230", country: "Bangladesh" },
        },
    },
    {
        id: 26, name: "Fatema Khatun", email: "fatema.khatun@eclassroompro.com", role: "Student", isActive: true, createdAt: "2024-04-10",
        studentDetails: {
            fathersName: "Abdul Khatun", mothersName: "Sufia Khatun", dateOfBirth: "2000-03-15",
            mobile: "+880 1830-112233", nationality: "Bangladeshi", studentId: "202-16-0757", regNo: "1234567908",
            department: "CSE", currentProgram: "Postgraduate", session: "2023-2024", semesterSession: "January-June/2024",
            address: { street: "House 19, Road 2, Mirpur 12", city: "Dhaka", state: "Dhaka Division", zip: "1216", country: "Bangladesh" },
        },
    },

    /* ─── CSE Postgraduate: July-December/2024 ─── */
    {
        id: 27, name: "Naimul Islam", email: "naimul.islam@eclassroompro.com", role: "Student", isActive: true, createdAt: "2024-05-01",
        studentDetails: {
            fathersName: "Shafiq Islam", mothersName: "Rahima Islam", dateOfBirth: "1998-07-20",
            mobile: "+880 1931-223344", nationality: "Bangladeshi", studentId: "202-16-0858", regNo: "1234567909",
            department: "CSE", currentProgram: "Postgraduate", session: "2023-2024", semesterSession: "July-December/2024",
            address: { street: "House 6, Road 9, Mohammadpur", city: "Dhaka", state: "Dhaka Division", zip: "1207", country: "Bangladesh" },
        },
    },
    {
        id: 28, name: "Sadia Afrin", email: "sadia.afrin@eclassroompro.com", role: "Student", isActive: true, createdAt: "2024-05-01",
        studentDetails: {
            fathersName: "Abdul Afrin", mothersName: "Nasrin Afrin", dateOfBirth: "1999-01-28",
            mobile: "+880 1632-334455", nationality: "Bangladeshi", studentId: "202-16-0959", regNo: "1234567910",
            department: "CSE", currentProgram: "Postgraduate", session: "2023-2024", semesterSession: "July-December/2024",
            address: { street: "Flat D1, Road 13, Gulshan 1", city: "Dhaka", state: "Dhaka Division", zip: "1212", country: "Bangladesh" },
        },
    },

    /* ─── CSE Postgraduate: January-June/2025 ─── */
    {
        id: 29, name: "Zahirul Islam", email: "zahirul.islam@eclassroompro.com", role: "Student", isActive: true, createdAt: "2024-05-05",
        studentDetails: {
            fathersName: "Abdul Islam", mothersName: "Halima Islam", dateOfBirth: "1997-08-12",
            mobile: "+880 1533-445566", nationality: "Bangladeshi", studentId: "202-16-1060", regNo: "1234567911",
            department: "CSE", currentProgram: "Postgraduate", session: "2024-2025", semesterSession: "January-June/2025",
            address: { street: "House 10, Road 4, Bashundhara", city: "Dhaka", state: "Dhaka Division", zip: "1229", country: "Bangladesh" },
        },
    },
    {
        id: 30, name: "Mst. Rupa Khatun", email: "rupa.khatun@eclassroompro.com", role: "Student", isActive: true, createdAt: "2024-05-05",
        studentDetails: {
            fathersName: "Abdul Khatun", mothersName: "Shahida Khatun", dateOfBirth: "1998-04-05",
            mobile: "+880 1734-556677", nationality: "Bangladeshi", studentId: "202-16-1161", regNo: "1234567912",
            department: "CSE", currentProgram: "Postgraduate", session: "2024-2025", semesterSession: "January-June/2025",
            address: { street: "House 16, Road 7, Khilgaon", city: "Dhaka", state: "Dhaka Division", zip: "1219", country: "Bangladesh" },
        },
    },
    {
        id: 31, name: "Tanjim Hasan", email: "tanjim.hasan@eclassroompro.com", role: "Student", isActive: true, createdAt: "2024-05-05",
        studentDetails: {
            fathersName: "Kamal Hasan", mothersName: "Amina Hasan", dateOfBirth: "1999-06-18",
            mobile: "+880 1835-667788", nationality: "Bangladeshi", studentId: "202-16-1262", regNo: "1234567913",
            department: "CSE", currentProgram: "Postgraduate", session: "2024-2025", semesterSession: "January-June/2025",
            address: { street: "House 4, Road 10, Adabor", city: "Dhaka", state: "Dhaka Division", zip: "1207", country: "Bangladesh" },
        },
    },

    /* ─── EEE Undergraduate: January-June/2023 ─── */
    {
        id: 32, name: "Rashedul Karim", email: "rashedul.karim@eclassroompro.com", role: "Student", isActive: true, createdAt: "2024-05-10",
        studentDetails: {
            fathersName: "Abdul Karim", mothersName: "Fatema Karim", dateOfBirth: "2001-02-20",
            mobile: "+880 1936-778899", nationality: "Bangladeshi", studentId: "203-17-0101", regNo: "1234567914",
            department: "EEE", currentProgram: "Undergraduate", session: "2022-2023", semesterSession: "January-June/2023",
            address: { street: "House 8, Road 3, Nasirabad", city: "Chattogram", state: "Chattogram Division", zip: "4000", country: "Bangladesh" },
        },
    },
    {
        id: 33, name: "Moushumi Akter", email: "moushumi.akter@eclassroompro.com", role: "Student", isActive: true, createdAt: "2024-05-10",
        studentDetails: {
            fathersName: "Shafiq Akter", mothersName: "Rahima Akter", dateOfBirth: "2002-05-10",
            mobile: "+880 1637-889900", nationality: "Bangladeshi", studentId: "203-17-0202", regNo: "1234567915",
            department: "EEE", currentProgram: "Undergraduate", session: "2022-2023", semesterSession: "January-June/2023",
            address: { street: "House 12, Road 6, Agrabad", city: "Chattogram", state: "Chattogram Division", zip: "4100", country: "Bangladesh" },
        },
    },
    {
        id: 34, name: "Sajjad Hossain", email: "sajjad.hossain@eclassroompro.com", role: "Student", isActive: true, createdAt: "2024-05-10",
        studentDetails: {
            fathersName: "Abdul Hossain", mothersName: "Khatun Hossain", dateOfBirth: "2001-09-25",
            mobile: "+880 1538-990011", nationality: "Bangladeshi", studentId: "203-17-0303", regNo: "1234567916",
            department: "EEE", currentProgram: "Undergraduate", session: "2022-2023", semesterSession: "January-June/2023",
            address: { street: "House 5, Road 8, Halishahar", city: "Chattogram", state: "Chattogram Division", zip: "4216", country: "Bangladesh" },
        },
    },

    /* ─── EEE Undergraduate: July-December/2023 ─── */
    {
        id: 35, name: "Nabila Tabassum", email: "nabila.tabassum@eclassroompro.com", role: "Student", isActive: true, createdAt: "2024-05-15",
        studentDetails: {
            fathersName: "Abdul Tabassum", mothersName: "Shirin Tabassum", dateOfBirth: "2002-01-15",
            mobile: "+880 1739-001122", nationality: "Bangladeshi", studentId: "203-17-0404", regNo: "1234567917",
            department: "EEE", currentProgram: "Undergraduate", session: "2022-2023", semesterSession: "July-December/2023",
            address: { street: "House 20, Road 1, Khulshi", city: "Chattogram", state: "Chattogram Division", zip: "4225", country: "Bangladesh" },
        },
    },
    {
        id: 36, name: "Fahim Ahmed", email: "fahim.ahmed@eclassroompro.com", role: "Student", isActive: true, createdAt: "2024-05-15",
        studentDetails: {
            fathersName: "Jamal Ahmed", mothersName: "Ayesha Ahmed", dateOfBirth: "2001-11-30",
            mobile: "+880 1840-112233", nationality: "Bangladeshi", studentId: "203-17-0505", regNo: "1234567918",
            department: "EEE", currentProgram: "Undergraduate", session: "2022-2023", semesterSession: "July-December/2023",
            address: { street: "House 9, Road 5, Nasirabad", city: "Chattogram", state: "Chattogram Division", zip: "4000", country: "Bangladesh" },
        },
    },

    /* ─── EEE Postgraduate: January-June/2024 ─── */
    {
        id: 37, name: "Asif Mahmud", email: "asif.mahmud@eclassroompro.com", role: "Student", isActive: true, createdAt: "2024-06-01",
        studentDetails: {
            fathersName: "Abdul Mahmud", mothersName: "Nasrin Mahmud", dateOfBirth: "1999-03-12",
            mobile: "+880 1941-223344", nationality: "Bangladeshi", studentId: "204-18-0101", regNo: "1234567919",
            department: "EEE", currentProgram: "Postgraduate", session: "2023-2024", semesterSession: "January-June/2024",
            address: { street: "House 14, Road 2, Dhanmondi", city: "Dhaka", state: "Dhaka Division", zip: "1205", country: "Bangladesh" },
        },
    },
    {
        id: 38, name: "Taslima Begum", email: "taslima.begum@eclassroompro.com", role: "Student", isActive: true, createdAt: "2024-06-01",
        studentDetails: {
            fathersName: "Shafiq Begum", mothersName: "Rahima Begum", dateOfBirth: "1998-07-25",
            mobile: "+880 1642-334455", nationality: "Bangladeshi", studentId: "204-18-0202", regNo: "1234567920",
            department: "EEE", currentProgram: "Postgraduate", session: "2023-2024", semesterSession: "January-June/2024",
            address: { street: "House 7, Road 9, Banani", city: "Dhaka", state: "Dhaka Division", zip: "1213", country: "Bangladesh" },
        },
    },

    /* ─── BBA Undergraduate: January-June/2024 ─── */
    {
        id: 39, name: "Shahin Alam", email: "shahin.alam@eclassroompro.com", role: "Student", isActive: true, createdAt: "2024-06-05",
        studentDetails: {
            fathersName: "Nurul Alam", mothersName: "Shirin Alam", dateOfBirth: "2001-04-18",
            mobile: "+880 1543-445566", nationality: "Bangladeshi", studentId: "205-19-0101", regNo: "1234567921",
            department: "BBA", currentProgram: "Undergraduate", session: "2023-2024", semesterSession: "January-June/2024",
            address: { street: "House 11, Road 3, Motijheel", city: "Dhaka", state: "Dhaka Division", zip: "1000", country: "Bangladesh" },
        },
    },
    {
        id: 40, name: "Munni Akter", email: "munni.akter@eclassroompro.com", role: "Student", isActive: true, createdAt: "2024-06-05",
        studentDetails: {
            fathersName: "Abdul Akter", mothersName: "Fatema Akter", dateOfBirth: "2002-08-08",
            mobile: "+880 1744-556677", nationality: "Bangladeshi", studentId: "205-19-0202", regNo: "1234567922",
            department: "BBA", currentProgram: "Undergraduate", session: "2023-2024", semesterSession: "January-June/2024",
            address: { street: "House 6, Road 7, Rampura", city: "Dhaka", state: "Dhaka Division", zip: "1219", country: "Bangladesh" },
        },
    },

    /* ─── BBA Undergraduate: July-December/2024 ─── */
    {
        id: 47, name: "Rakib Uddin", email: "rakib.uddin@eclassroompro.com", role: "Student", isActive: true, createdAt: "2024-07-01",
        studentDetails: {
            fathersName: "Abdul Uddin", mothersName: "Shahida Uddin", dateOfBirth: "2001-12-15",
            mobile: "+880 1845-667788", nationality: "Bangladeshi", studentId: "205-19-0303", regNo: "1234567923",
            department: "BBA", currentProgram: "Undergraduate", session: "2023-2024", semesterSession: "July-December/2024",
            address: { street: "House 13, Road 5, Farmgate", city: "Dhaka", state: "Dhaka Division", zip: "1215", country: "Bangladesh" },
        },
    },
    {
        id: 48, name: "Shirin Sultana", email: "shirin.sultana@eclassroompro.com", role: "Student", isActive: true, createdAt: "2024-07-01",
        studentDetails: {
            fathersName: "Jamal Sultana", mothersName: "Hosne Ara", dateOfBirth: "2002-03-22",
            mobile: "+880 1946-778899", nationality: "Bangladeshi", studentId: "205-19-0404", regNo: "1234567924",
            department: "BBA", currentProgram: "Undergraduate", session: "2023-2024", semesterSession: "July-December/2024",
            address: { street: "House 8, Road 11, Badda", city: "Dhaka", state: "Dhaka Division", zip: "1212", country: "Bangladesh" },
        },
    },

    /* ─── BBA Postgraduate: January-June/2025 ─── */
    {
        id: 49, name: "Kamrul Hasan", email: "kamrul.hasan@eclassroompro.com", role: "Student", isActive: true, createdAt: "2024-07-05",
        studentDetails: {
            fathersName: "Abdul Hasan", mothersName: "Rahima Hasan", dateOfBirth: "1998-06-10",
            mobile: "+880 1647-889900", nationality: "Bangladeshi", studentId: "206-20-0101", regNo: "1234567925",
            department: "BBA", currentProgram: "Postgraduate", session: "2024-2025", semesterSession: "January-June/2025",
            address: { street: "House 4, Road 8, Lalmatia", city: "Dhaka", state: "Dhaka Division", zip: "1207", country: "Bangladesh" },
        },
    },
    {
        id: 50, name: "Nasrin Akter", email: "nasrin.akter@eclassroompro.com", role: "Student", isActive: true, createdAt: "2024-07-05",
        studentDetails: {
            fathersName: "Shafiq Akter", mothersName: "Fatema Akter", dateOfBirth: "1999-01-05",
            mobile: "+880 1548-990011", nationality: "Bangladeshi", studentId: "206-20-0202", regNo: "1234567926",
            department: "BBA", currentProgram: "Postgraduate", session: "2024-2025", semesterSession: "January-June/2025",
            address: { street: "House 17, Road 2, Mohammadpur", city: "Dhaka", state: "Dhaka Division", zip: "1207", country: "Bangladesh" },
        },
    },

    /* ─── English Undergraduate: January-June/2024 ─── */
    {
        id: 51, name: "Sharmin Nahar", email: "sharmin.nahar@eclassroompro.com", role: "Student", isActive: true, createdAt: "2024-07-10",
        studentDetails: {
            fathersName: "Abdul Nahar", mothersName: "Sultana Nahar", dateOfBirth: "2001-05-20",
            mobile: "+880 1749-001122", nationality: "Bangladeshi", studentId: "207-21-0101", regNo: "1234567927",
            department: "English", currentProgram: "Undergraduate", session: "2023-2024", semesterSession: "January-June/2024",
            address: { street: "House 10, Road 4, Mirpur 10", city: "Dhaka", state: "Dhaka Division", zip: "1216", country: "Bangladesh" },
        },
    },
    {
        id: 52, name: "Arif Mahmud", email: "arif.mahmud@eclassroompro.com", role: "Student", isActive: true, createdAt: "2024-07-10",
        studentDetails: {
            fathersName: "Kamal Mahmud", mothersName: "Amina Mahmud", dateOfBirth: "2002-02-28",
            mobile: "+880 1850-112233", nationality: "Bangladeshi", studentId: "207-21-0202", regNo: "1234567928",
            department: "English", currentProgram: "Undergraduate", session: "2023-2024", semesterSession: "January-June/2024",
            address: { street: "House 15, Road 6, Khilgaon", city: "Dhaka", state: "Dhaka Division", zip: "1219", country: "Bangladesh" },
        },
    },

    /* ─── English Undergraduate: July-December/2024 ─── */
    {
        id: 53, name: "Rumana Haque", email: "rumana.haque@eclassroompro.com", role: "Student", isActive: true, createdAt: "2024-07-15",
        studentDetails: {
            fathersName: "Shafiq Haque", mothersName: "Rahima Haque", dateOfBirth: "2001-10-12",
            mobile: "+880 1951-223344", nationality: "Bangladeshi", studentId: "207-21-0303", regNo: "1234567929",
            department: "English", currentProgram: "Undergraduate", session: "2023-2024", semesterSession: "July-December/2024",
            address: { street: "House 3, Road 9, Bashundhara", city: "Dhaka", state: "Dhaka Division", zip: "1229", country: "Bangladesh" },
        },
    },

    /* ─── Economics Undergraduate: January-June/2024 ─── */
    {
        id: 54, name: "Mahmudul Hasan", email: "mahmudul.hasan@eclassroompro.com", role: "Student", isActive: true, createdAt: "2024-07-20",
        studentDetails: {
            fathersName: "Abdul Hasan", mothersName: "Khatun Hasan", dateOfBirth: "2001-07-08",
            mobile: "+880 1652-334455", nationality: "Bangladeshi", studentId: "208-22-0101", regNo: "1234567930",
            department: "Economics", currentProgram: "Undergraduate", session: "2023-2024", semesterSession: "January-June/2024",
            address: { street: "House 12, Road 1, Adabor", city: "Dhaka", state: "Dhaka Division", zip: "1207", country: "Bangladesh" },
        },
    },
    {
        id: 55, name: "Sadia Islam", email: "sadia.islam@eclassroompro.com", role: "Student", isActive: true, createdAt: "2024-07-20",
        studentDetails: {
            fathersName: "Nurul Islam", mothersName: "Shirin Islam", dateOfBirth: "2002-04-15",
            mobile: "+880 1553-445566", nationality: "Bangladeshi", studentId: "208-22-0202", regNo: "1234567931",
            department: "Economics", currentProgram: "Undergraduate", session: "2023-2024", semesterSession: "January-June/2024",
            address: { street: "House 7, Road 3, Rampura", city: "Dhaka", state: "Dhaka Division", zip: "1219", country: "Bangladesh" },
        },
    },

    /* ─── Law Undergraduate: January-June/2024 ─── */
    {
        id: 56, name: "Tanjila Akter", email: "tanjila.akter@eclassroompro.com", role: "Student", isActive: true, createdAt: "2024-07-25",
        studentDetails: {
            fathersName: "Abdul Akter", mothersName: "Fatema Akter", dateOfBirth: "2001-09-30",
            mobile: "+880 1754-556677", nationality: "Bangladeshi", studentId: "209-23-0101", regNo: "1234567932",
            department: "Law", currentProgram: "Undergraduate", session: "2023-2024", semesterSession: "January-June/2024",
            address: { street: "House 9, Road 5, Farmgate", city: "Dhaka", state: "Dhaka Division", zip: "1215", country: "Bangladesh" },
        },
    },
    {
        id: 57, name: "Rafiq Uddin", email: "rafiq.uddin@eclassroompro.com", role: "Student", isActive: true, createdAt: "2024-07-25",
        studentDetails: {
            fathersName: "Shafiq Uddin", mothersName: "Rahima Uddin", dateOfBirth: "2002-01-22",
            mobile: "+880 1855-667788", nationality: "Bangladeshi", studentId: "209-23-0202", regNo: "1234567933",
            department: "Law", currentProgram: "Undergraduate", session: "2023-2024", semesterSession: "January-June/2024",
            address: { street: "House 14, Road 8, Badda", city: "Dhaka", state: "Dhaka Division", zip: "1212", country: "Bangladesh" },
        },
    },

    /* ─── Mathematics Undergraduate: July-December/2024 ─── */
    {
        id: 58, name: "Shakil Ahmed", email: "shakil.ahmed@eclassroompro.com", role: "Student", isActive: true, createdAt: "2024-08-01",
        studentDetails: {
            fathersName: "Jamal Ahmed", mothersName: "Ayesha Ahmed", dateOfBirth: "2001-03-10",
            mobile: "+880 1956-778899", nationality: "Bangladeshi", studentId: "210-24-0101", regNo: "1234567934",
            department: "Mathematics", currentProgram: "Undergraduate", session: "2023-2024", semesterSession: "July-December/2024",
            address: { street: "House 5, Road 2, Lalmatia", city: "Dhaka", state: "Dhaka Division", zip: "1207", country: "Bangladesh" },
        },
    },
    {
        id: 59, name: "Farida Yasmin", email: "farida.yasmin@eclassroompro.com", role: "Student", isActive: true, createdAt: "2024-08-01",
        studentDetails: {
            fathersName: "Abdul Yasmin", mothersName: "Nasrin Yasmin", dateOfBirth: "2002-06-05",
            mobile: "+880 1657-889900", nationality: "Bangladeshi", studentId: "210-24-0202", regNo: "1234567935",
            department: "Mathematics", currentProgram: "Undergraduate", session: "2023-2024", semesterSession: "July-December/2024",
            address: { street: "House 11, Road 7, Mohammadpur", city: "Dhaka", state: "Dhaka Division", zip: "1207", country: "Bangladesh" },
        },
    },

    /* ─── CSE Undergraduate: January-June/2025 ─── */
    {
        id: 60, name: "Imran Khan", email: "imran.khan@eclassroompro.com", role: "Student", isActive: true, createdAt: "2024-08-05",
        studentDetails: {
            fathersName: "Rafiq Khan", mothersName: "Sultana Khan", dateOfBirth: "2002-08-25",
            mobile: "+880 1558-990011", nationality: "Bangladeshi", studentId: "201-15-2517", regNo: "1234567936",
            department: "CSE", currentProgram: "Undergraduate", session: "2021-2022", semesterSession: "January-June/2025",
            address: { street: "House 6, Road 12, Mirpur 11", city: "Dhaka", state: "Dhaka Division", zip: "1216", country: "Bangladesh" },
        },
    },
    {
        id: 61, name: "Sadia Rahman", email: "sadia.rahman@eclassroompro.com", role: "Student", isActive: true, createdAt: "2024-08-05",
        studentDetails: {
            fathersName: "Mokbul Rahman", mothersName: "Amina Rahman", dateOfBirth: "2001-12-18",
            mobile: "+880 1759-001122", nationality: "Bangladeshi", studentId: "201-15-2618", regNo: "1234567937",
            department: "CSE", currentProgram: "Undergraduate", session: "2021-2022", semesterSession: "January-June/2025",
            address: { street: "House 13, Road 4, Gulshan 2", city: "Dhaka", state: "Dhaka Division", zip: "1212", country: "Bangladesh" },
        },
    },
    {
        id: 62, name: "Nayeem Hossain", email: "nayeem.hossain@eclassroompro.com", role: "Student", isActive: true, createdAt: "2024-08-05",
        studentDetails: {
            fathersName: "Kamal Hossain", mothersName: "Salma Hossain", dateOfBirth: "2002-02-10",
            mobile: "+880 1860-112233", nationality: "Bangladeshi", studentId: "201-15-2719", regNo: "1234567938",
            department: "CSE", currentProgram: "Undergraduate", session: "2021-2022", semesterSession: "January-June/2025",
            address: { street: "House 8, Road 9, Bashundhara", city: "Dhaka", state: "Dhaka Division", zip: "1229", country: "Bangladesh" },
        },
    },

    /* ─── CSE Postgraduate: July-December/2025 ─── */
    {
        id: 63, name: "Rasel Mahmud", email: "rasel.mahmud@eclassroompro.com", role: "Student", isActive: true, createdAt: "2024-08-10",
        studentDetails: {
            fathersName: "Abdul Mahmud", mothersName: "Nasrin Mahmud", dateOfBirth: "1997-11-20",
            mobile: "+880 1961-223344", nationality: "Bangladeshi", studentId: "202-16-1363", regNo: "1234567939",
            department: "CSE", currentProgram: "Postgraduate", session: "2024-2025", semesterSession: "July-December/2025",
            address: { street: "House 10, Road 3, Dhanmondi", city: "Dhaka", state: "Dhaka Division", zip: "1205", country: "Bangladesh" },
        },
    },
    {
        id: 64, name: "Mst. Ayesha Khatun", email: "ayesha.khatun@eclassroompro.com", role: "Student", isActive: true, createdAt: "2024-08-10",
        studentDetails: {
            fathersName: "Shafiq Khatun", mothersName: "Rahima Khatun", dateOfBirth: "1998-05-15",
            mobile: "+880 1662-334455", nationality: "Bangladeshi", studentId: "202-16-1464", regNo: "1234567940",
            department: "CSE", currentProgram: "Postgraduate", session: "2024-2025", semesterSession: "July-December/2025",
            address: { street: "House 5, Road 11, Banani", city: "Dhaka", state: "Dhaka Division", zip: "1213", country: "Bangladesh" },
        },
    },
];

/* ─── Mock courses with new fields ─── */
export const adminCourses: AdminCourse[] = [
    { id: 1, name: "CIT-6102: Advanced Algorithms", program: "Postgraduate", department: "CSE", teacherIds: [3], studentIds: [9, 23, 24, 25, 26, 27, 28, 29, 30, 31], session: "January-June/2025", isActive: true },
    { id: 2, name: "CIT-5103: Symbolic Machines", program: "Postgraduate", department: "CSE", teacherIds: [3], studentIds: [23, 24, 27, 28], session: "January-June/2025", isActive: true },
    { id: 3, name: "CIT-5109: Natural Language Processing", program: "Postgraduate", department: "CSE", teacherIds: [4], studentIds: [29, 30, 31], session: "January-June/2025", isActive: true },
    { id: 4, name: "CIT-6105: Information Security", program: "Postgraduate", department: "CSE", teacherIds: [2], studentIds: [25, 26, 27, 28], session: "January-June/2024", isActive: true },
    { id: 5, name: "CIT-5101: Computer Networks", program: "Postgraduate", department: "CSE", teacherIds: [2], studentIds: [9, 10, 23, 24], session: "July-December/2023", isActive: false },
    { id: 6, name: "CCE 423: Cryptography and Network Security", program: "Undergraduate", department: "CSE", teacherIds: [], studentIds: [6, 7, 8, 11, 12, 13, 14, 15], session: "January-June/2024", isActive: true },
    { id: 7, name: "CSE 415: Operating Systems", program: "Undergraduate", department: "CSE", teacherIds: [2, 4], studentIds: [16, 17, 18, 19, 20, 21, 22], session: "July-December/2024", isActive: true },
    { id: 8, name: "CSE 416: Computer Architecture", program: "Undergraduate", department: "CSE", teacherIds: [3], studentIds: [60, 61, 62], session: "January-June/2025", isActive: true },
    { id: 9, name: "EEE 301: Circuit Analysis", program: "Undergraduate", department: "EEE", teacherIds: [41], studentIds: [32, 33, 34], session: "January-June/2023", isActive: true },
    { id: 10, name: "EEE 302: Digital Electronics", program: "Undergraduate", department: "EEE", teacherIds: [41], studentIds: [35, 36], session: "July-December/2023", isActive: true },
    { id: 11, name: "EEE 501: Power Electronics", program: "Postgraduate", department: "EEE", teacherIds: [41], studentIds: [37, 38], session: "January-June/2024", isActive: true },
    { id: 12, name: "BBA 201: Principles of Management", program: "Undergraduate", department: "BBA", teacherIds: [42], studentIds: [39, 40], session: "January-June/2024", isActive: true },
    { id: 13, name: "BBA 301: Marketing Management", program: "Undergraduate", department: "BBA", teacherIds: [42], studentIds: [47, 48], session: "July-December/2024", isActive: true },
    { id: 14, name: "BBA 401: Strategic Management", program: "Postgraduate", department: "BBA", teacherIds: [42], studentIds: [49, 50], session: "January-June/2025", isActive: true },
    { id: 15, name: "ENG 101: English Composition", program: "Undergraduate", department: "English", teacherIds: [43], studentIds: [51, 52], session: "January-June/2024", isActive: true },
    { id: 16, name: "ENG 201: Advanced English", program: "Undergraduate", department: "English", teacherIds: [43], studentIds: [53], session: "July-December/2024", isActive: true },
    { id: 17, name: "ECO 101: Microeconomics", program: "Undergraduate", department: "Economics", teacherIds: [44], studentIds: [54, 55], session: "January-June/2024", isActive: true },
    { id: 18, name: "LAW 101: Introduction to Law", program: "Undergraduate", department: "Law", teacherIds: [45], studentIds: [56, 57], session: "January-June/2024", isActive: true },
    { id: 19, name: "MTH 101: Calculus I", program: "Undergraduate", department: "Mathematics", teacherIds: [46], studentIds: [58, 59], session: "July-December/2024", isActive: true },
];

export const adminAssignments: AdminAssignment[] = [
    { id: 1, courseId: 4, courseName: "CIT-6105: Information Security", title: "CIT-6105 Research Assignment", description: "Follow IEEE Conference Paper format", deadline: "2025-09-16", maxMarks: 100, status: "Published", createdById: 2, createdBy: "Md. Mahbubur Rahman", createdAt: "2025-10-04", submissionCount: 18 },
    { id: 2, courseId: 4, courseName: "CIT-6105: Information Security", title: "Lab 1 - Substitution Cipher", description: "Implement Caesar and Vigenère ciphers", deadline: "2025-07-30", maxMarks: 50, status: "Published", createdById: 2, createdBy: "Md. Mahbubur Rahman", createdAt: "2025-07-20", submissionCount: 28 },
    { id: 3, courseId: 4, courseName: "CIT-6105: Information Security", title: "Quiz 1 - Classical Ciphers", description: "10 multiple-choice questions", deadline: "2025-07-12", maxMarks: 10, status: "Published", createdById: 2, createdBy: "Md. Mahbubur Rahman", createdAt: "2025-07-05", submissionCount: 30 },
    { id: 4, courseId: 1, courseName: "CIT-6102: Advanced Algorithms", title: "Quiz 2 - Hashing", description: "Hash functions and collision resolution", deadline: "2025-08-20", maxMarks: 20, status: "Published", createdById: 3, createdBy: "Prof. Dr. Abdul Masud", createdAt: "2025-08-10", submissionCount: 12 },
    { id: 5, courseId: 3, courseName: "CIT-5109: Natural Language Processing", title: "CIT-6109 Research Work", description: "NLP research paper analysis", deadline: "2025-08-16", maxMarks: 100, status: "Published", createdById: 4, createdBy: "Farjana Sultana Mim", createdAt: "2025-08-01", submissionCount: 8 },
    { id: 6, courseId: 1, courseName: "CIT-6102: Advanced Algorithms", title: "Assignment on Dynamic Programming", description: "Solve DP problems", deadline: "2025-09-01", maxMarks: 50, status: "Draft", createdById: 3, createdBy: "Prof. Dr. Abdul Masud", createdAt: "2025-08-15", submissionCount: 0 },
];

export const adminSubmissions: AdminSubmission[] = [
    { id: 1, assignmentId: 2, assignmentTitle: "Lab 1 - Substitution Cipher", courseId: 4, courseName: "CIT-6105: Information Security", studentId: 6, studentName: "Md. Samiur Rahman", status: "Graded", marks: 45, feedback: "Good implementation. Minor issues with edge cases.", submittedAt: "2025-07-28" },
    { id: 2, assignmentId: 2, assignmentTitle: "Lab 1 - Substitution Cipher", courseId: 4, courseName: "CIT-6105: Information Security", studentId: 7, studentName: "Habibur Rahman Khan Ratin", status: "Graded", marks: 42, feedback: "Well done. Consider adding more test cases.", submittedAt: "2025-07-29" },
    { id: 3, assignmentId: 2, assignmentTitle: "Lab 1 - Substitution Cipher", courseId: 4, courseName: "CIT-6105: Information Security", studentId: 8, studentName: "Iffat Ara Babli", status: "Submitted", marks: null, feedback: null, submittedAt: "2025-07-30" },
    { id: 4, assignmentId: 3, assignmentTitle: "Quiz 1 - Classical Ciphers", courseId: 4, courseName: "CIT-6105: Information Security", studentId: 6, studentName: "Md. Samiur Rahman", status: "Graded", marks: 9, feedback: "Excellent understanding.", submittedAt: "2025-07-11" },
    { id: 5, assignmentId: 1, assignmentTitle: "CIT-6105 Research Assignment", courseId: 4, courseName: "CIT-6105: Information Security", studentId: 6, studentName: "Md. Samiur Rahman", status: "Pending", marks: null, feedback: null, submittedAt: "" },
    { id: 6, assignmentId: 4, assignmentTitle: "Quiz 2 - Hashing", courseId: 1, courseName: "CIT-6102: Advanced Algorithms", studentId: 6, studentName: "Md. Samiur Rahman", status: "Submitted", marks: null, feedback: null, submittedAt: "2025-08-19" },
    { id: 7, assignmentId: 5, assignmentTitle: "CIT-6109 Research Work", courseId: 3, courseName: "CIT-5109: Natural Language Processing", studentId: 9, studentName: "Partha Bhakta", status: "Graded", marks: 88, feedback: "Thorough analysis. Good references.", submittedAt: "2025-08-14" },
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