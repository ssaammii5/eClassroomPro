"use client";

import { useEffect, useMemo, useState } from "react";
import type { DragEvent } from "react";
import {
    Check,
    ChevronDown,
    ClipboardList,
    EllipsisVertical,
    Eye,
    EyeOff,
    GripVertical,
    Pencil,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { homeClasses } from "@/lib/mock-data";
import { initialOf, type HomeClass } from "@/lib/schemas";

type SortMode = "custom" | "alphabetical";

interface ClassesLayout {
    order: number[];
    hiddenIds: number[];
    sort: SortMode;
}

const STORAGE_KEY = "eclassroompro.classes.layout.v1";
const ALL_CLASS_IDS = homeClasses.map((c) => c.id);

function defaultLayout(): ClassesLayout {
    return { order: ALL_CLASS_IDS, hiddenIds: [], sort: "custom" };
}

/** Load persisted layout (order / hidden / sort) from localStorage. */
function loadLayout(): ClassesLayout {
    const fallback = defaultLayout();
    if (typeof window === "undefined") return fallback;

    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return fallback;

        const parsed = JSON.parse(raw) as Partial<ClassesLayout>;
        const knownIds = new Set(ALL_CLASS_IDS);

        // Keep only ids that still exist, then append any new classes at the end.
        const savedOrder = Array.isArray(parsed.order)
            ? parsed.order.filter((id): id is number => typeof id === "number" && knownIds.has(id))
            : [];
        const missingIds = ALL_CLASS_IDS.filter((id) => !savedOrder.includes(id));

        const hiddenIds = Array.isArray(parsed.hiddenIds)
            ? parsed.hiddenIds.filter((id): id is number => typeof id === "number" && knownIds.has(id))
            : [];

        return {
            order: [...savedOrder, ...missingIds],
            hiddenIds,
            sort: parsed.sort === "alphabetical" ? "alphabetical" : "custom",
        };
    } catch {
        return fallback;
    }
}

export function ClassesSection() {
    const [layout, setLayout] = useState<ClassesLayout>(defaultLayout);
    const [hydrated, setHydrated] = useState(false);
    const [hiddenOpen, setHiddenOpen] = useState(true);
    const [draggingId, setDraggingId] = useState<number | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    // Restore persisted layout after mount (avoids SSR hydration mismatch).
    useEffect(() => {
        setLayout(loadLayout());
        setHydrated(true);
    }, []);

    // Persist layout whenever it changes.
    useEffect(() => {
        if (!hydrated) return;
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
        } catch {
            // Storage unavailable (private mode, etc.) — keep state in memory only.
        }
    }, [hydrated, layout]);

    const hiddenSet = useMemo(() => new Set(layout.hiddenIds), [layout.hiddenIds]);

    const visibleClasses = useMemo(() => {
        const ordered = layout.order
            .map((id) => homeClasses.find((c) => c.id === id))
            .filter((c): c is HomeClass => c !== undefined && !hiddenSet.has(c.id));
        if (layout.sort === "alphabetical") {
            return [...ordered].sort((a, b) => a.name.localeCompare(b.name));
        }
        return ordered;
    }, [layout.order, layout.sort, hiddenSet]);

    const hiddenClasses = useMemo(() => {
        const ordered = layout.order
            .map((id) => homeClasses.find((c) => c.id === id))
            .filter((c): c is HomeClass => c !== undefined && hiddenSet.has(c.id));
        if (layout.sort === "alphabetical") {
            return [...ordered].sort((a, b) => a.name.localeCompare(b.name));
        }
        return ordered;
    }, [layout.order, layout.sort, hiddenSet]);

    // Dragging is only allowed while in "Edit" phase AND in custom sort mode.
    const canDrag = isEditing && layout.sort === "custom";

    const enterEditMode = () => {
        setIsEditing(true);
        // Manual rearranging needs custom order — switch automatically if needed.
        setLayout((prev) => (prev.sort === "alphabetical" ? { ...prev, sort: "custom" } : prev));
    };

    const exitEditMode = () => {
        setIsEditing(false);
        setDraggingId(null);
    };

    const hideClass = (id: number) =>
        setLayout((prev) =>
            prev.hiddenIds.includes(id) ? prev : { ...prev, hiddenIds: [...prev.hiddenIds, id] },
        );

    const unhideClass = (id: number) =>
        setLayout((prev) => ({ ...prev, hiddenIds: prev.hiddenIds.filter((x) => x !== id) }));

    const handleSortChange = (value: string) => {
        const sort: SortMode = value === "alphabetical" ? "alphabetical" : "custom";
        setLayout((prev) => ({ ...prev, sort }));
    };

    /* ---------- Drag & drop (edit phase + custom order only) ---------- */

    const handleDragStart = (e: DragEvent<HTMLDivElement>, id: number) => {
        setDraggingId(id);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", String(id));
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>, overId: number) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        if (draggingId === null || draggingId === overId) return;

        // Live-reorder the custom order while dragging.
        setLayout((prev) => {
            const from = prev.order.indexOf(draggingId);
            const to = prev.order.indexOf(overId);
            if (from === -1 || to === -1 || from === to) return prev;
            const order = [...prev.order];
            order.splice(from, 1);
            order.splice(to, 0, draggingId);
            return { ...prev, order };
        });
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDraggingId(null);
    };

    const handleDragEnd = () => setDraggingId(null);

    return (
        <section className="rounded-xl bg-[#f9fafc] px-6 py-5 shadow-sm">
            {/* Header: title + sort selector + edit toggle */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl text-gray-800">Classes</h2>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <div className="relative">
                        <select
                            aria-label="Sort classes"
                            value={layout.sort}
                            onChange={(e) => handleSortChange(e.target.value)}
                            className="cursor-pointer appearance-none rounded-full border border-gray-400 bg-transparent py-2 pl-4 pr-9 text-sm font-medium text-[#1a73e8] hover:bg-blue-50 focus:outline-none focus:ring-1 focus:ring-[#1a73e8]"
                        >
                            <option value="custom">Custom order</option>
                            <option value="alphabetical">Alphabetical (A–Z)</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1a73e8]" />
                    </div>

                    {/* Edit / Done phase toggle */}
                    <button
                        type="button"
                        onClick={isEditing ? exitEditMode : enterEditMode}
                        className={`flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${isEditing
                                ? "border-[#1a63d8] bg-[#1a63d8] text-white hover:bg-[#1554b5]"
                                : "border-gray-400 text-[#1a73e8] hover:bg-blue-50"
                            }`}
                    >
                        {isEditing ? <Check className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
                        {isEditing ? "Done" : "Edit"}
                    </button>
                </div>
            </div>

            {/* Edit-mode hint bar */}
            {isEditing && (
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-[#e8f0fe] px-4 py-2.5">
                    <p className="text-sm text-[#174ea6]">
                        {canDrag
                            ? "Edit mode: drag cards to rearrange your classes."
                            : 'Edit mode: switch sorting to "Custom order" to drag cards.'}
                    </p>
                    <button
                        type="button"
                        onClick={exitEditMode}
                        className="cursor-pointer text-sm font-medium text-[#1a73e8] hover:underline"
                    >
                        Done
                    </button>
                </div>
            )}

            {/* Visible classes grid */}
            {visibleClasses.length === 0 ? (
                <p className="py-10 text-center text-sm text-gray-600">
                    {homeClasses.length === 0
                        ? "You are not enrolled in any classes."
                        : "All of your classes are hidden. Expand the Hidden classes section below to unhide them."}
                </p>
            ) : (
                <div
                    className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                >
                    {visibleClasses.map((c) => (
                        <div
                            key={c.id}
                            draggable={canDrag}
                            onDragStart={(e) => handleDragStart(e, c.id)}
                            onDragOver={(e) => handleDragOver(e, c.id)}
                            onDrop={handleDrop}
                            onDragEnd={handleDragEnd}
                            className={`transition-opacity duration-150 ${draggingId === c.id ? "opacity-50" : "opacity-100"
                                }`}
                        >
                            <ClassCard course={c} canDrag={canDrag} onToggleHide={() => hideClass(c.id)} />
                        </div>
                    ))}
                </div>
            )}

            {/* Hidden classes: collapsible section at the bottom */}
            {hiddenClasses.length > 0 && (
                <div className="mt-6 border-t border-gray-300/60 pt-4">
                    <button
                        type="button"
                        onClick={() => setHiddenOpen((v) => !v)}
                        aria-expanded={hiddenOpen}
                        className="flex w-full cursor-pointer items-center justify-between rounded-lg px-2 py-2 hover:bg-gray-900/5"
                    >
                        <span className="flex items-center gap-3 text-base font-medium text-gray-800">
                            <EyeOff className="h-5 w-5 text-gray-600" />
                            Hidden classes
                            <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-gray-300/80 px-1.5 text-xs font-semibold text-gray-700">
                                {hiddenClasses.length}
                            </span>
                        </span>
                        <ChevronDown
                            className={`h-5 w-5 text-gray-700 transition-transform duration-200 ${hiddenOpen ? "rotate-180" : ""
                                }`}
                        />
                    </button>

                    {hiddenOpen && (
                        <div className="mt-4 grid grid-cols-1 gap-5 pb-1 md:grid-cols-2 xl:grid-cols-3">
                            {hiddenClasses.map((c) => (
                                <ClassCard key={c.id} course={c} isHidden onToggleHide={() => unhideClass(c.id)} />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}

interface ClassCardProps {
    course: HomeClass;
    isHidden?: boolean;
    canDrag?: boolean;
    onToggleHide: () => void;
}

function ClassCard({ course, isHidden = false, canDrag = false, onToggleHide }: ClassCardProps) {
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <article
            className={`group/card relative rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md ${isHidden ? "opacity-80" : ""
                }${canDrag ? " cursor-grab active:cursor-grabbing" : ""}`}
        >
            {/* draggable={false} on the link so the card (not the URL) is dragged */}
            <Link href={`/class/${course.id}`} draggable={false} className="block" title={course.name}>
                {/* Header banner */}
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

                    {/* Drag indicator — visible while in edit phase */}
                    {canDrag && (
                        <span className="pointer-events-none absolute bottom-2 left-3 flex items-center gap-1 rounded-full bg-black/35 px-2 py-1 text-[11px] font-medium text-white">
                            <GripVertical className="h-3.5 w-3.5" />
                            Drag to reorder
                        </span>
                    )}
                </div>

                {/* Spacer so the avatar can overlap out of the banner */}
                <div className="h-24" />
            </Link>

            {/* Footer actions */}
            <div className="flex items-center justify-center gap-8 rounded-b-lg border-t border-gray-200 py-2 text-gray-600">
                {/* View your work */}
                <div className="group relative">
                    <button
                        type="button"
                        aria-label="View your work"
                        onClick={() => router.push(`/class/${course.id}/work`)}
                        className="cursor-pointer rounded p-2 hover:bg-gray-900/5"
                    >
                        <ClipboardList className="h-5 w-5" />
                    </button>

                    <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded bg-[#3c4043] px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100">
                        View your work
                    </span>
                </div>

                {/* More options */}
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
                            {/* Backdrop to close the menu */}
                            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                            <div className="absolute bottom-full right-0 z-20 mb-2 w-48 rounded-lg bg-[#e9eef4] py-2 shadow-lg">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setMenuOpen(false);
                                        onToggleHide();
                                    }}
                                    className="flex w-full cursor-pointer items-center gap-3 px-5 py-3 text-left text-sm text-gray-900 hover:bg-gray-900/5"
                                >
                                    {isHidden ? (
                                        <Eye className="h-4 w-4 text-gray-700" />
                                    ) : (
                                        <EyeOff className="h-4 w-4 text-gray-700" />
                                    )}
                                    {isHidden ? "Unhide class" : "Hide class"}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </article>
    );
}