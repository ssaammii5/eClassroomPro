"use client";

import { useState } from "react";
import {
    CalendarDays,
    ChevronRight,
    GraduationCap,
    Grip,
    LogOut,
    Menu,
    Plus,
    Settings,
    X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { IconButton } from "@/components/ui/IconButton";
import { currentUser, ROLE_STYLES } from "@/lib/currentUser";
import { homeClasses, sidebarClasses } from "@/lib/mock-data";
import { initialOf } from "@/lib/schemas";

interface TopBarProps {
    onMenuClick: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [accountOpen, setAccountOpen] = useState(false);

    const classMatch = pathname.match(/^\/class\/(\d+)/);
    const classCourse = classMatch
        ? homeClasses.find((c) => c.id === Number(classMatch[1])) ??
        sidebarClasses.find((c) => c.id === Number(classMatch[1]))
        : undefined;
    const classSub = classCourse
        ? "subject" in classCourse
            ? classCourse.subject
            : classCourse.sub
        : undefined;
    const isTodo = pathname.startsWith("/todo");
    const isCalendar = pathname.startsWith("/calendar");
    const isSettings = pathname.startsWith("/settings");

    const parts = currentUser.name.trim().split(/\s+/);
    const greetName = parts.length > 2 ? parts[1] : parts[0];

    return (
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between bg-white px-3 sm:px-4">
            {/* Left: menu + brand + breadcrumb */}
            <div className="flex min-w-0 items-center gap-1">
                <IconButton label="Open menu" onClick={onMenuClick}>
                    <Menu className="h-6 w-6" />
                </IconButton>
                <Link href="/" className="ml-1 flex shrink-0 items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#188038]">
                        <GraduationCap className="h-6 w-6 text-white" />
                    </span>
                    <span className="text-[22px] text-gray-700 max-sm:hidden">Classroom</span>
                </Link>

                {/* Class breadcrumb */}
                {classCourse && (
                    <Link
                        href={`/class/${classCourse.id}`}
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

                {/* To-do breadcrumb */}
                {isTodo && (
                    <span className="flex min-w-0 items-center">
                        <ChevronRight className="mx-1 h-5 w-5 shrink-0 text-gray-500" />
                        <span className="truncate text-[15px] font-medium text-gray-800">To-do</span>
                    </span>
                )}

                {/* Calendar breadcrumb */}
                {isCalendar && (
                    <span className="flex min-w-0 items-center">
                        <ChevronRight className="mx-1 h-5 w-5 shrink-0 text-gray-500" />
                        <span className="truncate text-[15px] font-medium text-gray-800">Calendar</span>
                    </span>
                )}

                {/* Settings breadcrumb */}
                {isSettings && (
                    <span className="flex min-w-0 items-center">
                        <ChevronRight className="mx-1 h-5 w-5 shrink-0 text-gray-500" />
                        <span className="truncate text-[15px] font-medium text-gray-800">Settings</span>
                    </span>
                )}
            </div>

            {/* Right: actions + account */}
            <div className="flex shrink-0 items-center gap-1">
                {!classCourse && !isTodo && !isCalendar && !isSettings && (
                    <IconButton label="Create">
                        <Plus className="h-6 w-6" />
                    </IconButton>
                )}
                {isCalendar && (
                    <IconButton label="Calendar">
                        <CalendarDays className="h-6 w-6" />
                    </IconButton>
                )}
                <IconButton label="Apps">
                    <Grip className="h-6 w-6" />
                </IconButton>

                {/* Account avatar + dropdown */}
                <div className="relative ml-2">
                    <button
                        type="button"
                        aria-label="Account"
                        onClick={() => setAccountOpen((v) => !v)}
                        className={`relative z-50 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-sm font-medium text-white ring-2 ring-transparent transition-shadow hover:ring-gray-400/60 ${currentUser.avatarClass}`}
                    >
                        {initialOf(currentUser.name)}
                    </button>

                    {accountOpen && (
                        <>
                            {/* click-away backdrop */}
                            <div className="fixed inset-0 z-40" onClick={() => setAccountOpen(false)} />

                            <div className="absolute right-0 top-full z-50 mt-3 w-[340px] rounded-2xl bg-[#e9eef4] p-5 shadow-xl">
                                {/* Email + close */}
                                <div className="relative text-center">
                                    <p className="truncate text-sm text-gray-800">{currentUser.email}</p>
                                    <button
                                        type="button"
                                        aria-label="Close"
                                        onClick={() => setAccountOpen(false)}
                                        className="absolute -right-1.5 -top-1.5 cursor-pointer rounded-full p-1.5 text-gray-700 hover:bg-gray-900/10"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                {/* Avatar */}
                                <div className="mt-5 flex justify-center">
                                    <span
                                        className={`flex h-20 w-20 items-center justify-center rounded-full text-4xl text-white ${currentUser.avatarClass}`}
                                    >
                                        {initialOf(currentUser.name)}
                                    </span>
                                </div>

                                {/* Greeting */}
                                <p className="mt-4 text-center text-xl text-gray-900">Hi, {greetName}!</p>

                                {/* Role chip */}
                                <div className="mt-2 flex justify-center">
                                    <span
                                        className={`rounded-full px-3.5 py-1 text-xs font-medium ${ROLE_STYLES[currentUser.role]}`}
                                    >
                                        {currentUser.role}
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="mt-5 grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setAccountOpen(false);
                                            router.push("/settings");
                                        }}
                                        className="flex cursor-pointer items-center justify-center gap-2 rounded-full border border-gray-500/70 bg-white/70 py-2.5 text-sm font-medium text-[#1a73e8] hover:bg-white"
                                    >
                                        <Settings className="h-4 w-4" />
                                        Settings
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setAccountOpen(false)}
                                        className="flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[#c5221f] py-2.5 text-sm font-medium text-white hover:bg-[#a31815]"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Log out
                                    </button>
                                </div>

                                {/* Footer */}
                                <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-700">
                                    <a href="#" className="hover:underline">
                                        Privacy Policy
                                    </a>
                                    <span>•</span>
                                    <a href="#" className="hover:underline">
                                        Terms of Service
                                    </a>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}