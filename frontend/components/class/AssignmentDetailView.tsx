"use client";

import { useState } from "react";
import {
    ClipboardList,
    EllipsisVertical,
    MessageSquare,
    UserRound,
    UsersRound,
} from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import type { AssignmentAttachment, AssignmentDetail } from "@/lib/assignmentDetails";

interface AssignmentDetailViewProps {
    detail: AssignmentDetail;
}

export function AssignmentDetailView({ detail }: AssignmentDetailViewProps) {
    const [turnedIn, setTurnedIn] = useState(detail.submission.status === "Turned in");

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
                                {turnedIn ? (
                                    <span className="text-sm font-medium text-[#188038]">Turned in</span>
                                ) : (
                                    <span className="text-sm font-medium text-gray-600">Not turned in</span>
                                )}
                            </div>

                            {turnedIn && detail.submission.attachments.length > 0 && (
                                <div className="mt-4">
                                    <FileTile attachment={detail.submission.attachments[0]} compact />
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={() => setTurnedIn((v) => !v)}
                                className="mt-5 w-full cursor-pointer rounded-full border border-gray-400/80 py-2 text-sm font-medium text-[#1a73e8] transition-colors hover:bg-white/70"
                            >
                                {turnedIn ? "Unsubmit" : "Submit"}
                            </button>
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
        </div>
    );
}

/* ------------------------------ Attachment tile ------------------------------ */
function FileTile({
    attachment,
    compact = false,
}: {
    attachment: AssignmentAttachment;
    compact?: boolean;
}) {
    return (
        <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className={`flex overflow-hidden rounded-lg border border-gray-300 bg-white transition-shadow hover:shadow-md ${compact ? "w-full" : "w-full max-w-[340px]"
                }`}
        >
            <span className="flex min-w-0 flex-1 flex-col justify-center px-4 py-3">
                <span className="truncate text-sm font-medium text-gray-900 underline">
                    {attachment.title}
                </span>
                <span className="mt-1 text-xs text-gray-600">{attachment.fileType}</span>
            </span>
            <span
                className={`flex shrink-0 items-center justify-center border-l border-gray-200 text-3xl ${attachment.thumbClass} ${compact ? "w-20" : "w-24"
                    }`}
            >
                📄
            </span>
        </a>
    );
}