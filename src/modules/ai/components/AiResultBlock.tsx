"use client";

import { ReactNode } from "react";

type AiResultBlockProps = {
    children: ReactNode;
};

export function AiResultBlock({ children }: AiResultBlockProps) {
    return (
        <div className="rounded-lg border border-neutral-800 bg-neutral-950/30 p-5">
            {children}
        </div>
    );
}

export function AiResultSection({
    title,
    children,
}: {
    title: string;
    children: ReactNode;
}) {
    return (
        <section className="space-y-2">
            <h3 className="text-xs font-semibold uppercase text-neutral-400">
                {title}
            </h3>
            {children}
        </section>
    );
}
