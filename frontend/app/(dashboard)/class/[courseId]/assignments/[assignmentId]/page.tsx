import { notFound } from "next/navigation";
import { AssignmentDetailView } from "@/components/class/AssignmentDetailView";
import { getAssignmentDetail } from "@/lib/assignmentDetails";
import { homeClasses, sidebarClasses } from "@/lib/mock-data";

interface AssignmentPageProps {
    params: Promise<{ courseId: string; assignmentId: string }>;
}

export default async function AssignmentPage({ params }: AssignmentPageProps) {
    const { courseId, assignmentId } = await params;

    const course =
        homeClasses.find((c) => c.id === Number(courseId)) ??
        sidebarClasses.find((c) => c.id === Number(courseId));

    if (!course) notFound();

    const detail = getAssignmentDetail(Number(assignmentId));

    return <AssignmentDetailView detail={detail} />;
}