"use client";

import { useState, useEffect } from "react";
import type { AdminCourse } from "@/lib/adminData";
import { adminUsers, TEACHER_DEPARTMENTS } from "@/lib/adminData";
import { X, Search } from "lucide-react";

const DEPARTMENT_OPTIONS: string[] = [...TEACHER_DEPARTMENTS];
const SEMESTER_PERIODS = ["January-June", "July-December"];
const START_YEAR = 2000;
const END_YEAR = new Date().getFullYear() + 1;
const YEAR_OPTIONS = Array.from(
    { length: END_YEAR - START_YEAR + 1 },
    (_, i) => String(START_YEAR + i)
);

interface CourseFormModalProps {
    open: boolean;
    course: AdminCourse | null;
    onSave: (data: Omit<AdminCourse, "id">) => void;
    onClose: () => void;
}

export function CourseFormModal({ open, course, onSave, onClose }: CourseFormModalProps) {
    const [name, setName] = useState("");
    const [department, setDepartment] = useState("");
    const [subject, setSubject] = useState("");
    const [teacherIds, setTeacherIds] = useState<number[]>([]);
    const [studentIds, setStudentIds] = useState<number[]>([]);
    const [sessionPeriod, setSessionPeriod] = useState("");
    const [sessionYear, setSessionYear] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [teacherSearch, setTeacherSearch] = useState("");
    const [studentSearch, setStudentSearch] = useState("");

    const allTeachers = adminUsers.filter((u) => u.role === "Teacher" && u.isActive);
    const allStudents = adminUsers.filter((u) => u.role === "Student" && u.isActive);

    const filteredTeachers = allTeachers.filter((t) =>
        t.name.toLowerCase().includes(teacherSearch.toLowerCase())
    );
    const filteredStudents = allStudents.filter((s) =>
        s.name.toLowerCase().includes(studentSearch.toLowerCase())
    );

    useEffect(() => {
        if (open) {
            setName(course?.name ?? "");
            setDepartment(course?.department ?? "");
            setSubject(course?.subject ?? "");
            setTeacherIds(course?.teacherIds ?? []);
            setStudentIds(course?.studentIds ?? []);
            setIsActive(course?.isActive ?? true);
            setErrors({});
            setTeacherSearch("");
            setStudentSearch("");

            if (course?.session) {
                const parts = course.session.split("/");
                setSessionPeriod(parts[0] ?? "");
                setSessionYear(parts[1] ?? "");
            } else {
                setSessionPeriod("");
                setSessionYear("");
            }
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
        if (!name.trim()) next.name = "Course name is required.";
        if (!department) next.department = "Department is required.";
        if (!sessionPeriod || !sessionYear) next.session = "Session period and year are required.";
        return next;
    };

    const handleSubmit = () => {
        const errs = validate();
        setErrors(errs);
        if (Object.keys(errs).length > 0) return;

        onSave({
            name: name.trim(),
            department,
            subject: subject.trim(),
            teacherIds,
            studentIds,
            session: `${sessionPeriod}/${sessionYear}`,
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
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => { setName(e.target.value); clearError("name"); }}
                            placeholder="e.g., CIT-6102: Advanced Algorithms"
                            className={`w-full rounded-md border px-3.5 py-2.5 text-[15px] focus:outline-none ${errors.name
                                    ? "border-[#c5221f] focus:ring-1 focus:ring-[#c5221f]"
                                    : "border-gray-400/80 focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]"
                                }`}
                        />
                        {errors.name && <span className="mt-1 block text-sm text-[#c5221f]">{errors.name}</span>}
                    </div>

                    {/* Department + Subject */}
                    <div className="grid gap-5 md:grid-cols-2">
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
                                <svg viewBox="0 0 20 20" fill="currentColor" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-700">
                                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                                </svg>
                            </div>
                            {errors.department && <span className="mt-1 block text-sm text-[#c5221f]">{errors.department}</span>}
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-800">Subject</label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="e.g., MS in CSIT"
                                className="w-full rounded-md border border-gray-400/80 px-3.5 py-2.5 text-[15px] focus:border-[#1a73e8] focus:outline-none focus:ring-1 focus:ring-[#1a73e8]"
                            />
                        </div>
                    </div>

                    {/* Session */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-800">
                            Session <span className="text-[#c5221f]">*</span>
                        </label>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="relative">
                                <select
                                    value={sessionPeriod}
                                    onChange={(e) => { setSessionPeriod(e.target.value); clearError("session"); }}
                                    className={`w-full appearance-none rounded-md border bg-white px-3.5 py-2.5 pr-10 text-[15px] focus:outline-none ${errors.session && !sessionPeriod
                                            ? "border-[#c5221f] focus:border-[#c5221f] focus:ring-1 focus:ring-[#c5221f]"
                                            : "border-gray-400/80 focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]"
                                        } ${sessionPeriod ? "text-gray-900" : "text-gray-600"}`}
                                >
                                    <option value="" disabled>Semester period</option>
                                    {SEMESTER_PERIODS.map((p) => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>
                                <svg viewBox="0 0 20 20" fill="currentColor" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-700">
                                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="relative">
                                <select
                                    value={sessionYear}
                                    onChange={(e) => { setSessionYear(e.target.value); clearError("session"); }}
                                    className={`w-full appearance-none rounded-md border bg-white px-3.5 py-2.5 pr-10 text-[15px] focus:outline-none ${errors.session && !sessionYear
                                            ? "border-[#c5221f] focus:border-[#c5221f] focus:ring-1 focus:ring-[#c5221f]"
                                            : "border-gray-400/80 focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]"
                                        } ${sessionYear ? "text-gray-900" : "text-gray-600"}`}
                                >
                                    <option value="" disabled>Year</option>
                                    {YEAR_OPTIONS.map((y) => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                                <svg viewBox="0 0 20 20" fill="currentColor" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-700">
                                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                        {errors.session && <span className="mt-1 block text-sm text-[#c5221f]">{errors.session}</span>}
                        {sessionPeriod && sessionYear && (
                            <p className="mt-2 text-xs text-gray-500">
                                Stored as: <span className="font-medium text-gray-800">{sessionPeriod}/{sessionYear}</span>
                            </p>
                        )}
                    </div>

                    {/* Assigned Teachers */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-800">
                            Assigned Teachers
                            {teacherIds.length > 0 && (
                                <span className="ml-2 rounded-full bg-[#e8f0fe] px-2 py-0.5 text-xs font-medium text-[#174ea6]">
                                    {teacherIds.length} selected
                                </span>
                            )}
                        </label>
                        <div className="relative mb-2">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                value={teacherSearch}
                                onChange={(e) => setTeacherSearch(e.target.value)}
                                placeholder="Search teachers..."
                                className="w-full rounded-md border border-gray-400/80 py-2 pl-10 pr-4 text-sm focus:border-[#1a73e8] focus:outline-none focus:ring-1 focus:ring-[#1a73e8]"
                            />
                        </div>
                        <div className="max-h-40 overflow-y-auto rounded-md border border-gray-200">
                            {filteredTeachers.length === 0 ? (
                                <p className="px-4 py-3 text-sm text-gray-500">No teachers found.</p>
                            ) : (
                                filteredTeachers.map((t) => (
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
                                        <span className="text-sm text-gray-900">{t.name}</span>
                                        <span className="ml-auto text-xs text-gray-500">
                                            {t.teacherDetails?.designation ?? ""}
                                        </span>
                                    </label>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Enrolled Students */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-800">
                            Enrolled Students
                            {studentIds.length > 0 && (
                                <span className="ml-2 rounded-full bg-[#e6f4ea] px-2 py-0.5 text-xs font-medium text-[#137333]">
                                    {studentIds.length} selected
                                </span>
                            )}
                        </label>
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
                        <div className="max-h-40 overflow-y-auto rounded-md border border-gray-200">
                            {filteredStudents.length === 0 ? (
                                <p className="px-4 py-3 text-sm text-gray-500">No students found.</p>
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
                                        <span className="text-sm text-gray-900">{s.name}</span>
                                        <span className="ml-auto text-xs text-gray-500">
                                            {s.studentDetails?.studentId ?? ""}
                                        </span>
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