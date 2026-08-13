"use client";

import { useState, useMemo } from "react";
import { Plus, Search, Pencil, Trash2, ShieldCheck, ShieldX } from "lucide-react";
import type { AdminUser } from "@/lib/adminData";
import { adminUsers } from "@/lib/adminData";
import { DataTable } from "./DataTable";
import { StatusBadge } from "./StatusBadge";
import { UserFormModal } from "./UserFormModal";
import { ConfirmDialog } from "./ConfirmDialog";

export function AdminTeachersView() {
    const [users, setUsers] = useState<AdminUser[]>(
        adminUsers.filter((u) => u.role === "Teacher")
    );
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [modalOpen, setModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);

    const filtered = useMemo(() => {
        return users.filter((u) => {
            const matchSearch =
                u.name.toLowerCase().includes(search.toLowerCase()) ||
                u.email.toLowerCase().includes(search.toLowerCase());
            const matchStatus =
                statusFilter === "all" ||
                (statusFilter === "active" ? u.isActive : !u.isActive);
            return matchSearch && matchStatus;
        });
    }, [users, search, statusFilter]);

    const handleSave = (data: Omit<AdminUser, "id" | "createdAt">) => {
        if (editingUser) {
            setUsers((prev) =>
                prev.map((u) => (u.id === editingUser.id ? { ...u, ...data } : u))
            );
        } else {
            const newUser: AdminUser = {
                ...data,
                role: "Teacher",
                id: Math.max(...users.map((u) => u.id), 0) + 100,
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

    const toggleActive = (user: AdminUser) => {
        setUsers((prev) =>
            prev.map((u) => (u.id === user.id ? { ...u, isActive: !u.isActive } : u))
        );
    };

    return (
        <div className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-semibold text-gray-900">Manage Teachers</h1>
                    <p className="mt-1 text-sm text-gray-600">{users.length} teachers total</p>
                </div>
                <button
                    type="button"
                    onClick={() => { setEditingUser(null); setModalOpen(true); }}
                    className="flex cursor-pointer items-center gap-2 rounded-full bg-[#1a63d8] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#1554b5]"
                >
                    <Plus className="h-4 w-4" />
                    Add Teacher
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
                        placeholder="Search by name or email..."
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

            {/* Table */}
            <div className="mt-6">
                <DataTable
                    columns={[
                        { key: "name", header: "Name" },
                        { key: "email", header: "Email" },
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
                                        title={u.isActive ? "Deactivate" : "Activate"}
                                        onClick={() => toggleActive(u)}
                                        className="cursor-pointer rounded p-2 text-gray-600 hover:bg-gray-100"
                                    >
                                        {u.isActive ? <ShieldX className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4 text-[#188038]" />}
                                    </button>
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
                    ]}
                    data={filtered}
                    keyExtractor={(u) => u.id}
                    emptyMessage="No teachers match your filters."
                />
            </div>

            <UserFormModal
                open={modalOpen}
                user={editingUser}
                defaultRole="Teacher"
                onSave={handleSave}
                onClose={() => { setModalOpen(false); setEditingUser(null); }}
            />

            <ConfirmDialog
                open={!!deleteTarget}
                title="Delete Teacher"
                message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
                confirmLabel="Delete"
                variant="danger"
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
            />
        </div>
    );
}