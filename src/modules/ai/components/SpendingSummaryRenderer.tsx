"use client";

import { SpendingSummaryData } from "../schemas/ai.schemas";

export function SpendingSummaryRenderer({
    data,
}: {
    data: SpendingSummaryData;
}) {
    return (
        <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-4 space-y-4">
            <h3 className="text-neutral-100 font-semibold text-sm">Summary</h3>
            <p className="text-neutral-300 text-sm leading-relaxed">
                {data.summary}
            </p>

            <h3 className="text-neutral-100 font-semibold text-sm">Insights</h3>
            {data.insights.length ? (
                <ul className="list-disc pl-5 space-y-1 text-neutral-300 text-sm">
                    {data.insights.map((item, i) => (
                        <li key={i}>{item}</li>
                    ))}
                </ul>
            ) : (
                <p className="text-neutral-400 text-sm">
                    No spending insights are available for this period.
                </p>
            )}
        </div>
    );
}
