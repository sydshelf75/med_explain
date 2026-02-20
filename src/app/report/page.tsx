"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Upload,
    Loader2,
    FileWarning,
    ArrowLeft,
    Activity,
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

    const handleLanguageChange = async (newLang: LanguageCode) => {
        if (!results || newLang === language) return;

        setLanguage(newLang);

        if (newLang === "en") {
            setResults({
                ...results,
                tests: results.tests.map((t, i) => ({
                    ...t,
                    explanation: originalExplanations[i] || t.explanation,
                })),
            });
            return;
        }

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



    return (
        <div className="min-h-screen flex flex-col" style={{ background: 'var(--background)' }}>
            <Header />

            <main className="flex-1 pt-28 pb-16 px-4 sm:px-6">
                <div className="mx-auto max-w-6xl">
                    {/* ── Page Header ── */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
                        <div>
                            <Link
                                href="/upload"
                                className="inline-flex items-center gap-1.5 text-sm no-underline mb-3 transition-colors hover:gap-2"
                                style={{ color: 'var(--text-muted)' }}
                            >
                                <ArrowLeft size={14} />
                                Upload another report
                            </Link>
                            <h1 className="text-4xl font-extrabold tracking-tight" style={{ color: 'var(--foreground)' }}>
                                Your Report,{" "}
                                <span style={{ color: 'var(--primary)' }}>Explained</span>
                            </h1>
                            <p className="mt-2 text-base" style={{ color: 'var(--text-secondary)' }}>
                                We analyzed your medical report and found <strong>{results.tests.length}</strong> test results.
                                Here&apos;s what they mean in plain language.
                            </p>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                            {isTranslating && (
                                <Loader2 size={16} className="animate-spin" style={{ color: 'var(--primary)' }} />
                            )}
                            <LanguageSelector value={language} onChange={handleLanguageChange} />
                        </div>
                    </div>


                    {/* ── Section Divider ── */}
                    <div className="flex items-center gap-3 mb-8">
                        <Activity size={18} style={{ color: 'var(--primary)' }} />
                        <h2 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>
                            Detailed Results
                        </h2>
                        <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
                    </div>

                    {/* ── Test Result Cards (single column, full width) ── */}
                    <div className="flex flex-col gap-6 mb-12">
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

                    {/* ── Disclaimer ── */}
                    <Disclaimer variant="banner" />
                </div>
            </main>

            <Footer />
        </div>
    );
}

