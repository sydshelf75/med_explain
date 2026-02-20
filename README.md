This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
Great. I’ll frame this as if you’re writing the **official product documentation** for:

# 🏥 MedExplain

**Understand your medical reports — clearly, calmly, in your language.**

---

# 1️⃣ Project Description

**MedExplain** is a multilingual medical document explanation system that helps patients understand their lab reports and prescriptions in simple, non-technical language.

It does **not diagnose** or provide treatment advice.
It focuses purely on:

* Explaining medical terms clearly
* Highlighting abnormal values
* Translating explanations into the patient’s native language using **lingo.dev**

The goal is clarity, not medical authority.

---

# 2️⃣ Core Value Proposition

Most patients:

* Receive reports in English
* Don’t understand medical jargon
* Feel anxious or confused

MedExplain:

* Converts complex terms → plain explanations
* Localizes explanations → patient’s chosen language
* Presents information calmly and structurally

It reduces confusion before the doctor consultation — not replaces it.

---

# 3️⃣ How It Works (System Overview)

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

# 4️⃣ Detailed Data Flow (Backend Logic)

Let’s break it down technically.

---

## Step 1: Document Upload

**Input:**

* PDF / Image (JPG, PNG)

**Process:**

* Validate file type & size
* Store temporarily (secure bucket)
* Generate report ID

---

## Step 2: OCR Processing

* Extract raw text
* Clean noise (headers, duplicate text, formatting artifacts)
* Convert into structured format:

Example structured object:

```json
{
  "test_name": "Hemoglobin",
  "patient_value": "9.2 g/dL",
  "normal_range": "13.5–17.5 g/dL"
}
```

---

## Step 3: Medical Explanation Engine

This layer:

* Matches known medical test patterns
* Determines:

  * Is value low?
  * Is value high?
  * Is it normal?
* Generates simple explanation template:

Example:

> “Your hemoglobin level is lower than the normal range. This may cause tiredness or weakness. Please consult your doctor for proper evaluation.”

This output is in base language (English).

---

## Step 4: Localization via lingo.dev

The simplified explanation is sent to:

**lingo.dev**

Purpose:

* Translate with medical context awareness
* Maintain correct tone (calm, informative)
* Preserve numeric values & units

Example:

English:

> “Your hemoglobin level is lower than normal.”

Hindi:

> “आपका हीमोग्लोबिन स्तर सामान्य से कम है।”

Important:
You’re translating **plain explanations**, not raw medical data — this reduces translation risk.

---

## Step 5: Final User Output

The frontend receives:

```json
{
  "test": "Hemoglobin",
  "status": "Low",
  "explanation_localized": "आपका हीमोग्लोबिन स्तर सामान्य से कम है..."
}
```

Displayed in structured card format.

---

# 5️⃣ UI / UX Design

## Main Screens

---

## 🟢 1. Landing Page

Minimal and trust-focused.

Sections:

* What is MedExplain?
* How it works (3 steps)
* Supported languages
* Clear disclaimer

Tone:
Calm, not tech-heavy.

---

## 🟢 2. Upload Screen

Components:

* Drag & drop upload
* Language selector dropdown
* Privacy assurance notice
* “Explain My Report” button

UX principles:

* Large buttons (elderly-friendly)
* Simple instructions
* No clutter

---

## 🟢 3. Report Explanation Screen

Each test displayed as a card:

---

### Example Card Layout

**Hemoglobin**
Status: 🔴 Low

Normal Range: 13.5–17.5 g/dL
Your Value: 9.2 g/dL

Explanation (Localized):
“आपका हीमोग्लोबिन स्तर सामान्य से कम है...”

---

Color coding:

* Green → Normal
* Orange → Borderline
* Red → Abnormal

Bottom Section:
⚠️ Disclaimer

---

## 🟢 4. Language Switcher (Live Re-render)

User can switch language:

* English
* Hindi
* Tamil
* Telugu

App re-fetches localized explanations from backend cache.

---

# 6️⃣ Database Schema (Basic Design)

### users

* id
* email
* preferred_language

### reports

* id
* user_id
* uploaded_at
* file_path

### extracted_tests

* id
* report_id
* test_name
* patient_value
* normal_range
* status

### explanations

* id
* test_id
* base_explanation
* localized_explanation
* language_code

---

# 7️⃣ Architecture Considerations

### Security

* Do not permanently store documents unless user opts in
* Encrypt sensitive data
* Auto-delete temporary files

### Caching

* Cache translated explanations
* Avoid repeated API calls to lingo.dev

### Error Handling

* Poor OCR detection → show “Unable to extract clearly”
* Unknown medical test → generic explanation template

---

# 8️⃣ Safety & Ethical Guardrails

The system must:

* Always show disclaimer
* Never use words like:

  * “You have”
  * “You are diagnosed with”
* Avoid predictive language
* Encourage doctor consultation

This protects users and you.

---

# 9️⃣ MVP Scope (Be Realistic)

For first version:

* Support 5–10 common tests:

  * Hemoglobin
  * Blood Sugar
  * Cholesterol
  * Vitamin D
  * Thyroid (TSH)

Avoid trying to parse everything.

---

