"use client";

import { CalendarDays, TriangleAlert, Video } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";

export const CLASS_TABS = [
    { id: "stream", label: "Stream" },
    { id: "classwork", label: "Classwork" },
    { id: "people", label: "People" },
] as const;

export type ClassTab = (typeof CLASS_TABS)[number]["id"];

interface ClassTabsProps {
    tab: ClassTab;
    onTabChange: (tab: ClassTab) => void;
}

export function ClassTabs({ tab, onTabChange }: ClassTabsProps) {
    return (
        <div className="sticky top-16 z-30 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between px-4 sm:px-8">
                <nav className="flex gap-8 sm:gap-12">
                    {CLASS_TABS.map((t) => (
                        <button
                            key={t.id}
                            type="button"
                            onClick={() => onTabChange(t.id)}
                            className={`relative cursor-pointer py-4 text-sm font-medium transition-colors ${tab === t.id ? "text-[#1a73e8]" : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            {t.label}
                            {tab === t.id && (
                                <span className="absolute inset-x-0 -bottom-px h-[3px] rounded-t-full bg-[#1a73e8]" />
                            )}
                        </button>
                    ))}
                </nav>

                <div className="flex items-center">
                    <IconButton label="Start Meet">
                        <Video className="h-5 w-5" />
                    </IconButton>
                    <IconButton label="Calendar">
                        <CalendarDays className="h-5 w-5" />
                    </IconButton>
                    <IconButton label="Missing work">
                        <TriangleAlert className="h-5 w-5" />
                    </IconButton>
                </div>
            </div>
        </div>
    );
}