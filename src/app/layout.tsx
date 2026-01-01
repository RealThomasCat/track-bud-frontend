import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthInitializer } from "@/components/auth/AuthInitializer";

export const metadata: Metadata = {
    title: "TrackBud",
    description:
        "Expense Tracker App - Monitor and manage your finances efficiently",
};

export const viewport: Viewport = {
    colorScheme: "dark",
    themeColor: "#121212",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark">
            <body className="antialiased bg-neutral-900 text-neutral-100">
                {/* Client-side auth (fetchUser) lives here */}
                <AuthInitializer />
                {children}
            </body>
        </html>
    );
}
