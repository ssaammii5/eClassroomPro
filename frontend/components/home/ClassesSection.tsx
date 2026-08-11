import { ClipboardList, EllipsisVertical, Folder, Plus } from "lucide-react";
import { homeClasses } from "@/lib/mock-data";
import { initialOf, type HomeClass } from "@/lib/schemas";

export function ClassesSection() {
    return (
        <section className="rounded-xl bg-[#f9fafc] px-6 py-5 shadow-sm">
            <div className="flex items-center justify-between">
                <h2 className="text-xl text-gray-800">Classes</h2>
                <a href="#" className="flex items-center gap-2 text-sm font-medium text-[#1a73e8] hover:underline">
                    <Plus className="h-4 w-4" />
                    Add class
                </a>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {homeClasses.map((c) => (
                    <ClassCard key={c.id} course={c} />
                ))}
            </div>
        </section>
    );
}

function ClassCard({ course }: { course: HomeClass }) {
    return (
        <article className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            {/* Colored header */}
            <div className="relative h-28 px-4 pt-4" style={{ backgroundColor: course.headerColor }}>
                <span aria-hidden className="absolute right-3 top-3 rotate-12 text-5xl opacity-90">
                    {course.emoji}
                </span>

                <a href="#" className="block truncate pr-10 text-xl font-medium text-white hover:underline">
                    {course.name}
                </a>
                {course.subject && (
                    <p className="mt-1 truncate text-sm font-medium text-white/90">{course.subject}</p>
                )}
                <p className="mt-1 truncate text-xs text-white/90">{course.teacherName ?? "No teacher assigned"}</p>

                <span
                    className={`absolute -bottom-7 right-4 flex h-14 w-14 items-center justify-center rounded-full text-2xl text-white ${course.teacherAvatarClass}`}
                >
                    {initialOf(course.teacherName)}
                </span>
            </div>

            {/* Empty preview area (stream preview comes later) */}
            <div className="h-24" />

            {/* Footer actions */}
            <div className="flex items-center justify-center gap-8 border-t border-gray-200 py-2 text-gray-600">
                <button type="button" aria-label="Classwork" className="rounded p-2 hover:bg-gray-900/5">
                    <ClipboardList className="h-5 w-5" />
                </button>
                <button type="button" aria-label="Open folder" className="rounded p-2 hover:bg-gray-900/5">
                    <Folder className="h-5 w-5" />
                </button>
                <button type="button" aria-label="More options" className="rounded p-2 hover:bg-gray-900/5">
                    <EllipsisVertical className="h-5 w-5" />
                </button>
            </div>
        </article>
    );
}