"use client";

import { TrendingDown, TrendingUp, CheckCircle, AlertTriangle, Info } from "lucide-react";
import type { TestStatus } from "@/lib/explanationEngine";
import { useTranslation } from "@/i18n/I18nProvider";

interface TestResultCardProps {
    testName: string;
    patientValue: number;
    unit: string;
    normalRange: { low: number; high: number };
    status: TestStatus;
    explanation: string;
    index?: number;
}

export default function TestResultCard({
    testName,
    patientValue,
    unit,
    normalRange,
    status,
    explanation,
    index = 0,
}: TestResultCardProps) {
    const { t } = useTranslation();

    const STATUS_CONFIG: Record<
        TestStatus,
        {
            label: string;
            color: string;
            bgColor: string;
            icon: typeof CheckCircle;
            gradient: string;
        }
    > = {
        normal: {
            label: t("testCard.normal"),
            color: "var(--status-normal)",
            bgColor: "var(--status-normal-bg)",
            icon: CheckCircle,
            gradient: "linear-gradient(135deg, rgba(34,197,94,0.08), rgba(34,197,94,0.02))",
        },
        low: {
            label: t("testCard.low"),
            color: "var(--status-abnormal)",
            bgColor: "var(--status-abnormal-bg)",
            icon: TrendingDown,
            gradient: "linear-gradient(135deg, rgba(239,68,68,0.08), rgba(239,68,68,0.02))",
        },
        high: {
            label: t("testCard.high"),
            color: "var(--status-abnormal)",
            bgColor: "var(--status-abnormal-bg)",
            icon: TrendingUp,
            gradient: "linear-gradient(135deg, rgba(239,68,68,0.08), rgba(239,68,68,0.02))",
        },
        borderline: {
            label: t("testCard.borderline"),
            color: "var(--status-borderline)",
            bgColor: "var(--status-borderline-bg)",
            icon: AlertTriangle,
            gradient: "linear-gradient(135deg, rgba(245,158,11,0.08), rgba(245,158,11,0.02))",
        },
    };

    const config = STATUS_CONFIG[status];
    const StatusIcon = config.icon;

    return (
        <div
            className="animate-fade-in-up rounded-2xl overflow-hidden transition-all duration-300 hover:translate-y-[-2px]"
            style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-lg)',
                animationDelay: `${index * 0.1}s`,
                opacity: 0,
                animationFillMode: 'forwards',
            }}
        >
            {/* Accent gradient bar */}
            <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${config.color}, transparent)` }} />

            <div className="flex flex-col lg:flex-row">
                {/* Left Panel — Data & Visualization */}
                <div className="flex-1 p-6 lg:p-8" style={{ background: config.gradient }}>
                    {/* Header: test name + status */}
                    <div className="flex items-start justify-between gap-3 mb-6">
                        <h3 className="text-xl font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>
                            {testName}
                        </h3>
                        <span
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 uppercase tracking-wide"
                            style={{ background: config.bgColor, color: config.color }}
                        >
                            <StatusIcon size={14} />
                            {config.label}
                        </span>
                    </div>

                    {/* Large Value Display */}
                    <div className="flex items-end gap-6 mb-6">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
                                {t("testCard.yourResult")}
                            </p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-extrabold tabular-nums" style={{ color: config.color }}>
                                    {patientValue}
                                </span>
                                <span className="text-base font-medium" style={{ color: 'var(--text-muted)' }}>
                                    {unit}
                                </span>
                            </div>
                        </div>
                        <div className="pb-1.5">
                            <p className="text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
                                {t("testCard.normalRange")}
                            </p>
                            <span className="text-2xl font-bold tabular-nums" style={{ color: 'var(--text-secondary)' }}>
                                {normalRange.low}–{normalRange.high}
                            </span>
                            <span className="text-sm font-medium ml-1.5" style={{ color: 'var(--text-muted)' }}>
                                {unit}
                            </span>
                        </div>
                    </div>

                    {/* Range Bar */}
                    <div>
                        <RangeBar
                            value={patientValue}
                            low={normalRange.low}
                            high={normalRange.high}
                            statusColor={config.color}
                        />
                    </div>
                </div>

                {/* Right Panel — Explanation */}
                <div
                    className="lg:w-[380px] xl:w-[420px] p-6 lg:p-8 flex flex-col justify-center"
                    style={{
                        borderLeft: '1px solid var(--border)',
                        borderTop: 'none',
                        background: 'var(--background)',
                    }}
                >
                    <div className="flex items-center gap-2 mb-3">
                        <Info size={15} style={{ color: config.color }} />
                        <p className="text-xs font-bold uppercase tracking-wider" style={{ color: config.color }}>
                            {t("testCard.whatThisMeans")}
                        </p>
                    </div>
                    <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {explanation}
                    </p>
                </div>
            </div>
        </div>
    );
}

function RangeBar({
    value,
    low,
    high,
    statusColor,
}: {
    value: number;
    low: number;
    high: number;
    statusColor: string;
}) {
    const { t } = useTranslation();
    const padding = (high - low) * 0.5;
    const barMin = Math.max(0, low - padding);
    const barMax = high + padding;
    const barRange = barMax - barMin;

    const normalStart = ((low - barMin) / barRange) * 100;
    const normalWidth = ((high - low) / barRange) * 100;
    const valuePos = Math.min(100, Math.max(0, ((value - barMin) / barRange) * 100));

    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                    {barMin.toFixed(0)}
                </span>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{
                    color: 'var(--status-normal)',
                    background: 'var(--status-normal-bg)',
                }}>
                    {t("rangeBar.normal")} {low}–{high}
                </span>
                <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                    {barMax.toFixed(0)}
                </span>
            </div>
            <div className="relative h-3 rounded-full overflow-hidden" style={{ background: 'var(--border-light)' }}>
                {/* Normal range zone */}
                <div
                    className="absolute top-0 h-full rounded-full"
                    style={{
                        left: `${normalStart}%`,
                        width: `${normalWidth}%`,
                        background: 'var(--status-normal)',
                        opacity: 0.2,
                    }}
                />
                {/* Value marker */}
                <div
                    className="absolute top-1/2 w-4 h-4 rounded-full border-2 transition-all duration-700"
                    style={{
                        left: `${valuePos}%`,
                        transform: 'translate(-50%, -50%)',
                        background: statusColor,
                        borderColor: 'var(--surface)',
                        boxShadow: `0 0 10px ${statusColor}, 0 0 20px ${statusColor}40`,
                    }}
                />
            </div>
        </div>
    );
}
