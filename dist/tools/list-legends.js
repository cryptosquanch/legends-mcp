// MCP Tool: list_legends
// Lists all available legendary founders/investors
// Serious advice, occasionally memey delivery
import { getLegendSummaries } from '../legends/loader.js';
// Easter eggs - for fun mode
const LEGEND_VIBES = {
    'elon-musk': '🚀 First principles guy. Sleeps at the factory.',
    'warren-buffett': '🍔 Cherry coke enthusiast. Hates crypto, loves compound interest.',
    'steve-jobs': '🎨 Reality distortion field. One more thing...',
    'jeff-bezos': '📦 Day 1 forever. Regret minimization framework.',
    'charlie-munger': '📚 Mental models collector. Brutally honest.',
    'paul-graham': '✍️ Essay machine. Invented modern startups.',
    'jensen-huang': '🧠 Leather jacket CEO. CUDA everything.',
    'marc-andreessen': '💻 Software eating the world. Techno-optimist.',
    'naval-ravikant': '🧘 Wealth without working. Seek wealth, not money.',
    'reid-hoffman': '🔗 LinkedIn mafia. Blitzscaling evangelist.',
    'peter-thiel': '♟️ Contrarian investor. Zero to one thinker.',
    'sam-altman': '🤖 AGI believer. YC to OpenAI pipeline.',
    'cz-binance': '🌏 BUIDL. 4. Global from day one.',
    'anatoly-yakovenko': '⚡ TPS maximalist. Proof of History inventor.',
    'mert-mumtaz': '🔧 Developer whisperer. RPC obsessed.',
    'michael-heinrich': '🎯 YC alum. Web exit → decentralized AI.',
};
/**
 * List all available legends
 */
export function listLegends(input) {
    let legends = getLegendSummaries();
    // Filter by category if provided
    if (input?.category) {
        const cat = input.category.toLowerCase();
        legends = legends.filter(l => l.tags.some(t => t.toLowerCase().includes(cat)) ||
            l.expertise.some(e => e.toLowerCase().includes(cat)));
    }
    return {
        count: legends.length,
        legends,
    };
}
/**
 * Format legends list as markdown for display
 */
export function formatLegendsMarkdown(result, vibe = 'serious') {
    const lines = [];
    if (vibe === 'fun') {
        lines.push(`# 🎭 The Council of Legends (${result.count})`);
        lines.push('');
        lines.push('*Your personal board of advisors. They\'ve built trillion-dollar companies, lost billions, and lived to tell the tale.*');
        lines.push('');
        lines.push('---');
        lines.push('');
        for (const legend of result.legends) {
            const emoji = LEGEND_VIBES[legend.id] || '💡';
            lines.push(`### ${legend.name}`);
            lines.push(`**ID:** \`${legend.id}\` ${emoji}`);
            lines.push('');
        }
        lines.push('---');
        lines.push('');
        lines.push('*"The best time to get advice from a legend was 20 years ago. The second best time is now."*');
        lines.push('');
        lines.push('Use `summon_legend` to start a conversation.');
    }
    else {
        lines.push(`# Available Legends (${result.count})`);
        lines.push('');
        lines.push('Chat with legendary founders and investors. Each brings unique frameworks and perspectives.');
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
        lines.push('**Disclaimer:** These are AI personas for educational purposes. Not affiliated with real individuals.');
        lines.push('');
        lines.push('Use `summon_legend` with a legend ID to start a conversation.');
    }
    return lines.join('\n');
}
// MCP Tool Definition
export const listLegendsTool = {
    name: 'list_legends',
    description: `List all legendary founders and investors you can chat with.

The council includes:
- **Tech Titans**: Elon Musk, Steve Jobs, Jeff Bezos, Jensen Huang
- **Investors**: Warren Buffett, Charlie Munger, Peter Thiel, Marc Andreessen
- **Startup Sages**: Paul Graham, Sam Altman, Naval Ravikant, Reid Hoffman
- **Crypto Builders**: CZ, Anatoly Yakovenko, Mert Mumtaz, Michael Heinrich

Each legend has unique thinking frameworks, principles, and perspectives.

Set vibe="fun" for a more entertaining presentation.`,
    inputSchema: {
        type: 'object',
        properties: {
            category: {
                type: 'string',
                description: 'Filter by category (e.g., "crypto", "investor", "founder", "tech")',
            },
            vibe: {
                type: 'string',
                enum: ['serious', 'fun'],
                description: 'Output style: "serious" (default) or "fun" for meme mode',
            },
        },
        required: [],
    },
};
//# sourceMappingURL=list-legends.js.map