// MCP Tool: auto_match
// Automatically matches and provides context from relevant legends based on user's question
// This is the "auto proc" feature - proactively giving relevant legend perspectives
import { getLegendById } from '../legends/loader.js';
import { buildLegendSystemPrompt } from '../legends/prompt-builder.js';
import { sanitizeContext, escapeBackticks, safeString } from '../utils/sanitize.js';
// Keywords to legend expertise mapping
const EXPERTISE_KEYWORDS = {
    // Crypto & Web3
    crypto: { legends: ['cz-binance', 'vitalik-buterin', 'balaji-srinivasan'], expertise: 'cryptocurrency' },
    bitcoin: { legends: ['michael-saylor', 'jack-dorsey', 'balaji-srinivasan'], expertise: 'Bitcoin' },
    ethereum: { legends: ['vitalik-buterin'], expertise: 'Ethereum' },
    solana: { legends: ['anatoly-yakovenko', 'mert-mumtaz'], expertise: 'Solana' },
    defi: { legends: ['hayden-adams', 'andre-cronje', 'vitalik-buterin'], expertise: 'DeFi' },
    nft: { legends: ['gary-vaynerchuk', 'cz-binance'], expertise: 'NFTs' },
    blockchain: { legends: ['vitalik-buterin', 'balaji-srinivasan', 'cz-binance'], expertise: 'blockchain' },
    web3: { legends: ['balaji-srinivasan', 'chris-dixon'], expertise: 'Web3' },
    exchange: { legends: ['cz-binance', 'brian-armstrong'], expertise: 'crypto exchanges' },
    // Investing
    invest: { legends: ['warren-buffett', 'charlie-munger', 'ray-dalio'], expertise: 'investing' },
    stock: { legends: ['warren-buffett', 'peter-lynch', 'cathie-wood'], expertise: 'stock investing' },
    value: { legends: ['warren-buffett', 'charlie-munger', 'benjamin-graham'], expertise: 'value investing' },
    growth: { legends: ['cathie-wood', 'bill-gurley'], expertise: 'growth investing' },
    portfolio: { legends: ['ray-dalio', 'howard-marks'], expertise: 'portfolio management' },
    risk: { legends: ['ray-dalio', 'howard-marks', 'nassim-taleb'], expertise: 'risk management' },
    venture: { legends: ['marc-andreessen', 'peter-thiel', 'bill-gurley'], expertise: 'venture capital' },
    // Startups
    startup: { legends: ['paul-graham', 'sam-altman', 'peter-thiel'], expertise: 'startups' },
    founder: { legends: ['elon-musk', 'jeff-bezos', 'brian-chesky'], expertise: 'founding companies' },
    fundrais: { legends: ['paul-graham', 'marc-andreessen', 'peter-thiel'], expertise: 'fundraising' },
    pitch: { legends: ['paul-graham', 'guy-kawasaki'], expertise: 'pitching' },
    scale: { legends: ['reid-hoffman', 'patrick-collison', 'tobi-lutke'], expertise: 'scaling' },
    yc: { legends: ['paul-graham', 'sam-altman'], expertise: 'Y Combinator' },
    accelerat: { legends: ['paul-graham', 'sam-altman'], expertise: 'accelerators' },
    // Tech & Product
    product: { legends: ['steve-jobs', 'brian-chesky', 'tobi-lutke'], expertise: 'product development' },
    design: { legends: ['steve-jobs', 'jony-ive', 'brian-chesky'], expertise: 'design' },
    engineer: { legends: ['elon-musk', 'jensen-huang', 'patrick-collison'], expertise: 'engineering' },
    ai: { legends: ['sam-altman', 'demis-hassabis', 'jensen-huang'], expertise: 'artificial intelligence' },
    machine: { legends: ['demis-hassabis', 'andrej-karpathy'], expertise: 'machine learning' },
    gpu: { legends: ['jensen-huang'], expertise: 'GPUs' },
    software: { legends: ['bill-gates', 'satya-nadella', 'marc-andreessen'], expertise: 'software' },
    hardware: { legends: ['steve-jobs', 'jensen-huang', 'elon-musk'], expertise: 'hardware' },
    // Leadership & Management
    lead: { legends: ['satya-nadella', 'jeff-bezos', 'reed-hastings'], expertise: 'leadership' },
    manage: { legends: ['andy-grove', 'ben-horowitz', 'reed-hastings'], expertise: 'management' },
    culture: { legends: ['reed-hastings', 'brian-chesky', 'tobi-lutke'], expertise: 'company culture' },
    team: { legends: ['ben-horowitz', 'patrick-lencioni', 'reed-hastings'], expertise: 'team building' },
    hire: { legends: ['paul-graham', 'ben-horowitz', 'reid-hoffman'], expertise: 'hiring' },
    // Marketing & Growth
    market: { legends: ['seth-godin', 'gary-vaynerchuk'], expertise: 'marketing' },
    brand: { legends: ['gary-vaynerchuk', 'seth-godin', 'steve-jobs'], expertise: 'branding' },
    social: { legends: ['gary-vaynerchuk', 'jack-dorsey'], expertise: 'social media' },
    content: { legends: ['gary-vaynerchuk', 'seth-godin'], expertise: 'content marketing' },
    // Personal Development
    productiv: { legends: ['tim-ferriss', 'naval-ravikant'], expertise: 'productivity' },
    wealth: { legends: ['naval-ravikant', 'warren-buffett', 'charlie-munger'], expertise: 'wealth building' },
    success: { legends: ['naval-ravikant', 'tim-ferriss'], expertise: 'success principles' },
    happiness: { legends: ['naval-ravikant', 'tim-ferriss'], expertise: 'happiness' },
    philosophy: { legends: ['naval-ravikant', 'charlie-munger', 'ray-dalio'], expertise: 'philosophy' },
    decision: { legends: ['charlie-munger', 'ray-dalio', 'jeff-bezos'], expertise: 'decision making' },
    mental: { legends: ['charlie-munger', 'naval-ravikant'], expertise: 'mental models' },
};
/**
 * Find matching legends based on question content
 */
function findMatches(question, maxMatches) {
    const q = question.toLowerCase();
    const matchScores = new Map();
    // Score legends based on keyword matches
    for (const [keyword, data] of Object.entries(EXPERTISE_KEYWORDS)) {
        if (q.includes(keyword)) {
            for (const legendId of data.legends) {
                const current = matchScores.get(legendId) || { score: 0, reasons: [], expertise: [] };
                current.score += 1;
                if (!current.reasons.includes(data.expertise)) {
                    current.reasons.push(data.expertise);
                }
                current.expertise.push(data.expertise);
                matchScores.set(legendId, current);
            }
        }
    }
    // If no keyword matches, use default diverse panel
    if (matchScores.size === 0) {
        return [
            { legendId: 'naval-ravikant', reason: 'general wisdom and mental models', matchedExpertise: ['general wisdom'] },
            { legendId: 'paul-graham', reason: 'startup and business insights', matchedExpertise: ['startups'] },
            { legendId: 'charlie-munger', reason: 'decision making and thinking', matchedExpertise: ['mental models'] },
        ].slice(0, maxMatches);
    }
    // Sort by score and return top matches
    const sorted = Array.from(matchScores.entries())
        .sort((a, b) => b[1].score - a[1].score)
        .slice(0, maxMatches);
    return sorted.map(([legendId, data]) => ({
        legendId,
        reason: data.reasons.join(', '),
        matchedExpertise: [...new Set(data.expertise)],
    }));
}
/**
 * Extract a key insight from a legend's principles
 */
function extractKeyInsight(legend) {
    // Try to get a relevant principle or pattern
    if (legend.principles?.length) {
        return safeString(legend.principles[0], '');
    }
    if (legend.patterns?.length) {
        const pattern = legend.patterns[0];
        if (typeof pattern === 'object' && pattern.name) {
            return `${pattern.name}: ${safeString(pattern.description || '', '')}`;
        }
    }
    if (legend.anti_patterns?.length) {
        const ap = legend.anti_patterns[0];
        const apText = typeof ap === 'object' ? ap.pattern : String(ap);
        return `Avoids: ${safeString(apText, '')}`;
    }
    return `${legend.name}'s perspective on ${(legend.owns || ['business']).slice(0, 2).join(' and ')}`;
}
/**
 * Auto-match legends to a question
 */
export function autoMatch(input) {
    const { sanitized: question } = sanitizeContext(input.question);
    const maxMatches = Math.min(input.max_matches || 2, 3);
    const includePrompts = input.include_prompts || false;
    // Find matching legends
    const matches = findMatches(question, maxMatches);
    // Build response
    const matchedLegends = matches.map(match => {
        const legend = getLegendById(match.legendId);
        if (!legend)
            return null;
        const result = {
            legend_id: legend.id,
            name: legend.name,
            relevance_reason: match.reason,
            expertise_match: match.matchedExpertise,
            key_insight: extractKeyInsight(legend),
        };
        if (includePrompts) {
            result.system_prompt = buildLegendSystemPrompt(legend);
        }
        return result;
    }).filter((m) => m !== null);
    if (matchedLegends.length === 0) {
        throw new Error('No matching legends found. Try rephrasing your question.');
    }
    // Generate suggested approach
    const legendNames = matchedLegends.map(m => m.name);
    const suggestedApproach = generateApproach(question, matchedLegends);
    return {
        question: escapeBackticks(question),
        matches: matchedLegends,
        suggested_approach: suggestedApproach,
    };
}
/**
 * Generate a suggested approach based on matched legends
 */
function generateApproach(question, matches) {
    if (matches.length === 1) {
        return `Consider ${matches[0].name}'s perspective on ${matches[0].expertise_match.join(', ')}. Their insight: "${matches[0].key_insight}"`;
    }
    const names = matches.map(m => m.name).join(' and ');
    const expertise = [...new Set(matches.flatMap(m => m.expertise_match))].join(', ');
    return `Combine perspectives from ${names} (expertise: ${expertise}). Each brings unique frameworks - use \`summon_legend\` or \`party_mode\` to get their full responses.`;
}
/**
 * Format auto-match response for display
 */
export function formatAutoMatch(response) {
    const lines = [
        '# Auto-Matched Legends',
        '',
        `**Your Question:** ${response.question}`,
        '',
        '---',
        '',
        '## Best Matches',
        '',
    ];
    response.matches.forEach((match, i) => {
        lines.push(`### ${i + 1}. ${match.name}`);
        lines.push(`- **Why matched:** ${match.relevance_reason}`);
        lines.push(`- **Expertise:** ${match.expertise_match.join(', ')}`);
        lines.push(`- **Key insight:** "${escapeBackticks(match.key_insight)}"`);
        if (match.system_prompt) {
            lines.push('');
            lines.push('<details>');
            lines.push('<summary>Full System Prompt</summary>');
            lines.push('');
            lines.push('```');
            lines.push(escapeBackticks(match.system_prompt));
            lines.push('```');
            lines.push('</details>');
        }
        lines.push('');
    });
    lines.push('---');
    lines.push('');
    lines.push('## Suggested Approach');
    lines.push('');
    lines.push(response.suggested_approach);
    lines.push('');
    lines.push('---');
    lines.push('');
    lines.push('**Next Steps:**');
    lines.push('- Use `summon_legend` to get advice from a specific legend');
    lines.push('- Use `party_mode` to have all matched legends discuss together');
    lines.push('');
    lines.push('*DISCLAIMER: AI personas for educational purposes. Not affiliated with real individuals.*');
    return lines.join('\n');
}
// MCP Tool Definition
export const autoMatchTool = {
    name: 'auto_match',
    description: `Automatically find the most relevant legends for your question.

**How it works:**
1. Analyzes your question for topics and keywords
2. Matches relevant legends based on their expertise
3. Returns matched legends with key insights

**Use this when:**
- You're not sure which legend to ask
- You want to see who has expertise in your topic
- You want quick insights before a full conversation

**What you get:**
- Top 2-3 most relevant legends
- Why each was matched
- A key insight from each
- Suggested next steps

**Examples:**
- "How do I raise money for my startup?" → Paul Graham, Marc Andreessen
- "What's the future of AI?" → Sam Altman, Jensen Huang
- "How should I think about risk?" → Ray Dalio, Howard Marks

DISCLAIMER: AI personas for educational purposes only.`,
    inputSchema: {
        type: 'object',
        properties: {
            question: {
                type: 'string',
                description: 'Your question or topic to find relevant legends for',
            },
            max_matches: {
                type: 'number',
                description: 'Maximum legends to match (default: 2, max: 3)',
            },
            include_prompts: {
                type: 'boolean',
                description: 'Include full system prompts for each legend (default: false)',
            },
        },
        required: ['question'],
    },
};
//# sourceMappingURL=auto-match.js.map