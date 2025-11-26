"use client";

import { useState } from "react";
import { AiSectionCard } from "./AiSectionCard";
import { AiResponse, SavingRecommendationsData } from "../schema/ai.schemas";
import { AiService } from "../services/ai.service";
import { SavingRecommendationsRenderer } from "./SavingRecommendationsRenderer";

export function AiSavingRecommendations() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] =
        useState<AiResponse<SavingRecommendationsData> | null>(null);

    const generate = async () => {
        try {
            setLoading(true);
            const res = await AiService.getSavingRecommendations();
            setResult(res);
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
        >
            {Boolean(result?.data) && (
                <SavingRecommendationsRenderer data={result!.data!} />
            )}
        </AiSectionCard>
    );
}
