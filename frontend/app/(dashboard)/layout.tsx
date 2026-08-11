"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { CircleHelp } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen bg-[#eef1f4] text-gray-900">
            <TopBar onMenuClick={() => setSidebarOpen((v) => !v)} />

            <div className="flex items-start">
                <Sidebar open={sidebarOpen} onExpand={() => setSidebarOpen(true)} />
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