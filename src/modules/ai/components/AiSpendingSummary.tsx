"use client";

import { useState } from "react";
import { AiSectionCard } from "./AiSectionCard";
import { AiResponse, SpendingSummaryData } from "../schema/ai.schemas";
import { AiService } from "../services/ai.service";
import { SpendingSummaryRenderer } from "./SpendingSummaryRenderer";

export function AiSpendingSummary() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] =
        useState<AiResponse<SpendingSummaryData> | null>(null);

    const generate = async () => {
        try {
            setLoading(true);
            const res = await AiService.getSpendingSummary();
            setResult(res);
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
        >
            {Boolean(result?.data) && (
                <SpendingSummaryRenderer data={result!.data!} />
            )}
        </AiSectionCard>
    );
}
