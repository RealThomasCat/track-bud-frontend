"use client";

import { useState } from "react";
import { AiSectionCard } from "./AiSectionCard";
import { AiResponse, SpendingSummaryData } from "../schemas/ai.schemas";
import { AiService } from "../services/ai.service";
import { SpendingSummaryRenderer } from "./SpendingSummaryRenderer";
import { extractErrorMessage } from "@/lib/utils";
import { AiRawTextFallback } from "./AiRawTextFallback";

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

    const hasResult = Boolean(result);
    const actionLabel = error ? "Retry" : "Generate";

    return (
        <AiSectionCard
            title="Spending Summary"
            description="Get an AI-powered overview of your spending trends."
            loading={loading}
            onGenerate={generate}
            actionLabel={actionLabel}
            showAction={!hasResult || Boolean(error)}
            error={error}
        >
            {loading && (
                <p className="text-neutral-400 text-sm">
                    Generating spending summary...
                </p>
            )}

            {!loading && !result && (
                <p className="text-neutral-400 text-sm">
                    No spending summary generated yet.
                </p>
            )}

            {!loading && Boolean(result?.data) && (
                <SpendingSummaryRenderer data={result!.data!} />
            )}

            {!loading && !result?.data && result?.rawText && (
                <AiRawTextFallback text={result.rawText} />
            )}

            {!loading && result && !result.data && !result.rawText && (
                <p className="text-neutral-400 text-sm">
                    No spending summary was returned for this period.
                </p>
            )}
        </AiSectionCard>
    );
}
