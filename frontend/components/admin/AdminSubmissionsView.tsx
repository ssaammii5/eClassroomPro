"use client";
import { useState, useMemo } from "react";
import {
    GraduationCap,
    Building2,
    CalendarRange,
    BookOpen,
    Search,
    SlidersHorizontal,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { adminSubmissions, adminCourses } from "@/lib/adminData";
import type { AdminSubmission } from "@/lib/adminData";
import { PROGRAM_TYPES } from "@/components/settings/constants";
import { DataTable } from "./DataTable";
import { StatusBadge } from "./StatusBadge";
function sessionRank(key: string): number {
    const [period, yearStr] = key.split("/");
    const year = Number(yearStr);
    if (!Number.isFinite(year)) return 0;
    const periodIndex = period === "July-December" ? 1 : 0;
    return year * 2 + periodIndex;
}
const PROGRAM_ORDER: Record<string, number> = Object.fromEntries(
    PROGRAM_TYPES.map((p, i) => [p, i])
);
function resolveCourseInfo(courseId: number) {
    const course = adminCourses.find((c) => c.id === courseId);
    return {
        program: course?.program ?? "Unknown",
        department: course?.department ?? "Unknown",
        session: course?.session ?? "Unknown",
    };
}
interface CourseGroup {
    courseName: string;
    submissions: AdminSubmission[];
}
interface SessionGroup {
    session: string;
    courses: CourseGroup[];
    count: number;
}
interface DeptGroup {
    name: string;
    sessions: SessionGroup[];
    count: number;
}
interface ProgramGroup {
    name: string;
    departments: DeptGroup[];
    count: number;
}
export function AdminSubmissionsView() {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [programFilter, setProgramFilter] = useState("all");
    const [departmentFilter, setDepartmentFilter] = useState("all");
    const [sessionFilter, setSessionFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const departmentOptions = useMemo(() => {
        const base =
            programFilter === "all"
                ? adminSubmissions
                : adminSubmissions.filter(
                    (s) => resolveCourseInfo(s.courseId).program === programFilter
                );
        return Array.from(
            new Set(base.map((s) => resolveCourseInfo(s.courseId).department).filter(Boolean))
        ).sort();
    }, [programFilter]);
    const sessionOptions = useMemo(() => {
        const base =
            programFilter === "all"
                ? adminSubmissions
                : adminSubmissions.filter(
                    (s) => resolveCourseInfo(s.courseId).program === programFilter
                );
        return Array.from(
            new Set(base.map((s) => resolveCourseInfo(s.courseId).session).filter(Boolean))
        ).sort((a, b) => sessionRank(b) - sessionRank(a));
    }, [programFilter]);
    const filtered = useMemo(() => {
        return adminSubmissions.filter((s) => {
            const courseInfo = resolveCourseInfo(s.courseId);
            const matchSearch =
                s.studentName.toLowerCase().includes(search.toLowerCase()) ||
                s.assignmentTitle.toLowerCase().includes(search.toLowerCase()) ||
                s.courseName.toLowerCase().includes(search.toLowerCase());
            const matchProgram =
                programFilter === "all" || courseInfo.program === programFilter;
            const matchDept =
                departmentFilter === "all" || courseInfo.department === departmentFilter;
            const matchSession =
                sessionFilter === "all" || courseInfo.session === sessionFilter;
            const matchStatus = statusFilter === "all" || s.status === statusFilter;
            return matchSearch && matchProgram && matchDept && matchSession && matchStatus;
        });
    }, [search, programFilter, departmentFilter, sessionFilter, statusFilter]);
    const activeFilterCount = [
        programFilter,
        departmentFilter,
        sessionFilter,
        statusFilter,
    ].filter((f) => f !== "all").length;
    const clearFilters = () => {
        setProgramFilter("all");
        setDepartmentFilter("all");
        setSessionFilter("all");
        setStatusFilter("all");
    };
    const programGroups = useMemo<ProgramGroup[]>(() => {
        const map = new Map<
            string,
            Map<string, Map<string, Map<string, AdminSubmission[]>>>
        >();
        for (const s of filtered) {
            const info = resolveCourseInfo(s.courseId);
            if (!map.has(info.program)) map.set(info.program, new Map());
            const deptMap = map.get(info.program)!;
            if (!deptMap.has(info.department)) deptMap.set(info.department, new Map());
            const sessionMap = deptMap.get(info.department)!;
            if (!sessionMap.has(info.session)) sessionMap.set(info.session, new Map());
            const courseMap = sessionMap.get(info.session)!;
            if (!courseMap.has(s.courseName)) courseMap.set(s.courseName, []);
            courseMap.get(s.courseName)!.push(s);
        }
        const programs = Array.from(map.keys()).sort((a, b) => {
            const ia = PROGRAM_ORDER[a] ?? 99;
            const ib = PROGRAM_ORDER[b] ?? 99;
            return ia - ib || a.localeCompare(b);
        });
        return programs.map((program) => {
            const deptMap = map.get(program)!;
            const departments: DeptGroup[] = Array.from(deptMap.keys())
                .sort((a, b) => a.localeCompare(b))
                .map((deptName) => {
                    const sessionMap = deptMap.get(deptName)!;
                    const sessions: SessionGroup[] = Array.from(sessionMap.entries())
                        .sort((a, b) => sessionRank(b[0]) - sessionRank(a[0]))
                        .map(([session, courseMap]) => {
                            const courses: CourseGroup[] = Array.from(courseMap.entries())
                                .sort((a, b) => a[0].localeCompare(b[0]))
                                .map(([courseName, submissions]) => ({
                                    courseName,
                                    submissions: submissions.sort((a, b) =>
                                        a.studentName.localeCompare(b.studentName)
                                    ),
                                }));
                            return {
                                session,
                                courses,
                                count: courses.reduce((sum, c) => sum + c.submissions.length, 0),
                            };
                        });
                    return {
                        name: deptName,
                        sessions,
                        count: sessions.reduce((sum, sess) => sum + sess.count, 0),
                    };
                });
            return {
                name: program,
                departments,
                count: departments.reduce((sum, d) => sum + d.count, 0),
            };
        });
    }, [filtered]);
    const handleRowClick = (submissionId: number) => {
        router.push(`/submissions/${submissionId}`);
    };
    const columns = [
        {
            key: "studentName",
            header: "Student",
            truncate: true,
            render: (s: AdminSubmission) => (
                <span className="text-sm font-medium text-[#1a73e8]">{s.studentName}</span>
            ),
        },
        {
            key: "assignmentTitle",
            header: "Assignment",
            truncate: true,
        },
        {
            key: "status",
            header: "Status",
            width: "110px",
            render: (s: AdminSubmission) => <StatusBadge status={s.status} />,
        },
        {
            key: "marks",
            header: "Marks",
            className: "text-center",
            width: "90px",
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
            width: "120px",
            render: (s: AdminSubmission) =>
                s.submittedAt ? s.submittedAt : <span className="italic text-gray-400">Not yet</span>,
        },
        {
            key: "feedback",
            header: "Feedback",
            truncate: true,
            render: (s: AdminSubmission) =>
                s.feedback ? (
                    <span className="text-sm text-gray-700">{s.feedback}</span>
                ) : (
                    <span className="text-gray-400">—</span>
                ),
        },
    ];
    return (
        <div className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-8">
            { }
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">All Submissions</h1>
                    <p className="mt-1 text-sm text-gray-600">
                        {adminSubmissions.length} submissions total • {filtered.length} shown
                    </p>
                </div>
            </div>
            { }
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
                <div className="relative w-full sm:max-w-sm sm:flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by student, assignment, or course..."
                        className="w-full rounded-md border border-gray-400/80 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-[#1a73e8] focus:outline-none focus:ring-1 focus:ring-[#1a73e8]"
                    />
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setFiltersOpen((v) => !v)}
                        className={`flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors ${filtersOpen || activeFilterCount > 0
                            ? "border-[#1a63d8] bg-[#e8f0fe] text-[#174ea6]"
                            : "border-gray-400 text-gray-700 hover:bg-gray-50"
                            }`}
                    >
                        <SlidersHorizontal className="h-4 w-4" />
                        Filters
                        {activeFilterCount > 0 && (
                            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#1a63d8] px-1.5 text-xs font-semibold text-white">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>
                    {activeFilterCount > 0 && (
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="cursor-pointer text-sm font-medium text-[#1a73e8] hover:underline"
                        >
                            Clear all
                        </button>
                    )}
                </div>
            </div>
            { }
            {filtersOpen && (
                <div className="mt-4 grid gap-4 rounded-lg border border-gray-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
                    <label className="block">
                        <span className="mb-1.5 block text-xs font-medium text-gray-600">Program</span>
                        <select
                            value={programFilter}
                            onChange={(e) => {
                                setProgramFilter(e.target.value);
                                setDepartmentFilter("all");
                                setSessionFilter("all");
                            }}
                            className="w-full rounded-md border border-gray-400/80 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-[#1a73e8] focus:outline-none focus:ring-1 focus:ring-[#1a73e8]"
                        >
                            <option value="all">All Programs</option>
                            {PROGRAM_TYPES.map((p) => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>
                    </label>
                    <label className="block">
                        <span className="mb-1.5 block text-xs font-medium text-gray-600">Department</span>
                        <select
                            value={departmentFilter}
                            onChange={(e) => setDepartmentFilter(e.target.value)}
                            className="w-full rounded-md border border-gray-400/80 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-[#1a73e8] focus:outline-none focus:ring-1 focus:ring-[#1a73e8]"
                        >
                            <option value="all">All Departments</option>
                            {departmentOptions.map((d) => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                    </label>
                    <label className="block">
                        <span className="mb-1.5 block text-xs font-medium text-gray-600">Session</span>
                        <select
                            value={sessionFilter}
                            onChange={(e) => setSessionFilter(e.target.value)}
                            className="w-full rounded-md border border-gray-400/80 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-[#1a73e8] focus:outline-none focus:ring-1 focus:ring-[#1a73e8]"
                        >
                            <option value="all">All Sessions</option>
                            {sessionOptions.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </label>
                    <label className="block">
                        <span className="mb-1.5 block text-xs font-medium text-gray-600">Status</span>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full rounded-md border border-gray-400/80 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-[#1a73e8] focus:outline-none focus:ring-1 focus:ring-[#1a73e8]"
                        >
                            <option value="all">All Status</option>
                            <option value="Submitted">Submitted</option>
                            <option value="Graded">Graded</option>
                            <option value="Pending">Pending</option>
                        </select>
                    </label>
                </div>
            )}
            { }
            <div className="mt-8 space-y-12">
                {filtered.length === 0 && (
                    <div className="rounded-lg border border-gray-200 bg-white py-16 text-center">
                        <p className="text-sm text-gray-600">No submissions match your filters.</p>
                    </div>
                )}
                {programGroups.map((pg) => (
                    <section key={pg.name}>
                        { }
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-gray-300 pb-3">
                            <div className="flex min-w-0 items-center gap-3">
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#d7e3fd] text-[#174ea6] sm:h-10 sm:w-10">
                                    <GraduationCap className="h-5 w-5" />
                                </span>
                                <h2 className="truncate text-xl text-gray-900 sm:text-2xl">{pg.name}</h2>
                            </div>
                            <span className="shrink-0 text-sm font-medium text-gray-600">
                                {pg.count} submission{pg.count === 1 ? "" : "s"}
                            </span>
                        </div>
                        { }
                        {pg.departments.map((dept) => (
                            <div key={dept.name} className="mt-6">
                                <div className="flex flex-wrap items-center justify-between gap-2 px-1">
                                    <div className="flex min-w-0 items-center gap-2">
                                        <Building2 className="h-4 w-4 shrink-0 text-gray-500" />
                                        <h3 className="min-w-0 truncate text-lg text-gray-800 sm:text-xl">
                                            {dept.name}
                                        </h3>
                                    </div>
                                    <span className="shrink-0 text-xs font-medium text-gray-500">
                                        {dept.count} submission{dept.count === 1 ? "" : "s"}
                                    </span>
                                </div>
                                { }
                                <div className="mt-4 space-y-6">
                                    {dept.sessions.map((sess) => (
                                        <div key={sess.session}>
                                            <div className="mb-3 flex flex-wrap items-center gap-2 px-1">
                                                <CalendarRange className="h-4 w-4 text-[#174ea6]" />
                                                <span className="rounded-full bg-[#e8f0fe] px-3 py-1 text-xs font-medium text-[#174ea6]">
                                                    {sess.session}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {sess.count} submission{sess.count === 1 ? "" : "s"}
                                                </span>
                                            </div>
                                            { }
                                            <div className="space-y-5">
                                                {sess.courses.map((course) => (
                                                    <div key={course.courseName}>
                                                        <div className="mb-2 flex items-center gap-2 px-1">
                                                            <BookOpen className="h-4 w-4 text-gray-600" />
                                                            <span className="text-sm font-semibold text-gray-800">
                                                                {course.courseName}
                                                            </span>
                                                            <span className="text-xs text-gray-500">
                                                                ({course.submissions.length} submission
                                                                {course.submissions.length === 1 ? "" : "s"})
                                                            </span>
                                                        </div>
                                                        <DataTable
                                                            columns={columns}
                                                            data={course.submissions}
                                                            keyExtractor={(s) => s.id}
                                                            emptyMessage="No submissions in this course."
                                                            onRowClick={(s) => handleRowClick(s.id)}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </section>
                ))}
            </div>
        </div>
    );
}