import type { LegendSummary } from '../types.js';
export interface ListLegendsInput {
    category?: string;
    vibe?: 'serious' | 'fun';
}
export interface ListLegendsResult {
    count: number;
    legends: LegendSummary[];
}
/**
 * List all available legends
 */
export declare function listLegends(input?: ListLegendsInput): ListLegendsResult;
/**
 * Format legends list as markdown for display
 */
export declare function formatLegendsMarkdown(result: ListLegendsResult, vibe?: 'serious' | 'fun'): string;
export declare const listLegendsTool: {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            category: {
                type: string;
                description: string;
            };
            vibe: {
                type: string;
                enum: string[];
                description: string;
            };
        };
        required: string[];
    };
};
//# sourceMappingURL=list-legends.d.ts.map