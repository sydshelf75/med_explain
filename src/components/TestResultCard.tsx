"use client";

import { TrendingDown, TrendingUp, CheckCircle, AlertTriangle } from "lucide-react";
import type { TestStatus } from "@/lib/explanationEngine";

interface TestResultCardProps {
    testName: string;
    patientValue: number;
    unit: string;
    normalRange: { low: number; high: number };
    status: TestStatus;
    explanation: string;
    index?: number;
}

const STATUS_CONFIG: Record<
    TestStatus,
    {
        label: string;
        color: string;
        bgColor: string;
        icon: typeof CheckCircle;
    }
> = {
    normal: {
        label: "Normal",
        color: "var(--status-normal)",
        bgColor: "var(--status-normal-bg)",
        icon: CheckCircle,
    },
    low: {
        label: "Low",
        color: "var(--status-abnormal)",
        bgColor: "var(--status-abnormal-bg)",
        icon: TrendingDown,
    },
    high: {
        label: "High",
        color: "var(--status-abnormal)",
        bgColor: "var(--status-abnormal-bg)",
        icon: TrendingUp,
    },
    borderline: {
        label: "Borderline",
        color: "var(--status-borderline)",
        bgColor: "var(--status-borderline-bg)",
        icon: AlertTriangle,
    },
};

export default function TestResultCard({
    testName,
    patientValue,
    unit,
    normalRange,
    status,
    explanation,
    index = 0,
}: TestResultCardProps) {
    const config = STATUS_CONFIG[status];
    const StatusIcon = config.icon;

    return (
        <div
            className="animate-fade-in-up rounded-2xl overflow-hidden transition-all duration-300 hover:translate-y-[-2px]"
            style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-md)',
                animationDelay: `${index * 0.1}s`,
                opacity: 0,
                animationFillMode: 'forwards',
            }}
        >
            {/* Header bar with status color */}
            <div className="h-1" style={{ background: config.color }} />

            <div className="p-5">
                {/* Test name + status badge */}
                <div className="flex items-start justify-between gap-3 mb-4">
                    <h3 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
                        {testName}
                    </h3>
                    <span
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold shrink-0"
                        style={{ background: config.bgColor, color: config.color }}
                    >
                        <StatusIcon size={13} />
                        {config.label}
                    </span>
                </div>

                {/* Values */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-3 rounded-xl" style={{ background: 'var(--background)' }}>
                        <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                            Your Value
                        </p>
                        <p className="text-lg font-bold" style={{ color: config.color }}>
                            {patientValue} <span className="text-xs font-normal" style={{ color: 'var(--text-muted)' }}>{unit}</span>
                        </p>
                    </div>
                    <div className="p-3 rounded-xl" style={{ background: 'var(--background)' }}>
                        <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                            Normal Range
                        </p>
                        <p className="text-lg font-bold" style={{ color: 'var(--text-secondary)' }}>
                            {normalRange.low}–{normalRange.high}{" "}
                            <span className="text-xs font-normal" style={{ color: 'var(--text-muted)' }}>{unit}</span>
                        </p>
                    </div>
                </div>

                {/* Visual range bar */}
                <div className="mb-4">
                    <RangeBar
                        value={patientValue}
                        low={normalRange.low}
                        high={normalRange.high}
                        statusColor={config.color}
                    />
                </div>

                {/* Explanation */}
                <div className="p-4 rounded-xl" style={{ background: 'var(--background)', borderLeft: `3px solid ${config.color}` }}>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
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
    // Calculate the bar range with padding
    const padding = (high - low) * 0.5;
    const barMin = Math.max(0, low - padding);
    const barMax = high + padding;
    const barRange = barMax - barMin;

    const normalStart = ((low - barMin) / barRange) * 100;
    const normalWidth = ((high - low) / barRange) * 100;
    const valuePos = Math.min(
        100,
        Math.max(0, ((value - barMin) / barRange) * 100)
    );

    return (
        <div className="relative h-2 rounded-full overflow-hidden" style={{ background: 'var(--border-light)' }}>
            {/* Normal range zone */}
            <div
                className="absolute top-0 h-full rounded-full opacity-30"
                style={{
                    left: `${normalStart}%`,
                    width: `${normalWidth}%`,
                    background: 'var(--status-normal)',
                }}
            />
            {/* Value marker */}
            <div
                className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 transition-all duration-500"
                style={{
                    left: `${valuePos}%`,
                    transform: `translate(-50%, -50%)`,
                    background: statusColor,
                    borderColor: 'var(--surface)',
                    boxShadow: `0 0 8px ${statusColor}`,
                }}
            />
        </div>
    );
}
