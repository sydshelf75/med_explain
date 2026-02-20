"use client";

import Link from "next/link";
import { LOCALE_LABELS } from "@/i18n/I18nProvider";
import {
  Upload,
  FileSearch,
  Languages,
  ArrowRight,
  Heart,
  Shield,
  Sparkles,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Disclaimer from "@/components/Disclaimer";
import { useTranslation } from "@/i18n/I18nProvider";

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--background)' }}>
      <Header />

      <main className="flex-1 pt-20">
        {/* ── Hero Section ── */}
        <section className="relative overflow-hidden py-24 px-6">
          {/* Background gradient orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-20 blur-3xl"
              style={{ background: 'var(--primary)' }}
            />
            <div
              className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-10 blur-3xl"
              style={{ background: 'var(--primary-light)' }}
            />
          </div>

          <div className="relative mx-auto max-w-4xl text-center">
            <div className="animate-fade-in-up">
              <span
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6"
                style={{ background: 'var(--primary-glow)', color: 'var(--primary)' }}
              >
                <Heart size={12} />
                {t("hero.badge")}
              </span>
            </div>

            <h1
              className="animate-fade-in-up animate-delay-1 text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight mb-6"
              style={{ color: 'var(--foreground)' }}
            >
              {t("hero.titleLine1")}{" "}
              <span
                className="relative inline-block"
                style={{ color: 'var(--primary)' }}
              >
                {t("hero.titleHighlight")}
                <span
                  className="absolute bottom-1 left-0 right-0 h-3 -z-10 rounded-sm opacity-20"
                  style={{ background: 'var(--primary)' }}
                />
              </span>
              <br />
              {t("hero.titleLine2")}
            </h1>

            <p
              className="animate-fade-in-up animate-delay-2 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              {t("hero.subtitle")}
            </p>

            <div className="animate-fade-in-up animate-delay-3 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/upload"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold text-white no-underline transition-all duration-300 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                  boxShadow: '0 4px 20px rgba(13, 148, 136, 0.3)',
                }}
              >
                {t("hero.cta")}
                <ArrowRight size={18} />
              </Link>
              <Disclaimer />
            </div>
          </div>
        </section>

        {/* ── How It Works ── */}
        <section className="py-24 px-6" style={{ background: 'var(--surface)' }}>
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-16">
              <h2
                className="text-3xl sm:text-4xl font-bold mb-4"
                style={{ color: 'var(--foreground)' }}
              >
                {t("howItWorks.title")}
              </h2>
              <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                {t("howItWorks.subtitle")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <StepCard
                step={1}
                icon={<Upload size={28} />}
                title={t("howItWorks.step1Title")}
                description={t("howItWorks.step1Desc")}
              />
              <StepCard
                step={2}
                icon={<FileSearch size={28} />}
                title={t("howItWorks.step2Title")}
                description={t("howItWorks.step2Desc")}
              />
              <StepCard
                step={3}
                icon={<Languages size={28} />}
                title={t("howItWorks.step3Title")}
                description={t("howItWorks.step3Desc")}
              />
            </div>
          </div>
        </section>

        {/* ── Languages ── */}
        <section className="py-24 px-6">
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-16">
              <h2
                className="text-3xl sm:text-4xl font-bold mb-4"
                style={{ color: 'var(--foreground)' }}
              >
                {t("languages.title")}
              </h2>
              <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                {t("languages.subtitle")}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Object.entries(LOCALE_LABELS).map(([code, label]) => (
                <LangCard key={code} name={label.name} native={label.nativeName} flag={label.flag} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Trust Section ── */}
        <section className="py-24 px-6" style={{ background: 'var(--surface)' }}>
          <div className="mx-auto max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <TrustCard
                icon={<Shield size={24} />}
                title={t("trust.privacyTitle")}
                description={t("trust.privacyDesc")}
              />
              <TrustCard
                icon={<Heart size={24} />}
                title={t("trust.noDiagTitle")}
                description={t("trust.noDiagDesc")}
              />
              <TrustCard
                icon={<Sparkles size={24} />}
                title={t("trust.aiTitle")}
                description={t("trust.aiDesc")}
              />
            </div>

            <div className="mt-12">
              <Disclaimer variant="banner" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function StepCard({
  step,
  icon,
  title,
  description,
}: {
  step: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div
      className="relative p-8 rounded-2xl text-center transition-all duration-300 hover:translate-y-[-4px] group"
      style={{
        background: 'var(--background)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Step number */}
      <span className="absolute top-4 right-4 text-xs font-bold" style={{ color: 'var(--text-muted)' }}>
        {String(step).padStart(2, "0")}
      </span>

      <div
        className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5 transition-all duration-300 group-hover:scale-110"
        style={{ background: 'var(--primary-glow)', color: 'var(--primary)' }}
      >
        {icon}
      </div>

      <h3
        className="text-xl font-semibold mb-3"
        style={{ color: 'var(--foreground)' }}
      >
        {title}
      </h3>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        {description}
      </p>
    </div>
  );
}

function LangCard({
  name,
  native,
  flag,
}: {
  name: string;
  native: string;
  flag: string;
}) {
  return (
    <div
      className="flex items-center gap-3 p-4 rounded-xl transition-all duration-200 hover:translate-y-[-2px]"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <span className="text-2xl">{flag}</span>
      <div>
        <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>
          {native}
        </p>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {name}
        </p>
      </div>
    </div>
  );
}

function TrustCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div
      className="p-6 rounded-2xl text-center"
      style={{
        background: 'var(--background)',
        border: '1px solid var(--border)',
      }}
    >
      <div
        className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4"
        style={{ background: 'var(--primary-glow)', color: 'var(--primary)' }}
      >
        {icon}
      </div>
      <h3
        className="text-base font-semibold mb-2"
        style={{ color: 'var(--foreground)' }}
      >
        {title}
      </h3>
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
        {description}
      </p>
    </div>
  );
}
