"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { CircleHelp } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";

const DESKTOP_QUERY = "(min-width: 1024px)";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    // Desktop (>= lg): sidebar starts OPEN (sticky rail).
    // Mobile/tablet (< lg): starts CLOSED (slide-in drawer).
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileReady, setMobileReady] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia(DESKTOP_QUERY);
        setSidebarOpen(mq.matches);
        setMobileReady(true);

        // Keep state consistent when crossing the breakpoint (resize/rotate).
        const handleChange = (e: MediaQueryListEvent) => setSidebarOpen(e.matches);
        mq.addEventListener("change", handleChange);
        return () => mq.removeEventListener("change", handleChange);
    }, []);

    return (
        <div className="min-h-screen bg-[#eef1f4] text-gray-900">
            <TopBar onMenuClick={() => setSidebarOpen((v) => !v)} />

            <div className="flex items-start">
                <Sidebar
                    open={sidebarOpen}
                    mobileReady={mobileReady}
                    onExpand={() => setSidebarOpen(true)}
                    onClose={() => setSidebarOpen(false)}
                />
                <main className="min-w-0 flex-1">{children}</main>
            </div>

            <button
                type="button"
                aria-label="Help"
                className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#f9fafc] text-gray-600 shadow-md hover:bg-white"
            >
                <CircleHelp className="h-6 w-6" />
            </button>
        </div>
    );
}