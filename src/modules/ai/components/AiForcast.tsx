"use client";

import { useState } from "react";
import { AiSectionCard } from "./AiSectionCard";
import { AiResponse, ForecastData } from "../schemas/ai.schemas";
import { AiService } from "../services/ai.service";
import { ForecastRenderer } from "./ForecastRenderer";
import { extractErrorMessage } from "@/lib/utils";
import { AiRawTextFallback } from "./AiRawTextFallback";

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

    const hasResult = Boolean(result);
    const actionLabel = error ? "Retry" : "Generate";

    return (
        <AiSectionCard
            title="Financial Forecast"
            description="Predict your future spending and cashflow trends."
            loading={loading}
            onGenerate={generate}
            actionLabel={actionLabel}
            showAction={!hasResult || Boolean(error)}
            error={error}
        >
            {loading && (
                <p className="text-neutral-400 text-sm">
                    Generating financial forecast...
                </p>
            )}

            {!loading && !result && (
                <p className="text-neutral-400 text-sm">
                    No financial forecast generated yet.
                </p>
            )}

            {!loading && Boolean(result?.data) && (
                <ForecastRenderer data={result!.data!} />
            )}

            {!loading && !result?.data && result?.rawText && (
                <AiRawTextFallback text={result.rawText} />
            )}

            {!loading && result && !result.data && !result.rawText && (
                <p className="text-neutral-400 text-sm">
                    No financial forecast was returned for this period.
                </p>
            )}
        </AiSectionCard>
    );
}
