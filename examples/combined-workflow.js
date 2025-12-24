#!/usr/bin/env node

/**
 * Example: Combined get_legend_context + get_legend_insight Workflow
 * 
 * This example demonstrates:
 * 1. Using get_legend_insight for quick actionable advice
 * 2. Following up with get_legend_context for comprehensive frameworks
 * 3. Optimal workflow for gathering both quick wins and deep understanding
 * 4. When to use each tool and how to combine them effectively
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

// Initialize MCP client
const transport = new StdioClientTransport({
  command: 'npx',
  args: ['legends-mcp'],
});

const client = new Client(
  { name: 'combined-workflow', version: '1.0.0' },
  { capabilities: {} }
);

await client.connect(transport);

console.log('='.repeat(70));
console.log('Combined Workflow: Comprehensive + Quick Advice from Startup Sages');
console.log('='.repeat(70));
console.log();

/**
 * Startup Scenario
 */
const scenario = {
  founder: "Technical founder, first-time entrepreneur",
  stage: "Pre-product, validating problem",
  challenge: "How to find product-market fit without building too much?",
  timeframe: "3 months until runway concerns",
};

/**
 * Example 1: Start with Quick Insights (get_legend_insight)
 */
async function getQuickInsights(legendId) {
  console.log('⚡ Step 1: Quick Actionable Insights\n');
  console.log(`Using: get_legend_insight for immediate advice\n`);

  try {
    const insightResult = await client.callTool({
      name: 'get_legend_insight',
      arguments: {
        legend_id: legendId,
        topic: 'product-market fit',
      },
    });

    const insight = JSON.parse(insightResult.content[0].text);

    console.log(`${insight.legend_name}'s Quick Wisdom:\n`);

    console.log('Actionable Quotes:');
    insight.quotes.forEach((quote, i) => {
      console.log(`  ${i + 1}. "${quote}"`);
    });
    console.log();

    console.log('Key Frameworks:');
    insight.frameworks.forEach((framework, i) => {
      console.log(`  ${i + 1}. ${framework.substring(0, 100)}...`);
    });
    console.log();

    return insight;

  } catch (error) {
    console.error('❌ Error getting insights:', error.message);
    throw error;
  }
}

/**
 * Example 2: Deep Dive with Comprehensive Context (get_legend_context)
 */
async function getComprehensiveContext(legendId) {
  console.log('🔍 Step 2: Comprehensive Frameworks & Mental Models\n');
  console.log(`Using: get_legend_context for deep understanding\n`);

  try {
    const contextResult = await client.callTool({
      name: 'get_legend_context',
      arguments: {
        legend_id: legendId,
        topic: 'building products',
      },
    });

    const context = JSON.parse(contextResult.content[0].text);

    console.log(`${context.legend_name}'s Full Framework:\n`);

    console.log('Core Principles:');
    context.principles.slice(0, 5).forEach((principle, i) => {
      console.log(`  ${i + 1}. ${principle}`);
    });
    console.log();

    console.log('Decision Patterns:');
    context.patterns.slice(0, 3).forEach((pattern, i) => {
      console.log(`  ${i + 1}. ${pattern.name}`);
      console.log(`     When: ${pattern.when}`);
      console.log(`     Approach: ${pattern.approach.substring(0, 100)}...`);
      console.log();
    });

    console.log('Anti-Patterns to Avoid:');
    context.anti_patterns.slice(0, 3).forEach((ap, i) => {
      console.log(`  ${i + 1}. ${ap.name}: ${ap.why}`);
    });
    console.log();

    return context;

  } catch (error) {
    console.error('❌ Error getting context:', error.message);
    throw error;
  }
}

/**
 * Example 3: Combined Workflow (Quick → Deep)
 */
async function combinedWorkflow(legendId, legendName) {
  console.log(`📋 Combined Workflow: ${legendName}\n`);
  console.log('Scenario:');
  Object.entries(scenario).forEach(([key, value]) => {
    console.log(`  ${key}: ${value}`);
  });
  console.log();
  console.log('─'.repeat(70) + '\n');

  // Phase 1: Quick insights (takes ~1-2 seconds)
  const insights = await getQuickInsights(legendId);
  console.log('─'.repeat(70) + '\n');

  // Phase 2: Comprehensive context (takes ~2-3 seconds)
  const context = await getComprehensiveContext(legendId);
  console.log('─'.repeat(70) + '\n');

  return { insights, context };
}

/**
 * Example 4: Synthesize Combined Advice into Action Plan
 */
function synthesizeActionPlan(insights, context) {
  console.log('🎯 Synthesized Action Plan\n');

  console.log('IMMEDIATE ACTIONS (from get_legend_insight):');
  insights.quotes.forEach((quote, i) => {
    console.log(`  ${i + 1}. ${quote}`);
  });
  console.log();

  console.log('STRATEGIC FRAMEWORK (from get_legend_context):');
  context.principles.slice(0, 3).forEach((principle, i) => {
    console.log(`  ${i + 1}. ${principle}`);
  });
  console.log();

  console.log('EXECUTION PLAYBOOK:');
  const playbook = [
    {
      week: '1-2',
      focus: 'Customer Discovery',
      actions: ['Talk to 50+ potential users', 'Find common pain points'],
      framework: context.patterns[0]?.name || 'First pattern',
    },
    {
      week: '3-4',
      focus: 'MVP Definition',
      actions: ['Design smallest solution', 'Create mock-ups, not code'],
      framework: context.patterns[1]?.name || 'Second pattern',
    },
    {
      week: '5-8',
      focus: 'Build & Test',
      actions: ['Ship to 10 users', 'Measure engagement daily'],
      framework: context.patterns[2]?.name || 'Third pattern',
    },
    {
      week: '9-12',
      focus: 'Iterate or Pivot',
      actions: ['Double down on what works', 'Kill what doesn\'t'],
      framework: 'Based on user data',
    },
  ];

  playbook.forEach(phase => {
    console.log(`  Week ${phase.week}: ${phase.focus}`);
    phase.actions.forEach(action => {
      console.log(`    • ${action}`);
    });
    console.log(`    Framework: ${phase.framework}`);
    console.log();
  });

  console.log('RED FLAGS (from anti-patterns):');
  context.anti_patterns.slice(0, 3).forEach((ap, i) => {
    console.log(`  🚫 ${ap.name}`);
    console.log(`     Why avoid: ${ap.why}`);
  });
  console.log();
}

/**
 * Example 5: When to Use Which Tool
 */
function displayToolGuidance() {
  console.log('💡 Tool Selection Guide\n');

  console.log('Use get_legend_insight when:');
  console.log('  ✓ You need quick actionable advice');
  console.log('  ✓ Time is limited (brainstorming, rapid decisions)');
  console.log('  ✓ You want memorable quotes for communication');
  console.log('  ✓ You\'re exploring multiple legends quickly');
  console.log('  ✓ You need motivation or direction, not detailed plans');
  console.log();

  console.log('Use get_legend_context when:');
  console.log('  ✓ You need comprehensive frameworks');
  console.log('  ✓ Building detailed implementation plans');
  console.log('  ✓ Understanding complex decision patterns');
  console.log('  ✓ Avoiding common mistakes (anti-patterns)');
  console.log('  ✓ Adopting a legend\'s complete mental model');
  console.log();

  console.log('Use both (combined workflow) when:');
  console.log('  ✓ Starting new projects or initiatives');
  console.log('  ✓ Making strategic decisions with execution plans');
  console.log('  ✓ Teaching/mentoring others');
  console.log('  ✓ Creating comprehensive playbooks');
  console.log('  ✓ Balancing speed with thoroughness');
  console.log();

  console.log('─'.repeat(70) + '\n');
}

/**
 * Example 6: Parallel Comparison (Multiple Legends)
 */
async function parallelComparison() {
  console.log('🔄 Bonus: Parallel Comparison Across Multiple Sages\n');

  const sages = ['paul-graham', 'naval-ravikant', 'peter-thiel'];

  try {
    // Get quick insights from all sages in parallel
    const insightPromises = sages.map(sage =>
      client.callTool({
        name: 'get_legend_insight',
        arguments: {
          legend_id: sage,
          topic: 'product-market fit',
        },
      }).then(result => ({
        sage,
        data: JSON.parse(result.content[0].text),
      }))
    );

    const insights = await Promise.all(insightPromises);

    console.log('Quick comparison of approaches:\n');
    insights.forEach(({ sage, data }) => {
      console.log(`${data.legend_name}:`);
      console.log(`  "${data.quotes[0]}"`);
      console.log();
    });

    // Then deep dive on the most relevant one
    console.log('Choose the most relevant approach and use get_legend_context');
    console.log('for detailed implementation guidance.\n');

  } catch (error) {
    console.error('❌ Error in parallel comparison:', error.message);
  }

  console.log('─'.repeat(70) + '\n');
}

/**
 * Main execution
 */
async function main() {
  try {
    // Combined workflow with Paul Graham
    const { insights, context } = await combinedWorkflow('paul-graham', 'Paul Graham');

    // Synthesize into action plan
    synthesizeActionPlan(insights, context);
    console.log('─'.repeat(70) + '\n');

    // Tool selection guidance
    displayToolGuidance();

    // Bonus: Parallel comparison
    await parallelComparison();

    console.log('🎓 Key Takeaways:');
    console.log('   1. Start with get_legend_insight for quick wins');
    console.log('   2. Follow up with get_legend_context for depth');
    console.log('   3. Combine both for comprehensive planning');
    console.log('   4. Use parallel calls for comparing multiple legends');
    console.log('   5. Choose tool based on time vs. thoroughness tradeoff');
    console.log();

  } catch (error) {
    console.error('Fatal error:', error);
  } finally {
    await client.close();
  }
}

main().catch(console.error);
