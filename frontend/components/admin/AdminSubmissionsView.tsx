// components/admin/AdminSubmissionsView.tsx
"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { adminSubmissions } from "@/lib/adminData";
import type { AdminSubmission } from "@/lib/adminData";
import { DataTable } from "./DataTable";
import { StatusBadge } from "./StatusBadge";

export function AdminSubmissionsView() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [courseFilter, setCourseFilter] = useState("all");

    const courseOptions = useMemo(
        () => Array.from(new Set(adminSubmissions.map((s) => s.courseName))),
        []
    );

    const filtered = useMemo(() => {
        return adminSubmissions.filter((s) => {
            const matchSearch =
                s.studentName.toLowerCase().includes(search.toLowerCase()) ||
                s.assignmentTitle.toLowerCase().includes(search.toLowerCase());
            const matchStatus = statusFilter === "all" || s.status === statusFilter;
            const matchCourse = courseFilter === "all" || s.courseName === courseFilter;
            return matchSearch && matchStatus && matchCourse;
        });
    }, [search, statusFilter, courseFilter]);

    return (
        <div className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-8">
            <div>
                <h1 className="text-3xl font-semibold text-gray-900">All Submissions</h1>
                <p className="mt-1 text-sm text-gray-600">
                    {adminSubmissions.length} submissions across all assignments
                </p>
            </div>

            {/* Filters */}
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by student or assignment..."
                        className="w-full rounded-md border border-gray-400/80 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-[#1a73e8] focus:outline-none focus:ring-1 focus:ring-[#1a73e8]"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="rounded-md border border-gray-400/80 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-[#1a73e8] focus:outline-none focus:ring-1 focus:ring-[#1a73e8]"
                >
                    <option value="all">All Status</option>
                    <option value="Submitted">Submitted</option>
                    <option value="Graded">Graded</option>
                    <option value="Pending">Pending</option>
                </select>
                <select
                    value={courseFilter}
                    onChange={(e) => setCourseFilter(e.target.value)}
                    className="rounded-md border border-gray-400/80 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-[#1a73e8] focus:outline-none focus:ring-1 focus:ring-[#1a73e8]"
                >
                    <option value="all">All Courses</option>
                    {courseOptions.map((c) => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
            </div>

            {/* Table */}
            <div className="mt-6">
                <DataTable
                    columns={[
                        { key: "studentName", header: "Student" },
                        { key: "assignmentTitle", header: "Assignment" },
                        { key: "courseName", header: "Course" },
                        {
                            key: "status",
                            header: "Status",
                            render: (s: AdminSubmission) => <StatusBadge status={s.status} />,
                        },
                        {
                            key: "marks",
                            header: "Marks",
                            className: "text-center",
                            render: (s: AdminSubmission) =>
                                s.marks !== null ? (
                                    <span className="font-medium text-gray-900">{s.marks}</span>
                                ) : (
                                    <span className="text-gray-400">—</span>
                                ),
                        },
                        {
                            key: "submittedAt",
                            header: "Submitted",
                            render: (s: AdminSubmission) =>
                                s.submittedAt ? s.submittedAt : <span className="italic text-gray-400">Not yet</span>,
                        },
                        {
                            key: "feedback",
                            header: "Feedback",
                            render: (s: AdminSubmission) =>
                                s.feedback ? (
                                    <span className="max-w-[200px] truncate text-sm text-gray-700">{s.feedback}</span>
                                ) : (
                                    <span className="text-gray-400">—</span>
                                ),
                        },
                    ]}
                    data={filtered}
                    keyExtractor={(s) => s.id}
                    emptyMessage="No submissions match your filters."
                />
            </div>
        </div>
    );
}