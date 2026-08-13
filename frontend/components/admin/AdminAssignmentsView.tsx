// components/admin/AdminAssignmentsView.tsx
"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { adminAssignments } from "@/lib/adminData";
import type { AdminAssignment } from "@/lib/adminData";
import { DataTable } from "./DataTable";
import { StatusBadge } from "./StatusBadge";

export function AdminAssignmentsView() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [courseFilter, setCourseFilter] = useState("all");

    const courseOptions = useMemo(
        () => Array.from(new Set(adminAssignments.map((a) => a.courseName))),
        []
    );

    const filtered = useMemo(() => {
        return adminAssignments.filter((a) => {
            const matchSearch =
                a.title.toLowerCase().includes(search.toLowerCase()) ||
                a.createdBy.toLowerCase().includes(search.toLowerCase());
            const matchStatus = statusFilter === "all" || a.status === statusFilter;
            const matchCourse = courseFilter === "all" || a.courseName === courseFilter;
            return matchSearch && matchStatus && matchCourse;
        });
    }, [search, statusFilter, courseFilter]);

    return (
        <div className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-8">
            <div>
                <h1 className="text-3xl font-semibold text-gray-900">All Assignments</h1>
                <p className="mt-1 text-sm text-gray-600">
                    {adminAssignments.length} assignments across all courses
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
                        placeholder="Search by title or creator..."
                        className="w-full rounded-md border border-gray-400/80 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-[#1a73e8] focus:outline-none focus:ring-1 focus:ring-[#1a73e8]"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="rounded-md border border-gray-400/80 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-[#1a73e8] focus:outline-none focus:ring-1 focus:ring-[#1a73e8]"
                >
                    <option value="all">All Status</option>
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                    <option value="Archived">Archived</option>
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
                        { key: "title", header: "Title" },
                        { key: "courseName", header: "Course" },
                        { key: "createdBy", header: "Created By" },
                        { key: "deadline", header: "Deadline" },
                        { key: "maxMarks", header: "Max Marks", className: "text-center" },
                        {
                            key: "status",
                            header: "Status",
                            render: (a: AdminAssignment) => <StatusBadge status={a.status} />,
                        },
                        { key: "submissionCount", header: "Submissions", className: "text-center" },
                    ]}
                    data={filtered}
                    keyExtractor={(a) => a.id}
                    emptyMessage="No assignments match your filters."
                />
            </div>
        </div>
    );
}