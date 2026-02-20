/**
 * Medical Dictionary — reference data for known tests, normal ranges,
 * and explanation templates used by the explanation engine.
 */

export interface TestReference {
  /** Canonical test name */
  name: string;
  /** Alternate names / aliases that might appear on reports */
  aliases: string[];
  /** Unit of measurement */
  unit: string;
  /** Normal range */
  normalRange: { low: number; high: number };
  /** Explanation templates keyed by status */
  explanations: {
    normal: string;
    low: string;
    high: string;
    borderline: string;
  };
}

export const MEDICAL_DICTIONARY: TestReference[] = [
  {
    name: "Hemoglobin",
    aliases: ["hb", "hgb", "haemoglobin", "hemoglobin"],
    unit: "g/dL",
    normalRange: { low: 12.0, high: 17.5 },
    explanations: {
      normal:
        "Your hemoglobin level is within the normal range. This means your blood is carrying oxygen well throughout your body.",
      low:
        "Your hemoglobin level is lower than the normal range. This may indicate anemia, which can cause tiredness, weakness, or shortness of breath. Please consult your doctor for proper evaluation.",
      high:
        "Your hemoglobin level is higher than the normal range. This could be related to dehydration or other conditions. Please consult your doctor for proper evaluation.",
      borderline:
        "Your hemoglobin level is near the edge of the normal range. It may be worth monitoring. Please discuss with your doctor during your next visit.",
    },
  },
  {
    name: "Blood Sugar (Fasting)",
    aliases: [
      "fasting blood sugar",
      "fbs",
      "fasting glucose",
      "glucose fasting",
      "blood sugar fasting",
      "fasting blood glucose",
    ],
    unit: "mg/dL",
    normalRange: { low: 70, high: 100 },
    explanations: {
      normal:
        "Your fasting blood sugar level is within the normal range, suggesting your body is managing blood sugar well.",
      low:
        "Your fasting blood sugar is lower than normal. This may cause dizziness, shakiness, or fatigue. Please consult your doctor for advice.",
      high:
        "Your fasting blood sugar is higher than normal. This may require attention as it could indicate pre-diabetes or diabetes. Please consult your doctor for proper evaluation.",
      borderline:
        "Your fasting blood sugar is near the upper limit of the normal range. It may be worth monitoring your diet and activity. Please discuss with your doctor.",
    },
  },
  {
    name: "Blood Sugar (Post-Prandial)",
    aliases: [
      "pp blood sugar",
      "ppbs",
      "post prandial blood sugar",
      "blood sugar pp",
      "post meal blood sugar",
      "glucose pp",
      "post prandial glucose",
    ],
    unit: "mg/dL",
    normalRange: { low: 70, high: 140 },
    explanations: {
      normal:
        "Your post-meal blood sugar level is within the normal range. Your body is processing sugar from food effectively.",
      low:
        "Your post-meal blood sugar is lower than expected. Please consult your doctor if you experience dizziness or fatigue after meals.",
      high:
        "Your post-meal blood sugar is higher than the normal range. This may need attention. Please consult your doctor for proper evaluation.",
      borderline:
        "Your post-meal blood sugar is near the upper limit. Monitoring your carbohydrate intake may help. Please discuss with your doctor.",
    },
  },
  {
    name: "Total Cholesterol",
    aliases: [
      "cholesterol total",
      "total cholesterol",
      "cholesterol",
      "serum cholesterol",
    ],
    unit: "mg/dL",
    normalRange: { low: 0, high: 200 },
    explanations: {
      normal:
        "Your total cholesterol level is within the desirable range, which is good for heart health.",
      low:
        "Your cholesterol level is quite low. While generally not a concern, please discuss with your doctor if you have other symptoms.",
      high:
        "Your total cholesterol is higher than the desirable range. Elevated cholesterol may increase heart-related risks over time. Please consult your doctor for dietary advice and evaluation.",
      borderline:
        "Your total cholesterol is borderline high. Lifestyle and dietary changes may help. Please discuss with your doctor.",
    },
  },
  {
    name: "HDL Cholesterol",
    aliases: ["hdl", "hdl cholesterol", "hdl-c", "good cholesterol"],
    unit: "mg/dL",
    normalRange: { low: 40, high: 60 },
    explanations: {
      normal:
        "Your HDL (good) cholesterol is within a healthy range. HDL helps remove other forms of cholesterol from your bloodstream.",
      low:
        "Your HDL (good) cholesterol is lower than ideal. Low HDL may increase heart-related risks. Regular exercise and a healthy diet may help. Please consult your doctor.",
      high:
        "Your HDL (good) cholesterol is higher than typical. Higher HDL is generally considered protective for heart health.",
      borderline:
        "Your HDL cholesterol is near the lower limit of the healthy range. Increasing physical activity may help improve it. Please discuss with your doctor.",
    },
  },
  {
    name: "LDL Cholesterol",
    aliases: ["ldl", "ldl cholesterol", "ldl-c", "bad cholesterol"],
    unit: "mg/dL",
    normalRange: { low: 0, high: 100 },
    explanations: {
      normal:
        "Your LDL (bad) cholesterol is within the optimal range. This is good for heart health.",
      low:
        "Your LDL cholesterol is very low. This is generally not a concern but discuss with your doctor if needed.",
      high:
        "Your LDL (bad) cholesterol is higher than optimal. Elevated LDL may increase heart-related risks over time. Please consult your doctor for advice on diet and lifestyle changes.",
      borderline:
        "Your LDL cholesterol is near the upper limit of optimal. Dietary changes may help keep it in check. Please discuss with your doctor.",
    },
  },
  {
    name: "Vitamin D",
    aliases: [
      "vitamin d",
      "vit d",
      "25-oh vitamin d",
      "25 hydroxy vitamin d",
      "vitamin d3",
      "cholecalciferol",
      "25-hydroxyvitamin d",
    ],
    unit: "ng/mL",
    normalRange: { low: 30, high: 100 },
    explanations: {
      normal:
        "Your Vitamin D level is within the sufficient range. Vitamin D is important for bone health and immune function.",
      low:
        "Your Vitamin D level is lower than recommended. Low Vitamin D may affect bone strength and energy levels. Your doctor may suggest supplements or more sun exposure.",
      high:
        "Your Vitamin D level is higher than the typical range. While uncommon, very high levels may need monitoring. Please consult your doctor.",
      borderline:
        "Your Vitamin D level is near the lower end of the sufficient range. A little more sunlight or dietary Vitamin D may help. Please discuss with your doctor.",
    },
  },
  {
    name: "TSH",
    aliases: [
      "tsh",
      "thyroid stimulating hormone",
      "thyroid",
      "thyrotropin",
      "serum tsh",
    ],
    unit: "mIU/L",
    normalRange: { low: 0.4, high: 4.0 },
    explanations: {
      normal:
        "Your TSH level is within the normal range. This suggests your thyroid gland is functioning normally.",
      low:
        "Your TSH level is lower than normal. This may suggest an overactive thyroid (hyperthyroidism). Symptoms may include weight loss, rapid heartbeat, or anxiety. Please consult your doctor for further evaluation.",
      high:
        "Your TSH level is higher than normal. This may suggest an underactive thyroid (hypothyroidism). Symptoms may include fatigue, weight gain, or feeling cold. Please consult your doctor for further evaluation.",
      borderline:
        "Your TSH level is near the edge of the normal range. It may be worth monitoring your thyroid function. Please discuss with your doctor.",
    },
  },
  {
    name: "Triglycerides",
    aliases: ["triglycerides", "tg", "serum triglycerides"],
    unit: "mg/dL",
    normalRange: { low: 0, high: 150 },
    explanations: {
      normal:
        "Your triglyceride level is within the normal range. This is a good sign for heart and metabolic health.",
      low:
        "Your triglyceride level is very low. This is generally not a concern, but please discuss with your doctor if needed.",
      high:
        "Your triglyceride level is higher than normal. Elevated triglycerides may increase heart-related risks. Diet, exercise, and lifestyle changes may help. Please consult your doctor.",
      borderline:
        "Your triglyceride level is borderline high. Reducing sugar and refined carbs may help. Please discuss with your doctor.",
    },
  },
  {
    name: "Creatinine",
    aliases: ["creatinine", "serum creatinine", "creat"],
    unit: "mg/dL",
    normalRange: { low: 0.6, high: 1.2 },
    explanations: {
      normal:
        "Your creatinine level is within the normal range. This suggests your kidneys are filtering waste effectively.",
      low:
        "Your creatinine level is lower than typical. This is generally not a concern but may be discussed with your doctor.",
      high:
        "Your creatinine level is higher than normal. This may suggest your kidneys are working harder than usual. Please consult your doctor for kidney function evaluation.",
      borderline:
        "Your creatinine level is near the upper limit of normal. Staying hydrated and monitoring kidney health is advisable. Please discuss with your doctor.",
    },
  },
];

/**
 * Supported languages for translation
 */
export const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు" },
  { code: "ur", name: "Urdu", nativeName: "اردو" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ" },
  { code: "or", name: "Oriya", nativeName: "ଓଡ଼ିଆ" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা" },
  { code: "mr", name: "Marathi", nativeName: "मराठी" },
  { code: "as", name: "Assamese", nativeName: "অসমীয়া" },
  { code: "fr", name: "French", nativeName: "français" },
  { code: "de", name: "German", nativeName: "Deutsch" },
  { code: "it", name: "Italian", nativeName: "Italiano" },
  { code: "es", name: "Spanish", nativeName: "Español" },
  { code: "pt", name: "Portuguese", nativeName: "Português" },
  { code: "ru", name: "Russian", nativeName: "Русский" },
  { code: "ja", name: "Japanese", nativeName: "日本語" },
  { code: "zh", name: "Chinese", nativeName: "中文" },
  { code: "ko", name: "Korean", nativeName: "한국어" },
] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]["code"];
