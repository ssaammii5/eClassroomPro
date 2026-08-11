import { notFound } from "next/navigation";
import { ClassPageClient } from "@/components/class/ClassPageClient";
import { getClassDetails, homeClasses, sidebarClasses } from "@/lib/mock-data";

interface ClassPageProps {
    params: Promise<{ courseId: string }>;
}

export default async function ClassPage({ params }: ClassPageProps) {
    const { courseId } = await params;
    const id = Number(courseId);

    const course =
        homeClasses.find((c) => c.id === id) ?? sidebarClasses.find((c) => c.id === id);
    const details = getClassDetails(id);

    if (!course || !details) notFound();

    return <ClassPageClient title={course.name} details={details} />;
}