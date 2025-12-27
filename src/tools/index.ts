// MCP Tools - Export all tools and handlers

export { listLegendsTool, listLegends, formatLegendsMarkdown } from './list-legends.js';
export { summonLegendTool, summonLegend, formatSummonedLegend } from './summon-legend.js';
export { getLegendContextTool, getLegendContext } from './get-legend-context.js';
export { getLegendInsightTool, getLegendInsight, getAllLegendInsights } from './get-legend-insight.js';
export { searchLegendsTool, searchLegends, formatSearchResults } from './search-legends.js';
export { partyModeTool, partyMode, formatPartyMode } from './party-mode.js';
export { autoMatchTool, autoMatch, formatAutoMatch } from './auto-match.js';
export { suggestTool, suggest, formatSuggestion } from './suggest.js';

// All tool definitions for registration
import { listLegendsTool } from './list-legends.js';
import { summonLegendTool } from './summon-legend.js';
import { getLegendContextTool } from './get-legend-context.js';
import { getLegendInsightTool } from './get-legend-insight.js';
import { searchLegendsTool } from './search-legends.js';
import { partyModeTool } from './party-mode.js';
import { autoMatchTool } from './auto-match.js';
import { suggestTool } from './suggest.js';

export const allTools = [
  suggestTool,        // First! Claude should see this first for proactive use
  listLegendsTool,
  summonLegendTool,
  getLegendContextTool,
  getLegendInsightTool,
  searchLegendsTool,
  partyModeTool,
  autoMatchTool,
];
