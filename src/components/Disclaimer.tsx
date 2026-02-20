"use client";

import { ShieldAlert } from "lucide-react";
import { useTranslation } from "@/i18n/I18nProvider";

interface DisclaimerProps {
    variant?: "inline" | "banner";
}

export default function Disclaimer({ variant = "inline" }: DisclaimerProps) {
    const { t } = useTranslation();

    if (variant === "banner") {
        return (
            <div className="w-full p-4 rounded-2xl" style={{ background: 'var(--status-borderline-bg)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                <div className="flex items-start gap-3">
                    <ShieldAlert size={18} className="mt-0.5 shrink-0" style={{ color: 'var(--status-borderline)' }} />
                    <div>
                        <p className="text-sm font-semibold mb-1" style={{ color: 'var(--status-borderline)' }}>
                            {t("disclaimer.bannerTitle")}
                        </p>
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                            {t("disclaimer.bannerText")}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <p className="inline-flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
            <ShieldAlert size={12} />
            {t("disclaimer.inline")}
        </p>
    );
}
