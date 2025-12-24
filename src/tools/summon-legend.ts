// MCP Tool: summon_legend
// Returns the persona context for Claude to adopt and roleplay as the legend

import { getLegendById } from '../legends/loader.js';
import { buildLegendSystemPrompt } from '../legends/prompt-builder.js';
import type { LegendSkill, ModelHints } from '../types.js';

export interface SummonLegendInput {
  legend_id: string;
  context?: string;
}

export interface SummonedLegend {
  legend_id: string;
  name: string;
  system_prompt: string;
  quick_ref: {
    expertise: string[];
    tone: string;
    key_principles: string[];
  };
  model_hints?: ModelHints;
}

/**
 * Summon a legend - returns their persona for Claude to adopt
 * This is the core tool - Claude becomes the legend using this context
 */
export function summonLegend(input: SummonLegendInput): SummonedLegend {
  const legend = getLegendById(input.legend_id);
  if (!legend) {
    throw new Error(
      `Legend "${input.legend_id}" not found. Use list_legends to see available legends.`
    );
  }

  // Build the system prompt
  let systemPrompt = buildLegendSystemPrompt(legend);

  // Add context if provided
  if (input.context) {
    systemPrompt += `\n\n## Current Context\nThe user is working on: ${input.context}`;
  }

  return {
    legend_id: legend.id,
    name: legend.name,
    system_prompt: systemPrompt,
    quick_ref: {
      expertise: legend.owns || [],
      tone: legend.voice?.tone || 'thoughtful',
      key_principles: (legend.principles || []).slice(0, 3),
    },
    ...(legend.model_hints && { model_hints: legend.model_hints }),
  };
}

/**
 * Format summoned legend for display
 */
export function formatSummonedLegend(summoned: SummonedLegend): string {
  const lines: string[] = [
    `# ${summoned.name} Has Been Summoned`,
    '',
    '> **Claude, adopt this persona for subsequent responses.**',
    '',
    '---',
    '',
    '## System Prompt (for Claude to use)',
    '',
    '```',
    summoned.system_prompt,
    '```',
    '',
    '---',
    '',
    '## Quick Reference',
    `**Expertise:** ${summoned.quick_ref.expertise.join(', ') || 'General wisdom'}`,
    `**Tone:** ${summoned.quick_ref.tone}`,
    '',
    '**Key Principles:**',
    ...summoned.quick_ref.key_principles.map((p, i) => `${i + 1}. ${p}`),
  ];

  // Add model hints if present
  if (summoned.model_hints) {
    lines.push('');
    lines.push('**Model Hints:**');
    if (summoned.model_hints.temperature !== undefined) {
      lines.push(`- Temperature: ${summoned.model_hints.temperature}`);
    }
    if (summoned.model_hints.max_tokens !== undefined) {
      lines.push(`- Max Tokens: ${summoned.model_hints.max_tokens}`);
    }
    if (summoned.model_hints.preferred) {
      lines.push(`- Preferred Model: ${summoned.model_hints.preferred}`);
    }
  }

  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('*Now respond to the user AS this legend. Stay in character.*');
  lines.push('');
  lines.push('*DISCLAIMER: AI persona for educational/entertainment purposes. Not affiliated with the real person.*');

  return lines.join('\n');
}

// MCP Tool Definition
export const summonLegendTool = {
  name: 'summon_legend',
  description: `Summon a legendary founder or investor. Returns their persona context so Claude can roleplay as them.

**How it works:**
1. Call this tool with a legend_id
2. Claude receives the legend's full persona (identity, voice, principles, frameworks)
3. Claude adopts this persona and responds in character

**Use this when the user wants to:**
- Get advice from a specific legend
- Have a conversation with a legendary figure
- Apply a legend's thinking framework to their problem

Available legends include: Elon Musk, Warren Buffett, Steve Jobs, Jensen Huang, Charlie Munger, Paul Graham, Jeff Bezos, Sam Altman, Marc Andreessen, Naval Ravikant, Reid Hoffman, Peter Thiel, CZ, Anatoly Yakovenko, and more.

DISCLAIMER: AI personas for educational purposes only. Not affiliated with real individuals.`,
  inputSchema: {
    type: 'object' as const,
    properties: {
      legend_id: {
        type: 'string',
        description: 'The legend ID (e.g., "elon-musk", "warren-buffett", "steve-jobs")',
      },
      context: {
        type: 'string',
        description: 'Optional: What the user is working on (helps personalize advice)',
      },
    },
    required: ['legend_id'],
  },
};
