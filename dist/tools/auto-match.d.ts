export interface AutoMatchInput {
    question: string;
    max_matches?: number;
    include_prompts?: boolean;
}
export interface MatchedLegend {
    legend_id: string;
    name: string;
    relevance_reason: string;
    expertise_match: string[];
    key_insight: string;
    system_prompt?: string;
}
export interface AutoMatchResponse {
    question: string;
    matches: MatchedLegend[];
    suggested_approach: string;
}
/**
 * Auto-match legends to a question
 */
export declare function autoMatch(input: AutoMatchInput): AutoMatchResponse;
/**
 * Format auto-match response for display
 */
export declare function formatAutoMatch(response: AutoMatchResponse): string;
export declare const autoMatchTool: {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            question: {
                type: string;
                description: string;
            };
            max_matches: {
                type: string;
                description: string;
            };
            include_prompts: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
};
//# sourceMappingURL=auto-match.d.ts.map