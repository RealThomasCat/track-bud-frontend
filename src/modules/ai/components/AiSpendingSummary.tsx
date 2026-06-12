"use client";

import { useState } from "react";
import { AiSectionCard } from "./AiSectionCard";
import { AiResponse, SpendingSummaryData } from "../schema/ai.schemas";
import { AiService } from "../services/ai.service";
import { SpendingSummaryRenderer } from "./SpendingSummaryRenderer";
import { extractErrorMessage } from "@/lib/utils";

export function AiSpendingSummary() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] =
        useState<AiResponse<SpendingSummaryData> | null>(null);

    const generate = async () => {
        if (loading) return;

        try {
            setLoading(true);
            setError(null);
            const res = await AiService.getSpendingSummary();
            setResult(res);
        } catch (err: unknown) {
            setError(extractErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <AiSectionCard
            title="Spending Summary"
            description="Get an AI-powered overview of your spending trends."
            loading={loading}
            onGenerate={generate}
            error={error}
        >
            {Boolean(result?.data) && (
                <SpendingSummaryRenderer data={result!.data!} />
            )}
        </AiSectionCard>
    );
}
