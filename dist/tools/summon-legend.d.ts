import type { ModelHints } from '../types.js';
export interface SummonLegendInput {
    legend_id: string;
    context?: string;
}
export interface SummonedLegend {
    legend_id: string;
    name: string;
    system_prompt: string;
    user_context?: string;
    quick_ref: {
        expertise: string[];
        tone: string;
        key_principles: string[];
    };
    model_hints?: ModelHints;
    context_warnings?: string[];
}
/**
 * Summon a legend - returns their persona for Claude to adopt
 * This is the core tool - Claude becomes the legend using this context
 */
export declare function summonLegend(input: SummonLegendInput): SummonedLegend;
/**
 * Format summoned legend for display
 * Uses JSON for system prompt to prevent backtick injection
 */
export declare function formatSummonedLegend(summoned: SummonedLegend): string;
export declare const summonLegendTool: {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            legend_id: {
                type: string;
                description: string;
            };
            context: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
};
//# sourceMappingURL=summon-legend.d.ts.map