"use client";

import { ChevronRight, GraduationCap, Grip, Menu, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconButton } from "@/components/ui/IconButton";
import { homeClasses, sidebarClasses } from "@/lib/mock-data";

interface TopBarProps {
    onMenuClick: () => void;
    userInitial?: string;
}

export function TopBar({ onMenuClick, userInitial = "M" }: TopBarProps) {
    const pathname = usePathname();
    const classMatch = pathname.match(/^\/classes\/(\d+)/);
    const classCourse = classMatch
        ? homeClasses.find((c) => c.id === Number(classMatch[1])) ??
        sidebarClasses.find((c) => c.id === Number(classMatch[1]))
        : undefined;
    const classSub = classCourse
        ? "subject" in classCourse
            ? classCourse.subject
            : classCourse.sub
        : undefined;

    return (
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between bg-white px-3 sm:px-4">
            {/* Left: menu + brand + current class */}
            <div className="flex min-w-0 items-center gap-1">
                <IconButton label="Open menu" onClick={onMenuClick}>
                    <Menu className="h-6 w-6" />
                </IconButton>
                <a href="/" className="ml-1 flex shrink-0 items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#188038]">
                        <GraduationCap className="h-6 w-6 text-white" />
                    </span>
                    <span className="text-[22px] text-gray-700 max-sm:hidden">Classroom</span>
                </a>

                {/* Clickable class breadcrumb -> class home page */}
                {classCourse && (
                    <Link
                        href={`/classes/${classCourse.id}`}
                        title={classCourse.name}
                        className="flex min-w-0 items-center rounded-full py-1 pl-1 pr-3 transition-colors hover:bg-gray-900/5"
                    >
                        <ChevronRight className="mx-1 h-5 w-5 shrink-0 text-gray-500" />
                        <span className="min-w-0">
                            <span className="block truncate text-[15px] font-medium text-gray-800">
                                {classCourse.name}
                            </span>
                            {classSub && (
                                <span className="block truncate text-xs text-gray-600">{classSub}</span>
                            )}
                        </span>
                    </Link>
                )}
            </div>

            {/* Right: actions */}
            <div className="flex shrink-0 items-center gap-1">
                {!classCourse && (
                    <IconButton label="Create">
                        <Plus className="h-6 w-6" />
                    </IconButton>
                )}
                <IconButton label="Apps">
                    <Grip className="h-6 w-6" />
                </IconButton>
                <button
                    type="button"
                    aria-label="Account"
                    className="ml-2 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-purple-800 text-sm font-medium text-white"
                >
                    {userInitial}
                </button>
            </div>
        </header>
    );
}