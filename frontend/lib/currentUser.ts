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

export const currentUser: CurrentUser = {
    name: "Md. Samiur Rahman",
    email: "samiurinfo@gmail.com",
    role: "Student",
    avatarClass: "bg-purple-800",
};