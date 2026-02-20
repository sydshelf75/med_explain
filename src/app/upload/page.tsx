"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import {
    Upload,
    FileText,
    Image,
    X,
    Loader2,
    ShieldCheck,
    ArrowRight,
    Camera,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Disclaimer from "@/components/Disclaimer";
import LanguageSelector from "@/components/LanguageSelector";
import CameraCapture from "@/components/CameraCapture";
import type { LanguageCode } from "@/lib/medicalDictionary";
import { useTranslation } from "@/i18n/I18nProvider";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ACCEPTED_TYPES = {
    "application/pdf": [".pdf"],
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"],
};

export default function UploadPage() {
    const router = useRouter();
    const { t } = useTranslation();
    const [file, setFile] = useState<File | null>(null);
    const [language, setLanguage] = useState<LanguageCode>("en");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showCamera, setShowCamera] = useState(false);

    const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: unknown[]) => {
        setError(null);

        if (rejectedFiles && (rejectedFiles as Array<unknown>).length > 0) {
            setError(t("upload.fileError"));
            return;
        }

        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
        }
    }, [t]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: ACCEPTED_TYPES,
        maxSize: MAX_FILE_SIZE,
        multiple: false,
    });

    const removeFile = () => {
        setFile(null);
        setError(null);
    };

    const handleSubmit = async () => {
        if (!file) return;

        setIsAnalyzing(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("language", language);

            const response = await fetch("/api/analyze", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || t("upload.analysisError"));
            }

            const results = await response.json();

            // Store results in sessionStorage and navigate to report
            sessionStorage.setItem("medexplain_results", JSON.stringify(results));
            sessionStorage.setItem("medexplain_language", language);
            router.push("/report");
        } catch (err) {
            setError(
                err instanceof Error ? err.message : t("upload.genericError")
            );
            setIsAnalyzing(false);
        }
    };

    const handleCameraCapture = (capturedFile: File) => {
        setFile(capturedFile);
        setShowCamera(false);
        setError(null);
    };

    const isImage = file?.type.startsWith("image/");

    return (
        <div className="min-h-screen flex flex-col" style={{ background: 'var(--background)' }}>
            <Header />

            <main className="flex-1 pt-28 pb-16 px-6">
                <div className="mx-auto max-w-2xl">
                    {/* Page title */}
                    <div className="text-center mb-10">
                        <h1
                            className="text-3xl sm:text-4xl font-bold mb-3"
                            style={{ color: 'var(--foreground)' }}
                        >
                            {t("upload.title")}
                        </h1>
                        <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                            {t("upload.subtitle")}
                        </p>
                    </div>

                    {/* Upload zone */}
                    <div
                        {...getRootProps()}
                        className={`
              relative p-10 rounded-2xl text-center cursor-pointer
              transition-all duration-300 group
              ${isDragActive ? "scale-[1.01]" : ""}
            `}
                        style={{
                            background: isDragActive ? 'var(--primary-glow)' : 'var(--surface)',
                            border: `2px dashed ${isDragActive ? 'var(--primary)' : 'var(--border)'}`,
                            boxShadow: isDragActive ? 'var(--shadow-glow)' : 'var(--shadow-sm)',
                        }}
                    >
                        <input {...getInputProps()} />

                        {!file ? (
                            <div className="flex flex-col items-center gap-4">
                                <div
                                    className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                                    style={{ background: 'var(--primary-glow)', color: 'var(--primary)' }}
                                >
                                    <Upload size={28} />
                                </div>
                                <div>
                                    <p className="text-base font-semibold mb-1" style={{ color: 'var(--foreground)' }}>
                                        {isDragActive
                                            ? t("upload.dragActive")
                                            : t("upload.dragDefault")}
                                    </p>
                                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                                        {t("upload.browseHint")}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div
                                className="flex items-center gap-4 p-4 rounded-xl"
                                style={{ background: 'var(--background)' }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                                    style={{ background: 'var(--primary-glow)', color: 'var(--primary)' }}
                                >
                                    {isImage ? <Image size={22} /> : <FileText size={22} />}
                                </div>
                                <div className="flex-1 text-left min-w-0">
                                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--foreground)' }}>
                                        {file.name}
                                    </p>
                                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                        {(file.size / 1024).toFixed(1)} KB • {file.type.split("/")[1].toUpperCase()}
                                    </p>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeFile();
                                    }}
                                    className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                                    style={{ background: 'var(--status-abnormal-bg)', color: 'var(--status-abnormal)' }}
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Scan with Camera button */}
                    <div className="mt-4 flex items-center gap-3">
                        <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
                        <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                            {t("upload.orText")}
                        </span>
                        <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
                    </div>

                    <button
                        onClick={() => setShowCamera(true)}
                        className="mt-4 w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-sm font-semibold transition-all duration-300 hover:scale-[1.01] group"
                        style={{
                            background: 'var(--surface)',
                            border: '1px solid var(--border)',
                            color: 'var(--foreground)',
                        }}
                    >
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                            style={{ background: 'var(--primary-glow)', color: 'var(--primary)' }}
                        >
                            <Camera size={20} />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                                {t("upload.cameraBtnLabel")}
                            </p>
                            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                {t("upload.cameraBtnHint")}
                            </p>
                        </div>
                    </button>

                    {/* Error message */}
                    {error && (
                        <div
                            className="mt-4 p-3 rounded-xl text-sm"
                            style={{ background: 'var(--status-abnormal-bg)', color: 'var(--status-abnormal)' }}
                        >
                            {error}
                        </div>
                    )}

                    {/* Language + Submit */}
                    <div className="mt-8 space-y-6">
                        {/* Language selector */}
                        <div className="flex items-center justify-between p-4 rounded-2xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                            <div>
                                <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                                    {t("upload.langLabel")}
                                </p>
                                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                    {t("upload.langHint")}
                                </p>
                            </div>
                            <LanguageSelector value={language} onChange={setLanguage} />
                        </div>

                        {/* Privacy notice */}
                        <div className="flex items-start gap-3 p-4 rounded-2xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                            <ShieldCheck size={18} className="mt-0.5 shrink-0" style={{ color: 'var(--status-normal)' }} />
                            <div>
                                <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                                    {t("upload.privacyTitle")}
                                </p>
                                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                    {t("upload.privacyDesc")}
                                </p>
                            </div>
                        </div>

                        {/* Submit button */}
                        <button
                            onClick={handleSubmit}
                            disabled={!file || isAnalyzing}
                            className="w-full flex items-center justify-center gap-2 py-4 rounded-full text-base font-semibold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01]"
                            style={{
                                background: file ? 'linear-gradient(135deg, var(--primary), var(--primary-dark))' : 'var(--border)',
                                boxShadow: file ? '0 4px 20px rgba(13, 148, 136, 0.3)' : 'none',
                            }}
                        >
                            {isAnalyzing ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    {t("upload.analyzing")}
                                </>
                            ) : (
                                <>
                                    {t("upload.submitBtn")}
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>

                        <div className="text-center">
                            <Disclaimer />
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            {/* Camera overlay */}
            {showCamera && (
                <CameraCapture
                    onCapture={handleCameraCapture}
                    onClose={() => setShowCamera(false)}
                />
            )}
        </div>
    );
}
