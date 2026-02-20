import Anthropic from "@anthropic-ai/sdk";
import type { ExplainedTest, TestStatus } from "./explanationEngine";

const SYSTEM_PROMPT = `You are a medical report analysis assistant. Your job is to:
1. Read raw text extracted from a medical lab report (via OCR or PDF parsing).
2. Identify ALL medical test results present in the text.
3. For each test, extract: the test name, the patient's value, the unit of measurement, and the normal/reference range.
4. Determine the status of each test: "normal", "low", "high", or "borderline".
   - "borderline" means the value is within ~10% of the boundary of the normal range.
5. Write a simple, patient-friendly explanation for each test result. The explanation should:
   - Be written in plain English that a non-medical person can understand.
   - Explain what the test measures.
   - State whether the result is normal, low, high, or borderline.
   - If abnormal, briefly mention possible implications and advise consulting a doctor.
   - Be 2-3 sentences long.

IMPORTANT RULES:
- Only extract tests that have actual numeric values in the report. Do not invent values.
- If you cannot determine a normal range from the report, use standard medical reference ranges.
- The "patientValue" must be a number (not a string).
- The "normalRange" must have numeric "low" and "high" fields.
- The "status" must be exactly one of: "normal", "low", "high", "borderline".

You MUST respond with ONLY a valid JSON array (no markdown, no code fences, no extra text).
Each element must have this exact shape:
{
  "testName": "string",
  "patientValue": number,
  "unit": "string",
  "normalRange": { "low": number, "high": number },
  "status": "normal" | "low" | "high" | "borderline",
  "explanation": "string"
}`;


export async function analyzeWithClaude(
    rawText: string
): Promise<ExplainedTest[]> {
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey || apiKey === "your_anthropic_api_key_here") {
        throw new Error("ANTHROPIC_API_KEY is not configured");
    }

    const client = new Anthropic({ apiKey });

    console.log("Sending medical report text to Claude for analysis...");

    const message = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        messages: [
            {
                role: "user",
                content: `Analyze the following medical report text and extract all test results with explanations.\n\n--- REPORT TEXT ---\n${rawText}\n--- END OF REPORT ---`,
            },
        ],
        system: SYSTEM_PROMPT,
    });

    // Extract the text content from Claude's response
    const responseText = message.content
        .filter((block): block is Anthropic.TextBlock => block.type === "text")
        .map((block) => block.text)
        .join("");

    console.log("Claude response received, parsing results...");

    // Parse the JSON response
    const parsed = parseClaudeResponse(responseText);

    if (parsed.length === 0) {
        console.warn("Claude returned no test results.");
    } else {
        console.log(`Claude identified ${parsed.length} test(s).`);
    }

    return parsed;
}

function parseClaudeResponse(responseText: string): ExplainedTest[] {
    // Strip markdown code fences if present
    let cleaned = responseText.trim();
    if (cleaned.startsWith("```")) {
        cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "");
    }

    try {
        const data = JSON.parse(cleaned);

        if (!Array.isArray(data)) {
            console.error("Claude response is not an array");
            return [];
        }

        // Validate and coerce each item
        return data
            .filter((item: Record<string, unknown>) => {
                return (
                    item &&
                    typeof item.testName === "string" &&
                    typeof item.patientValue === "number" &&
                    typeof item.unit === "string" &&
                    item.normalRange &&
                    typeof (item.normalRange as { low: number }).low === "number" &&
                    typeof (item.normalRange as { high: number }).high === "number" &&
                    typeof item.status === "string" &&
                    typeof item.explanation === "string"
                );
            })
            .map((item: Record<string, unknown>) => ({
                testName: item.testName as string,
                patientValue: item.patientValue as number,
                unit: item.unit as string,
                normalRange: item.normalRange as { low: number; high: number },
                status: validateStatus(item.status as string),
                explanation: item.explanation as string,
            }));
    } catch (err) {
        console.error("Failed to parse Claude response as JSON:", err);
        console.error("Raw response:", responseText.substring(0, 500));
        return [];
    }
}

/**
 * Ensure the status string is a valid TestStatus.
 */
function validateStatus(status: string): TestStatus {
    const valid: TestStatus[] = ["normal", "low", "high", "borderline"];
    const lower = status.toLowerCase() as TestStatus;
    return valid.includes(lower) ? lower : "normal";
}
