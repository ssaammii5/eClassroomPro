"use client";

import { useState, useEffect, useMemo } from "react";
import type { AdminCourse, AdminUser } from "@/lib/adminData";
import {
    adminUsers,
    COURSE_CATALOG,
    AVAILABLE_SESSIONS,
    TEACHER_DEPARTMENTS,
} from "@/lib/adminData";
import { PROGRAM_TYPES } from "@/components/settings/constants";
import { X, Search, ChevronDown } from "lucide-react";

const DEPARTMENT_OPTIONS: string[] = [...TEACHER_DEPARTMENTS];

interface CourseFormModalProps {
    open: boolean;
    course: AdminCourse | null;
    onSave: (data: Omit<AdminCourse, "id">) => void;
    onClose: () => void;
}

export function CourseFormModal({ open, course, onSave, onClose }: CourseFormModalProps) {
    const [name, setName] = useState("");
    const [program, setProgram] = useState("");
    const [department, setDepartment] = useState("");
    const [session, setSession] = useState("");
    const [teacherIds, setTeacherIds] = useState<number[]>([]);
    const [studentIds, setStudentIds] = useState<number[]>([]);
    const [isActive, setIsActive] = useState(true);
    const [errors, setErrors] = useState<Record<string, string>>({});

    /* Student filter states */
    const [studentProgramFilter, setStudentProgramFilter] = useState("all");
    const [studentDeptFilter, setStudentDeptFilter] = useState("all");
    const [studentSessionFilter, setStudentSessionFilter] = useState("all");
    const [studentSearch, setStudentSearch] = useState("");

    const allTeachers = adminUsers.filter((u) => u.role === "Teacher" && u.isActive);
    const allStudents = adminUsers.filter((u) => u.role === "Student");

    /* Group teachers by department */
    const teachersByDept = useMemo(() => {
        const map = new Map<string, AdminUser[]>();
        for (const t of allTeachers) {
            const dept = t.teacherDetails?.department ?? "Uncategorized";
            if (!map.has(dept)) map.set(dept, []);
            map.get(dept)!.push(t);
        }
        return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
    }, [allTeachers]);

    /* Get unique student sessions for filter */
    const studentSessionOptions = useMemo(() => {
        return Array.from(
            new Set(allStudents.map((s) => s.studentDetails?.semesterSession ?? "").filter(Boolean))
        ).sort();
    }, [allStudents]);

    /* Filtered students based on program, dept, session */
    const filteredStudents = useMemo(() => {
        return allStudents.filter((s) => {
            const d = s.studentDetails;
            const matchProgram = studentProgramFilter === "all" || d?.currentProgram === studentProgramFilter;
            const matchDept = studentDeptFilter === "all" || d?.department === studentDeptFilter;
            const matchSession = studentSessionFilter === "all" || d?.semesterSession === studentSessionFilter;
            const matchSearch = s.name.toLowerCase().includes(studentSearch.toLowerCase());
            return matchProgram && matchDept && matchSession && matchSearch;
        });
    }, [allStudents, studentProgramFilter, studentDeptFilter, studentSessionFilter, studentSearch]);

    useEffect(() => {
        if (open) {
            setName(course?.name ?? "");
            setProgram(course?.program ?? "");
            setDepartment(course?.department ?? "");
            setSession(course?.session ?? "");
            setTeacherIds(course?.teacherIds ?? []);
            setStudentIds(course?.studentIds ?? []);
            setIsActive(course?.isActive ?? true);
            setErrors({});
            setStudentProgramFilter("all");
            setStudentDeptFilter("all");
            setStudentSessionFilter("all");
            setStudentSearch("");
        }
    }, [open, course]);

    const clearError = (key: string) =>
        setErrors((prev) => {
            if (!prev[key]) return prev;
            const next = { ...prev };
            delete next[key];
            return next;
        });

    const toggleTeacher = (id: number) => {
        setTeacherIds((prev) =>
            prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
        );
    };

    const toggleStudent = (id: number) => {
        setStudentIds((prev) =>
            prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
        );
    };

    const validate = () => {
        const next: Record<string, string> = {};
        if (!name) next.name = "Course name is required.";
        if (!program) next.program = "Program is required.";
        if (!department) next.department = "Department is required.";
        if (!session) next.session = "Session is required.";
        return next;
    };

    const handleSubmit = () => {
        const errs = validate();
        setErrors(errs);
        if (Object.keys(errs).length > 0) return;

        onSave({
            name,
            program,
            department,
            teacherIds,
            studentIds,
            session,
            isActive,
        });
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {course ? "Edit Course" : "Add New Course"}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="cursor-pointer rounded-full p-2 text-gray-600 hover:bg-gray-100"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-6">
                    {/* Course Name */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-800">
                            Course Name <span className="text-[#c5221f]">*</span>
                        </label>
                        <div className="relative">
                            <select
                                value={name}
                                onChange={(e) => { setName(e.target.value); clearError("name"); }}
                                className={`w-full appearance-none rounded-md border bg-white px-3.5 py-2.5 pr-10 text-[15px] focus:outline-none ${errors.name
                                        ? "border-[#c5221f] focus:border-[#c5221f] focus:ring-1 focus:ring-[#c5221f]"
                                        : "border-gray-400/80 focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]"
                                    } ${name ? "text-gray-900" : "text-gray-600"}`}
                            >
                                <option value="" disabled>Select course name</option>
                                {COURSE_CATALOG.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-700" />
                        </div>
                        {errors.name && <span className="mt-1 block text-sm text-[#c5221f]">{errors.name}</span>}
                    </div>

                    {/* Program + Department */}
                    <div className="grid gap-5 md:grid-cols-2">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-800">
                                Program <span className="text-[#c5221f]">*</span>
                            </label>
                            <div className="relative">
                                <select
                                    value={program}
                                    onChange={(e) => { setProgram(e.target.value); clearError("program"); }}
                                    className={`w-full appearance-none rounded-md border bg-white px-3.5 py-2.5 pr-10 text-[15px] focus:outline-none ${errors.program
                                            ? "border-[#c5221f] focus:border-[#c5221f] focus:ring-1 focus:ring-[#c5221f]"
                                            : "border-gray-400/80 focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]"
                                        } ${program ? "text-gray-900" : "text-gray-600"}`}
                                >
                                    <option value="" disabled>Select program</option>
                                    {PROGRAM_TYPES.map((p) => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-700" />
                            </div>
                            {errors.program && <span className="mt-1 block text-sm text-[#c5221f]">{errors.program}</span>}
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-800">
                                Department <span className="text-[#c5221f]">*</span>
                            </label>
                            <div className="relative">
                                <select
                                    value={department}
                                    onChange={(e) => { setDepartment(e.target.value); clearError("department"); }}
                                    className={`w-full appearance-none rounded-md border bg-white px-3.5 py-2.5 pr-10 text-[15px] focus:outline-none ${errors.department
                                            ? "border-[#c5221f] focus:border-[#c5221f] focus:ring-1 focus:ring-[#c5221f]"
                                            : "border-gray-400/80 focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]"
                                        } ${department ? "text-gray-900" : "text-gray-600"}`}
                                >
                                    <option value="" disabled>Select department</option>
                                    {DEPARTMENT_OPTIONS.map((d) => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-700" />
                            </div>
                            {errors.department && <span className="mt-1 block text-sm text-[#c5221f]">{errors.department}</span>}
                        </div>
                    </div>

                    {/* Session */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-800">
                            Session <span className="text-[#c5221f]">*</span>
                        </label>
                        <div className="relative">
                            <select
                                value={session}
                                onChange={(e) => { setSession(e.target.value); clearError("session"); }}
                                className={`w-full appearance-none rounded-md border bg-white px-3.5 py-2.5 pr-10 text-[15px] focus:outline-none ${errors.session
                                        ? "border-[#c5221f] focus:border-[#c5221f] focus:ring-1 focus:ring-[#c5221f]"
                                        : "border-gray-400/80 focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]"
                                    } ${session ? "text-gray-900" : "text-gray-600"}`}
                            >
                                <option value="" disabled>Select session</option>
                                {AVAILABLE_SESSIONS.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-700" />
                        </div>
                        {errors.session && <span className="mt-1 block text-sm text-[#c5221f]">{errors.session}</span>}
                    </div>

                    {/* Assigned Teachers - Grouped by Department */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-800">
                            Assigned Teachers
                            {teacherIds.length > 0 && (
                                <span className="ml-2 rounded-full bg-[#e8f0fe] px-2 py-0.5 text-xs font-medium text-[#174ea6]">
                                    {teacherIds.length} selected
                                </span>
                            )}
                        </label>
                        <div className="max-h-52 overflow-y-auto rounded-md border border-gray-200">
                            {teachersByDept.length === 0 ? (
                                <p className="px-4 py-3 text-sm text-gray-500">No active teachers found.</p>
                            ) : (
                                teachersByDept.map(([deptName, teachers]) => (
                                    <div key={deptName}>
                                        {/* Department header */}
                                        <div className="sticky top-0 border-b border-gray-100 bg-[#f8f9fa] px-4 py-2">
                                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                                                {deptName}
                                            </span>
                                        </div>
                                        {/* Teachers in this department */}
                                        {teachers.map((t) => (
                                            <label
                                                key={t.id}
                                                className="flex cursor-pointer items-center gap-3 px-4 py-2.5 hover:bg-gray-50"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={teacherIds.includes(t.id)}
                                                    onChange={() => toggleTeacher(t.id)}
                                                    className="h-4 w-4 accent-[#1a73e8]"
                                                />
                                                <div className="min-w-0 flex-1">
                                                    <span className="block truncate text-sm text-gray-900">{t.name}</span>
                                                    <span className="block text-xs text-gray-500">
                                                        {t.teacherDetails?.teacherId ?? "N/A"} • {t.teacherDetails?.department ?? "N/A"}
                                                    </span>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Enrolled Students - With Filters */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-800">
                            Enrolled Students
                            {studentIds.length > 0 && (
                                <span className="ml-2 rounded-full bg-[#e6f4ea] px-2 py-0.5 text-xs font-medium text-[#137333]">
                                    {studentIds.length} selected
                                </span>
                            )}
                        </label>

                        {/* Student Filters */}
                        <div className="mb-3 grid gap-3 rounded-md border border-gray-200 bg-[#f8f9fa] p-3 sm:grid-cols-3">
                            <select
                                value={studentProgramFilter}
                                onChange={(e) => setStudentProgramFilter(e.target.value)}
                                className="w-full rounded-md border border-gray-400/80 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#1a73e8] focus:outline-none focus:ring-1 focus:ring-[#1a73e8]"
                            >
                                <option value="all">All Programs</option>
                                {PROGRAM_TYPES.map((p) => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                            <select
                                value={studentDeptFilter}
                                onChange={(e) => setStudentDeptFilter(e.target.value)}
                                className="w-full rounded-md border border-gray-400/80 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#1a73e8] focus:outline-none focus:ring-1 focus:ring-[#1a73e8]"
                            >
                                <option value="all">All Departments</option>
                                {DEPARTMENT_OPTIONS.map((d) => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                            <select
                                value={studentSessionFilter}
                                onChange={(e) => setStudentSessionFilter(e.target.value)}
                                className="w-full rounded-md border border-gray-400/80 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#1a73e8] focus:outline-none focus:ring-1 focus:ring-[#1a73e8]"
                            >
                                <option value="all">All Sessions</option>
                                {studentSessionOptions.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>

                        {/* Student Search */}
                        <div className="relative mb-2">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                value={studentSearch}
                                onChange={(e) => setStudentSearch(e.target.value)}
                                placeholder="Search students..."
                                className="w-full rounded-md border border-gray-400/80 py-2 pl-10 pr-4 text-sm focus:border-[#1a73e8] focus:outline-none focus:ring-1 focus:ring-[#1a73e8]"
                            />
                        </div>

                        {/* Student List */}
                        <div className="max-h-52 overflow-y-auto rounded-md border border-gray-200">
                            {filteredStudents.length === 0 ? (
                                <p className="px-4 py-3 text-sm text-gray-500">No students match the filters.</p>
                            ) : (
                                filteredStudents.map((s) => (
                                    <label
                                        key={s.id}
                                        className="flex cursor-pointer items-center gap-3 px-4 py-2.5 hover:bg-gray-50"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={studentIds.includes(s.id)}
                                            onChange={() => toggleStudent(s.id)}
                                            className="h-4 w-4 accent-[#1a73e8]"
                                        />
                                        <div className="min-w-0 flex-1">
                                            <span className="block truncate text-sm text-gray-900">{s.name}</span>
                                            <span className="block text-xs text-gray-500">
                                                {s.studentDetails?.studentId ?? "N/A"} • {s.studentDetails?.department ?? "N/A"} • {s.studentDetails?.semesterSession ?? "N/A"}
                                            </span>
                                        </div>
                                    </label>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Active Toggle */}
                    <div className="flex items-center justify-between rounded-md border border-gray-200 px-4 py-3">
                        <span className="text-sm text-gray-800">Active Course</span>
                        <button
                            type="button"
                            role="switch"
                            aria-checked={isActive}
                            onClick={() => setIsActive((v) => !v)}
                            className={`relative h-7 w-12 shrink-0 cursor-pointer rounded-full transition-colors ${isActive ? "bg-[#1a73e8]" : "bg-gray-300"
                                }`}
                        >
                            <span
                                className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${isActive ? "left-6" : "left-1"
                                    }`}
                            />
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="cursor-pointer rounded-full border border-gray-400 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="cursor-pointer rounded-full bg-[#1a63d8] px-7 py-2.5 text-sm font-medium text-white hover:bg-[#1554b5]"
                    >
                        {course ? "Save Changes" : "Create Course"}
                    </button>
                </div>
            </div>
        </div>
    );
}