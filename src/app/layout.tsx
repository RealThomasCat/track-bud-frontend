import type { Metadata } from "next";
import "./globals.css";
import { AuthInitializer } from "@/components/auth/AuthInitializer";

export const metadata: Metadata = {
    title: "TrackBud",
    description:
        "Expense Tracker App - Monitor and manage your finances efficiently",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="antialiased">
                {/* Client-side auth (fetchUser) lives here */}
                <AuthInitializer />
                {children}
            </body>
        </html>
    );
}
