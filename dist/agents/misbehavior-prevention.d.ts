import type { LegendSkill } from '../types.js';
export interface MisbehaviorCheck {
    passed: boolean;
    issues: MisbehaviorIssue[];
    severity: 'low' | 'medium' | 'high' | 'critical';
    suggestions: string[];
}
export interface MisbehaviorIssue {
    type: 'character_break' | 'generic' | 'harmful' | 'quality' | 'annoying';
    message: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    matched?: string;
}
/**
 * Check response for misbehavior
 */
export declare function checkMisbehavior(response: string, legend: LegendSkill): MisbehaviorCheck;
/**
 * Pre-check user input for potential issues
 */
export declare function preCheckUserInput(message: string, legend: LegendSkill): {
    needsWarning: boolean;
    warnings: string[];
};
/**
 * Sanitize response to remove problematic content
 */
export declare function sanitizeResponse(response: string, legend: LegendSkill): string;
/**
 * Generate quality improvement suggestions
 */
export declare function getSuggestions(response: string, legend: LegendSkill): string[];
//# sourceMappingURL=misbehavior-prevention.d.ts.map