// MCP Tool: search_legends
// Search legends by query string

import { searchLegends as searchLegendsLoader } from '../legends/loader.js';
import type { LegendSkill } from '../types.js';

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
export function searchLegends(input: SearchLegendsInput): SearchLegendsResult {
  const results = searchLegendsLoader(input.query);

  return {
    count: results.length,
    legends: results.map(l => ({
      id: l.id,
      name: l.name,
      description: l.description,
      expertise: l.owns || [],
      tags: l.tags || [],
    })),
  };
}

/**
 * Format search results as markdown
 */
export function formatSearchResults(result: SearchLegendsResult, query: string): string {
  const lines: string[] = [];

  if (result.count === 0) {
    lines.push(`# No legends found for "${query}"`);
    lines.push('');
    lines.push('Try a different search term, or use `list_legends` to see all available legends.');
    return lines.join('\n');
  }

  lines.push(`# Search Results for "${query}" (${result.count} found)`);
  lines.push('');

  for (const legend of result.legends) {
    lines.push(`## ${legend.name}`);
    lines.push(`**ID:** \`${legend.id}\``);
    lines.push(`*${legend.description}*`);
    if (legend.expertise.length > 0) {
      lines.push(`**Expertise:** ${legend.expertise.join(', ')}`);
    }
    if (legend.tags.length > 0) {
      lines.push(`**Tags:** ${legend.tags.join(', ')}`);
    }
    lines.push('');
  }

  lines.push('---');
  lines.push('');
  lines.push('Use `summon_legend` with a legend ID to start a conversation.');

  return lines.join('\n');
}

// MCP Tool Definition
export const searchLegendsTool = {
  name: 'search_legends',
  description: `Search for legends by name, description, expertise, or tags.

Examples:
- "crypto" → finds CZ, Anatoly, Mert, Michael
- "investor" → finds Warren Buffett, Charlie Munger, Peter Thiel
- "first principles" → finds Elon Musk
- "AI" → finds Sam Altman, Jensen Huang

Use this for query-based discovery when you're not sure which legend to summon.`,
  inputSchema: {
    type: 'object' as const,
    properties: {
      query: {
        type: 'string',
        description: 'Search query (matches name, description, tags, expertise)',
      },
    },
    required: ['query'] as string[],
  },
};
