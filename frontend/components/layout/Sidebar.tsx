"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import {
    CalendarDays,
    ChevronUp,
    GraduationCap,
    House,
    ListTodo,
    Settings,
} from "lucide-react";
import { sidebarClasses } from "@/lib/mock-data";

interface SidebarProps {
    open: boolean;
    onExpand?: () => void;
}

export function Sidebar({ open, onExpand }: SidebarProps) {
    const [enrolledOpen, setEnrolledOpen] = useState(true);

    return (
        <aside
            className={`sticky top-16 h-[calc(100vh-4rem)] shrink-0 self-start overflow-y-auto overflow-x-hidden pb-6 pt-2 transition-all duration-200 ${open
                    ? "w-[300px] px-2 max-lg:fixed max-lg:left-0 max-lg:top-16 max-lg:z-30 max-lg:bg-[#eef1f4] max-lg:shadow-xl"
                    : "w-[72px] px-1.5 max-lg:hidden"
                }`}
        >
            <nav className="flex flex-col gap-0.5">
                <NavItem open={open} active href="/" icon={<House className="h-6 w-6" />} label="Home" />
                <NavItem open={open} href="#" icon={<CalendarDays className="h-6 w-6" />} label="Calendar" />
                {open && <div className="my-2 h-px bg-gray-300/70" />}

                {/* Enrolled */}
                {open ? (
                    <button
                        type="button"
                        onClick={() => setEnrolledOpen((v) => !v)}
                        className="flex items-center justify-between rounded-full px-6 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-900/5"
                    >
                        <span className="flex items-center gap-4">
                            <GraduationCap className="h-6 w-6 text-gray-600" />
                            Enrolled
                        </span>
                        <ChevronUp
                            className={`h-5 w-5 text-gray-600 transition-transform ${enrolledOpen ? "" : "rotate-180"}`}
                        />
                    </button>
                ) : (
                    <button
                        type="button"
                        title="Enrolled"
                        aria-label="Enrolled"
                        onClick={onExpand}
                        className="my-2 flex h-11 w-full items-center justify-center rounded-full text-gray-700 hover:bg-gray-900/5"
                    >
                        <GraduationCap className="h-6 w-6" />
                    </button>
                )}

                {/* To-do */}
                <NavItem open={open} href="#" icon={<ListTodo className="h-6 w-6" />} label="To-do" />

                {open && enrolledOpen && (
                    <>
                        {sidebarClasses.map((c) => (
                            <a
                                key={c.id}
                                href="#"
                                className="flex items-center gap-3 rounded-full py-2 pl-4 pr-4 hover:bg-gray-900/5"
                            >
                                <span
                                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium ${c.avatarClass}`}
                                >
                                    {c.letter}
                                </span>
                                <span className="min-w-0">
                                    <span className="block truncate text-sm text-gray-800">{c.name}</span>
                                    {c.sub && <span className="block truncate text-xs text-gray-600">{c.sub}</span>}
                                </span>
                            </a>
                        ))}
                    </>
                )}

                <NavItem open={open} href="#" icon={<Settings className="h-6 w-6" />} label="Settings" />
            </nav>
        </aside>
    );
}

interface NavItemProps {
    href: string;
    icon: ReactNode;
    label: string;
    active?: boolean;
    badge?: boolean;
    open: boolean;
}

function NavItem({ href, icon, label, active = false, badge = false, open }: NavItemProps) {
    if (!open) {
        return (
            <a
                href={href}
                title={label}
                aria-label={label}
                className={`flex h-11 w-full items-center justify-center rounded-full ${active ? "bg-[#cfe8fc] text-[#1a73e8]" : "text-gray-700 hover:bg-gray-900/5"
                    }`}
            >
                <span className="relative">
                    {icon}
                    {badge && (
                        <span className="absolute -right-1.5 -top-1 h-2 w-2 rounded-full bg-blue-600" />
                    )}
                </span>
            </a>
        );
    }
    return (
        <a
            href={href}
            className={`flex items-center gap-4 rounded-full px-6 py-2.5 text-sm ${active ? "bg-[#cfe8fc] font-medium text-gray-900" : "text-gray-800 hover:bg-gray-900/5"
                }`}
        >
            <span className={`relative ${active ? "text-[#1a73e8]" : "text-gray-600"}`}>
                {icon}
                {badge && <span className="absolute -right-1 -top-0.5 h-2 w-2 rounded-full bg-blue-600" />}
            </span>
            {label}
        </a>
    );
}