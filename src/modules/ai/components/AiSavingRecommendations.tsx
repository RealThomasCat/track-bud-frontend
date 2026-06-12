"use client";

import { useState } from "react";
import { AiSectionCard } from "./AiSectionCard";
import { AiResponse, SavingRecommendationsData } from "../schemas/ai.schemas";
import { AiService } from "../services/ai.service";
import { SavingRecommendationsRenderer } from "./SavingRecommendationsRenderer";
import { extractErrorMessage } from "@/lib/utils";

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

    return (
        <AiSectionCard
            title="Saving Recommendations"
            description="Get personalized suggestions to maximize your savings."
            loading={loading}
            onGenerate={generate}
            error={error}
        >
            {Boolean(result?.data) && (
                <SavingRecommendationsRenderer data={result!.data!} />
            )}
        </AiSectionCard>
    );
}
