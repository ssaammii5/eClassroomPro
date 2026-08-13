"use client";

import { useState, useMemo } from "react";
import { Plus, Search, Pencil, Trash2, GraduationCap, CalendarRange, Building2 } from "lucide-react";
import type { AcademicProgram, AcademicSemester, AcademicDepartment } from "@/lib/adminData";
import { academicPrograms, academicSemesters, academicDepartments } from "@/lib/adminData";
import { DataTable } from "./DataTable";
import { AcademicFormModal } from "./AcademicFormModal";
import { ConfirmDialog } from "./ConfirmDialog";

type AcademicTab = "programs" | "departments" | "semesters";

const TABS: { id: AcademicTab; label: string; icon: React.ReactNode }[] = [
    { id: "programs", label: "Programs", icon: <GraduationCap className="h-4 w-4" /> },
    { id: "departments", label: "Departments", icon: <Building2 className="h-4 w-4" /> },
    { id: "semesters", label: "Semesters", icon: <CalendarRange className="h-4 w-4" /> },
];

/**
 * Returns a numeric rank for a semester string like "January-June/2025".
 * Higher rank = more recent semester.
 * July-December gets +1 over January-June within the same year.
 */
function semesterRank(name: string): number {
    const [period, yearStr] = name.split("/");
    const year = Number(yearStr);
    if (!Number.isFinite(year)) return 0;
    const periodIndex = period === "July-December" ? 1 : 0;
    return year * 2 + periodIndex;
}

export function AdminAcademicsView() {
    const [activeTab, setActiveTab] = useState<AcademicTab>("programs");

    // Programs state
    const [programs, setPrograms] = useState<AcademicProgram[]>(academicPrograms);
    const [programSearch, setProgramSearch] = useState("");

    // Departments state
    const [departments, setDepartments] = useState<AcademicDepartment[]>(academicDepartments);
    const [departmentSearch, setDepartmentSearch] = useState("");

    // Semesters state
    const [semesters, setSemesters] = useState<AcademicSemester[]>(academicSemesters);
    const [semesterSearch, setSemesterSearch] = useState("");

    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState<"program" | "semester" | "department">("program");
    const [editingItem, setEditingItem] = useState<AcademicProgram | AcademicSemester | AcademicDepartment | null>(null);

    // Delete state
    const [deleteTarget, setDeleteTarget] = useState<{ type: string; id: number; name: string } | null>(null);

    // Filtered data
    const filteredPrograms = useMemo(() => {
        return programs.filter((p) =>
            p.name.toLowerCase().includes(programSearch.toLowerCase()) ||
            p.description.toLowerCase().includes(programSearch.toLowerCase())
        );
    }, [programs, programSearch]);

    const filteredDepartments = useMemo(() => {
        return departments.filter((d) =>
            d.name.toLowerCase().includes(departmentSearch.toLowerCase()) ||
            d.code.toLowerCase().includes(departmentSearch.toLowerCase())
        );
    }, [departments, departmentSearch]);

    const filteredSemesters = useMemo(() => {
        return semesters
            .filter((s) => s.name.toLowerCase().includes(semesterSearch.toLowerCase()))
            .sort((a, b) => semesterRank(b.name) - semesterRank(a.name));
    }, [semesters, semesterSearch]);

    // Handlers
    const openAddModal = (type: "program" | "semester" | "department") => {
        setModalType(type);
        setEditingItem(null);
        setModalOpen(true);
    };

    const openEditModal = (type: "program" | "semester" | "department", item: AcademicProgram | AcademicSemester | AcademicDepartment) => {
        setModalType(type);
        setEditingItem(item);
        setModalOpen(true);
    };

    const handleSave = (data: { name: string; description?: string; code?: string }) => {
        if (modalType === "program") {
            if (editingItem) {
                setPrograms((prev) =>
                    prev.map((p) =>
                        p.id === editingItem.id
                            ? { ...p, name: data.name, description: data.description ?? "" }
                            : p
                    )
                );
            } else {
                const newProgram: AcademicProgram = {
                    id: Math.max(0, ...programs.map((p) => p.id)) + 1,
                    name: data.name,
                    description: data.description ?? "",
                };
                setPrograms((prev) => [...prev, newProgram]);
            }
        } else if (modalType === "semester") {
            if (editingItem) {
                setSemesters((prev) =>
                    prev.map((s) =>
                        s.id === editingItem.id
                            ? { ...s, name: data.name }
                            : s
                    )
                );
            } else {
                const newSemester: AcademicSemester = {
                    id: Math.max(0, ...semesters.map((s) => s.id)) + 1,
                    name: data.name,
                };
                setSemesters((prev) => [...prev, newSemester]);
            }
        } else if (modalType === "department") {
            if (editingItem) {
                setDepartments((prev) =>
                    prev.map((d) =>
                        d.id === editingItem.id
                            ? { ...d, name: data.name, code: data.code ?? "" }
                            : d
                    )
                );
            } else {
                const newDept: AcademicDepartment = {
                    id: Math.max(0, ...departments.map((d) => d.id)) + 1,
                    name: data.name,
                    code: data.code ?? "",
                };
                setDepartments((prev) => [...prev, newDept]);
            }
        }
        setModalOpen(false);
        setEditingItem(null);
    };

    const handleDelete = () => {
        if (!deleteTarget) return;
        if (deleteTarget.type === "program") {
            setPrograms((prev) => prev.filter((p) => p.id !== deleteTarget.id));
        } else if (deleteTarget.type === "semester") {
            setSemesters((prev) => prev.filter((s) => s.id !== deleteTarget.id));
        } else if (deleteTarget.type === "department") {
            setDepartments((prev) => prev.filter((d) => d.id !== deleteTarget.id));
        }
        setDeleteTarget(null);
    };

    return (
        <div className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-8">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-semibold text-gray-900">Academics</h1>
                    <p className="mt-1 text-sm text-gray-600">
                        Manage programs, departments, and semesters for your institution
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="mt-6 border-b border-gray-200">
                <nav className="flex gap-8">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={`relative flex cursor-pointer items-center gap-2 py-3.5 text-sm font-medium transition-colors ${activeTab === tab.id ? "text-[#1a73e8]" : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            {tab.icon}
                            {tab.label}
                            {activeTab === tab.id && (
                                <span className="absolute inset-x-0 -bottom-px h-[3px] rounded-t-full bg-[#1a73e8]" />
                            )}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Programs Tab */}
            {activeTab === "programs" && (
                <div className="mt-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative max-w-sm flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                value={programSearch}
                                onChange={(e) => setProgramSearch(e.target.value)}
                                placeholder="Search programs..."
                                className="w-full rounded-md border border-gray-400/80 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-[#1a73e8] focus:outline-none focus:ring-1 focus:ring-[#1a73e8]"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => openAddModal("program")}
                            className="flex cursor-pointer items-center gap-2 self-start rounded-full bg-[#1a63d8] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#1554b5] sm:self-auto"
                        >
                            <Plus className="h-4 w-4" />
                            Add Program
                        </button>
                    </div>

                    <div className="mt-6">
                        <DataTable
                            columns={[
                                { key: "name", header: "Program Name" },
                                { key: "description", header: "Description" },
                                {
                                    key: "actions",
                                    header: "Actions",
                                    width: "150px",
                                    className: "text-right",
                                    render: (p: AcademicProgram) => (
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                type="button"
                                                title="Edit"
                                                onClick={() => openEditModal("program", p)}
                                                className="cursor-pointer rounded p-2 text-gray-600 hover:bg-gray-100"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button
                                                type="button"
                                                title="Delete"
                                                onClick={() => setDeleteTarget({ type: "program", id: p.id, name: p.name })}
                                                className="cursor-pointer rounded p-2 text-[#c5221f] hover:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ),
                                },
                            ]}
                            data={filteredPrograms}
                            keyExtractor={(p) => p.id}
                            emptyMessage="No programs found."
                        />
                    </div>
                </div>
            )}

            {/* Departments Tab */}
            {activeTab === "departments" && (
                <div className="mt-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative max-w-sm flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                value={departmentSearch}
                                onChange={(e) => setDepartmentSearch(e.target.value)}
                                placeholder="Search departments..."
                                className="w-full rounded-md border border-gray-400/80 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-[#1a73e8] focus:outline-none focus:ring-1 focus:ring-[#1a73e8]"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => openAddModal("department")}
                            className="flex cursor-pointer items-center gap-2 self-start rounded-full bg-[#1a63d8] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#1554b5] sm:self-auto"
                        >
                            <Plus className="h-4 w-4" />
                            Add Department
                        </button>
                    </div>

                    <div className="mt-6">
                        <DataTable
                            columns={[
                                { key: "code", header: "Code", width: "100px" },
                                { key: "name", header: "Department Name" },
                                {
                                    key: "actions",
                                    header: "Actions",
                                    width: "150px",
                                    className: "text-right",
                                    render: (d: AcademicDepartment) => (
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                type="button"
                                                title="Edit"
                                                onClick={() => openEditModal("department", d)}
                                                className="cursor-pointer rounded p-2 text-gray-600 hover:bg-gray-100"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button
                                                type="button"
                                                title="Delete"
                                                onClick={() => setDeleteTarget({ type: "department", id: d.id, name: d.name })}
                                                className="cursor-pointer rounded p-2 text-[#c5221f] hover:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ),
                                },
                            ]}
                            data={filteredDepartments}
                            keyExtractor={(d) => d.id}
                            emptyMessage="No departments found."
                        />
                    </div>
                </div>
            )}

            {/* Semesters Tab */}
            {activeTab === "semesters" && (
                <div className="mt-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative max-w-sm flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                value={semesterSearch}
                                onChange={(e) => setSemesterSearch(e.target.value)}
                                placeholder="Search semesters..."
                                className="w-full rounded-md border border-gray-400/80 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-[#1a73e8] focus:outline-none focus:ring-1 focus:ring-[#1a73e8]"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => openAddModal("semester")}
                            className="flex cursor-pointer items-center gap-2 self-start rounded-full bg-[#1a63d8] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#1554b5] sm:self-auto"
                        >
                            <Plus className="h-4 w-4" />
                            Add Semester
                        </button>
                    </div>

                    <div className="mt-6">
                        <DataTable
                            columns={[
                                { key: "name", header: "Semester" },
                                {
                                    key: "actions",
                                    header: "Actions",
                                    width: "150px",
                                    className: "text-right",
                                    render: (s: AcademicSemester) => (
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                type="button"
                                                title="Edit"
                                                onClick={() => openEditModal("semester", s)}
                                                className="cursor-pointer rounded p-2 text-gray-600 hover:bg-gray-100"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button
                                                type="button"
                                                title="Delete"
                                                onClick={() => setDeleteTarget({ type: "semester", id: s.id, name: s.name })}
                                                className="cursor-pointer rounded p-2 text-[#c5221f] hover:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ),
                                },
                            ]}
                            data={filteredSemesters}
                            keyExtractor={(s) => s.id}
                            emptyMessage="No semesters found."
                        />
                    </div>
                </div>
            )}

            {/* Form Modal */}
            <AcademicFormModal
                open={modalOpen}
                type={modalType}
                item={editingItem}
                onSave={handleSave}
                onClose={() => { setModalOpen(false); setEditingItem(null); }}
            />

            {/* Delete Confirmation */}
            <ConfirmDialog
                open={!!deleteTarget}
                title={`Delete ${deleteTarget?.type === "program" ? "Program" : deleteTarget?.type === "semester" ? "Semester" : "Department"}`}
                message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
                confirmLabel="Delete"
                variant="danger"
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
            />
        </div>
    );
}