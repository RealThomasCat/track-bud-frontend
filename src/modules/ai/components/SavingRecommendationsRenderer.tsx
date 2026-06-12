"use client";

import { SavingRecommendationsData } from "../schemas/ai.schemas";

export function SavingRecommendationsRenderer({
    data,
}: {
    data: SavingRecommendationsData;
}) {
    return (
        <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-4 space-y-4">
            <h3 className="text-neutral-100 font-semibold text-sm">
                Saving Tips
            </h3>

            <ul className="list-disc pl-5 space-y-2 text-neutral-300 text-sm leading-relaxed">
                {data.tips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                ))}
            </ul>
        </div>
    );
}
