export { listLegendsTool, listLegends, formatLegendsMarkdown } from './list-legends.js';
export { summonLegendTool, summonLegend, formatSummonedLegend } from './summon-legend.js';
export { getLegendContextTool, getLegendContext } from './get-legend-context.js';
export { getLegendInsightTool, getLegendInsight, getAllLegendInsights } from './get-legend-insight.js';
export { searchLegendsTool, searchLegends, formatSearchResults } from './search-legends.js';
export { partyModeTool, partyMode, formatPartyMode } from './party-mode.js';
export { autoMatchTool, autoMatch, formatAutoMatch } from './auto-match.js';
export { suggestTool, suggest, formatSuggestion } from './suggest.js';
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
} | {
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
} | {
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
} | {
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
} | {
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
})[];
//# sourceMappingURL=index.d.ts.map