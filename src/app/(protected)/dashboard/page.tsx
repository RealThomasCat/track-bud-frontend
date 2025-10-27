"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/modules/auth/store/authStore";
import { Button } from "@/components/ui/Button";

export default function Dashboard() {
    const router = useRouter();

    // Access auth store values + actions
    const { user, loading, fetchMe, logout } = useAuthStore();

    // First useEffect:
    // Runs once when component mounts.
    // Purpose: If user data is not already available (e.g., after reload),
    // call /auth/me to restore session.
    useEffect(() => {
        if (!user) {
            fetchMe();
        }
    }, [user, fetchMe]);

    // Second useEffect:
    // Runs whenever `loading` or `user` changes.
    // Purpose: If fetchMe has finished (`loading=false`) but still no user,
    // it means the session is invalid → redirect to /login.
    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [loading, user, router]);

    // Show loading state while fetching user data
    if (loading || !user) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p>Loading...</p>
            </div>
        );
    }

    // Dashboard UI
    return (
        <div className="p-10">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <p>Welcome, {user.name}!</p>

            <Button
                variant="primary"
                className="max-w-24"
                onClick={async () => {
                    await logout();
                    router.push("/login");
                }}
            >
                Logout
            </Button>
        </div>
    );
}
