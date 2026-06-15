"use client";

import { SpendingSummaryData } from "../schemas/ai.schemas";
import { AiResultBlock, AiResultSection } from "./AiResultBlock";

export function SpendingSummaryRenderer({
    data,
}: {
    data: SpendingSummaryData;
}) {
    return (
        <AiResultBlock>
            <div className="space-y-5">
                <AiResultSection title="Summary">
                    <p className="text-neutral-300 text-sm leading-6">
                        {data.summary}
                    </p>
                </AiResultSection>

                <AiResultSection title="Insights">
                    {data.insights.length ? (
                        <ul className="list-disc pl-4 space-y-2 text-neutral-300 text-sm leading-6 marker:text-neutral-500">
                            {data.insights.map((item, i) => (
                                <li key={i} className="pl-1">
                                    {item}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-neutral-400 text-sm">
                            No spending insights are available for this period.
                        </p>
                    )}
                </AiResultSection>
            </div>
        </AiResultBlock>
    );
}
