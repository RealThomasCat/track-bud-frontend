"use client";

import { SavingRecommendationsData } from "../schemas/ai.schemas";
import { AiResultBlock, AiResultSection } from "./AiResultBlock";

export function SavingRecommendationsRenderer({
    data,
}: {
    data: SavingRecommendationsData;
}) {
    return (
        <AiResultBlock>
            <div className="space-y-5">
                <AiResultSection title="Summary">
                    <p className="text-neutral-300 text-sm leading-6">
                        {data.summary}
                    </p>
                </AiResultSection>

                <AiResultSection title="Saving Tips">
                    {data.tips.length ? (
                        <ul className="list-disc pl-4 space-y-2 text-neutral-300 text-sm leading-6 marker:text-neutral-500">
                            {data.tips.map((tip, i) => (
                                <li key={i} className="pl-1">
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-neutral-400 text-sm">
                            No saving tips are available for this period.
                        </p>
                    )}
                </AiResultSection>
            </div>
        </AiResultBlock>
    );
}
