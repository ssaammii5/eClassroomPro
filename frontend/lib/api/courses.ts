import { apiFetch } from "./client";

export interface CourseDto {
    id: number;
    name: string;
    subject: string;
    program: string;
    department: string;
    session: string;
    isActive: boolean;
    teacherId: number | null;
    teacherName: string | null;
    teacherIds: number[];
    teacherNames: string[];
    studentIds: number[];
    studentCount: number;
}

export interface CoursePayload {
    name: string;
    subject?: string;
    program: string;
    department: string;
    session: string;
    isActive: boolean;
    teacherIds: number[];
    studentIds: number[];
}

export function getCoursesRequest(): Promise<CourseDto[]> {
    return apiFetch<CourseDto[]>("/api/courses", { method: "GET" });
}

export function createCourseRequest(payload: CoursePayload): Promise<CourseDto> {
    return apiFetch<CourseDto>("/api/courses", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export function updateCourseRequest(id: number, payload: CoursePayload): Promise<void> {
    return apiFetch<void>(`/api/courses/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
}

export function deleteCourseRequest(id: number): Promise<void> {
    return apiFetch<void>(`/api/courses/${id}`, { method: "DELETE" });
}