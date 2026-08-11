import { ClassesSection } from "@/components/home/ClassesSection";
import { DueSoonCard } from "@/components/home/DueSoonCard";

export default function StudentHomePage() {
    return (
        <div className="mx-auto w-full max-w-[1080px] px-4 py-6 sm:px-8">
            <div className="flex flex-col gap-6">
                <DueSoonCard />
                <ClassesSection />
            </div>
        </div>
    );
}