"use client";

import { ForecastData } from "../schemas/ai.schemas";
import { AiResultBlock, AiResultSection } from "./AiResultBlock";

export function ForecastRenderer({ data }: { data: ForecastData }) {
    return (
        <AiResultBlock>
            <div className="space-y-5">
                <AiResultSection title="Forecast">
                    <p className="text-neutral-300 text-sm leading-6">
                        {data.forecastText}
                    </p>
                </AiResultSection>

                <AiResultSection title="Expected Change">
                    <p className="text-emerald-400 font-medium text-sm">
                        {data.expectedChange}
                    </p>
                </AiResultSection>
            </div>
        </AiResultBlock>
    );
}
