// components/admin/CourseFormModal.tsx
"use client";

import { useState, useEffect } from "react";
import type { AdminCourse } from "@/lib/adminData";
import { adminUsers } from "@/lib/adminData";
import { X } from "lucide-react";

interface CourseFormModalProps {
    open: boolean;
    course: AdminCourse | null;
    onSave: (data: Omit<AdminCourse, "id" | "studentCount">) => void;
    onClose: () => void;
}

export function CourseFormModal({ open, course, onSave, onClose }: CourseFormModalProps) {
    const [name, setName] = useState("");
    const [subject, setSubject] = useState("");
    const [teacherId, setTeacherId] = useState<number | null>(null);
    const [session, setSession] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const teachers = adminUsers.filter((u) => u.role === "Teacher" && u.isActive);

    useEffect(() => {
        if (open) {
            setName(course?.name ?? "");
            setSubject(course?.subject ?? "");
            setTeacherId(course?.teacherId ?? null);
            setSession(course?.session ?? "");
            setIsActive(course?.isActive ?? true);
            setErrors({});
        }
    }, [open, course]);

    const validate = () => {
        const next: Record<string, string> = {};
        if (!name.trim()) next.name = "Course name is required.";
        if (!subject.trim()) next.subject = "Subject is required.";
        if (!session.trim()) next.session = "Session is required.";
        return next;
    };

    const handleSubmit = () => {
        const errs = validate();
        setErrors(errs);
        if (Object.keys(errs).length > 0) return;
        const teacher = teachers.find((t) => t.id === teacherId);
        onSave({
            name: name.trim(),
            subject: subject.trim(),
            teacherId,
            teacherName: teacher?.name ?? null,
            session: session.trim(),
            isActive,
        });
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {course ? "Edit Course" : "Add New Course"}
                    </h2>
                    <button type="button" onClick={onClose} className="cursor-pointer rounded-full p-2 text-gray-600 hover:bg-gray-100">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="mt-6 space-y-5">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-800">Course Name *</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: "" })); }}
                            className={`w-full rounded-md border px-3.5 py-2.5 text-[15px] focus:outline-none ${errors.name ? "border-[#c5221f] focus:ring-1 focus:ring-[#c5221f]" : "border-gray-400/80 focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]"}`}
                            placeholder="e.g., CIT-6102: Advanced Algorithms"
                        />
                        {errors.name && <span className="mt-1 block text-sm text-[#c5221f]">{errors.name}</span>}
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-800">Subject *</label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => { setSubject(e.target.value); setErrors((p) => ({ ...p, subject: "" })); }}
                            className={`w-full rounded-md border px-3.5 py-2.5 text-[15px] focus:outline-none ${errors.subject ? "border-[#c5221f] focus:ring-1 focus:ring-[#c5221f]" : "border-gray-400/80 focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]"}`}
                            placeholder="e.g., MS in CSIT"
                        />
                        {errors.subject && <span className="mt-1 block text-sm text-[#c5221f]">{errors.subject}</span>}
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-800">Assigned Teacher</label>
                        <select
                            value={teacherId?.toString() ?? ""}
                            onChange={(e) => setTeacherId(e.target.value ? Number(e.target.value) : null)}
                            className="w-full appearance-none rounded-md border border-gray-400/80 bg-white px-3.5 py-2.5 text-[15px] text-gray-900 focus:border-[#1a73e8] focus:outline-none focus:ring-1 focus:ring-[#1a73e8]"
                        >
                            <option value="">No teacher assigned</option>
                            {teachers.map((t) => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-800">Session *</label>
                        <input
                            type="text"
                            value={session}
                            onChange={(e) => { setSession(e.target.value); setErrors((p) => ({ ...p, session: "" })); }}
                            className={`w-full rounded-md border px-3.5 py-2.5 text-[15px] focus:outline-none ${errors.session ? "border-[#c5221f] focus:ring-1 focus:ring-[#c5221f]" : "border-gray-400/80 focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]"}`}
                            placeholder="e.g., January-June 2025"
                        />
                        {errors.session && <span className="mt-1 block text-sm text-[#c5221f]">{errors.session}</span>}
                    </div>

                    <div className="flex items-center justify-between rounded-md border border-gray-200 px-4 py-3">
                        <span className="text-sm text-gray-800">Active Course</span>
                        <button
                            type="button"
                            role="switch"
                            aria-checked={isActive}
                            onClick={() => setIsActive((v) => !v)}
                            className={`relative h-7 w-12 shrink-0 cursor-pointer rounded-full transition-colors ${isActive ? "bg-[#1a73e8]" : "bg-gray-300"}`}
                        >
                            <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${isActive ? "left-6" : "left-1"}`} />
                        </button>
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-3">
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