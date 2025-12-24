export declare const getLegendInsightTool: {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            legend_id: {
                type: string;
                description: string;
            };
            topic: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
};
export interface GetLegendInsightInput {
    legend_id: string;
    topic?: string;
}
export declare function getLegendInsight(input: GetLegendInsightInput): string;
export declare function getAllLegendInsights(legendId: string): string;
//# sourceMappingURL=get-legend-insight.d.ts.map