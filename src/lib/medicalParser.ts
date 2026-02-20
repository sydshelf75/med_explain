/**
 * Medical Parser — Extracts structured test data from raw OCR/PDF text.
 * Uses regex patterns to identify test names, patient values, and normal ranges.
 */

import { MEDICAL_DICTIONARY, type TestReference } from "./medicalDictionary";

export interface ParsedTest {
    testName: string;
    patientValue: number;
    unit: string;
    normalRange: { low: number; high: number };
    rawText: string;
}

/**
 * Parse raw text from OCR/PDF extraction and identify medical test results.
 */
export function parseRawText(rawText: string): ParsedTest[] {
    const lines = rawText.split("\n").map((l) => l.trim()).filter(Boolean);
    const results: ParsedTest[] = [];
    const foundTests = new Set<string>();

    for (const ref of MEDICAL_DICTIONARY) {
        const match = findTestInLines(lines, ref);
        if (match && !foundTests.has(ref.name)) {
            foundTests.add(ref.name);
            results.push(match);
        }
    }

    return results;
}

/**
 * Searches through lines for a matching test reference.
 */
function findTestInLines(
    lines: string[],
    ref: TestReference
): ParsedTest | null {
    const allNames = [ref.name.toLowerCase(), ...ref.aliases.map((a) => a.toLowerCase())];

    for (let i = 0; i < lines.length; i++) {
        const lineLower = lines[i].toLowerCase();

        for (const name of allNames) {
            if (!lineLower.includes(name)) continue;

            // Try to find a numeric value on the same line or nearby lines
            const value = extractNumericValue(lines[i]);
            if (value !== null) {
                // Try to extract a normal range from the same or nearby lines
                const range = extractNormalRange(lines, i) || ref.normalRange;

                return {
                    testName: ref.name,
                    patientValue: value,
                    unit: ref.unit,
                    normalRange: range,
                    rawText: lines[i],
                };
            }

            // Check the next 2 lines for values
            for (let j = 1; j <= 2 && i + j < lines.length; j++) {
                const nextValue = extractNumericValue(lines[i + j]);
                if (nextValue !== null) {
                    const range =
                        extractNormalRange(lines, i + j) ||
                        extractNormalRange(lines, i) ||
                        ref.normalRange;

                    return {
                        testName: ref.name,
                        patientValue: nextValue,
                        unit: ref.unit,
                        normalRange: range,
                        rawText: `${lines[i]} ${lines[i + j]}`,
                    };
                }
            }
        }
    }

    return null;
}

/**
 * Extract first numeric value from a line.
 * Handles formats: "9.2", "9.2 g/dL", "Result: 9.2"
 */
function extractNumericValue(line: string): number | null {
    // Match numbers that look like test values (with optional decimal)
    const matches = line.match(/(\d+\.?\d*)\s*(g\/dL|mg\/dL|ng\/mL|mIU\/L|%|mmol\/L|µIU\/mL|IU\/L)?/gi);
    if (!matches) return null;

    for (const match of matches) {
        const numMatch = match.match(/(\d+\.?\d*)/);
        if (numMatch) {
            const val = parseFloat(numMatch[1]);
            // Filter out likely non-test numbers (years, dates, ages, etc.)
            if (val > 0 && val < 10000) {
                return val;
            }
        }
    }

    return null;
}

/**
 * Extract normal range from a line or nearby lines.
 * Handles formats: "13.5-17.5", "13.5 - 17.5", "(13.5–17.5)", "Normal: 13.5 to 17.5"
 */
function extractNormalRange(
    lines: string[],
    lineIdx: number
): { low: number; high: number } | null {
    // Check current line and next 2 lines
    for (let i = lineIdx; i < Math.min(lineIdx + 3, lines.length); i++) {
        const line = lines[i];

        // Match range patterns: "13.5-17.5", "13.5 – 17.5", "13.5 to 17.5"
        const rangeMatch = line.match(
            /(\d+\.?\d*)\s*[-–—to]+\s*(\d+\.?\d*)/i
        );
        if (rangeMatch) {
            const low = parseFloat(rangeMatch[1]);
            const high = parseFloat(rangeMatch[2]);
            if (low < high && low >= 0 && high < 10000) {
                return { low, high };
            }
        }
    }

    return null;
}
