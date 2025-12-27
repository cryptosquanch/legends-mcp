export interface SuggestInput {
    message: string;
}
export interface SuggestedAction {
    tool: 'summon_legend' | 'party_mode' | 'auto_match';
    params: Record<string, any>;
    description: string;
}
export interface Suggestion {
    should_invoke: boolean;
    confidence: 'high' | 'medium' | 'low';
    recommended_legends: {
        id: string;
        name: string;
        why: string;
    }[];
    use_party_mode: boolean;
    party_mode_reason?: string;
    suggested_actions: SuggestedAction[];
    primary_action: SuggestedAction | null;
    instruction: string;
}
/**
 * Analyze a message and suggest relevant legends
 */
export declare function suggest(input: SuggestInput): Suggestion;
/**
 * Format suggestion for display
 */
export declare function formatSuggestion(suggestion: Suggestion, originalMessage: string): string;
export declare const suggestTool: {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            message: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
};
//# sourceMappingURL=suggest.d.ts.map