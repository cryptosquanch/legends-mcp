export interface SearchLegendsInput {
    query: string;
}
export interface SearchLegendsResult {
    count: number;
    legends: Array<{
        id: string;
        name: string;
        description: string;
        expertise: string[];
        tags: string[];
    }>;
}
/**
 * Search legends by query
 */
export declare function searchLegends(input: SearchLegendsInput): SearchLegendsResult;
/**
 * Format search results as markdown
 */
export declare function formatSearchResults(result: SearchLegendsResult, query: string): string;
export declare const searchLegendsTool: {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            query: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
};
//# sourceMappingURL=search-legends.d.ts.map