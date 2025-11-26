"use client";

import { useState } from "react";
import { AiSectionCard } from "./AiSectionCard";
import { AiResponse, ForecastData } from "../schema/ai.schemas";
import { AiService } from "../services/ai.service";
import { ForecastRenderer } from "./ForecastRenderer";

export function AiForecast() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<AiResponse<ForecastData> | null>(null);

    const generate = async () => {
        try {
            setLoading(true);
            const res = await AiService.getForecast();
            setResult(res);
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
        >
            {Boolean(result?.data) && <ForecastRenderer data={result!.data!} />}
        </AiSectionCard>
    );
}
