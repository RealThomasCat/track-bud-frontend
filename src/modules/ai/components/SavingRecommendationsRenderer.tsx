"use client";

import { SavingRecommendationsData } from "../schemas/ai.schemas";

export function SavingRecommendationsRenderer({
    data,
}: {
    data: SavingRecommendationsData;
}) {
    return (
        <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-4 space-y-4">
            <div>
                <h3 className="text-neutral-100 font-semibold text-sm">
                    Summary
                </h3>
                <p className="text-neutral-300 text-sm leading-relaxed mt-2">
                    {data.summary}
                </p>
            </div>

            <h3 className="text-neutral-100 font-semibold text-sm">
                Saving Tips
            </h3>

            {data.tips.length ? (
                <ul className="list-disc pl-5 space-y-2 text-neutral-300 text-sm leading-relaxed">
                    {data.tips.map((tip, i) => (
                        <li key={i}>{tip}</li>
                    ))}
                </ul>
            ) : (
                <p className="text-neutral-400 text-sm">
                    No saving tips are available for this period.
                </p>
            )}
        </div>
    );
}
