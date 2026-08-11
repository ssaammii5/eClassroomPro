"use client";

import { useRef, useState } from "react";
import {
    ClipboardList,
    EllipsisVertical,
    Link2,
    MessageSquare,
    Paperclip,
    Plus,
    UserRound,
    UsersRound,
    X,
} from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import {
    submissionFilePool,
    type AssignmentAttachment,
    type AssignmentDetail,
} from "@/lib/assignmentDetails";

interface AssignmentDetailViewProps {
    detail: AssignmentDetail;
}

type WorkStatus = "Assigned" | "Turned in";

export function AssignmentDetailView({ detail }: AssignmentDetailViewProps) {
    const initiallyTurnedIn = detail.submission.status === "Turned in";

    const [status, setStatus] = useState<WorkStatus>(initiallyTurnedIn ? "Turned in" : "Assigned");
    const [attachments, setAttachments] = useState<AssignmentAttachment[]>(
        initiallyTurnedIn ? detail.submission.attachments : [],
    );
    const [addMenuOpen, setAddMenuOpen] = useState(false);
    const [turnInOpen, setTurnInOpen] = useState(false);
    const [unsubmitOpen, setUnsubmitOpen] = useState(false);
    const linkIdRef = useRef(1000);

    const turnedIn = status === "Turned in";

    /* ------------------------------ work actions ------------------------------ */
    const addFile = () => {
        setAddMenuOpen(false);
        setAttachments((prev) => {
            const used = new Set(prev.map((a) => a.title));
            const next = submissionFilePool.find((f) => !used.has(f.title));
            return next ? [...prev, next] : prev;
        });
    };

    const addLink = () => {
        setAddMenuOpen(false);
        setAttachments((prev) => [
            ...prev,
            {
                id: linkIdRef.current++,
                title: "https://drive.google.com/drive/folders/class-notes",
                fileType: "Link",
                thumbClass: "bg-gray-100",
            },
        ]);
    };

    const removeAttachment = (id: number) =>
        setAttachments((prev) => prev.filter((a) => a.id !== id));

    const handlePrimary = () => {
        if (attachments.length > 0) setTurnInOpen(true);
        else setStatus("Turned in"); // "Mark as done"
    };

    const confirmTurnIn = () => {
        setTurnInOpen(false);
        setStatus("Turned in");
    };

    const confirmUnsubmit = () => {
        setUnsubmitOpen(false);
        setStatus("Assigned");
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-white">
            <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-8">
                <div className="flex flex-col gap-8 lg:flex-row">
                    {/* ------------------------------ Main column ------------------------------ */}
                    <div className="min-w-0 flex-1">
                        {/* Title row */}
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex min-w-0 items-center gap-6">
                                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-700">
                                    <ClipboardList className="h-6 w-6" />
                                </span>
                                <h1 className="min-w-0 text-3xl text-gray-900 sm:text-[32px]">{detail.title}</h1>
                            </div>
                            <IconButton label="More options" className="h-10 w-10 shrink-0">
                                <EllipsisVertical className="h-5 w-5" />
                            </IconButton>
                        </div>

                        {/* Meta */}
                        <p className="mt-6 text-sm text-gray-800">
                            {detail.teacherName}
                            <span className="mx-2 text-gray-600">•</span>
                            {detail.postedDate}
                        </p>
                        <p className="mt-4 text-sm font-semibold text-gray-900">
                            {detail.points} points
                            <span className="mx-3 font-normal text-gray-700">|</span>
                            {detail.dueLabel}
                        </p>

                        <div className="mt-5 border-t border-gray-300" />

                        {/* Description */}
                        <p className="mt-7 whitespace-pre-line text-sm leading-6 text-gray-800">
                            {detail.description}
                        </p>

                        {/* Attachments */}
                        {detail.attachments.length > 0 && (
                            <div className="mt-7 flex flex-wrap gap-4">
                                {detail.attachments.map((att) => (
                                    <FileTile key={att.id} attachment={att} />
                                ))}
                            </div>
                        )}

                        {/* Class comments */}
                        <div className="mt-12 flex items-center gap-4">
                            <UsersRound className="h-6 w-6 text-gray-700" />
                            <span className="text-sm font-medium text-gray-900">Class comments</span>
                        </div>

                        <button
                            type="button"
                            className="mt-7 flex cursor-pointer items-center gap-3 text-sm font-medium text-[#1a73e8] hover:underline"
                        >
                            <MessageSquare className="h-5 w-5" />
                            Add comment
                        </button>
                    </div>

                    {/* ------------------------------ Right column ------------------------------ */}
                    <div className="w-full shrink-0 space-y-6 lg:w-[350px]">
                        {/* Your work */}
                        <section className="rounded-lg bg-[#e9eef4] p-4 sm:p-5">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg text-gray-900">Your work</h2>
                                <span
                                    className={`text-sm font-medium ${turnedIn ? "text-[#188038]" : "text-gray-900"}`}
                                >
                                    {turnedIn ? "Turned in" : "Assigned"}
                                </span>
                            </div>

                            {/* Current / submitted attachments */}
                            {attachments.length > 0 && (
                                <div className="mt-4 space-y-4">
                                    {attachments.map((att) => (
                                        <div key={att.id} className="flex items-center gap-3">
                                            <WorkAttachmentCard attachment={att} />
                                            {!turnedIn && (
                                                <button
                                                    type="button"
                                                    aria-label={`Remove ${att.title}`}
                                                    onClick={() => removeAttachment(att.id)}
                                                    className="cursor-pointer rounded-full p-1.5 text-gray-700 hover:bg-gray-900/10"
                                                >
                                                    <X className="h-5 w-5" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Add or create */}
                            {!turnedIn && (
                                <div className="relative mt-4">
                                    <button
                                        type="button"
                                        onClick={() => setAddMenuOpen((v) => !v)}
                                        className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-full border border-gray-400/80 py-2 text-sm font-medium text-[#1a73e8] hover:bg-white/70"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Add or create
                                    </button>

                                    {addMenuOpen && (
                                        <>
                                            {/* click-away backdrop */}
                                            <div className="fixed inset-0 z-10" onClick={() => setAddMenuOpen(false)} />
                                            <div className="absolute inset-x-0 top-full z-20 mt-2 overflow-hidden rounded-lg bg-[#e9eef4] py-2 shadow-lg">
                                                <button
                                                    type="button"
                                                    onClick={addLink}
                                                    className="flex w-full cursor-pointer items-center gap-4 px-4 py-2.5 text-sm text-gray-900 hover:bg-gray-900/5"
                                                >
                                                    <Link2 className="h-5 w-5" />
                                                    Link
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={addFile}
                                                    className="flex w-full cursor-pointer items-center gap-4 px-4 py-2.5 text-sm text-gray-900 hover:bg-gray-900/5"
                                                >
                                                    <Paperclip className="h-5 w-5" />
                                                    File
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}

                            {/* Primary action */}
                            <button
                                type="button"
                                onClick={turnedIn ? () => setUnsubmitOpen(true) : handlePrimary}
                                className={`mt-4 w-full cursor-pointer rounded-full py-2.5 text-sm font-medium transition-colors ${turnedIn
                                        ? "border border-gray-400/80 text-[#1a73e8] hover:bg-white/70"
                                        : "bg-[#1a63d8] text-white hover:bg-[#1554b5]"
                                    }`}
                            >
                                {turnedIn ? "Unsubmit" : attachments.length > 0 ? "Turn in" : "Mark as done"}
                            </button>

                            {!turnedIn && (
                                <p className="mt-4 text-center text-xs italic text-gray-700">
                                    Work cannot be turned in after the due date
                                </p>
                            )}
                        </section>

                        {/* Private comments */}
                        <section className="rounded-lg bg-[#e9eef4] p-4 sm:p-5">
                            <div className="flex items-center gap-3">
                                <UserRound className="h-5 w-5 text-gray-700" />
                                <span className="text-sm font-medium text-gray-900">Private comments</span>
                            </div>
                            <button
                                type="button"
                                className="mt-5 flex w-full cursor-pointer items-center gap-3 text-sm font-medium text-[#1a73e8] hover:underline"
                            >
                                <MessageSquare className="h-5 w-5 shrink-0" />
                                <span className="truncate">Add comment to {detail.privateCommentTarget}</span>
                            </button>
                        </section>
                    </div>
                </div>
            </div>

            {/* ------------------------------ Turn-in confirmation dialog ------------------------------ */}
            {turnInOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-xl rounded-2xl bg-[#e9eef4] p-6 shadow-xl">
                        <h2 className="text-2xl text-gray-900">Turn in your work?</h2>
                        <p className="mt-4 text-sm text-gray-800">
                            {attachments.length} attachment{attachments.length === 1 ? "" : "s"} will be
                            submitted for &quot;{detail.title}&quot;.
                        </p>
                        <div className="mt-4 border-t border-gray-400/60" />
                        <ul className="mt-4 space-y-3">
                            {attachments.map((att) => (
                                <li key={att.id} className="flex items-center gap-3">
                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-[#d93025] text-[7px] font-bold text-white">
                                        {att.fileType === "Link" ? "URL" : "PDF"}
                                    </span>
                                    <span className="truncate text-sm text-gray-900 underline">{att.title}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-6 flex justify-end gap-8">
                            <button
                                type="button"
                                onClick={() => setTurnInOpen(false)}
                                className="cursor-pointer text-sm font-medium text-[#1a73e8] hover:underline"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmTurnIn}
                                className="cursor-pointer text-sm font-medium text-[#1a73e8] hover:underline"
                            >
                                Turn in
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ------------------------------ Unsubmit confirmation dialog ------------------------------ */}
            {unsubmitOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-xl rounded-2xl bg-[#e9eef4] p-6 shadow-xl">
                        <h2 className="text-2xl text-gray-900">Unsubmit?</h2>
                        <p className="mt-4 text-sm leading-6 text-gray-800">
                            Unsubmit to add or change attachments. Don&apos;t forget to resubmit once
                            you&apos;re done.
                        </p>
                        <div className="mt-8 flex justify-end gap-8">
                            <button
                                type="button"
                                onClick={() => setUnsubmitOpen(false)}
                                className="cursor-pointer text-sm font-medium text-[#1a73e8] hover:underline"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmUnsubmit}
                                className="cursor-pointer text-sm font-medium text-[#1a73e8] hover:underline"
                            >
                                Unsubmit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ------------------------------ attachment tiles ------------------------------ */
function WorkAttachmentCard({ attachment }: { attachment: AssignmentAttachment }) {
    return (
        <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="flex min-w-0 flex-1 overflow-hidden rounded-lg border border-gray-300 bg-white transition-shadow hover:shadow-md"
        >
            <span className="flex min-w-0 flex-1 flex-col justify-center px-4 py-3">
                <span className="truncate text-sm font-medium text-gray-900 underline">
                    {attachment.title}
                </span>
                <span className="mt-1 text-xs text-gray-600">{attachment.fileType}</span>
            </span>
            <span
                className={`flex w-24 shrink-0 items-center justify-center border-l border-gray-200 text-3xl ${attachment.thumbClass}`}
            >
                {attachment.fileType === "Link" ? "🔗" : "📄"}
            </span>
        </a>
    );
}

function FileTile({ attachment }: { attachment: AssignmentAttachment }) {
    return (
        <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="flex w-full max-w-[340px] overflow-hidden rounded-lg border border-gray-300 bg-white transition-shadow hover:shadow-md"
        >
            <span className="flex min-w-0 flex-1 flex-col justify-center px-4 py-3">
                <span className="truncate text-sm font-medium text-gray-900 underline">
                    {attachment.title}
                </span>
                <span className="mt-1 text-xs text-gray-600">{attachment.fileType}</span>
            </span>
            <span
                className={`flex w-24 shrink-0 items-center justify-center border-l border-gray-200 text-3xl ${attachment.thumbClass}`}
            >
                📄
            </span>
        </a>
    );
}