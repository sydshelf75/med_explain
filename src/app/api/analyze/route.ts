import { NextRequest, NextResponse } from "next/server";
import { parseRawText } from "@/lib/medicalParser";
import { generateExplanations } from "@/lib/explanationEngine";
import { translateTexts } from "@/lib/translator";
import type { LanguageCode } from "@/lib/medicalDictionary";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File | null;
        const language = (formData.get("language") as LanguageCode) || "en";

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Validate file type
        const allowedTypes = [
            "application/pdf",
            "image/jpeg",
            "image/png",
            "image/jpg",
        ];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: "Invalid file type. Please upload a PDF, JPG, or PNG file." },
                { status: 400 }
            );
        }

        // Validate file size (10MB max)
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json(
                { error: "File too large. Maximum size is 10 MB." },
                { status: 400 }
            );
        }

        // Extract text via Santa AI service
        const fileType = file.type === "application/pdf" ? "pdf" : file.type.split("/")[1];
        const rawText = await extractViaSantaAi(file, fileType);

        if (!rawText || rawText.trim().length < 10) {
            return NextResponse.json(
                {
                    error:
                        "Unable to extract text from the uploaded file. Please ensure the report is clearly printed and try again.",
                    tests: [],
                },
                { status: 200 }
            );
        }

        // Parse medical test data from raw text
        const parsedTests = parseRawText(rawText);

        // Generate explanations
        const explainedTests = generateExplanations(parsedTests);

        // Translate if needed
        let finalTests = explainedTests;
        if (language !== "en") {
            const explanationTexts = explainedTests.map((t) => t.explanation);
            const translated = await translateTexts(explanationTexts, language);
            finalTests = explainedTests.map((t, i) => ({
                ...t,
                explanation: translated[i],
            }));
        }

        return NextResponse.json({
            tests: finalTests,
            rawTextPreview: rawText.substring(0, 200),
        });
    } catch (error) {
        console.error("Analysis error:", error);
        return NextResponse.json(
            { error: "An error occurred while analyzing the report. Please try again." },
            { status: 500 }
        );
    }
}

const SANTA_AI_URL = "http://localhost:8000";

/**
 * Extract text from a PDF or image file via Santa AI service.
 */
async function extractViaSantaAi(file: File, fileType: string): Promise<string> {
    try {
        const buffer = Buffer.from(await file.arrayBuffer());
        const formData = new FormData();
        formData.append("file", new Blob([buffer]), `document.${fileType}`);
        formData.append("file_type", fileType);

        console.log("Calling Santa AI for text extraction...");

        const response = await fetch(`${SANTA_AI_URL}/extract`, {
            method: "POST",
            body: formData,
            signal: AbortSignal.timeout(30_000),
        });

        if (!response.ok) {
            console.warn(`Santa AI returned status ${response.status}`);
            return "";
        }

        const result = await response.json() as {
            success: boolean;
            text: string;
            metadata?: Record<string, unknown>;
        };

        if (result.success && result.text) {
            console.log("Text extracted successfully via Santa AI");
            return result.text;
        }

        return "";
    } catch (error: unknown) {
        const err = error as { cause?: { code?: string }; name?: string; code?: string; message?: string };
        if (err.cause?.code === "ECONNREFUSED" || err.name === "TimeoutError" || err.code === "ECONNREFUSED") {
            console.error("Santa AI not reachable — ensure the service is running on port 8000");
        } else {
            console.error("Santa AI extraction failed:", err.message);
        }
        return "";
    }
}
