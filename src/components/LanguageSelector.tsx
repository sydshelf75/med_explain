"use client";

import { Globe } from "lucide-react";
import { SUPPORTED_LANGUAGES, type LanguageCode } from "@/lib/medicalDictionary";
import { useTranslation } from "@/i18n/I18nProvider";

interface LanguageSelectorProps {
    value: LanguageCode;
    onChange: (lang: LanguageCode) => void;
    size?: "sm" | "md";
}

export default function LanguageSelector({
    value,
    onChange,
    size = "md",
}: LanguageSelectorProps) {
    const { setLocale } = useTranslation();

    const handleChange = (newLang: LanguageCode) => {
        // Update both the UI locale and the parent's language state
        setLocale(newLang);
        onChange(newLang);
    };

    return (
        <div className="relative inline-flex items-center">
            <Globe
                size={size === "sm" ? 14 : 16}
                className="absolute left-3 pointer-events-none"
                style={{ color: 'var(--primary)' }}
            />
            <select
                value={value}
                onChange={(e) => handleChange(e.target.value as LanguageCode)}
                className={`
          appearance-none cursor-pointer rounded-full font-medium
          transition-all duration-200 outline-none
          ${size === "sm" ? "pl-8 pr-8 py-1.5 text-xs" : "pl-9 pr-10 py-2.5 text-sm"}
        `}
                style={{
                    background: 'var(--surface)',
                    color: 'var(--foreground)',
                    border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-sm)',
                }}
            >
                {SUPPORTED_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                        {lang.nativeName} ({lang.name})
                    </option>
                ))}
            </select>
            <svg
                className="absolute right-3 pointer-events-none"
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                style={{ color: 'var(--text-muted)' }}
            >
                <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </div>
    );
}
