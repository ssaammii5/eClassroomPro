import { notFound } from "next/navigation";
import { AdminSubmissionDetailView } from "@/components/admin/AdminSubmissionDetailView";
import { getAdminSubmission } from "@/lib/submissionDetails";

interface AdminSubmissionDetailPageProps {
    params: Promise<{ submissionId: string }>;
}

export default async function AdminSubmissionDetailPage({ params }: AdminSubmissionDetailPageProps) {
    const { submissionId } = await params;
    const submission = getAdminSubmission(Number(submissionId));
    if (!submission) notFound();
    return <AdminSubmissionDetailView submission={submission} />;
}