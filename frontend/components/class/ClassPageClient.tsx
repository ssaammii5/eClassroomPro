"use client";

import { useState } from "react";
import { ClassTabs, type ClassTab } from "@/components/class/ClassTabs";
import { ClassworkView } from "@/components/class/ClassworkView";
import { PeopleView } from "@/components/class/PeopleView";
import { StreamView } from "@/components/class/StreamView";
import type { ClassDetails } from "@/lib/schemas";

interface ClassPageClientProps {
    title: string;
    details: ClassDetails;
}

export function ClassPageClient({ title, details }: ClassPageClientProps) {
    const [tab, setTab] = useState<ClassTab>("stream");

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-white pb-10">
            <ClassTabs tab={tab} onTabChange={setTab} />

            {tab === "stream" && <StreamView title={title} details={details} />}
            {tab === "classwork" && <ClassworkView items={details.classwork} />}
            {tab === "people" && <PeopleView people={details.people} />}
        </div>
    );
}