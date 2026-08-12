import { SettingsView } from "@/components/settings/SettingsView";
import { currentUser } from "@/lib/currentUser";

export default function SettingsPage() {
    return <SettingsView userName={currentUser.name} role={currentUser.role} />;
}