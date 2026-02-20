import { ShieldAlert } from "lucide-react";

export default function Footer() {
    return (
        <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--surface)' }}>
            <div className="mx-auto max-w-6xl px-6 py-8">
                {/* Disclaimer */}
                <div className="flex items-start gap-3 mb-6 p-4 rounded-xl" style={{ background: 'var(--status-borderline-bg)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                    <ShieldAlert size={20} className="mt-0.5 shrink-0" style={{ color: 'var(--status-borderline)' }} />
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        <strong>Disclaimer:</strong> MedExplain is an educational tool only. It does not provide medical diagnoses,
                        treatment advice, or professional medical opinions. Always consult a qualified healthcare provider for
                        medical concerns. The explanations provided are simplified and may not capture the full clinical context.
                    </p>
                </div>

                {/* Footer info */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        © {new Date().getFullYear()} MedExplain — Understand your reports clearly.
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        Translations powered by{" "}
                        <a
                            href="https://lingo.dev"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline transition-colors"
                            style={{ color: 'var(--primary)' }}
                        >
                            lingo.dev
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
