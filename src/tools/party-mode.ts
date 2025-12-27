// MCP Tool: party_mode
// Enables group discussions with multiple legends responding to questions
// Inspired by BMAD's party mode feature

import { getAllLegends, getLegendById } from '../legends/loader.js';
import { buildLegendSystemPrompt } from '../legends/prompt-builder.js';
import { sanitizeContext, escapeBackticks, safeString } from '../utils/sanitize.js';
import type { LegendSkill } from '../types.js';

export interface PartyModeInput {
  question: string;
  legends?: string[]; // Optional: specific legend IDs to include
  category?: string;  // Optional: filter by category (crypto, investor, founder, tech)
  max_legends?: number; // Default: 3, Max: 5
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

// Topic to legend mapping for intelligent selection
const TOPIC_LEGEND_MAP: Record<string, string[]> = {
  // Crypto/Web3
  crypto: ['cz-binance', 'vitalik-buterin', 'anatoly-yakovenko', 'balaji-srinivasan', 'brian-armstrong'],
  defi: ['hayden-adams', 'andre-cronje', 'vitalik-buterin'],
  solana: ['anatoly-yakovenko', 'mert-mumtaz'],
  bitcoin: ['jack-dorsey', 'michael-saylor', 'balaji-srinivasan'],

  // Investing
  investing: ['warren-buffett', 'charlie-munger', 'ray-dalio', 'howard-marks', 'cathie-wood'],
  value: ['warren-buffett', 'charlie-munger', 'howard-marks', 'benjamin-graham'],
  growth: ['cathie-wood', 'bill-gurley', 'marc-andreessen'],
  venture: ['marc-andreessen', 'peter-thiel', 'bill-gurley', 'reid-hoffman'],

  // Startups
  startup: ['paul-graham', 'sam-altman', 'peter-thiel', 'reid-hoffman'],
  founder: ['elon-musk', 'jeff-bezos', 'brian-chesky', 'tobi-lutke', 'patrick-collison'],
  yc: ['paul-graham', 'sam-altman'],
  scale: ['reid-hoffman', 'patrick-collison', 'tobi-lutke'],

  // Tech
  ai: ['sam-altman', 'demis-hassabis', 'jensen-huang', 'elon-musk'],
  product: ['steve-jobs', 'brian-chesky', 'tobi-lutke'],
  engineering: ['elon-musk', 'jensen-huang', 'patrick-collison'],
  leadership: ['satya-nadella', 'sundar-pichai', 'jeff-bezos'],

  // Philosophy/Mindset
  philosophy: ['naval-ravikant', 'charlie-munger', 'ray-dalio'],
  productivity: ['tim-ferriss', 'naval-ravikant'],
  marketing: ['gary-vaynerchuk', 'seth-godin'],
};

/**
 * Intelligently select legends based on question content
 */
function selectLegendsForQuestion(question: string, maxLegends: number = 3): string[] {
  const q = question.toLowerCase();
  const selectedIds = new Set<string>();

  // Check topic mappings
  for (const [topic, legendIds] of Object.entries(TOPIC_LEGEND_MAP)) {
    if (q.includes(topic)) {
      legendIds.forEach(id => selectedIds.add(id));
    }
  }

  // If no specific matches, use diverse defaults
  if (selectedIds.size === 0) {
    // Default diverse panel
    ['elon-musk', 'warren-buffett', 'paul-graham', 'naval-ravikant', 'steve-jobs']
      .forEach(id => selectedIds.add(id));
  }

  // Limit to max and return
  return Array.from(selectedIds).slice(0, maxLegends);
}

/**
 * Get a brief perspective hint for each legend
 */
function getPerspectiveHint(legend: LegendSkill): string {
  // Use voice tone or first principle as hint
  if (legend.voice?.tone) {
    return `Will respond in a ${legend.voice.tone} manner`;
  }
  if (legend.principles?.[0]) {
    return `Guided by: "${safeString(legend.principles[0], '').slice(0, 50)}..."`;
  }
  return 'Will offer their unique perspective';
}

/**
 * Activate party mode - multiple legends discuss a question
 */
export function partyMode(input: PartyModeInput): PartyModeResponse {
  const { sanitized: question } = sanitizeContext(input.question);
  const maxLegends = Math.min(input.max_legends || 3, 5);

  // Determine which legends to include
  let legendIds: string[];

  if (input.legends?.length) {
    // User specified legends
    legendIds = input.legends.slice(0, maxLegends);
  } else if (input.category) {
    // Filter by category
    const categoryLegends = TOPIC_LEGEND_MAP[input.category.toLowerCase()];
    legendIds = categoryLegends ? categoryLegends.slice(0, maxLegends) : selectLegendsForQuestion(question, maxLegends);
  } else {
    // Auto-select based on question
    legendIds = selectLegendsForQuestion(question, maxLegends);
  }

  // Build participants list
  const participants = legendIds.map(id => {
    const legend = getLegendById(id);
    if (!legend) return null;

    return {
      legend_id: legend.id,
      name: legend.name,
      perspective_hint: getPerspectiveHint(legend),
      expertise: (legend.owns || []).slice(0, 5),
    };
  }).filter((p): p is NonNullable<typeof p> => p !== null);

  if (participants.length === 0) {
    throw new Error('No valid legends found for party mode. Check legend IDs or try a different category.');
  }

  // Build discussion prompt
  const discussionPrompt = buildDiscussionPrompt(participants, question);

  return {
    question: escapeBackticks(question),
    participants,
    discussion_prompt: discussionPrompt,
    format_guide: `
## Party Mode Discussion Format

For each legend, respond AS that person:

${participants.map((p, i) => `### ${i + 1}. ${p.name}
[Respond in their voice, using their frameworks and vocabulary]
`).join('\n')}

### Synthesis
[Optionally summarize key agreements/disagreements]

---
*Remember: Each legend should sound distinct and true to their character.*
`,
  };
}

/**
 * Build the discussion prompt for Claude
 */
function buildDiscussionPrompt(
  participants: PartyModeResponse['participants'],
  question: string
): string {
  const legendNames = participants.map(p => p.name).join(', ');

  return `You are facilitating a group discussion between these legendary figures: ${legendNames}

Each person should respond to this question in their authentic voice:

"${question}"

Guidelines:
1. Each legend responds separately, using their characteristic vocabulary and thinking frameworks
2. They can reference or build on each other's points
3. They may politely disagree based on their principles
4. Keep each response focused (2-4 paragraphs per legend)
5. Stay true to each legend's documented philosophy and communication style

The goal is an insightful discussion that showcases diverse perspectives on the topic.`;
}

/**
 * Format party mode response for display
 */
export function formatPartyMode(response: PartyModeResponse): string {
  const lines: string[] = [
    '# Party Mode Activated',
    '',
    `**Question:** ${response.question}`,
    '',
    '## Participants',
    '',
  ];

  response.participants.forEach((p, i) => {
    lines.push(`${i + 1}. **${p.name}**`);
    lines.push(`   - ${p.perspective_hint}`);
    lines.push(`   - Expertise: ${p.expertise.join(', ') || 'General wisdom'}`);
    lines.push('');
  });

  lines.push('---');
  lines.push('');
  lines.push('## Discussion Prompt');
  lines.push('');
  lines.push('```');
  lines.push(escapeBackticks(response.discussion_prompt));
  lines.push('```');
  lines.push('');
  lines.push(response.format_guide);
  lines.push('');
  lines.push('---');
  lines.push('*DISCLAIMER: AI personas for educational purposes. Not affiliated with real individuals.*');

  return lines.join('\n');
}

// MCP Tool Definition
export const partyModeTool = {
  name: 'party_mode',
  description: `Activate Party Mode - multiple legendary figures discuss your question together!

**How it works:**
1. Ask a question about any topic
2. Party mode selects relevant legends (or you can specify)
3. Each legend responds in their authentic voice
4. Get diverse perspectives from multiple experts

**Use this when:**
- You want multiple viewpoints on a complex topic
- You're making a big decision and want varied advice
- You want to see how different thinkers approach a problem
- You want an engaging group discussion format

**Examples:**
- "What makes a great startup founder?" → Panel of founders discuss
- "Is Bitcoin a good investment?" → Crypto experts + traditional investors debate
- "How do you build company culture?" → Tech leaders share perspectives

DISCLAIMER: AI personas for educational purposes only.`,
  inputSchema: {
    type: 'object' as const,
    properties: {
      question: {
        type: 'string',
        description: 'The question or topic for the legends to discuss',
      },
      legends: {
        type: 'array',
        items: { type: 'string' },
        description: 'Optional: Specific legend IDs to include (e.g., ["elon-musk", "warren-buffett"])',
      },
      category: {
        type: 'string',
        enum: ['crypto', 'defi', 'investing', 'value', 'growth', 'venture', 'startup', 'founder', 'ai', 'product', 'philosophy'],
        description: 'Optional: Filter legends by category',
      },
      max_legends: {
        type: 'number',
        description: 'Optional: Maximum legends to include (default: 3, max: 5)',
      },
    },
    required: ['question'],
  },
};
