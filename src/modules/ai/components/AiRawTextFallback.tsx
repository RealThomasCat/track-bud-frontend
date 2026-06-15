"use client";

import { AiResultBlock, AiResultSection } from "./AiResultBlock";

type AiRawTextFallbackProps = {
    text: string;
};

export function AiRawTextFallback({ text }: AiRawTextFallbackProps) {
    return (
        <AiResultBlock>
            <AiResultSection title="AI Response">
                <p className="text-neutral-300 text-sm leading-6 whitespace-pre-line">
                    {text}
                </p>
            </AiResultSection>
        </AiResultBlock>
    );
}
