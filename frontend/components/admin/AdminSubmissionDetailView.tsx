"use client";
import { useState } from "react";
import type { ReactNode } from "react";
import {
    ArrowLeft,
    BookOpen,
    Building2,
    CalendarRange,
    ClipboardList,
    Clock,
    Download,
    FileText,
    GraduationCap,
    Link2,
    Mail,
    Paperclip,
    Save,
    UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { initialOf } from "@/lib/schemas";
import type { AdminSubmission } from "@/lib/adminData";
import { adminCourses, adminUsers } from "@/lib/adminData";
import type { SubmissionAttachment } from "@/lib/submissionDetails";
import { getAssignmentForSubmission, getSubmissionDetail } from "@/lib/submissionDetails";
import { StatusBadge } from "./StatusBadge";
interface AdminSubmissionDetailViewProps {
    submission: AdminSubmission;
}
function attachmentEmoji(att: SubmissionAttachment): string {
    if (att.kind === "link") return "🔗";
    const ext = att.fileName.split(".").pop()?.toLowerCase() ?? "";
    if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)) return "🖼️";
    if (ext === "zip" || ext === "rar" || ext === "7z") return "🗜️";
    if (ext === "pdf") return "📕";
    if (["py", "js", "ts", "jsx", "tsx", "java", "c", "cpp", "cs", "ipynb"].includes(ext)) return "💻";
    if (["doc", "docx"].includes(ext)) return "📝";
    if (["ppt", "pptx"].includes(ext)) return "📊";
    if (["xls", "xlsx", "csv"].includes(ext)) return "📈";
    if (ext === "md") return "📄";
    if (ext === "bib") return "📚";
    return "📄";
}
export function AdminSubmissionDetailView({ submission }: AdminSubmissionDetailViewProps) {
    const router = useRouter();
    const detail = getSubmissionDetail(submission.id);
    const assignment = getAssignmentForSubmission(submission);
    const course = adminCourses.find((c) => c.id === submission.courseId);
    const student = adminUsers.find((u) => u.id === submission.studentId);
    const maxMarks = assignment?.maxMarks ?? 100;
    const notSubmitted = !submission.submittedAt;
    const studentEmail = student?.email ?? "—";
    const studentAcademicId = student?.studentDetails?.studentId ?? "—";
    const studentDepartment = student?.studentDetails?.department ?? "—";
    const studentProgram = student?.studentDetails?.currentProgram ?? "—";
    const attachments = detail?.attachments ?? [];
    const activity = detail?.activity ?? [];
    const answer = detail?.answer ?? "";
    const [marks, setMarks] = useState<string>(
        submission.marks !== null ? String(submission.marks) : ""
    );
    const [feedback, setFeedback] = useState<string>(submission.feedback ?? "");
    const [status, setStatus] = useState(submission.status);
    const [savedMarks, setSavedMarks] = useState<number | null>(submission.marks);
    const [flash, setFlash] = useState(false);
    const [gradeError, setGradeError] = useState<string | null>(null);
    const handleSaveGrade = () => {
        if (notSubmitted) return;
        const trimmed = marks.trim();
        const parsed = trimmed === "" ? null : Number(trimmed);
        if (parsed !== null && (Number.isNaN(parsed) || parsed < 0 || parsed > maxMarks)) {
            setGradeError(`Enter marks between 0 and ${maxMarks}.`);
            return;
        }
        setGradeError(null);
        setSavedMarks(parsed);
        if (parsed !== null) {
            setStatus("Graded");
        }
        setFlash(true);
        window.setTimeout(() => setFlash(false), 2200);
    };
    return (
        <div className="min-h-[calc(100vh-4rem)] bg-white">
            <div className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-8">
                { }
                <button
                    type="button"
                    onClick={() => router.push("/submissions")}
                    className="flex cursor-pointer items-center gap-2 text-sm font-medium text-[#1a73e8] hover:underline"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to All Submissions
                </button>
                { }
                <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-4">
                        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#7b1fa2] text-xl font-medium text-white">
                            {initialOf(submission.studentName)}
                        </span>
                        <div className="min-w-0">
                            <h1 className="truncate text-2xl font-semibold text-gray-900 sm:text-3xl">
                                {submission.assignmentTitle}
                            </h1>
                            <p className="mt-1 text-sm text-gray-600">
                                Submitted by <span className="font-medium text-gray-900">{submission.studentName}</span>
                                <span className="mx-2">•</span>
                                {submission.courseName}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {detail?.isLate && !notSubmitted && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#fce8e6] px-3 py-1 text-xs font-medium text-[#c5221f]">
                                <Clock className="h-3.5 w-3.5" />
                                Late
                            </span>
                        )}
                        <StatusBadge status={status} />
                    </div>
                </div>
                { }
                <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
                    { }
                    <div className="min-w-0 space-y-6">
                        { }
                        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                            <div className="flex items-center gap-2 border-b border-gray-200 bg-[#f8f9fa] px-6 py-4">
                                <FileText className="h-5 w-5 text-gray-600" />
                                <h2 className="text-lg font-medium text-gray-900">Student Answer</h2>
                            </div>
                            <div className="px-6 py-5">
                                {notSubmitted ? (
                                    <p className="text-sm italic text-gray-500">
                                        This student has not submitted any work yet.
                                    </p>
                                ) : answer ? (
                                    <p className="whitespace-pre-line text-sm leading-6 text-gray-800">{answer}</p>
                                ) : (
                                    <p className="text-sm italic text-gray-500">No written answer provided.</p>
                                )}
                            </div>
                        </section>
                        { }
                        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                            <div className="flex items-center justify-between border-b border-gray-200 bg-[#f8f9fa] px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <Paperclip className="h-5 w-5 text-gray-600" />
                                    <h2 className="text-lg font-medium text-gray-900">Submitted Files</h2>
                                </div>
                                <span className="text-sm text-gray-600">
                                    {attachments.length} file{attachments.length === 1 ? "" : "s"}
                                </span>
                            </div>
                            {attachments.length === 0 ? (
                                <p className="px-6 py-8 text-center text-sm text-gray-500">
                                    {notSubmitted ? "Nothing has been uploaded." : "No files were attached."}
                                </p>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {attachments.map((att) => (
                                        <AttachmentRow key={att.id} attachment={att} />
                                    ))}
                                </div>
                            )}
                        </section>
                        { }
                        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                            <div className="flex items-center gap-2 border-b border-gray-200 bg-[#f8f9fa] px-6 py-4">
                                <Clock className="h-5 w-5 text-gray-600" />
                                <h2 className="text-lg font-medium text-gray-900">Activity</h2>
                            </div>
                            {activity.length === 0 ? (
                                <p className="px-6 py-8 text-center text-sm text-gray-500">No activity recorded.</p>
                            ) : (
                                <ul className="px-6 py-5">
                                    {activity.map((event, index) => (
                                        <li key={event.id} className="relative flex gap-4 pb-6 last:pb-0">
                                            {index < activity.length - 1 && (
                                                <span className="absolute left-[6px] top-5 h-full w-px bg-gray-200" />
                                            )}
                                            <span className="mt-1 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-[#1a73e8] bg-white" />
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-gray-900">{event.action}</p>
                                                <p className="mt-0.5 text-xs text-gray-500">
                                                    {event.actor} <span className="mx-1">•</span> {event.timestamp}
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>
                    </div>
                    { }
                    <div className="space-y-6">
                        { }
                        <section className="rounded-xl border border-gray-200 bg-white p-6">
                            <h2 className="text-lg font-medium text-gray-900">Grading</h2>
                            {notSubmitted ? (
                                <p className="mt-3 text-sm text-gray-600">
                                    Waiting for the student to submit before grading.
                                </p>
                            ) : (
                                <>
                                    <div className="mt-4">
                                        <label className="mb-1.5 block text-sm font-medium text-gray-800">
                                            Marks (out of {maxMarks})
                                        </label>
                                        <input
                                            type="number"
                                            min={0}
                                            max={maxMarks}
                                            value={marks}
                                            onChange={(e) => { setMarks(e.target.value); setGradeError(null); }}
                                            placeholder="Enter marks"
                                            className={`w-full rounded-md border px-3.5 py-2.5 text-[15px] focus:outline-none ${gradeError
                                                ? "border-[#c5221f] focus:ring-1 focus:ring-[#c5221f]"
                                                : "border-gray-400/80 focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]"
                                                }`}
                                        />
                                        {gradeError && <span className="mt-1 block text-sm text-[#c5221f]">{gradeError}</span>}
                                    </div>
                                    <div className="mt-4">
                                        <label className="mb-1.5 block text-sm font-medium text-gray-800">Feedback</label>
                                        <textarea
                                            value={feedback}
                                            onChange={(e) => setFeedback(e.target.value)}
                                            placeholder="Write feedback for the student..."
                                            rows={4}
                                            className="w-full rounded-md border border-gray-400/80 px-3.5 py-2.5 text-[15px] focus:border-[#1a73e8] focus:outline-none focus:ring-1 focus:ring-[#1a73e8]"
                                        />
                                    </div>
                                    <div className="mt-5 flex items-center justify-between gap-3">
                                        {flash && <span className="text-sm font-medium text-[#188038]">Saved</span>}
                                        <button
                                            type="button"
                                            onClick={handleSaveGrade}
                                            className="flex cursor-pointer items-center gap-2 rounded-full bg-[#1a63d8] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#1554b5]"
                                        >
                                            <Save className="h-4 w-4" />
                                            Save Grade
                                        </button>
                                    </div>
                                    {savedMarks !== null && (
                                        <div className="mt-4 flex items-center gap-2 rounded-lg bg-[#e6f4ea] px-4 py-3">
                                            <GraduationCap className="h-4 w-4 text-[#137333]" />
                                            <span className="text-sm font-medium text-[#137333]">
                                                Current grade: {savedMarks} / {maxMarks}
                                            </span>
                                        </div>
                                    )}
                                </>
                            )}
                        </section>
                        { }
                        <section className="rounded-xl border border-gray-200 bg-white p-6">
                            <h2 className="text-lg font-medium text-gray-900">Submission Info</h2>
                            <dl className="mt-4 space-y-3 text-sm">
                                <InfoRow icon={<ClipboardList className="h-4 w-4" />} label="Assignment" value={submission.assignmentTitle} />
                                <InfoRow icon={<BookOpen className="h-4 w-4" />} label="Course" value={submission.courseName} />
                                <InfoRow icon={<CalendarRange className="h-4 w-4" />} label="Session" value={course?.session ?? "—"} />
                                <InfoRow
                                    icon={<Clock className="h-4 w-4" />}
                                    label="Submitted"
                                    value={notSubmitted
                                        ? "Not submitted"
                                        : `${submission.submittedAt}${detail?.submittedAtTime ? ` at ${detail.submittedAtTime}` : ""}`}
                                />
                                {detail?.gradedBy && (
                                    <InfoRow
                                        icon={<GraduationCap className="h-4 w-4" />}
                                        label="Graded By"
                                        value={`${detail.gradedBy}${detail.gradedAt ? ` (${detail.gradedAt})` : ""}`}
                                    />
                                )}
                            </dl>
                        </section>
                        { }
                        <section className="rounded-xl border border-gray-200 bg-white p-6">
                            <h2 className="text-lg font-medium text-gray-900">Student Info</h2>
                            <dl className="mt-4 space-y-3 text-sm">
                                <InfoRow icon={<UserRound className="h-4 w-4" />} label="Name" value={submission.studentName} />
                                <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={studentEmail} />
                                <InfoRow icon={<ClipboardList className="h-4 w-4" />} label="Student ID" value={studentAcademicId} />
                                <InfoRow icon={<Building2 className="h-4 w-4" />} label="Department" value={studentDepartment} />
                                <InfoRow icon={<GraduationCap className="h-4 w-4" />} label="Program" value={studentProgram} />
                            </dl>
                            {student?.email && (
                                <a
                                    href={`mailto:${student.email}`}
                                    className="mt-5 flex cursor-pointer items-center justify-center gap-2 rounded-full border border-gray-400 px-5 py-2.5 text-sm font-medium text-[#1a73e8] hover:bg-blue-50"
                                >
                                    <Mail className="h-4 w-4" />
                                    Contact Student
                                </a>
                            )}
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
function InfoRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
    return (
        <div className="flex items-start gap-3">
            <span className="mt-0.5 text-gray-500">{icon}</span>
            <div className="min-w-0">
                <dt className="text-xs text-gray-500">{label}</dt>
                <dd className="break-words font-medium text-gray-900">{value}</dd>
            </div>
        </div>
    );
}
function AttachmentRow({ attachment }: { attachment: SubmissionAttachment }) {
    return (
        <div className="flex items-center gap-4 px-6 py-4">
            <span className="text-3xl">{attachmentEmoji(attachment)}</span>
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">{attachment.fileName}</p>
                <p className="mt-0.5 text-xs text-gray-500">
                    {attachment.fileType}
                    <span className="mx-1">•</span>
                    {attachment.fileSize}
                    <span className="mx-1">•</span>
                    Uploaded {attachment.uploadedAt}
                </p>
            </div>
            {attachment.kind === "link" && attachment.url ? (
                <a
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-gray-400 px-4 py-2 text-xs font-medium text-[#1a73e8] hover:bg-blue-50"
                >
                    <Link2 className="h-3.5 w-3.5" />
                    Open
                </a>
            ) : (
                <button
                    type="button"
                    className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-gray-400 px-4 py-2 text-xs font-medium text-[#1a73e8] hover:bg-blue-50"
                >
                    <Download className="h-3.5 w-3.5" />
                    Download
                </button>
            )}
        </div>
    );
}