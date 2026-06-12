"use client";

import { useState } from "react";
import { AiSectionCard } from "./AiSectionCard";
import { AiResponse, ForecastData } from "../schemas/ai.schemas";
import { AiService } from "../services/ai.service";
import { ForecastRenderer } from "./ForecastRenderer";
import { extractErrorMessage } from "@/lib/utils";

export function AiForecast() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<AiResponse<ForecastData> | null>(null);

    const generate = async () => {
        if (loading) return;

        try {
            setLoading(true);
            setError(null);
            const res = await AiService.getForecast();
            setResult(res);
        } catch (err: unknown) {
            setError(extractErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <AiSectionCard
            title="Financial Forecast"
            description="Predict your future spending and cashflow trends."
            loading={loading}
            onGenerate={generate}
            error={error}
        >
            {Boolean(result?.data) && <ForecastRenderer data={result!.data!} />}
        </AiSectionCard>
    );
}
