"use client";

import { useState } from "react";
import { AiSectionCard } from "./AiSectionCard";
import { AiResponse, SavingRecommendationsData } from "../schemas/ai.schemas";
import { AiService } from "../services/ai.service";
import { SavingRecommendationsRenderer } from "./SavingRecommendationsRenderer";
import { extractErrorMessage } from "@/lib/utils";
import { AiRawTextFallback } from "./AiRawTextFallback";

export function AiSavingRecommendations() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] =
        useState<AiResponse<SavingRecommendationsData> | null>(null);

    const generate = async () => {
        if (loading) return;

        try {
            setLoading(true);
            setError(null);
            const res = await AiService.getSavingRecommendations();
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
            title="Saving Recommendations"
            description="Get personalized suggestions to maximize your savings."
            loading={loading}
            onGenerate={generate}
            actionLabel={actionLabel}
            showAction={!hasResult || Boolean(error)}
            error={error}
        >
            {loading && (
                <p className="text-neutral-400 text-sm">
                    Generating saving recommendations...
                </p>
            )}

            {!loading && !result && (
                <p className="text-neutral-400 text-sm">
                    No saving recommendations generated yet.
                </p>
            )}

            {!loading && Boolean(result?.data) && (
                <SavingRecommendationsRenderer data={result!.data!} />
            )}

            {!loading && !result?.data && result?.rawText && (
                <AiRawTextFallback text={result.rawText} />
            )}

            {!loading && result && !result.data && !result.rawText && (
                <p className="text-neutral-400 text-sm">
                    No saving recommendations were returned for this period.
                </p>
            )}
        </AiSectionCard>
    );
}
