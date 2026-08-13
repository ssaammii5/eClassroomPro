"use client";

import { useState, useMemo } from "react";
import { Plus, Search, Pencil, Trash2, GraduationCap } from "lucide-react";
import type { AdminUser } from "@/lib/adminData";
import { adminUsers } from "@/lib/adminData";
import { DataTable } from "./DataTable";
import { StatusBadge } from "./StatusBadge";
import { StudentFormModal } from "./StudentFormModal";
import { ConfirmDialog } from "./ConfirmDialog";

interface StudentGroup {
    key: string;
    label: string;
    level: number | null;
    semester: number | null;
    students: AdminUser[];
}

export function AdminStudentsView() {
    const [users, setUsers] = useState<AdminUser[]>(
        adminUsers.filter((u) => u.role === "Student")
    );
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [modalOpen, setModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);

    /* ---------- filtering ---------- */
    const filtered = useMemo(() => {
        return users.filter((u) => {
            const matchSearch =
                u.name.toLowerCase().includes(search.toLowerCase()) ||
                u.email.toLowerCase().includes(search.toLowerCase()) ||
                (u.studentDetails?.studentId ?? "").toLowerCase().includes(search.toLowerCase());
            const matchStatus =
                statusFilter === "all" ||
                (statusFilter === "active" ? u.isActive : !u.isActive);
            return matchSearch && matchStatus;
        });
    }, [users, search, statusFilter]);

    /* ---------- group by Level + Semester ---------- */
    const groups = useMemo<StudentGroup[]>(() => {
        const map = new Map<string, StudentGroup>();

        for (const u of filtered) {
            const level = u.studentDetails?.level ?? null;
            const semester = u.studentDetails?.semester ?? null;
            const hasGroup = level !== null && semester !== null;
            const key = hasGroup ? `level-${level}-semester-${semester}` : "uncategorized";

            if (!map.has(key)) {
                map.set(key, {
                    key,
                    label: hasGroup
                        ? `Level ${level} — Semester ${semester}`
                        : "Uncategorized (no level / semester)",
                    level,
                    semester,
                    students: [],
                });
            }
            map.get(key)!.students.push(u);
        }

        const list = Array.from(map.values());

        // alphabetical inside each group
        for (const g of list) {
            g.students.sort((a, b) => a.name.localeCompare(b.name));
        }

        // Level asc → Semester asc, Uncategorized last
        list.sort((a, b) => {
            if (a.level === null) return 1;
            if (b.level === null) return -1;
            if (a.level !== b.level) return a.level - b.level;
            return (a.semester ?? 0) - (b.semester ?? 0);
        });

        return list;
    }, [filtered]);

    /* ---------- actions ---------- */
    const handleSave = (data: Omit<AdminUser, "id" | "createdAt">) => {
        if (editingUser) {
            setUsers((prev) =>
                prev.map((u) => (u.id === editingUser.id ? { ...u, ...data } : u))
            );
        } else {
            const newUser: AdminUser = {
                ...data,
                role: "Student",
                id: Math.max(0, ...users.map((u) => u.id)) + 1,
                createdAt: new Date().toISOString().split("T")[0],
            };
            setUsers((prev) => [...prev, newUser]);
        }
        setModalOpen(false);
        setEditingUser(null);
    };

    const handleDelete = () => {
        if (deleteTarget) {
            setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
            setDeleteTarget(null);
        }
    };

    /* ---------- table columns (shared by every group) ---------- */
    const columns = [
        { key: "name", header: "Name" },
        { key: "email", header: "Email" },
        {
            key: "studentId",
            header: "Student ID",
            render: (u: AdminUser) =>
                u.studentDetails?.studentId ? (
                    <span className="text-sm text-gray-900">{u.studentDetails.studentId}</span>
                ) : (
                    <span className="text-gray-400">—</span>
                ),
        },
        {
            key: "program",
            header: "Program",
            render: (u: AdminUser) =>
                u.studentDetails?.currentProgram ? (
                    <span className="text-sm text-gray-800">{u.studentDetails.currentProgram}</span>
                ) : (
                    <span className="text-gray-400">—</span>
                ),
        },
        {
            key: "isActive",
            header: "Status",
            render: (u: AdminUser) => <StatusBadge status={u.isActive ? "Active" : "Inactive"} />,
        },
        { key: "createdAt", header: "Created" },
        {
            key: "actions",
            header: "Actions",
            className: "text-right",
            render: (u: AdminUser) => (
                <div className="flex items-center justify-end gap-1">
                    <button
                        type="button"
                        title="Edit"
                        onClick={() => { setEditingUser(u); setModalOpen(true); }}
                        className="cursor-pointer rounded p-2 text-gray-600 hover:bg-gray-100"
                    >
                        <Pencil className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        title="Delete"
                        onClick={() => setDeleteTarget(u)}
                        className="cursor-pointer rounded p-2 text-[#c5221f] hover:bg-red-50"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-8">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-semibold text-gray-900">Manage Students</h1>
                    <p className="mt-1 text-sm text-gray-600">
                        {users.length} students total • grouped by level &amp; semester
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => { setEditingUser(null); setModalOpen(true); }}
                    className="flex cursor-pointer items-center gap-2 rounded-full bg-[#1a63d8] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#1554b5]"
                >
                    <Plus className="h-4 w-4" />
                    Add Student
                </button>
            </div>

            {/* Filters */}
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name, email, or student ID..."
                        className="w-full rounded-md border border-gray-400/80 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-[#1a73e8] focus:outline-none focus:ring-1 focus:ring-[#1a73e8]"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="rounded-md border border-gray-400/80 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-[#1a73e8] focus:outline-none focus:ring-1 focus:ring-[#1a73e8]"
                >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>

            {/* Grouped tables */}
            <div className="mt-8 space-y-10">
                {groups.length === 0 && (
                    <div className="rounded-lg border border-gray-200 bg-white py-16 text-center">
                        <p className="text-sm text-gray-600">No students match your filters.</p>
                    </div>
                )}

                {groups.map((group) => (
                    <section key={group.key}>
                        {/* Group header */}
                        <div className="flex items-center justify-between px-1">
                            <div className="flex items-center gap-3">
                                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d7e3fd] text-[#174ea6]">
                                    <GraduationCap className="h-5 w-5" />
                                </span>
                                <h2 className="text-xl text-gray-900">{group.label}</h2>
                            </div>
                            <span className="text-sm font-medium text-gray-600">
                                {group.students.length} student{group.students.length === 1 ? "" : "s"}
                            </span>
                        </div>

                        {/* Group table */}
                        <div className="mt-3">
                            <DataTable
                                columns={columns}
                                data={group.students}
                                keyExtractor={(u) => u.id}
                                emptyMessage="No students in this group."
                            />
                        </div>
                    </section>
                ))}
            </div>

            {/* Modals */}
            <StudentFormModal
                open={modalOpen}
                user={editingUser}
                onSave={handleSave}
                onClose={() => { setModalOpen(false); setEditingUser(null); }}
            />

            <ConfirmDialog
                open={!!deleteTarget}
                title="Delete Student"
                message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
                confirmLabel="Delete"
                variant="danger"
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
            />
        </div>
    );
}