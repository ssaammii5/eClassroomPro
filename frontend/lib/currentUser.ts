// lib/currentUser.ts

export const ROLE_STYLES: Record<"Admin" | "Teacher" | "Student", string> = {
    Admin: "bg-[#fce8e6] text-[#c5221f]",
    Teacher: "bg-[#fef7e0] text-[#b06000]",
    Student: "bg-[#e6f4ea] text-[#137333]",
};

export interface CurrentUser {
    name: string;
    email: string;
    role: keyof typeof ROLE_STYLES;
    avatarClass: string;
}

// Change role to "Admin" to access the admin panel
export const currentUser: CurrentUser = {
    name: "Admin User",
    email: "admin@eclassroompro.com",
    role: "Admin",
    avatarClass: "bg-[#c5221f]",
};

// ... rest of the file (Address, ProgramType, StudentProfile, currentStudentProfile) stays the same
export interface Address {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
}

export type ProgramType =
    | "Undergraduate"
    | "Postgraduate"
    | "Post Graduate Diploma"
    | "M.Phil"
    | "PhD";

export interface StudentProfile {
    fullName: string;
    fathersName: string;
    mothersName: string;
    dateOfBirth: string;
    mobile: string;
    nationality: string;
    studentId: string;
    regNo: string;
    department: string;
    currentProgram: ProgramType;
    session: string;
    level: number;
    semester: number;
    permanentAddress: Address;
}

export const currentStudentProfile: StudentProfile = {
    fullName: "Md. Samiur Rahman",
    fathersName: "Father Name Here",
    mothersName: "Mother Name Here",
    dateOfBirth: "2002-05-15",
    mobile: "+880 1712-345678",
    nationality: "Bangladeshi",
    studentId: "201-15-0000",
    regNo: "1234567890",
    department: "Computer Science and Engineering",
    currentProgram: "Undergraduate",
    session: "2021-2022",
    level: 1,
    semester: 1,
    permanentAddress: {
        street: "House 12, Road 5, Dhanmondi",
        city: "Dhaka",
        state: "Dhaka Division",
        zip: "1205",
        country: "Bangladesh",
    },
};