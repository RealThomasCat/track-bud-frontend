"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/Button";

type AiSectionCardProps = {
    title: string;
    description: string;
    loading: boolean;
    onGenerate: () => void;
    children?: ReactNode;
};

export function AiSectionCard({
    title,
    description,
    loading,
    onGenerate,
    children,
}: AiSectionCardProps) {
    return (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 mt-6">
            <div className="flex flex-col md:flex-row gap-4 md:gap-0 justify-between md:items-center">
                <div>
                    <h2 className="text-lg font-semibold text-neutral-100">
                        {title}
                    </h2>
                    <p className="text-sm text-neutral-400">{description}</p>
                </div>

                <Button
                    variant="primary"
                    className="md:max-w-40"
                    disabled={loading}
                    onClick={onGenerate}
                >
                    {loading ? "Generating..." : "Generate"}
                </Button>
            </div>

            {children && <div className="mt-4">{children}</div>}
        </div>
    );
}
