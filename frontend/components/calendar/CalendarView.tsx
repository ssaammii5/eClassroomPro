"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { calendarEvents } from "@/lib/calendarEvents";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function startOfWeek(d: Date): Date {
    const c = new Date(d);
    c.setDate(c.getDate() - c.getDay());
    c.setHours(0, 0, 0, 0);
    return c;
}

function addDays(d: Date, n: number): Date {
    const c = new Date(d);
    c.setDate(c.getDate() + n);
    return c;
}

function sameDay(a: Date, b: Date): boolean {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

function fmt(d: Date): string {
    return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

export function CalendarView() {
    const [weekStart, setWeekStart] = useState<Date>(() => startOfWeek(new Date()));
    const [classFilter, setClassFilter] = useState("all");

    const days = useMemo(
        () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
        [weekStart],
    );
    const weekEnd = days[6];
    const today = new Date();

    const classOptions = useMemo(
        () => Array.from(new Set(calendarEvents.map((e) => e.courseName))),
        [],
    );

    const eventsFor = (day: Date) =>
        calendarEvents.filter(
            (e) => sameDay(e.date, day) && (classFilter === "all" || e.courseName === classFilter),
        );

    const label =
        weekStart.getFullYear() === weekEnd.getFullYear()
            ? `${fmt(weekStart)} - ${fmt(weekEnd)}, ${weekEnd.getFullYear()}`
            : `${fmt(weekStart)}, ${weekStart.getFullYear()} - ${fmt(weekEnd)}, ${weekEnd.getFullYear()}`;

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-white">
            <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-8">
                {/* Toolbar */}
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    {/* Class filter */}
                    <div className="relative w-full max-w-[420px] rounded border border-gray-500/70 focus-within:border-[#1a73e8] focus-within:ring-1 focus-within:ring-[#1a73e8]">
                        <select
                            value={classFilter}
                            onChange={(e) => setClassFilter(e.target.value)}
                            className="w-full appearance-none bg-transparent px-4 py-4 pr-10 text-[15px] text-gray-900 focus:outline-none"
                        >
                            <option value="all">All classes</option>
                            {classOptions.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-800" />
                    </div>

                    {/* Week navigation + Today */}
                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            aria-label="Previous week"
                            onClick={() => setWeekStart((w) => addDays(w, -7))}
                            className="cursor-pointer rounded-full p-2 text-gray-700 hover:bg-gray-900/5"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <span className="min-w-[220px] text-center text-[15px] font-medium text-gray-900">
                            {label}
                        </span>
                        <button
                            type="button"
                            aria-label="Next week"
                            onClick={() => setWeekStart((w) => addDays(w, 7))}
                            className="cursor-pointer rounded-full p-2 text-gray-700 hover:bg-gray-900/5"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => setWeekStart(startOfWeek(new Date()))}
                            className="ml-3 cursor-pointer rounded-full border border-gray-400 px-6 py-2 text-sm font-medium text-[#1a73e8] hover:bg-blue-50"
                        >
                            Today
                        </button>
                    </div>
                </div>

                {/* Week grid */}
                <div className="mt-6 overflow-x-auto">
                    <div className="grid min-w-[980px] grid-cols-7 overflow-hidden rounded-lg border border-gray-300">
                        {days.map((day, i) => {
                            const isToday = sameDay(day, today);
                            const dayEvents = eventsFor(day);
                            return (
                                <div
                                    key={day.toISOString()}
                                    className={`flex min-h-[560px] flex-col bg-[#f8f9fa]/60 ${i > 0 ? "border-l border-gray-300" : ""
                                        }`}
                                >
                                    {/* Day header */}
                                    <div className="flex flex-col items-center gap-1 border-b border-gray-200 py-3">
                                        <span className="text-sm text-gray-700">{DOW[day.getDay()]}</span>
                                        <span
                                            className={`flex h-10 w-10 items-center justify-center rounded-full text-2xl ${isToday ? "bg-[#1a73e8] font-medium text-white" : "text-gray-900"
                                                }`}
                                        >
                                            {day.getDate()}
                                        </span>
                                    </div>

                                    {/* Events */}
                                    <div className="flex flex-1 flex-col gap-2 p-1.5">
                                        {dayEvents.map((e) => (
                                            <div
                                                key={e.id}
                                                title={`${e.title} (${e.courseName})`}
                                                className={`cursor-pointer rounded px-2.5 py-2 text-white shadow-sm transition-opacity hover:opacity-90 ${e.color}`}
                                            >
                                                <p className="text-sm font-medium leading-5">{e.title}</p>
                                                <p className="mt-0.5 text-xs">{e.time}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}