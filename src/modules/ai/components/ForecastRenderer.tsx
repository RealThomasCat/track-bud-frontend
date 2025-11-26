"use client";

import { ForecastData } from "../schema/ai.schemas";

export function ForecastRenderer({ data }: { data: ForecastData }) {
    return (
        <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-4 space-y-4">
            <h3 className="text-neutral-100 font-semibold text-sm">
                AI Forecast
            </h3>

            <p className="text-neutral-300 text-sm leading-relaxed">
                {data.forecastText}
            </p>

            <div className="mt-2">
                <span className="text-neutral-400 text-xs uppercase">
                    Expected Change:
                </span>
                <div className="text-emerald-400 font-medium text-sm">
                    {data.expectedChange}
                </div>
            </div>
        </div>
    );
}
