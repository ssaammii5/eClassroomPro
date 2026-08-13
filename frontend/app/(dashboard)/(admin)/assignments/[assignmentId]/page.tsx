import { notFound } from "next/navigation";
import { AssignmentDetailView } from "@/components/class/AssignmentDetailView";
import { adminAssignments } from "@/lib/adminData";
import type { AssignmentDetail } from "@/lib/assignmentDetails";

interface AdminAssignmentDetailPageProps {
    params: Promise<{ assignmentId: string }>;
}

function mapToAssignmentDetail(assignment: (typeof adminAssignments)[number]): AssignmentDetail {
    return {
        id: assignment.id,
        title: assignment.title,
        teacherName: assignment.createdBy,
        postedDate: assignment.createdAt,
        points: assignment.maxMarks,
        dueLabel: `Due ${assignment.deadline}`,
        description: assignment.description,
        attachments: [],
        submission: {
            status: "Assigned",
            attachments: [],
        },
        privateCommentTarget: assignment.createdBy,
    };
}

export default async function AdminAssignmentDetailPage({ params }: AdminAssignmentDetailPageProps) {
    const { assignmentId } = await params;
    const assignment = adminAssignments.find((a) => a.id === Number(assignmentId));

    if (!assignment) notFound();

    const detail = mapToAssignmentDetail(assignment);

    return <AssignmentDetailView detail={detail} readOnly />;
}