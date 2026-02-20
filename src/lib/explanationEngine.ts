/**
 * Explanation Engine — Generates patient-friendly explanations
 * for parsed medical test results.
 */

import { MEDICAL_DICTIONARY } from "./medicalDictionary";
import type { ParsedTest } from "./medicalParser";

export type TestStatus = "normal" | "low" | "high" | "borderline";

export interface ExplainedTest {
    testName: string;
    patientValue: number;
    unit: string;
    normalRange: { low: number; high: number };
    status: TestStatus;
    explanation: string;
}

/**
 * Borderline threshold — percentage within which a value is considered borderline.
 * e.g., 10% means if the value is within 10% of the range boundary, it's borderline.
 */
const BORDERLINE_THRESHOLD = 0.1;

/**
 * Generate explanations for a list of parsed tests.
 */
export function generateExplanations(tests: ParsedTest[]): ExplainedTest[] {
    return tests.map((test) => {
        const status = determineStatus(test);
        const explanation = getExplanation(test.testName, status);

        return {
            testName: test.testName,
            patientValue: test.patientValue,
            unit: test.unit,
            normalRange: test.normalRange,
            status,
            explanation,
        };
    });
}

/**
 * Determine if a test value is normal, low, high, or borderline.
 */
function determineStatus(test: ParsedTest): TestStatus {
    const { patientValue, normalRange } = test;
    const { low, high } = normalRange;
    const rangeSpan = high - low;
    const borderlineMargin = rangeSpan * BORDERLINE_THRESHOLD;

    if (patientValue < low) {
        // Check if it's borderline low (within threshold of the low boundary)
        if (patientValue >= low - borderlineMargin) {
            return "borderline";
        }
        return "low";
    }

    if (patientValue > high) {
        // Check if it's borderline high
        if (patientValue <= high + borderlineMargin) {
            return "borderline";
        }
        return "high";
    }

    return "normal";
}

/**
 * Get explanation text for a test by name and status.
 * Falls back to a generic template if the test isn't in the dictionary.
 */
function getExplanation(testName: string, status: TestStatus): string {
    const ref = MEDICAL_DICTIONARY.find(
        (d) => d.name.toLowerCase() === testName.toLowerCase()
    );

    if (ref) {
        return ref.explanations[status];
    }

    // Generic fallback explanations
    const genericExplanations: Record<TestStatus, string> = {
        normal:
            `Your ${testName} level is within the normal range. This is generally a good sign.`,
        low:
            `Your ${testName} level is lower than the normal range. Please consult your doctor for proper evaluation.`,
        high:
            `Your ${testName} level is higher than the normal range. Please consult your doctor for proper evaluation.`,
        borderline:
            `Your ${testName} level is near the edge of the normal range. It may be worth monitoring. Please discuss with your doctor.`,
    };

    return genericExplanations[status];
}
