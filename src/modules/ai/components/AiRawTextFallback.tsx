"use client";

type AiRawTextFallbackProps = {
    text: string;
};

export function AiRawTextFallback({ text }: AiRawTextFallbackProps) {
    return (
        <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-4">
            <h3 className="text-neutral-100 font-semibold text-sm">
                AI Response
            </h3>
            <p className="text-neutral-300 text-sm leading-relaxed mt-3 whitespace-pre-line">
                {text}
            </p>
        </div>
    );
}
