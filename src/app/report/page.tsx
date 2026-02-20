"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Upload,
    Loader2,
    FileWarning,
    ArrowLeft,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Disclaimer from "@/components/Disclaimer";
import LanguageSelector from "@/components/LanguageSelector";
import TestResultCard from "@/components/TestResultCard";
import type { LanguageCode } from "@/lib/medicalDictionary";
import type { TestStatus } from "@/lib/explanationEngine";

interface TestResult {
    testName: string;
    patientValue: number;
    unit: string;
    normalRange: { low: number; high: number };
    status: TestStatus;
    explanation: string;
}

interface AnalysisResults {
    tests: TestResult[];
    rawTextPreview?: string;
}

export default function ReportPage() {
    const router = useRouter();
    const [results, setResults] = useState<AnalysisResults | null>(null);
    const [language, setLanguage] = useState<LanguageCode>("en");
    const [isTranslating, setIsTranslating] = useState(false);
    const [originalExplanations, setOriginalExplanations] = useState<string[]>([]);

    useEffect(() => {
        // Load results from sessionStorage
        const stored = sessionStorage.getItem("medexplain_results");
        const storedLang = sessionStorage.getItem("medexplain_language") as LanguageCode;

        if (!stored) {
            router.push("/upload");
            return;
        }

        const parsed = JSON.parse(stored) as AnalysisResults;
        setResults(parsed);
        setOriginalExplanations(parsed.tests.map((t) => t.explanation));

        if (storedLang) {
            setLanguage(storedLang);
        }
    }, [router]);

    // Handle language switch
    const handleLanguageChange = async (newLang: LanguageCode) => {
        if (!results || newLang === language) return;

        setLanguage(newLang);

        if (newLang === "en") {
            // Restore original English explanations
            setResults({
                ...results,
                tests: results.tests.map((t, i) => ({
                    ...t,
                    explanation: originalExplanations[i] || t.explanation,
                })),
            });
            return;
        }

        // Translate via API
        setIsTranslating(true);
        try {
            const response = await fetch("/api/translate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    texts: originalExplanations,
                    targetLanguage: newLang,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setResults({
                    ...results,
                    tests: results.tests.map((t, i) => ({
                        ...t,
                        explanation: data.translations[i] || t.explanation,
                    })),
                });
            }
        } catch (error) {
            console.error("Translation failed:", error);
        } finally {
            setIsTranslating(false);
        }
    };

    // Loading state
    if (!results) {
        return (
            <div className="min-h-screen flex flex-col" style={{ background: 'var(--background)' }}>
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 size={40} className="animate-spin mx-auto mb-4" style={{ color: 'var(--primary)' }} />
                        <p style={{ color: 'var(--text-secondary)' }}>Loading your results...</p>
                    </div>
                </main>
            </div>
        );
    }

    // No tests found
    if (results.tests.length === 0) {
        return (
            <div className="min-h-screen flex flex-col" style={{ background: 'var(--background)' }}>
                <Header />
                <main className="flex-1 flex items-center justify-center px-6">
                    <div className="text-center max-w-md">
                        <div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                            style={{ background: 'var(--status-borderline-bg)', color: 'var(--status-borderline)' }}
                        >
                            <FileWarning size={28} />
                        </div>
                        <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--foreground)' }}>
                            Unable to extract test data
                        </h2>
                        <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
                            We couldn&apos;t identify common medical tests in your report.
                            This could happen with handwritten reports, unclear scans, or
                            specialized tests we don&apos;t yet support.
                        </p>
                        <Link
                            href="/upload"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white no-underline transition-all"
                            style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))' }}
                        >
                            <Upload size={16} />
                            Try another report
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // Count statuses
    const statusCounts = results.tests.reduce(
        (acc, t) => {
            acc[t.status]++;
            return acc;
        },
        { normal: 0, low: 0, high: 0, borderline: 0 } as Record<TestStatus, number>
    );

    return (
        <div className="min-h-screen flex flex-col" style={{ background: 'var(--background)' }}>
            <Header />

            <main className="flex-1 pt-28 pb-16 px-6">
                <div className="mx-auto max-w-4xl">
                    {/* Header section */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                        <div>
                            <Link
                                href="/upload"
                                className="inline-flex items-center gap-1 text-sm no-underline mb-3 transition-colors"
                                style={{ color: 'var(--text-muted)' }}
                            >
                                <ArrowLeft size={14} />
                                Upload another
                            </Link>
                            <h1 className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>
                                Your Report Explained
                            </h1>
                        </div>

                        <div className="flex items-center gap-3">
                            {isTranslating && (
                                <Loader2 size={16} className="animate-spin" style={{ color: 'var(--primary)' }} />
                            )}
                            <LanguageSelector value={language} onChange={handleLanguageChange} />
                        </div>
                    </div>

                    {/* Summary badges */}
                    <div className="flex flex-wrap gap-3 mb-8">
                        <SummaryBadge
                            label="Tests Found"
                            count={results.tests.length}
                            color="var(--primary)"
                            bg="var(--primary-glow)"
                        />
                        {statusCounts.normal > 0 && (
                            <SummaryBadge
                                label="Normal"
                                count={statusCounts.normal}
                                color="var(--status-normal)"
                                bg="var(--status-normal-bg)"
                            />
                        )}
                        {statusCounts.borderline > 0 && (
                            <SummaryBadge
                                label="Borderline"
                                count={statusCounts.borderline}
                                color="var(--status-borderline)"
                                bg="var(--status-borderline-bg)"
                            />
                        )}
                        {(statusCounts.low > 0 || statusCounts.high > 0) && (
                            <SummaryBadge
                                label="Abnormal"
                                count={statusCounts.low + statusCounts.high}
                                color="var(--status-abnormal)"
                                bg="var(--status-abnormal-bg)"
                            />
                        )}
                    </div>

                    {/* Test result cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
                        {results.tests.map((test, index) => (
                            <TestResultCard
                                key={test.testName}
                                testName={test.testName}
                                patientValue={test.patientValue}
                                unit={test.unit}
                                normalRange={test.normalRange}
                                status={test.status}
                                explanation={test.explanation}
                                index={index}
                            />
                        ))}
                    </div>

                    {/* Disclaimer */}
                    <Disclaimer variant="banner" />
                </div>
            </main>

            <Footer />
        </div>
    );
}

function SummaryBadge({
    label,
    count,
    color,
    bg,
}: {
    label: string;
    count: number;
    color: string;
    bg: string;
}) {
    return (
        <span
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
            style={{ background: bg, color }}
        >
            <span className="text-lg font-bold">{count}</span>
            {label}
        </span>
    );
}
