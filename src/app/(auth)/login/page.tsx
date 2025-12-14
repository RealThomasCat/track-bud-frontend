import { PublicRoute } from "@/components/auth/PublicRoute";
import { LoginForm } from "@/modules/auth/components/LoginForm";

export default function Page() {
    return (
        <PublicRoute>
            <LoginForm />
        </PublicRoute>
    );
}
