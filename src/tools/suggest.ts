// MCP Tool: suggest
// Lightweight proactive suggestion tool - designed to be called on EVERY user question
// Returns quick recommendations for legends and party_mode

import { getAllLegends } from '../legends/loader.js';
import { safeString } from '../utils/sanitize.js';
import type { LegendSkill } from '../types.js';

export interface SuggestInput {
  message: string; // The user's message/question
}

export interface Suggestion {
  should_invoke: boolean;
  confidence: 'high' | 'medium' | 'low';
  recommended_legends: {
    id: string;
    name: string;
    why: string;
  }[];
  use_party_mode: boolean;
  party_mode_reason?: string;
  quick_prompt?: string; // Ready-to-use prompt for Claude
}

// Topic keywords with associated legend IDs and confidence boosters
const TOPIC_MAP: Record<string, { legends: string[]; boost: number }> = {
  // High confidence triggers (specific domains)
  crypto: { legends: ['cz-binance', 'vitalik-buterin', 'balaji-srinivasan'], boost: 3 },
  bitcoin: { legends: ['jack-dorsey', 'balaji-srinivasan'], boost: 3 },
  ethereum: { legends: ['vitalik-buterin', 'hayden-adams'], boost: 3 },
  solana: { legends: ['anatoly-yakovenko', 'mert-mumtaz'], boost: 3 },
  defi: { legends: ['hayden-adams', 'andre-cronje'], boost: 3 },

  startup: { legends: ['paul-graham', 'sam-altman', 'peter-thiel'], boost: 3 },
  founder: { legends: ['elon-musk', 'jeff-bezos', 'brian-chesky'], boost: 3 },
  fundrais: { legends: ['paul-graham', 'marc-andreessen', 'bill-gurley'], boost: 3 },
  pitch: { legends: ['paul-graham', 'peter-thiel'], boost: 3 },
  yc: { legends: ['paul-graham', 'sam-altman'], boost: 3 },

  invest: { legends: ['warren-buffett', 'charlie-munger', 'ray-dalio'], boost: 3 },
  stock: { legends: ['warren-buffett', 'peter-lynch', 'cathie-wood'], boost: 3 },
  portfolio: { legends: ['ray-dalio', 'howard-marks'], boost: 2 },

  ai: { legends: ['sam-altman', 'demis-hassabis', 'jensen-huang'], boost: 3 },
  artificial: { legends: ['sam-altman', 'demis-hassabis'], boost: 2 },

  // Medium confidence (general business)
  business: { legends: ['jeff-bezos', 'warren-buffett', 'charlie-munger'], boost: 2 },
  company: { legends: ['jeff-bezos', 'satya-nadella', 'tobi-lutke'], boost: 2 },
  product: { legends: ['steve-jobs', 'brian-chesky', 'tobi-lutke'], boost: 2 },
  design: { legends: ['steve-jobs', 'brian-chesky'], boost: 2 },
  scale: { legends: ['reid-hoffman', 'patrick-collison'], boost: 2 },
  growth: { legends: ['reid-hoffman', 'gary-vaynerchuk'], boost: 2 },

  lead: { legends: ['satya-nadella', 'jeff-bezos'], boost: 2 },
  manage: { legends: ['satya-nadella', 'andy-grove'], boost: 2 },
  team: { legends: ['reid-hoffman', 'patrick-collison'], boost: 2 },
  hire: { legends: ['paul-graham', 'reid-hoffman'], boost: 2 },
  culture: { legends: ['brian-chesky', 'tobi-lutke'], boost: 2 },

  market: { legends: ['seth-godin', 'gary-vaynerchuk'], boost: 2 },
  brand: { legends: ['gary-vaynerchuk', 'steve-jobs'], boost: 2 },
  social: { legends: ['gary-vaynerchuk', 'jack-dorsey'], boost: 2 },

  // Lower confidence (life/philosophy)
  life: { legends: ['naval-ravikant', 'tim-ferriss'], boost: 1 },
  success: { legends: ['naval-ravikant', 'tim-ferriss'], boost: 1 },
  wealth: { legends: ['naval-ravikant', 'warren-buffett'], boost: 1 },
  happiness: { legends: ['naval-ravikant'], boost: 1 },
  decision: { legends: ['charlie-munger', 'ray-dalio', 'jeff-bezos'], boost: 2 },
  think: { legends: ['charlie-munger', 'naval-ravikant'], boost: 1 },
  mental: { legends: ['charlie-munger', 'naval-ravikant'], boost: 2 },
  philosophy: { legends: ['naval-ravikant', 'charlie-munger'], boost: 1 },

  // Question patterns that suggest advice-seeking
  'should i': { legends: ['charlie-munger', 'naval-ravikant'], boost: 2 },
  'how do i': { legends: ['paul-graham', 'naval-ravikant'], boost: 2 },
  'how to': { legends: ['paul-graham', 'tim-ferriss'], boost: 1 },
  'what would': { legends: ['charlie-munger', 'warren-buffett'], boost: 2 },
  'advice': { legends: ['naval-ravikant', 'paul-graham'], boost: 2 },
};

// Questions that benefit from multiple perspectives (party mode)
const PARTY_MODE_TRIGGERS = [
  'debate',
  'different perspective',
  'what do .* think',
  'various view',
  'multiple opinion',
  'compare',
  'contrast',
  'pros and cons',
  'should i .* or',
  'best approach',
  'trade-?off',
];

/**
 * Analyze a message and suggest relevant legends
 */
export function suggest(input: SuggestInput): Suggestion {
  const msg = safeString(input.message, '').toLowerCase();

  if (!msg || msg.length < 5) {
    return {
      should_invoke: false,
      confidence: 'low',
      recommended_legends: [],
      use_party_mode: false,
    };
  }

  // Score legends based on keyword matches
  const scores = new Map<string, { score: number; reasons: string[] }>();

  for (const [keyword, data] of Object.entries(TOPIC_MAP)) {
    if (msg.includes(keyword)) {
      for (const legendId of data.legends) {
        const current = scores.get(legendId) || { score: 0, reasons: [] };
        current.score += data.boost;
        current.reasons.push(keyword);
        scores.set(legendId, current);
      }
    }
  }

  // Get top matches
  const sorted = Array.from(scores.entries())
    .sort((a, b) => b[1].score - a[1].score)
    .slice(0, 3);

  // Determine confidence
  const topScore = sorted[0]?.[1].score || 0;
  let confidence: 'high' | 'medium' | 'low' = 'low';
  if (topScore >= 5) confidence = 'high';
  else if (topScore >= 3) confidence = 'medium';

  // Check if party mode would be beneficial
  let usePartyMode = false;
  let partyModeReason = '';

  for (const pattern of PARTY_MODE_TRIGGERS) {
    if (new RegExp(pattern, 'i').test(msg)) {
      usePartyMode = true;
      partyModeReason = `Question suggests wanting multiple perspectives (matched: "${pattern}")`;
      break;
    }
  }

  // Also suggest party mode for complex questions with multiple high-scoring legends
  if (sorted.length >= 2 && sorted[0][1].score >= 3 && sorted[1][1].score >= 3) {
    usePartyMode = true;
    partyModeReason = partyModeReason || 'Multiple legends have strong expertise in this area';
  }

  // Build recommendations
  const allLegends = getAllLegends();
  const recommended = sorted.map(([id, data]) => {
    const legend = allLegends.find(l => l.id === id);
    return {
      id,
      name: legend?.name || id,
      why: data.reasons.join(', '),
    };
  });

  // Generate quick prompt if we have recommendations
  let quickPrompt: string | undefined;
  if (recommended.length > 0 && confidence !== 'low') {
    if (usePartyMode) {
      quickPrompt = `Use party_mode with question: "${input.message}"`;
    } else {
      quickPrompt = `Use summon_legend with legend_id: "${recommended[0].id}"`;
    }
  }

  return {
    should_invoke: topScore >= 2,
    confidence,
    recommended_legends: recommended,
    use_party_mode: usePartyMode,
    party_mode_reason: partyModeReason || undefined,
    quick_prompt: quickPrompt,
  };
}

/**
 * Format suggestion for display
 */
export function formatSuggestion(suggestion: Suggestion, originalMessage: string): string {
  if (!suggestion.should_invoke) {
    return ''; // Return empty - no suggestion needed
  }

  const lines: string[] = [
    '💡 **Legend Suggestion**',
    '',
  ];

  if (suggestion.use_party_mode && suggestion.recommended_legends.length >= 2) {
    lines.push(`**Recommended:** Use \`party_mode\` for multiple perspectives`);
    lines.push('');
    lines.push('**Relevant legends:**');
    suggestion.recommended_legends.forEach(l => {
      lines.push(`- **${l.name}** (${l.why})`);
    });
    if (suggestion.party_mode_reason) {
      lines.push('');
      lines.push(`*${suggestion.party_mode_reason}*`);
    }
  } else if (suggestion.recommended_legends.length > 0) {
    const top = suggestion.recommended_legends[0];
    lines.push(`**Recommended:** Ask **${top.name}** (expertise: ${top.why})`);

    if (suggestion.recommended_legends.length > 1) {
      lines.push('');
      lines.push('**Also relevant:**');
      suggestion.recommended_legends.slice(1).forEach(l => {
        lines.push(`- ${l.name} (${l.why})`);
      });
    }
  }

  lines.push('');
  lines.push(`*Confidence: ${suggestion.confidence}*`);

  return lines.join('\n');
}

// MCP Tool Definition - Note the description tells Claude to use this PROACTIVELY
export const suggestTool = {
  name: 'suggest',
  description: `🔮 **PROACTIVE SUGGESTION TOOL** - Call this on user questions to get legend recommendations!

**IMPORTANT: Use this tool proactively!**
When a user asks about business, startups, investing, crypto, leadership, or life advice,
call this tool FIRST to see if a legend can help.

**How it works:**
1. Pass the user's message/question
2. Get back: which legends are relevant + whether to use party_mode
3. Follow the recommendation (or let user decide)

**Returns:**
- \`should_invoke\`: Whether legends are relevant (true/false)
- \`confidence\`: How confident the match is (high/medium/low)
- \`recommended_legends\`: List of relevant legends with reasons
- \`use_party_mode\`: Whether multiple perspectives would help
- \`quick_prompt\`: Ready-to-use command

**Example flow:**
User: "How do I raise my seed round?"
→ Call suggest({message: "How do I raise my seed round?"})
→ Returns: paul-graham, marc-andreessen recommended, party_mode: true
→ Either auto-invoke party_mode OR ask user if they want legend advice

**Trigger keywords:** startup, crypto, invest, AI, founder, scale, leadership, decision, life advice

DISCLAIMER: AI personas for educational purposes only.`,
  inputSchema: {
    type: 'object' as const,
    properties: {
      message: {
        type: 'string',
        description: 'The user\'s message or question to analyze for legend relevance',
      },
    },
    required: ['message'],
  },
};
