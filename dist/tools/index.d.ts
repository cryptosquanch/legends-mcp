export { listLegendsTool, listLegends, formatLegendsMarkdown } from './list-legends.js';
export { summonLegendTool, summonLegend, formatSummonedLegend } from './summon-legend.js';
export { getLegendContextTool, getLegendContext } from './get-legend-context.js';
export { getLegendInsightTool, getLegendInsight, getAllLegendInsights } from './get-legend-insight.js';
export declare const allTools: ({
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
} | {
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
} | {
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
} | {
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
})[];
//# sourceMappingURL=index.d.ts.map