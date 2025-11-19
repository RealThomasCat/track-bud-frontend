"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/modules/auth/store/auth.store";

export function AuthInitializer() {
    const fetchUser = useAuthStore((s) => s.fetchUser);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    return null;
}
