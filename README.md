# 🏥 MedExplain

**Understand your medical reports — clearly, calmly, in your language.**

---

## Project Description

**MedExplain** is a multilingual medical document explanation system that helps patients understand their lab reports and prescriptions in simple, non-technical language.

It does **not diagnose** or provide treatment advice.
It focuses purely on:

* Explaining medical terms clearly
* Highlighting abnormal values
* Translating explanations into the patient's native language using **lingo.dev**

The goal is clarity, not medical authority.

---

## Core Value Proposition

Most patients:

* Receive reports in English
* Don't understand medical jargon
* Feel anxious or confused

MedExplain:

* Converts complex terms → plain explanations
* Localizes explanations → patient's chosen language
* Presents information calmly and structurally

It reduces confusion before the doctor consultation — not replaces it.

---

## How It Works

### High-Level Flow

```
Upload Report
   ↓
OCR (Text Extraction)
   ↓
Medical Term Parsing
   ↓
Explanation Engine
   ↓
Localization (lingo.dev)
   ↓
Patient-Friendly Output
```

---

## UI / UX Design

### 🟢 1. Landing Page

Minimal and trust-focused.

Sections:

* What is MedExplain?
* How it works (3 steps)
* Supported languages
* Clear disclaimer

Tone:
Calm, not tech-heavy.

---

### 🟢 2. Upload Screen

Components:

* Drag & drop upload
* Language selector dropdown
* Privacy assurance notice
* "Explain My Report" button

UX principles:

* Large buttons (elderly-friendly)
* Simple instructions
* No clutter

---

### 🟢 3. Report Explanation Screen

Each test displayed as a card:

#### Example Card Layout

**Hemoglobin**
Status: 🔴 Low

Normal Range: 13.5–17.5 g/dL
Your Value: 9.2 g/dL

Explanation (Localized):
"आपका हीमोग्लोबिन स्तर सामान्य से कम है..."

---

Color coding:

* Green → Normal
* Orange → Borderline
* Red → Abnormal

Bottom Section:
⚠️ Disclaimer

---

### 🟢 4. Language Switcher (Live Re-render)

User can switch language:

* English
* Hindi
* Tamil
* Telugu

App re-fetches localized explanations from backend cache.

---

## Safety & Ethical Guardrails

The system must:

* Always show disclaimer
* Never use words like:

  * "You have"
  * "You are diagnosed with"
* Avoid predictive language
* Encourage doctor consultation

This protects users and you.

---

## MVP Scope

For first version:

* Support 5–10 common tests:

  * Hemoglobin
  * Blood Sugar
  * Cholesterol
  * Vitamin D
  * Thyroid (TSH)

Avoid trying to parse everything.

---

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
