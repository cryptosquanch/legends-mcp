#!/usr/bin/env node

/**
 * Example: Brainstorming Session with Alternating Legend Insights
 * 
 * This example demonstrates:
 * 1. Rapid iteration through multiple legend insights
 * 2. Alternating between different personas (Elon Musk, Naval Ravikant, etc.)
 * 3. Building creative momentum with quick wisdom snippets
 * 4. Synthesizing diverse viewpoints into actionable ideas
 * 5. Session management for brainstorming workflows
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

// Initialize MCP client
const transport = new StdioClientTransport({
  command: 'npx',
  args: ['legends-mcp'],
});

const client = new Client(
  { name: 'brainstorming-session', version: '1.0.0' },
  { capabilities: {} }
);

await client.connect(transport);

console.log('='.repeat(70));
console.log('Brainstorming Session: Alternating Legend Insights');
console.log('='.repeat(70));
console.log();

/**
 * Brainstorming Topic
 */
const topic = {
  challenge: "How to make AI agents more trustworthy and explainable?",
  context: `
    Users are skeptical of AI decision-making
    Need transparency without overwhelming technical details
    Balance between automation and human oversight
  `.trim(),
};

/**
 * Legend Rotation for Brainstorming
 */
const legends = [
  { id: 'elon-musk', focus: 'First principles & simplification' },
  { id: 'naval-ravikant', focus: 'Leverage & specific knowledge' },
  { id: 'steve-jobs', focus: 'User experience & simplicity' },
  { id: 'satya-nadella', focus: 'Empathy & trust' },
  { id: 'demis-hassabis', focus: 'AI safety & alignment' },
];

/**
 * Brainstorming Session Manager
 */
class BrainstormingSession {
  constructor(topic) {
    this.topic = topic;
    this.rounds = [];
    this.insights = [];
    this.actionableIdeas = [];
  }

  addRound(legendId, legendName, insight) {
    this.rounds.push({
      round: this.rounds.length + 1,
      legendId,
      legendName,
      insight,
      timestamp: new Date(),
    });

    // Extract actionable ideas from quotes
    if (insight.quotes && insight.quotes.length > 0) {
      this.insights.push(...insight.quotes);
    }
  }

  synthesizeIdeas() {
    // Group insights by theme
    const themes = {
      transparency: [],
      simplicity: [],
      trust: [],
      safety: [],
      usability: [],
    };

    this.insights.forEach(insight => {
      const lower = insight.toLowerCase();
      if (lower.includes('transparent') || lower.includes('explain')) {
        themes.transparency.push(insight);
      }
      if (lower.includes('simple') || lower.includes('intuitive')) {
        themes.simplicity.push(insight);
      }
      if (lower.includes('trust') || lower.includes('reliable')) {
        themes.trust.push(insight);
      }
      if (lower.includes('safe') || lower.includes('align')) {
        themes.safety.push(insight);
      }
      if (lower.includes('user') || lower.includes('experience')) {
        themes.usability.push(insight);
      }
    });

    return themes;
  }

  generateSummary() {
    return {
      totalRounds: this.rounds.length,
      legendsConsulted: [...new Set(this.rounds.map(r => r.legendName))],
      insightsCollected: this.insights.length,
      duration: this.rounds.length > 0 ? 
        new Date() - this.rounds[0].timestamp : 0,
    };
  }
}

/**
 * Example 1: Quick Insight Gathering (Alternating Legends)
 */
async function alternatingInsights(session) {
  console.log(`🎨 Brainstorming: "${topic.challenge}"\n`);
  console.log(`Context: ${topic.context}\n`);
  console.log('─'.repeat(70) + '\n');

  for (const legend of legends) {
    try {
      console.log(`💡 Round ${session.rounds.length + 1}: ${legend.id}`);
      console.log(`   Focus: ${legend.focus}\n`);

      // Get quick insights
      const insightResult = await client.callTool({
        name: 'get_legend_insight',
        arguments: {
          legend_id: legend.id,
          topic: topic.challenge,
        },
      });

      const insight = JSON.parse(insightResult.content[0].text);
      
      // Display insights
      console.log(`   Quotes from ${insight.legend_name}:`);
      insight.quotes.forEach((quote, i) => {
        console.log(`     ${i + 1}. "${quote}"`);
      });
      console.log();

      console.log(`   Frameworks:`);
      insight.frameworks.forEach((framework, i) => {
        console.log(`     ${i + 1}. ${framework}`);
      });
      console.log();

      // Add to session
      session.addRound(legend.id, insight.legend_name, insight);

      // Pause for dramatic effect in demo
      await new Promise(resolve => setTimeout(resolve, 500));

      console.log('─'.repeat(70) + '\n');

    } catch (error) {
      console.error(`   ❌ Error getting insight from ${legend.id}:`, error.message);
      console.log();
    }
  }
}

/**
 * Example 2: Rapid-Fire Insight Mode (Parallel)
 */
async function rapidFireMode() {
  console.log('⚡ Rapid-Fire Mode: All Insights in Parallel\n');

  try {
    const insightPromises = legends.map(legend =>
      client.callTool({
        name: 'get_legend_insight',
        arguments: {
          legend_id: legend.id,
          topic: 'AI trustworthiness',
        },
      }).then(result => ({
        legend: legend.id,
        data: JSON.parse(result.content[0].text),
      }))
    );

    const results = await Promise.all(insightPromises);

    console.log(`✅ Collected ${results.length} perspectives simultaneously\n`);

    results.forEach(({ legend, data }) => {
      console.log(`${data.legend_name}:`);
      console.log(`   "${data.quotes[0]}"`);
      console.log();
    });

  } catch (error) {
    console.error('❌ Error in rapid-fire mode:', error.message);
  }

  console.log('─'.repeat(70) + '\n');
}

/**
 * Example 3: Theme-Based Synthesis
 */
function synthesizeByTheme(session) {
  console.log('🎯 Theme-Based Synthesis\n');

  const themes = session.synthesizeIdeas();

  Object.entries(themes).forEach(([theme, insights]) => {
    if (insights.length > 0) {
      console.log(`${theme.toUpperCase()}:`);
      insights.forEach(insight => {
        console.log(`   • ${insight.substring(0, 80)}...`);
      });
      console.log();
    }
  });

  console.log('─'.repeat(70) + '\n');
}

/**
 * Example 4: Generate Actionable Ideas
 */
function generateActionableIdeas(session) {
  console.log('✨ Actionable Ideas from Brainstorm\n');

  const themes = session.synthesizeIdeas();

  // Combine insights into actionable ideas
  const ideas = [
    {
      title: 'Explainability Dashboard',
      description: 'Show AI decision path in simple, visual format',
      inspiration: themes.transparency.concat(themes.simplicity),
      champions: ['steve-jobs', 'satya-nadella'],
    },
    {
      title: 'Confidence Scores',
      description: 'Display AI confidence level for each prediction',
      inspiration: themes.trust.concat(themes.transparency),
      champions: ['demis-hassabis', 'elon-musk'],
    },
    {
      title: 'Human-in-the-Loop Controls',
      description: 'User can override or guide AI decisions',
      inspiration: themes.safety.concat(themes.trust),
      champions: ['satya-nadella', 'demis-hassabis'],
    },
    {
      title: 'Progressive Disclosure',
      description: 'Start simple, reveal details on demand',
      inspiration: themes.simplicity.concat(themes.usability),
      champions: ['steve-jobs', 'naval-ravikant'],
    },
  ];

  ideas.forEach((idea, i) => {
    console.log(`${i + 1}. ${idea.title}`);
    console.log(`   ${idea.description}`);
    console.log(`   Champions: ${idea.champions.join(', ')}`);
    console.log(`   Insights used: ${idea.inspiration.length}`);
    console.log();
  });

  console.log('─'.repeat(70) + '\n');

  return ideas;
}

/**
 * Example 5: Session Summary and Next Steps
 */
function displaySessionSummary(session) {
  console.log('📊 Brainstorming Session Summary\n');

  const summary = session.generateSummary();

  console.log(`   Duration: ${Math.floor(summary.duration / 1000)}s`);
  console.log(`   Total Rounds: ${summary.totalRounds}`);
  console.log(`   Legends Consulted: ${summary.legendsConsulted.join(', ')}`);
  console.log(`   Insights Collected: ${summary.insightsCollected}`);
  console.log();

  console.log('   Session Flow:');
  session.rounds.forEach(round => {
    console.log(`     Round ${round.round}: ${round.legendName} (${round.legendId})`);
  });
  console.log();

  console.log('🚀 Next Steps:');
  console.log('   1. Prioritize actionable ideas by impact vs. effort');
  console.log('   2. Deep dive with get_legend_context for implementation details');
  console.log('   3. Validate ideas with summon_legend for full persona consultation');
  console.log('   4. Create prototypes for top 2-3 ideas');
  console.log();
}

/**
 * Main execution
 */
async function main() {
  const session = new BrainstormingSession(topic);

  try {
    // Method 1: Sequential alternating (builds momentum)
    await alternatingInsights(session);

    // Method 2: Rapid parallel (quick comparison)
    await rapidFireMode();

    // Synthesis & Ideas
    synthesizeByTheme(session);
    generateActionableIdeas(session);
    displaySessionSummary(session);

    console.log('💡 Brainstorming Workflow Benefits:');
    console.log('   • get_legend_insight provides quick wisdom snippets');
    console.log('   • Alternating legends maintains creative momentum');
    console.log('   • Parallel mode enables rapid perspective gathering');
    console.log('   • Theme synthesis reveals patterns across legends');
    console.log('   • Session management tracks ideation progress');
    console.log();

  } catch (error) {
    console.error('Fatal error:', error);
  } finally {
    await client.close();
  }
}

main().catch(console.error);
