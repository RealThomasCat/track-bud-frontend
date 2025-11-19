import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardContent } from "@/modules/dashboard/components/DashboardContent";

export default function DashboardPage() {
    return (
        <ProtectedRoute>
            <DashboardContent />
        </ProtectedRoute>
    );
}
