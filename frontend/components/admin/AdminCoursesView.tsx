"use client";

import { useState, useMemo } from "react";
import { Plus, Search, Pencil, Trash2, UserPlus } from "lucide-react";
import type { AdminCourse } from "@/lib/adminData";
import { adminCourses, adminUsers, TEACHER_DEPARTMENTS } from "@/lib/adminData";
import { DataTable } from "./DataTable";
import { StatusBadge } from "./StatusBadge";
import { CourseFormModal } from "./CourseFormModal";
import { ConfirmDialog } from "./ConfirmDialog";

function resolveTeacherNames(ids: number[]): string {
    if (ids.length === 0) return "";
    return ids
        .map((id) => adminUsers.find((u) => u.id === id)?.name ?? "Unknown")
        .join(", ");
}

export function AdminCoursesView() {
    const [courses, setCourses] = useState<AdminCourse[]>(adminCourses);
    const [search, setSearch] = useState("");
    const [departmentFilter, setDepartmentFilter] = useState("all");
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<AdminCourse | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<AdminCourse | null>(null);

    const departmentOptions = useMemo(() => {
        const fromData = courses.map((c) => c.department).filter(Boolean);
        return Array.from(new Set([...TEACHER_DEPARTMENTS, ...fromData])).sort();
    }, [courses]);

    const filtered = useMemo(() => {
        return courses.filter((c) => {
            const teacherNames = resolveTeacherNames(c.teacherIds);
            const matchSearch =
                c.name.toLowerCase().includes(search.toLowerCase()) ||
                c.subject.toLowerCase().includes(search.toLowerCase()) ||
                teacherNames.toLowerCase().includes(search.toLowerCase());
            const matchDept = departmentFilter === "all" || c.department === departmentFilter;
            return matchSearch && matchDept;
        });
    }, [courses, search, departmentFilter]);

    const handleSave = (data: Omit<AdminCourse, "id">) => {
        if (editingCourse) {
            setCourses((prev) =>
                prev.map((c) => (c.id === editingCourse.id ? { ...c, ...data } : c))
            );
        } else {
            const newCourse: AdminCourse = {
                ...data,
                id: Math.max(0, ...courses.map((c) => c.id)) + 1,
            };
            setCourses((prev) => [...prev, newCourse]);
        }
        setModalOpen(false);
        setEditingCourse(null);
    };

    const handleDelete = () => {
        if (deleteTarget) {
            setCourses((prev) => prev.filter((c) => c.id !== deleteTarget.id));
            setDeleteTarget(null);
        }
    };

    return (
        <div className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-8">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-semibold text-gray-900">Manage Courses</h1>
                    <p className="mt-1 text-sm text-gray-600">
                        {courses.length} courses total • {filtered.length} shown
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => { setEditingCourse(null); setModalOpen(true); }}
                    className="flex cursor-pointer items-center gap-2 rounded-full bg-[#1a63d8] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#1554b5]"
                >
                    <Plus className="h-4 w-4" />
                    Add Course
                </button>
            </div>

            {/* Filters */}
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative max-w-sm flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search courses, subjects, or teachers..."
                        className="w-full rounded-md border border-gray-400/80 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-[#1a73e8] focus:outline-none focus:ring-1 focus:ring-[#1a73e8]"
                    />
                </div>
                <select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="rounded-md border border-gray-400/80 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-[#1a73e8] focus:outline-none focus:ring-1 focus:ring-[#1a73e8]"
                >
                    <option value="all">All Departments</option>
                    {departmentOptions.map((d) => (
                        <option key={d} value={d}>{d}</option>
                    ))}
                </select>
            </div>

            {/* Table */}
            <div className="mt-6">
                <DataTable
                    columns={[
                        { key: "name", header: "Course Name" },
                        { key: "department", header: "Department" },
                        { key: "subject", header: "Subject" },
                        {
                            key: "teachers",
                            header: "Teachers",
                            render: (c: AdminCourse) => {
                                const names = resolveTeacherNames(c.teacherIds);
                                return names ? (
                                    <span className="text-sm text-gray-900" title={names}>{names}</span>
                                ) : (
                                    <span className="text-sm italic text-gray-500">Not assigned</span>
                                );
                            },
                        },
                        {
                            key: "students",
                            header: "Students",
                            className: "text-center",
                            render: (c: AdminCourse) => (
                                <span className="text-sm text-gray-900">{c.studentIds.length}</span>
                            ),
                        },
                        { key: "session", header: "Session" },
                        {
                            key: "isActive",
                            header: "Status",
                            render: (c: AdminCourse) => <StatusBadge status={c.isActive ? "Active" : "Inactive"} />,
                        },
                        {
                            key: "actions",
                            header: "Actions",
                            className: "text-right",
                            render: (c: AdminCourse) => (
                                <div className="flex items-center justify-end gap-1">
                                    <button
                                        type="button"
                                        title="Assign Teacher / Students"
                                        onClick={() => { setEditingCourse(c); setModalOpen(true); }}
                                        className="cursor-pointer rounded p-2 text-gray-600 hover:bg-gray-100"
                                    >
                                        <UserPlus className="h-4 w-4" />
                                    </button>
                                    <button
                                        type="button"
                                        title="Edit"
                                        onClick={() => { setEditingCourse(c); setModalOpen(true); }}
                                        className="cursor-pointer rounded p-2 text-gray-600 hover:bg-gray-100"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </button>
                                    <button
                                        type="button"
                                        title="Delete"
                                        onClick={() => setDeleteTarget(c)}
                                        className="cursor-pointer rounded p-2 text-[#c5221f] hover:bg-red-50"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ),
                        },
                    ]}
                    data={filtered}
                    keyExtractor={(c) => c.id}
                    emptyMessage="No courses match your filters."
                />
            </div>

            {/* Modals */}
            <CourseFormModal
                open={modalOpen}
                course={editingCourse}
                onSave={handleSave}
                onClose={() => { setModalOpen(false); setEditingCourse(null); }}
            />
            <ConfirmDialog
                open={!!deleteTarget}
                title="Delete Course"
                message={`Are you sure you want to delete "${deleteTarget?.name}"? All associated assignments will be affected.`}
                confirmLabel="Delete"
                variant="danger"
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
            />
        </div>
    );
}