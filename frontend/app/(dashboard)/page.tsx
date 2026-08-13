// app/(dashboard)/page.tsx
import { currentUser } from "@/lib/currentUser";
import { AdminDashboardView } from "@/components/admin/AdminDashboardView";
import { ClassesSection } from "@/components/home/ClassesSection";
import { DueSoonCard } from "@/components/home/DueSoonCard";

export default function DashboardHomePage() {
    const isAdmin = currentUser.role === "Admin";

    if (isAdmin) {
        return <AdminDashboardView />;
    }

    return (
        <div className="mx-auto w-full max-w-[1080px] px-4 py-6 sm:px-8">
            <div className="flex flex-col gap-6">
                <DueSoonCard />
                <ClassesSection />
            </div>
        </div>
    );
}