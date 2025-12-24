import type { LegendSkill } from '../types.js';
export interface GuardrailResult {
    passed: boolean;
    violations: string[];
    sanitizedResponse?: string;
}
export declare function buildLegendGuardrails(legend: LegendSkill): RegExp[];
/**
 * Check if a response violates any guardrails
 * Returns violations if any, or empty array if passed
 */
export declare function checkGuardrails(response: string, legend: LegendSkill, context?: {
    topic?: string;
}): GuardrailResult;
/**
 * Add required disclaimers to response if missing
 */
export declare function addRequiredDisclaimers(response: string, legend: LegendSkill, context?: {
    topic?: string;
}): string;
/**
 * Validate response before returning to user
 * This is the main guardrail enforcement function
 */
export declare function enforceGuardrails(response: string, legend: LegendSkill, context?: {
    topic?: string;
}): {
    response: string;
    warnings: string[];
};
/**
 * Pre-check user input for topics that require extra care
 */
export declare function detectSensitiveTopics(userMessage: string): {
    isFinancial: boolean;
    isInvestmentAdvice: boolean;
    requiresNFA: boolean;
};
/**
 * Generate pre-prompt injection for sensitive topics
 * This adds extra instructions before the user's message
 */
export declare function generateSensitivityPreamble(userMessage: string, legend: LegendSkill): string | null;
//# sourceMappingURL=guardrails.d.ts.map