"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/modules/auth/store/auth.store";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { user, loading } = useAuthStore();

    // Only redirect AFTER loading finishes
    useEffect(() => {
        if (!loading && !user) {
            router.replace("/login");
        }
    }, [loading, user, router]);

    // While checking auth → show nothing
    if (loading) return null;

    // If user is null after loading → redirect is happening
    if (!user) return null;

    return <>{children}</>;
}
