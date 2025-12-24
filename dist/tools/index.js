// MCP Tools - Export all tools and handlers
export { listLegendsTool, listLegends, formatLegendsMarkdown } from './list-legends.js';
export { summonLegendTool, summonLegend, formatSummonedLegend } from './summon-legend.js';
export { getLegendContextTool, getLegendContext } from './get-legend-context.js';
export { getLegendInsightTool, getLegendInsight, getAllLegendInsights } from './get-legend-insight.js';
export { searchLegendsTool, searchLegends, formatSearchResults } from './search-legends.js';
// All tool definitions for registration
import { listLegendsTool } from './list-legends.js';
import { summonLegendTool } from './summon-legend.js';
import { getLegendContextTool } from './get-legend-context.js';
import { getLegendInsightTool } from './get-legend-insight.js';
import { searchLegendsTool } from './search-legends.js';
export const allTools = [
    listLegendsTool,
    summonLegendTool,
    getLegendContextTool,
    getLegendInsightTool,
    searchLegendsTool,
];
//# sourceMappingURL=index.js.map