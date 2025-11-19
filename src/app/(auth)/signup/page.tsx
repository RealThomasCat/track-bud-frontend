import { PublicRoute } from "@/components/auth/PublicRoute";
import { SignupForm } from "@/modules/auth/components/SignupForm";

export default function Page() {
    return (
        <PublicRoute>
            <SignupForm />
        </PublicRoute>
    );
}
