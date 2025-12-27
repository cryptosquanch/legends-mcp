export interface PartyModeInput {
    question: string;
    legends?: string[];
    category?: string;
    max_legends?: number;
}
export interface PartyModeResponse {
    question: string;
    participants: {
        legend_id: string;
        name: string;
        perspective_hint: string;
        expertise: string[];
    }[];
    discussion_prompt: string;
    format_guide: string;
}
/**
 * Activate party mode - multiple legends discuss a question
 */
export declare function partyMode(input: PartyModeInput): PartyModeResponse;
/**
 * Format party mode response for display
 */
export declare function formatPartyMode(response: PartyModeResponse): string;
export declare const partyModeTool: {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            question: {
                type: string;
                description: string;
            };
            legends: {
                type: string;
                items: {
                    type: string;
                };
                description: string;
            };
            category: {
                type: string;
                enum: string[];
                description: string;
            };
            max_legends: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
};
//# sourceMappingURL=party-mode.d.ts.map