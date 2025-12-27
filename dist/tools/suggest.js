// MCP Tool: suggest
// Lightweight proactive suggestion tool - designed to be called on EVERY user question
// Returns quick recommendations for legends and party_mode
import { getAllLegends } from '../legends/loader.js';
import { safeString } from '../utils/sanitize.js';
// Topic keywords with associated legend IDs and confidence boosters
const TOPIC_MAP = {
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
export function suggest(input) {
    const msg = safeString(input.message, '').toLowerCase();
    if (!msg || msg.length < 5) {
        return {
            should_invoke: false,
            confidence: 'low',
            recommended_legends: [],
            use_party_mode: false,
            suggested_actions: [],
            primary_action: null,
            instruction: 'No legend recommendation for this message.',
        };
    }
    // Score legends based on keyword matches
    const scores = new Map();
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
    let confidence = 'low';
    if (topScore >= 5)
        confidence = 'high';
    else if (topScore >= 3)
        confidence = 'medium';
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
    // Build suggested actions with ready-to-use parameters
    const suggestedActions = [];
    let instruction = '';
    if (recommended.length > 0 && topScore >= 2) {
        // Always add party_mode option if 2+ legends match
        if (recommended.length >= 2) {
            suggestedActions.push({
                tool: 'party_mode',
                params: {
                    question: input.message,
                    legends: recommended.slice(0, 3).map(l => l.id),
                    max_legends: Math.min(recommended.length, 3),
                },
                description: `Get perspectives from ${recommended.slice(0, 3).map(l => l.name).join(', ')}`,
            });
        }
        // Always add summon_legend for top match
        suggestedActions.push({
            tool: 'summon_legend',
            params: {
                legend_id: recommended[0].id,
                context: input.message,
            },
            description: `Ask ${recommended[0].name} (expert in ${recommended[0].why})`,
        });
        // Add second legend option if available
        if (recommended.length >= 2) {
            suggestedActions.push({
                tool: 'summon_legend',
                params: {
                    legend_id: recommended[1].id,
                    context: input.message,
                },
                description: `Ask ${recommended[1].name} (expert in ${recommended[1].why})`,
            });
        }
        // Always add auto_match for deeper exploration
        suggestedActions.push({
            tool: 'auto_match',
            params: {
                question: input.message,
                max_matches: 3,
                include_prompts: false,
            },
            description: `Deep dive: Get detailed analysis of which legends best match this question`,
        });
    }
    // Determine primary action and instruction
    let primaryAction = null;
    if (suggestedActions.length > 0) {
        if (usePartyMode && suggestedActions.find(a => a.tool === 'party_mode')) {
            primaryAction = suggestedActions.find(a => a.tool === 'party_mode');
            instruction = `🎯 **RECOMMENDED: Use party_mode** for multiple perspectives from ${recommended.slice(0, 3).map(l => l.name).join(', ')}.\n\nCall: \`party_mode({ question: "${input.message.slice(0, 100)}${input.message.length > 100 ? '...' : ''}", legends: ${JSON.stringify(recommended.slice(0, 3).map(l => l.id))} })\``;
        }
        else {
            primaryAction = suggestedActions.find(a => a.tool === 'summon_legend');
            instruction = `🎯 **RECOMMENDED: Summon ${recommended[0].name}** (${recommended[0].why}).\n\nCall: \`summon_legend({ legend_id: "${recommended[0].id}", context: "${input.message.slice(0, 80)}${input.message.length > 80 ? '...' : ''}" })\``;
        }
        // Add alternatives
        if (suggestedActions.length > 1) {
            instruction += '\n\n**Alternatives:**\n';
            suggestedActions.slice(0, 3).forEach((action, i) => {
                if (action !== primaryAction) {
                    instruction += `${i + 1}. ${action.description}\n`;
                }
            });
        }
    }
    else {
        instruction = 'No legend recommendation for this message.';
    }
    return {
        should_invoke: topScore >= 2,
        confidence,
        recommended_legends: recommended,
        use_party_mode: usePartyMode,
        party_mode_reason: partyModeReason || undefined,
        suggested_actions: suggestedActions,
        primary_action: primaryAction,
        instruction,
    };
}
/**
 * Format suggestion for display
 */
export function formatSuggestion(suggestion, originalMessage) {
    if (!suggestion.should_invoke) {
        return ''; // Return empty - no suggestion needed
    }
    const lines = [
        '# 💡 Legend Suggestion',
        '',
        suggestion.instruction,
        '',
        '---',
        '',
    ];
    // Show all available actions
    if (suggestion.suggested_actions.length > 0) {
        lines.push('## Ready-to-Use Actions');
        lines.push('');
        suggestion.suggested_actions.forEach((action, i) => {
            const isPrimary = action === suggestion.primary_action;
            lines.push(`### ${isPrimary ? '⭐ ' : ''}Option ${i + 1}: ${action.tool}`);
            lines.push(`${action.description}`);
            lines.push('```json');
            lines.push(JSON.stringify(action.params, null, 2));
            lines.push('```');
            lines.push('');
        });
    }
    lines.push('---');
    lines.push(`*Confidence: ${suggestion.confidence}* | *Legends matched: ${suggestion.recommended_legends.length}*`);
    if (suggestion.party_mode_reason) {
        lines.push('');
        lines.push(`*Party mode reason: ${suggestion.party_mode_reason}*`);
    }
    return lines.join('\n');
}
// MCP Tool Definition - Note the description tells Claude to use this PROACTIVELY
export const suggestTool = {
    name: 'suggest',
    description: `🔮 **PROACTIVE LEGEND SUGGESTER** - Returns ready-to-execute actions!

**⚡ USE THIS PROACTIVELY** on questions about:
business, startups, investing, crypto, AI, leadership, decisions, life advice

**HOW IT WORKS:**
1. Pass user's message → \`suggest({ message: "..." })\`
2. Get back \`primary_action\` with ready-to-use params
3. **EXECUTE the suggested action** (party_mode or summon_legend)

**RETURNS READY ACTIONS:**
\`\`\`json
{
  "primary_action": {
    "tool": "party_mode",           // or "summon_legend"
    "params": { ... },              // Ready to pass directly!
    "description": "Get perspectives from Paul Graham, Marc Andreessen"
  },
  "suggested_actions": [ ... ],     // All options
  "instruction": "🎯 RECOMMENDED: Use party_mode..."
}
\`\`\`

**EXAMPLE FLOW:**
\`\`\`
User: "How do I raise my seed round?"

1. Call: suggest({ message: "How do I raise my seed round?" })

2. Response includes:
   primary_action.tool = "party_mode"
   primary_action.params = { question: "...", legends: ["paul-graham", "marc-andreessen", "bill-gurley"] }

3. Execute: party_mode(primary_action.params)
   → Multiple legends discuss the question!
\`\`\`

**OR for single legend:**
\`\`\`
primary_action.tool = "summon_legend"
primary_action.params = { legend_id: "paul-graham", context: "..." }

Execute: summon_legend(primary_action.params)
→ Paul Graham responds in character!
\`\`\`

**WHEN TO USE EACH TOOL:**
- **party_mode**: Complex questions, "pros/cons", "different perspectives", debates
- **summon_legend**: Specific expertise needed, single mentor preferred
- **auto_match**: Deep analysis, unsure which legend, want detailed matching

**ALL 3 ARE ALWAYS SUGGESTED** - pick the best fit for the user's needs!

DISCLAIMER: AI personas for educational purposes only.`,
    inputSchema: {
        type: 'object',
        properties: {
            message: {
                type: 'string',
                description: 'The user\'s message or question to analyze for legend relevance',
            },
        },
        required: ['message'],
    },
};
//# sourceMappingURL=suggest.js.map