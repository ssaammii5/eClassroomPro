// components/layout/Sidebar.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
    CalendarDays,
    ChevronUp,
    GraduationCap,
    House,
    ListTodo,
    Settings,
    ShieldCheck,
    Users,
    BookOpen,
    ClipboardList,
    FileText,
    Cog,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarClasses } from "@/lib/mock-data";
import { currentUser } from "@/lib/currentUser";

const DESKTOP_QUERY = "(min-width: 1024px)";

interface SidebarProps {
    open: boolean;
    mobileReady?: boolean;
    onExpand?: () => void;
    onClose?: () => void;
}

export function Sidebar({ open, mobileReady = true, onExpand, onClose }: SidebarProps) {
    const [enrolledOpen, setEnrolledOpen] = useState(true);
    const [adminOpen, setAdminOpen] = useState(true);
    const pathname = usePathname();
    const prevPathname = useRef(pathname);
    const isAdmin = currentUser.role === "Admin";

    useEffect(() => {
        if (prevPathname.current === pathname) return;
        prevPathname.current = pathname;
        if (typeof window !== "undefined" && !window.matchMedia(DESKTOP_QUERY).matches) {
            onClose?.();
        }
    }, [pathname, onClose]);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const mq = window.matchMedia(DESKTOP_QUERY);
        const update = () => {
            document.body.style.overflow = open && !mq.matches ? "hidden" : "";
        };
        update();
        mq.addEventListener("change", update);
        return () => {
            mq.removeEventListener("change", update);
            document.body.style.overflow = "";
        };
    }, [open]);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && !window.matchMedia(DESKTOP_QUERY).matches) onClose?.();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    const mobileClasses = !mobileReady
        ? "max-lg:hidden"
        : open
            ? "max-lg:fixed max-lg:left-0 max-lg:top-16 max-lg:z-30 max-lg:h-[calc(100dvh-4rem)] max-lg:max-w-[85vw] max-lg:translate-x-0 max-lg:bg-[#eef1f4] max-lg:shadow-xl"
            : "max-lg:fixed max-lg:left-0 max-lg:top-16 max-lg:z-30 max-lg:h-[calc(100dvh-4rem)] max-lg:w-[300px] max-lg:max-w-[85vw] max-lg:-translate-x-full max-lg:invisible max-lg:pointer-events-none max-lg:bg-[#eef1f4]";

    return (
        <>
            {mobileReady && open && (
                <div
                    className="fixed inset-0 top-16 z-20 bg-black/40 lg:hidden"
                    aria-hidden
                    onClick={onClose}
                />
            )}
            <aside
                className={`sticky top-16 h-[calc(100vh-4rem)] shrink-0 self-start overflow-y-auto overflow-x-hidden pb-6 pt-2 transition-all duration-200 ${mobileClasses} ${open ? "w-[300px] px-2" : "w-[72px] px-1.5"}`}
            >
                <nav className="flex flex-col gap-0.5">
                    <NavItem open={open} active={pathname === "/"} href="/" icon={<House className="h-6 w-6" />} label="Home" />
                    <NavItem open={open} active={pathname.startsWith("/calendar")} href="/calendar" icon={<CalendarDays className="h-6 w-6" />} label="Calendar" />

                    {open && <div className="my-2 h-px bg-gray-300/70" />}

                    {/* Admin Section */}
                    {isAdmin && (
                        <>
                            {open ? (
                                <button
                                    type="button"
                                    onClick={() => setAdminOpen((v) => !v)}
                                    className="flex items-center justify-between rounded-full px-6 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-900/5"
                                >
                                    <span className="flex items-center gap-4">
                                        <ShieldCheck className="h-6 w-6 text-[#c5221f]" />
                                        Admin Panel
                                    </span>
                                    <ChevronUp className={`h-5 w-5 text-gray-600 transition-transform ${adminOpen ? "" : "rotate-180"}`} />
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    title="Admin Panel"
                                    aria-label="Admin Panel"
                                    onClick={onExpand}
                                    className="my-2 flex h-11 w-full items-center justify-center rounded-full text-[#c5221f] hover:bg-gray-900/5"
                                >
                                    <ShieldCheck className="h-6 w-6" />
                                </button>
                            )}

                            {open && adminOpen && (
                                <>
                                    <NavItem open={open} active={pathname === "/admin"} href="/admin" icon={<House className="h-5 w-5" />} label="Dashboard" />
                                    <NavItem open={open} active={pathname.startsWith("/admin/users")} href="/admin/users" icon={<Users className="h-5 w-5" />} label="Users" />
                                    <NavItem open={open} active={pathname.startsWith("/admin/courses")} href="/admin/courses" icon={<BookOpen className="h-5 w-5" />} label="Courses" />
                                    <NavItem open={open} active={pathname.startsWith("/admin/assignments")} href="/admin/assignments" icon={<ClipboardList className="h-5 w-5" />} label="Assignments" />
                                    <NavItem open={open} active={pathname.startsWith("/admin/submissions")} href="/admin/submissions" icon={<FileText className="h-5 w-5" />} label="Submissions" />
                                    <NavItem open={open} active={pathname.startsWith("/admin/settings")} href="/admin/settings" icon={<Cog className="h-5 w-5" />} label="App Settings" />
                                </>
                            )}

                            {open && <div className="my-2 h-px bg-gray-300/70" />}
                        </>
                    )}

                    {/* Enrolled Classes */}
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
                            <ChevronUp className={`h-5 w-5 text-gray-600 transition-transform ${enrolledOpen ? "" : "rotate-180"}`} />
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

                    <NavItem open={open} active={pathname.startsWith("/todo")} href="/todo" icon={<ListTodo className="h-6 w-6" />} label="To-do" />

                    {open && enrolledOpen && (
                        <>
                            {sidebarClasses.map((c) => (
                                <Link
                                    key={c.id}
                                    href={`/class/${c.id}`}
                                    className="flex items-center gap-3 rounded-full py-2 pl-4 pr-4 hover:bg-gray-900/5"
                                >
                                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium ${c.avatarClass}`}>
                                        {c.letter}
                                    </span>
                                    <span className="min-w-0">
                                        <span className="block truncate text-sm text-gray-800">{c.name}</span>
                                        {c.sub && <span className="block truncate text-xs text-gray-600">{c.sub}</span>}
                                    </span>
                                </Link>
                            ))}
                        </>
                    )}

                    <NavItem open={open} active={pathname.startsWith("/settings")} href="/settings" icon={<Settings className="h-6 w-6" />} label="Settings" />
                </nav>
            </aside>
        </>
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
                className={`flex h-11 w-full items-center justify-center rounded-full ${active ? "bg-[#cfe8fc] text-[#1a73e8]" : "text-gray-700 hover:bg-gray-900/5"}`}
            >
                <span className="relative">
                    {icon}
                    {badge && <span className="absolute -right-1.5 -top-1 h-2 w-2 rounded-full bg-blue-600" />}
                </span>
            </a>
        );
    }
    return (
        <a
            href={href}
            className={`flex items-center gap-4 rounded-full px-6 py-2.5 text-sm ${active ? "bg-[#cfe8fc] font-medium text-gray-900" : "text-gray-800 hover:bg-gray-900/5"}`}
        >
            <span className={`relative ${active ? "text-[#1a73e8]" : "text-gray-600"}`}>
                {icon}
                {badge && <span className="absolute -right-1 -top-0.5 h-2 w-2 rounded-full bg-blue-600" />}
            </span>
            {label}
        </a>
    );
}