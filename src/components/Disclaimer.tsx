import { ShieldAlert } from "lucide-react";

interface DisclaimerProps {
    variant?: "inline" | "banner";
}

export default function Disclaimer({ variant = "inline" }: DisclaimerProps) {
    if (variant === "banner") {
        return (
            <div className="w-full p-4 rounded-2xl" style={{ background: 'var(--status-borderline-bg)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                <div className="flex items-start gap-3">
                    <ShieldAlert size={18} className="mt-0.5 shrink-0" style={{ color: 'var(--status-borderline)' }} />
                    <div>
                        <p className="text-sm font-semibold mb-1" style={{ color: 'var(--status-borderline)' }}>
                            Important Disclaimer
                        </p>
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                            MedExplain provides simplified explanations for educational purposes only.
                            It does not diagnose conditions or recommend treatments.
                            Always consult a qualified healthcare professional for medical advice.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <p className="inline-flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
            <ShieldAlert size={12} />
            For educational purposes only — not a substitute for medical advice.
        </p>
    );
}
