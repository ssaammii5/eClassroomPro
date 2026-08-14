import { apiFetch } from "./client";

export interface AssignmentDto {
    id: number;
    courseId: number;
    courseName: string | null;
    subject: string | null;
    program: string | null;
    department: string | null;
    session: string | null;
    title: string;
    description: string;
    deadlineUtc: string;
    maxMarks: number;
    status: string;
    createdById: number;
    createdByName: string | null;
    createdAtUtc: string;
    submissionCount: number;
}

export interface CreateAssignmentPayload {
    courseId: number;
    title: string;
    description: string;
    deadlineUtc: string;
    maxMarks: number;
}

export interface UpdateAssignmentPayload {
    title: string;
    description: string;
    deadlineUtc: string;
    maxMarks: number;
}

export function getAssignmentsRequest(): Promise<AssignmentDto[]> {
    return apiFetch<AssignmentDto[]>("/api/assignments", { method: "GET" });
}

export function getAssignmentRequest(id: number): Promise<AssignmentDto> {
    return apiFetch<AssignmentDto>(`/api/assignments/${id}`, { method: "GET" });
}

export function createAssignmentRequest(payload: CreateAssignmentPayload): Promise<{ id: number }> {
    return apiFetch<{ id: number }>("/api/assignments", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export function updateAssignmentRequest(id: number, payload: UpdateAssignmentPayload): Promise<void> {
    return apiFetch<void>(`/api/assignments/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
}

export function deleteAssignmentRequest(id: number): Promise<void> {
    return apiFetch<void>(`/api/assignments/${id}`, { method: "DELETE" });
}

export function publishAssignmentRequest(id: number): Promise<void> {
    return apiFetch<void>(`/api/assignments/${id}/publish`, { method: "POST" });
}