"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";

// Import all locale files from lingo.dev managed directory
import en from "../../i18n/en.json";
import hi from "../../i18n/hi.json";
import ta from "../../i18n/ta.json";
import te from "../../i18n/te.json";
import ur from "../../i18n/ur.json";
import kn from "../../i18n/kn.json";
import ml from "../../i18n/ml.json";
import gu from "../../i18n/gu.json";
import pa from "../../i18n/pa.json";
import or_ from "../../i18n/or.json";
import bn from "../../i18n/bn.json";
import mr from "../../i18n/mr.json";
import as_ from "../../i18n/as.json";
import fr from "../../i18n/fr.json";
import de from "../../i18n/de.json";
import it from "../../i18n/it.json";
import es from "../../i18n/es.json";
import pt from "../../i18n/pt.json";
import ru from "../../i18n/ru.json";
import ja from "../../i18n/ja.json";
import zh from "../../i18n/zh.json";
import ko from "../../i18n/ko.json";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TranslationDict = Record<string, any>;

const locales: Record<string, TranslationDict> = {
    en, hi, ta, te, ur, kn, ml, gu, pa,
    or: or_, bn, mr, as: as_,
    fr, de, it, es, pt, ru, ja, zh, ko,
};

export const LOCALE_LABELS: Record<string, { name: string; nativeName: string; flag: string }> = {
    en: { name: "English", nativeName: "English", flag: "🇬🇧" },
    hi: { name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
    ta: { name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳" },
    te: { name: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳" },
    ur: { name: "Urdu", nativeName: "اردو", flag: "🇵🇰" },
    kn: { name: "Kannada", nativeName: "ಕನ್ನಡ", flag: "🇮🇳" },
    ml: { name: "Malayalam", nativeName: "മലയാളം", flag: "🇮🇳" },
    gu: { name: "Gujarati", nativeName: "ગુજરાતી", flag: "🇮🇳" },
    pa: { name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
    or: { name: "Oriya", nativeName: "ଓଡ଼ିଆ", flag: "🇮🇳" },
    bn: { name: "Bengali", nativeName: "বাংলা", flag: "🇮🇳" },
    mr: { name: "Marathi", nativeName: "मराठी", flag: "🇮🇳" },
    as: { name: "Assamese", nativeName: "অসমীয়া", flag: "🇮🇳" },
    fr: { name: "French", nativeName: "Français", flag: "🇫🇷" },
    de: { name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
    it: { name: "Italian", nativeName: "Italiano", flag: "🇮🇹" },
    es: { name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
    pt: { name: "Portuguese", nativeName: "Português", flag: "🇵🇹" },
    ru: { name: "Russian", nativeName: "Русский", flag: "🇷🇺" },
    ja: { name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
    zh: { name: "Chinese", nativeName: "中文", flag: "🇨🇳" },
    ko: { name: "Korean", nativeName: "한국어", flag: "🇰🇷" },
};

interface I18nContextType {
    locale: string;
    setLocale: (locale: string) => void;
    t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

/**
 * Resolve a dot-notated key like "hero.title" from a nested object.
 */
function resolve(obj: TranslationDict, path: string): string | undefined {
    const keys = path.split(".");
    let current: unknown = obj;
    for (const k of keys) {
        if (current === null || current === undefined || typeof current !== "object") {
            return undefined;
        }
        current = (current as Record<string, unknown>)[k];
    }
    return typeof current === "string" ? current : undefined;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocale] = useState<string>("en");

    const t = useCallback(
        (key: string, params?: Record<string, string | number>): string => {
            const dict = locales[locale] || locales.en;
            let text = resolve(dict, key) ?? resolve(locales.en, key) ?? key;

            // Interpolate {{param}} patterns
            if (params) {
                for (const [k, v] of Object.entries(params)) {
                    text = text.replace(new RegExp(`\\{\\{${k}\\}\\}`, "g"), String(v));
                }
            }

            return text;
        },
        [locale]
    );

    const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

    return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

/**
 * Hook to access translations and locale switching.
 */
export function useTranslation() {
    const ctx = useContext(I18nContext);
    if (!ctx) {
        throw new Error("useTranslation must be used within an <I18nProvider>");
    }
    return ctx;
}
