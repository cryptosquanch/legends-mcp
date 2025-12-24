export interface GetLegendContextInput {
    legend_id: string;
    format?: 'full' | 'markdown' | 'system_prompt' | 'frameworks' | 'principles' | 'voice' | 'examples';
    include_related?: boolean;
}
export interface LegendContext {
    legend_id: string;
    name: string;
    format: string;
    content: string;
    metadata: {
        expertise: string[];
        tags: string[];
        framework_count: number;
        principle_count: number;
        example_count: number;
    };
    related_legends?: Array<{
        id: string;
        name: string;
        relationship: string;
    }>;
}
/**
 * Get detailed context about a legend
 * This provides EXTREMELY DETAILED information for maximum usefulness
 */
export declare function getLegendContext(input: GetLegendContextInput): LegendContext;
export declare const getLegendContextTool: {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            legend_id: {
                type: string;
                description: string;
            };
            format: {
                type: string;
                enum: string[];
                description: string;
                default: string;
            };
            include_related: {
                type: string;
                description: string;
                default: boolean;
            };
        };
        required: string[];
    };
};
//# sourceMappingURL=get-legend-context.d.ts.map