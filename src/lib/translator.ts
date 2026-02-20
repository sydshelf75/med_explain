

import type { LanguageCode } from "./medicalDictionary";
import { LingoDotDevEngine } from "lingo.dev/sdk"


export async function translateTexts(
    texts: string[],
    targetLanguage: LanguageCode
): Promise<string[]> {
    // No translation needed for English
    if (targetLanguage === "en") {
        return texts;
    }

    const apiKey = process.env.LINGO_API_KEY;
    if (!apiKey || apiKey === "your_lingo_api_key_here") {
        console.warn("LINGO_API_KEY not configured — returning English text as fallback.");
        return texts;
    }

    try {
        const engine = new LingoDotDevEngine({
            apiKey,
        });

        // Translate each text individually to preserve ordering
        const translated = await Promise.all(
            texts.map(async (text) => {
                try {
                    const result = await engine.localizeText(text, {
                        sourceLocale: "en",
                        targetLocale: targetLanguage,
                    });
                    return result || text;
                } catch {
                    console.warn(`Translation failed for text, using English fallback.`);
                    return text;
                }
            })
        );

        return translated;
    } catch (error) {
        console.error("Lingo.dev SDK initialization failed:", error);
        return texts;
    }
}

/**
 * Translate a single text string.
 */
export async function translateText(
    text: string,
    targetLanguage: LanguageCode
): Promise<string> {
    const [result] = await translateTexts([text], targetLanguage);
    return result;
}
