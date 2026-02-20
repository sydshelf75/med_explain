import { NextRequest, NextResponse } from "next/server";
import { translateTexts } from "@/lib/translator";
import type { LanguageCode } from "@/lib/medicalDictionary";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { texts, targetLanguage } = body as {
            texts: string[];
            targetLanguage: LanguageCode;
        };

        if (!texts || !Array.isArray(texts) || texts.length === 0) {
            return NextResponse.json(
                { error: "No texts provided for translation." },
                { status: 400 }
            );
        }

        if (!targetLanguage) {
            return NextResponse.json(
                { error: "Target language not specified." },
                { status: 400 }
            );
        }

        const translations = await translateTexts(texts, targetLanguage);

        return NextResponse.json({ translations });
    } catch (error) {
        console.error("Translation error:", error);
        return NextResponse.json(
            { error: "Translation failed. Please try again." },
            { status: 500 }
        );
    }
}
