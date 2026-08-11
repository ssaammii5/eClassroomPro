"use client";

import { useState } from "react";
import { ClipboardList, EllipsisVertical, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { homeClasses } from "@/lib/mock-data";
import { initialOf, type HomeClass } from "@/lib/schemas";

export function ClassesSection() {
    const [visibleIds, setVisibleIds] = useState<number[]>(homeClasses.map((c) => c.id));

    const removeClass = (id: number) => setVisibleIds((prev) => prev.filter((x) => x !== id));

    const visibleClasses = homeClasses.filter((c) => visibleIds.includes(c.id));

    return (
        <section className="rounded-xl bg-[#f9fafc] px-6 py-5 shadow-sm">
            <div className="flex items-center justify-between">
                <h2 className="text-xl text-gray-800">Classes</h2>
                <a href="#" className="flex items-center gap-2 text-sm font-medium text-[#1a73e8] hover:underline">
                    <Plus className="h-4 w-4" />
                    Add class
                </a>
            </div>

            {visibleClasses.length === 0 ? (
                <p className="py-10 text-center text-sm text-gray-600">You are not enrolled in any classes.</p>
            ) : (
                <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {visibleClasses.map((c) => (
                        <ClassCard key={c.id} course={c} onUnenroll={() => removeClass(c.id)} />
                    ))}
                </div>
            )}
        </section>
    );
}

interface ClassCardProps {
    course: HomeClass;
    onUnenroll: () => void;
}

function ClassCard({ course, onUnenroll }: ClassCardProps) {
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <article className="relative rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md">
            {/* Clickable card body -> class home page */}
            <Link href={`/class/${course.id}`} className="block" title={course.name}>
                {/* Colored header */}
                <div
                    className="relative h-28 rounded-t-lg px-4 pt-4"
                    style={{ backgroundColor: course.headerColor }}
                >
                    <span aria-hidden className="absolute right-3 top-3 rotate-12 text-5xl opacity-90">
                        {course.emoji}
                    </span>
                    <span className="block truncate pr-10 text-xl font-medium text-white hover:underline">
                        {course.name}
                    </span>
                    {course.subject && (
                        <p className="mt-1 truncate text-sm font-medium text-white/90">{course.subject}</p>
                    )}
                    <p className="mt-1 truncate text-xs text-white-90 text-white/90">
                        {course.teacherName ?? "No teacher assigned"}
                    </p>
                    <span
                        className={`absolute -bottom-7 right-4 flex h-14 w-14 items-center justify-center rounded-full text-2xl text-white ${course.teacherAvatarClass}`}
                    >
                        {initialOf(course.teacherName)}
                    </span>
                </div>

                {/* Spacer keeps room for the floating teacher avatar */}
                <div className="h-24" />
            </Link>

            {/* Footer actions */}
            <div className="flex items-center justify-center gap-8 rounded-b-lg border-t border-gray-200 py-2 text-gray-600">
                {/* Left button -> "View your work" page of this class (with hover tooltip) */}
                <div className="group relative">
                    <button
                        type="button"
                        aria-label="View your work"
                        onClick={() => router.push(`/class/${course.id}/work`)}
                        className="cursor-pointer rounded p-2 hover:bg-gray-900/5"
                    >
                        <ClipboardList className="h-5 w-5" />
                    </button>
                    {/* Tooltip */}
                    <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded bg-[#3c4043] px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100">
                        View your work
                    </span>
                </div>

                {/* 3-dot menu (Unenroll only) */}
                <div className="relative">
                    <button
                        type="button"
                        aria-label="More options"
                        onClick={() => setMenuOpen((v) => !v)}
                        className={`rounded p-2 hover:bg-gray-900/5 ${menuOpen ? "bg-gray-900/10" : ""}`}
                    >
                        <EllipsisVertical className="h-5 w-5" />
                    </button>

                    {menuOpen && (
                        <>
                            {/* click-away backdrop */}
                            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                            <div className="absolute bottom-full right-0 z-20 mb-2 w-44 rounded-lg bg-[#e9eef4] py-2 shadow-lg">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setMenuOpen(false);
                                        onUnenroll();
                                    }}
                                    className="flex w-full cursor-pointer px-5 py-3 text-left text-sm text-gray-900 hover:bg-gray-900/5"
                                >
                                    Unenroll
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </article>
    );
}