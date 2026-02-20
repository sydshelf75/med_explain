"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, ChevronDown, Home, FileUp } from "lucide-react";
import { useTranslation, LOCALE_LABELS } from "@/i18n/I18nProvider";
import { useState, useRef, useEffect } from "react";

export default function Header() {
    const pathname = usePathname();
    const { t, locale, setLocale } = useTranslation();

    return (
        <header className="glass fixed top-0 left-0 right-0 z-50" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-3">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 no-underline group">
                    <img
                        src="/favicon.svg"
                        alt="MedExplain Logo"
                        width={32}
                        height={32}
                        className="transition-all duration-300 group-hover:scale-105"
                    />
                    <span className="hidden sm:inline text-lg font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>
                        Med<span style={{ color: 'var(--primary)' }}>Explain</span>
                    </span>
                </Link>

                {/* Navigation + Language Switcher */}
                <div className="flex items-center gap-2">
                    <nav className="flex items-center gap-1">
                        <NavLink href="/" active={pathname === "/"}>
                            <Home size={18} className="sm:hidden" />
                            <span className="hidden sm:inline">{t("header.home")}</span>
                        </NavLink>
                        <NavLink href="/upload" active={pathname === "/upload"}>
                            <FileUp size={18} className="sm:hidden" />
                            <span className="hidden sm:inline">{t("header.uploadReport")}</span>
                        </NavLink>
                    </nav>

                    {/* Language Switcher */}
                    <LanguageSwitcher locale={locale} setLocale={setLocale} />
                </div>
            </div>
        </header>
    );
}

function LanguageSwitcher({
    locale,
    setLocale,
}: {
    locale: string;
    setLocale: (l: string) => void;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const current = LOCALE_LABELS[locale] || LOCALE_LABELS.en;
    const locales = Object.entries(LOCALE_LABELS);

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200"
                style={{
                    background: 'var(--surface)',
                    color: 'var(--foreground)',
                    border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-sm)',
                }}
            >
                <Globe size={15} style={{ color: 'var(--primary)' }} />
                <span className="hidden sm:inline">{current.flag} {current.nativeName}</span>
                <span className="sm:hidden">{current.flag}</span>
                <ChevronDown size={12} style={{ color: 'var(--text-muted)' }} />
            </button>

            {open && (
                <div
                    className="absolute right-0 top-full mt-2 w-48 rounded-xl overflow-hidden py-1 z-50"
                    style={{
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        boxShadow: 'var(--shadow-lg)',
                    }}
                >
                    {locales.map(([code, label]) => (
                        <button
                            key={code}
                            onClick={() => {
                                setLocale(code);
                                setOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors text-left"
                            style={{
                                color: code === locale ? 'var(--primary)' : 'var(--foreground)',
                                background: code === locale ? 'var(--primary-glow)' : 'transparent',
                            }}
                            onMouseEnter={(e) => {
                                if (code !== locale) e.currentTarget.style.background = 'var(--background)';
                            }}
                            onMouseLeave={(e) => {
                                if (code !== locale) e.currentTarget.style.background = 'transparent';
                            }}
                        >
                            <span className="text-lg">{label.flag}</span>
                            <span>{label.nativeName}</span>
                            <span className="ml-auto text-xs" style={{ color: 'var(--text-muted)' }}>
                                {label.name}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

function NavLink({
    href,
    active,
    children,
}: {
    href: string;
    active: boolean;
    children: React.ReactNode;
}) {
    return (
        <Link
            href={href}
            className="px-4 py-2 rounded-full text-sm font-medium no-underline transition-all duration-200"
            style={{
                color: active ? 'var(--primary)' : 'var(--text-secondary)',
                background: active ? 'var(--primary-glow)' : 'transparent',
            }}
        >
            {children}
        </Link>
    );
}
