"use client";

import { useEffect, useState } from "react";
import { ClassTabs, type ClassTab } from "@/components/class/ClassTabs";
import { ClassworkView } from "@/components/class/ClassworkView";
import { GradesView } from "@/components/class/GradesView";
import { PeopleView } from "@/components/class/PeopleView";
import { StreamView } from "@/components/class/StreamView";
import { TeacherClassworkView } from "@/components/class/TeacherClassworkView";
import { AssignmentCreateView } from "@/components/class/AssignmentCreateView";
import { currentUser } from "@/lib/currentUser";
import type { ClassDetails, ClassworkEntry } from "@/lib/schemas";
import { loadTeacherClasswork, saveTeacherClasswork } from "@/lib/teacherClasswork";

interface ClassPageClientProps {
    title: string;
    details: ClassDetails;
}

export function ClassPageClient({ title, details }: ClassPageClientProps) {
    // Teachers (and admins, for demo convenience) get the teacher experience.
    const isTeacher = currentUser.role === "Teacher" || currentUser.role === "Admin";

    const [tab, setTab] = useState<ClassTab>("stream");
    const [classwork, setClasswork] = useState<ClassworkEntry[]>(details.classwork);
    const [editorOpen, setEditorOpen] = useState(false);
    const [editing, setEditing] = useState<ClassworkEntry | null>(null);

    useEffect(() => {
        if (isTeacher) {
            setClasswork(loadTeacherClasswork(details.courseId, details.classwork));
        }
    }, [isTeacher, details.courseId, details.classwork]);

    const mutateClasswork = (next: ClassworkEntry[]) => {
        setClasswork(next);
        if (isTeacher) saveTeacherClasswork(details.courseId, next);
    };

    const openCreate = () => {
        setEditing(null);
        setEditorOpen(true);
    };
    const openEdit = (entry: ClassworkEntry) => {
        setEditing(entry);
        setEditorOpen(true);
    };
    const closeEditor = () => {
        setEditorOpen(false);
        setEditing(null);
    };
    const handleDelete = (entry: ClassworkEntry) =>
        mutateClasswork(classwork.filter((i) => i.id !== entry.id));
    const handleSubmit = (entry: ClassworkEntry) => {
        const exists = classwork.some((i) => i.id === entry.id);
        mutateClasswork(
            exists ? classwork.map((i) => (i.id === entry.id ? entry : i)) : [...classwork, entry],
        );
        closeEditor();
    };

    if (editorOpen) {
        return (
            <AssignmentCreateView
                courseName={title}
                initial={editing}
                onClose={closeEditor}
                onSubmit={handleSubmit}
            />
        );
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-white pb-10">
            <ClassTabs tab={tab} onTabChange={setTab} isTeacher={isTeacher} />
            {tab === "stream" && <StreamView title={title} details={details} />}
            {tab === "classwork" &&
                (isTeacher ? (
                    <TeacherClassworkView
                        items={classwork}
                        onCreate={openCreate}
                        onEdit={openEdit}
                        onDelete={handleDelete}
                    />
                ) : (
                    <ClassworkView items={classwork} courseId={details.courseId} />
                ))}
            {tab === "people" && <PeopleView people={details.people} />}
            {tab === "grades" && isTeacher && <GradesView people={details.people} items={classwork} />}
        </div>
    );
}