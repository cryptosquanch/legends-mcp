// Get Legend Insight - Quick wisdom from legendary figures
// Inspired by Claude Code's Insight format

import type { LegendSkill } from '../types.js';
import { getAllLegends, getLegendById } from '../legends/loader.js';

// Tool definition for MCP
export const getLegendInsightTool = {
  name: 'get_legend_insight',
  description: 'Get a quick insight or wisdom snippet from a legendary founder/investor. Returns formatted wisdom in the style of a thought leader.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      legend_id: {
        type: 'string',
        description: 'ID of the legend (e.g., "elon-musk", "warren-buffett", "cz-binance")',
      },
      topic: {
        type: 'string',
        description: 'Optional topic to get insight about (e.g., "hiring", "fundraising", "product")',
      },
    },
    required: ['legend_id'],
  },
};

export interface GetLegendInsightInput {
  legend_id: string;
  topic?: string;
}

// Signature insights by legend - their most iconic wisdom
const LEGEND_INSIGHTS: Record<string, { quotes: string[]; frameworks: string[] }> = {
  'elon-musk': {
    quotes: [
      'The first step is to establish that something is possible; then probability will occur.',
      'I think it\'s important to reason from first principles rather than by analogy.',
      'The best part is no part. The best process is no process.',
      'If you\'re not failing, you\'re not innovating enough.',
      'Constantly think about how you could be doing things better.',
    ],
    frameworks: [
      '**First Principles**: Break down to fundamental truths, rebuild from there.',
      '**Idiot Index**: Compare final cost vs raw materials cost to find inefficiency.',
      '**Delete First**: Before optimizing, ask if you need it at all.',
      '**Physics Check**: What does physics allow? Start from constraints.',
    ],
  },
  'warren-buffett': {
    quotes: [
      'Price is what you pay, value is what you get.',
      'Be fearful when others are greedy and greedy when others are fearful.',
      'Only when the tide goes out do you discover who\'s been swimming naked.',
      'Time is the friend of the wonderful company, the enemy of the mediocre.',
      'The stock market is designed to transfer money from the Active to the Patient.',
    ],
    frameworks: [
      '**Circle of Competence**: Only invest in what you truly understand.',
      '**Margin of Safety**: Always buy at a discount to intrinsic value.',
      '**Moat Analysis**: Look for sustainable competitive advantages.',
      '**10-Year Test**: Would you own this for a decade without checking the price?',
    ],
  },
  'steve-jobs': {
    quotes: [
      'Design is not just what it looks like and feels like. Design is how it works.',
      'People don\'t know what they want until you show it to them.',
      'Stay hungry, stay foolish.',
      'Simplicity is the ultimate sophistication.',
      'The journey is the reward.',
    ],
    frameworks: [
      '**A-Player Obsession**: A-players hire A-players. B-players hire C-players.',
      '**Saying No**: Focus means saying no to 100 things to say yes to 1.',
      '**Intersection Method**: Magic happens at intersection of liberal arts and technology.',
      '**Reality Distortion**: Believe something is possible, then make it happen.',
    ],
  },
  'paul-graham': {
    quotes: [
      'Make something people want.',
      'Do things that don\'t scale.',
      'Launch fast and iterate.',
      'Better to make a few users love you than a lot ambivalent.',
      'Startups don\'t die, they commit suicide.',
    ],
    frameworks: [
      '**Schlep Blindness**: The best ideas are often tedious work others avoid.',
      '**Default Alive/Dead**: Are you profitable before money runs out?',
      '**Frighteningly Ambitious**: The best ideas seem initially crazy.',
      '**Relentlessly Resourceful**: The 2 words that define good startup founders.',
    ],
  },
  'cz-binance': {
    quotes: [
      'Funds are SAFU.',
      '4',
      'Ignore FUD, focus on building.',
      'Stay humble.',
      'Users first.',
    ],
    frameworks: [
      '**Global-First**: Launch in every market from day one.',
      '**User-First Decision Making**: Every choice should benefit users.',
      '**BUIDL Mentality**: Keep building regardless of market conditions.',
      '**Transparency Protocol**: When in doubt, communicate more.',
    ],
  },
  'michael-heinrich': {
    quotes: [
      'Ship it, then iterate.',
      'Talk to users constantly.',
      'Not financial advice.',
      'The best infrastructure is invisible.',
      'Make something people want - then decentralize it.',
    ],
    frameworks: [
      '**YC Mindset**: Talk to users, build what they want, ship fast.',
      '**Exit Lessons**: Under-promise, over-deliver. Build trust through consistency.',
      '**Infrastructure Layer Thinking**: Be the foundation others build on.',
      '**Decentralized AI Thesis**: AI needs decentralized data to be trustworthy.',
    ],
  },
  'anatoly-yakovenko': {
    quotes: [
      'Performance is the only moat that matters.',
      'We optimize for TPS, not validator count.',
      'Hardware trends are the tailwind.',
      'Users care about speed and cost, not decentralization theater.',
      'If Solana goes down, I lose sleep. That\'s how you know I care.',
    ],
    frameworks: [
      '**Hardware Trends First**: Design for where hardware is going, not where it is.',
      '**Pragmatic Decentralization**: Enough for security, not for theater.',
      '**Parallel Execution**: Don\'t sequence what can run in parallel.',
      '**Proof of History**: Solve the time problem, solve the scaling problem.',
    ],
  },
  'mert-mumtaz': {
    quotes: [
      'Developer experience is product.',
      'Documentation is not optional, it\'s the product.',
      'If your RPC is slow, your app is slow.',
      'Every support ticket is a product insight.',
      'Build for builders.',
    ],
    frameworks: [
      '**DX-First Development**: Developer experience determines adoption.',
      '**Docs as Product**: Documentation quality = product quality.',
      '**Community Feedback Loop**: Discord, Twitter, support = roadmap.',
      '**Infrastructure Excellence**: Backend quality enables frontend magic.',
    ],
  },
};

// Add default insights for legends without specific entries
const DEFAULT_INSIGHTS = {
  quotes: [
    'Success leaves clues.',
    'Focus on fundamentals.',
    'Long-term thinking wins.',
    'Build something meaningful.',
    'Learn from every failure.',
  ],
  frameworks: [
    '**First Principles**: Question assumptions, reason from ground truth.',
    '**Long-term Thinking**: What matters in 10 years?',
    '**Compounding**: Small consistent efforts compound over time.',
    '**Focus**: Do fewer things better.',
  ],
};

export interface GetLegendInsightResult {
  content: string;
  isError?: boolean;
}

export function getLegendInsight(
  input: GetLegendInsightInput
): GetLegendInsightResult {
  const legend = getLegendById(input.legend_id);
  if (!legend) {
    return {
      content: `Legend "${input.legend_id}" not found. Use list_legends to see available legends.`,
      isError: true,
    };
  }

  const insights = LEGEND_INSIGHTS[input.legend_id] || DEFAULT_INSIGHTS;

  // Filter by topic if provided
  let quotes = insights.quotes;
  let frameworks = insights.frameworks;

  if (input.topic) {
    const topicLower = input.topic.toLowerCase();
    // Try to find topic-relevant quotes/frameworks
    const filteredQuotes = quotes.filter(q => q.toLowerCase().includes(topicLower));
    const filteredFrameworks = frameworks.filter(f => f.toLowerCase().includes(topicLower));

    // Use filtered if we found matches, otherwise use all
    if (filteredQuotes.length > 0) quotes = filteredQuotes;
    if (filteredFrameworks.length > 0) frameworks = filteredFrameworks;
  }

  // Pick a random quote and framework
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  const randomFramework = frameworks[Math.floor(Math.random() * frameworks.length)];

  const topicNote = input.topic ? `\n\n*Topic: ${input.topic}*` : '';

  const insightBlock = `
# ${legend.name}'s Insight${topicNote}

"${randomQuote}"

${randomFramework}

---

*Want more? Use \`summon_legend\` to have a full conversation.*
`;

  return {
    content: insightBlock.trim(),
  };
}

// Get all insights for a legend (for reference)
export function getAllLegendInsights(
  legendId: string
): string {
  const legend = getLegendById(legendId);
  if (!legend) {
    return `Legend "${legendId}" not found.`;
  }

  const insights = LEGEND_INSIGHTS[legendId] || DEFAULT_INSIGHTS;

  const sections: string[] = [
    `# ${legend.name}'s Wisdom`,
    '',
    '## Key Quotes',
    ...insights.quotes.map((q, i) => `${i + 1}. "${q}"`),
    '',
    '## Thinking Frameworks',
    ...insights.frameworks,
    '',
    '*AI persona for educational purposes only. Not affiliated with the real person.*',
  ];

  return sections.join('\n');
}
