#!/usr/bin/env node

/**
 * Example: Resolving Conflicting Advice from Multiple Legends
 * 
 * This example demonstrates:
 * 1. Summoning multiple legends for the same strategic decision
 * 2. Comparing their distinct mental models and frameworks
 * 3. Identifying conflicts and areas of agreement
 * 4. Synthesizing a balanced decision matrix
 * 5. Using MCP's parallel tool calling for efficient comparison
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

// Initialize MCP client
const transport = new StdioClientTransport({
  command: 'npx',
  args: ['legends-mcp'],
});

const client = new Client(
  { name: 'conflict-resolution-example', version: '1.0.0' },
  { capabilities: {} }
);

await client.connect(transport);

console.log('='.repeat(70));
console.log('Conflicting Advice Resolution: Strategic Decision Analysis');
console.log('='.repeat(70));
console.log();

/**
 * Strategic Decision Scenario
 */
const decision = {
  context: "Should we pivot from B2B SaaS to B2C marketplace?",
  background: `
    - Current: B2B SaaS with 50 paying customers ($500k ARR)
    - Traction: Growing 10% MoM, but slow enterprise sales cycle
    - Opportunity: Noticed organic B2C demand (200+ signups/week)
    - Team: 5 engineers, 1 PM, 1 sales
    - Runway: 18 months
  `.trim(),
  stakeholders: ['investors', 'team', 'customers'],
};

/**
 * Legend Perspectives to Compare
 */
const legendPerspectives = [
  { id: 'paul-graham', expertise: 'Startup fundamentals & pivoting' },
  { id: 'peter-thiel', expertise: 'Zero-to-one thinking & monopoly' },
  { id: 'reid-hoffman', expertise: 'Blitzscaling & network effects' },
  { id: 'jeff-bezos', expertise: 'Customer obsession & long-term thinking' },
];

/**
 * Data Structure for Advice Comparison
 */
class AdviceComparison {
  constructor() {
    this.perspectives = [];
    this.conflictAreas = [];
    this.agreements = [];
    this.decisionMatrix = {
      factors: [],
      legendScores: {},
    };
  }

  addPerspective(legendId, legendName, advice) {
    this.perspectives.push({ legendId, legendName, advice });
  }

  analyze() {
    // Extract key themes from each perspective
    const themes = {};
    
    this.perspectives.forEach(({ legendId, legendName, advice }) => {
      // Extract themes from principles and patterns
      const legendThemes = this.extractThemes(advice);
      themes[legendId] = legendThemes;
    });

    // Find conflicts (themes where legends disagree)
    this.findConflicts(themes);
    
    // Find agreements (common themes across legends)
    this.findAgreements(themes);
    
    // Build decision matrix
    this.buildDecisionMatrix();
  }

  extractThemes(advice) {
    return {
      speed: advice.principles.some(p => p.toLowerCase().includes('fast') || p.toLowerCase().includes('move')),
      risk: advice.principles.some(p => p.toLowerCase().includes('risk') || p.toLowerCase().includes('bet')),
      focus: advice.principles.some(p => p.toLowerCase().includes('focus') || p.toLowerCase().includes('one thing')),
      scale: advice.principles.some(p => p.toLowerCase().includes('scale') || p.toLowerCase().includes('growth')),
      customer: advice.principles.some(p => p.toLowerCase().includes('customer') || p.toLowerCase().includes('user')),
    };
  }

  findConflicts(themes) {
    const themeKeys = ['speed', 'risk', 'focus', 'scale', 'customer'];
    
    themeKeys.forEach(theme => {
      const values = Object.entries(themes).map(([id, t]) => ({ id, value: t[theme] }));
      const hasConflict = values.some(v => v.value) && values.some(v => !v.value);
      
      if (hasConflict) {
        this.conflictAreas.push({
          theme,
          for: values.filter(v => v.value).map(v => v.id),
          against: values.filter(v => !v.value).map(v => v.id),
        });
      }
    });
  }

  findAgreements(themes) {
    const themeKeys = ['speed', 'risk', 'focus', 'scale', 'customer'];
    
    themeKeys.forEach(theme => {
      const values = Object.values(themes).map(t => t[theme]);
      const allAgree = values.every(v => v === values[0]);
      
      if (allAgree && values[0]) {
        this.agreements.push(theme);
      }
    });
  }

  buildDecisionMatrix() {
    // Define decision factors
    this.decisionMatrix.factors = [
      { name: 'Product-Market Fit', weight: 0.3 },
      { name: 'Growth Potential', weight: 0.25 },
      { name: 'Execution Risk', weight: 0.2 },
      { name: 'Competitive Advantage', weight: 0.15 },
      { name: 'Resource Fit', weight: 0.1 },
    ];
  }

  generateSummary() {
    return {
      totalPerspectives: this.perspectives.length,
      conflictAreas: this.conflictAreas,
      agreements: this.agreements,
      recommendation: this.synthesizeRecommendation(),
    };
  }

  synthesizeRecommendation() {
    // Weight agreement areas higher
    if (this.agreements.length > this.conflictAreas.length) {
      return 'Strong consensus among legends - proceed with confidence';
    } else if (this.conflictAreas.length > this.agreements.length) {
      return 'Significant disagreement - deeper analysis needed before decision';
    } else {
      return 'Mixed signals - consider phased approach or additional validation';
    }
  }
}

/**
 * Example 1: Summon Multiple Legends in Parallel
 */
async function gatherMultiplePerspectives() {
  console.log('📞 Summoning Multiple Legends in Parallel\n');
  console.log(`Decision: ${decision.context}\n`);

  try {
    // Parallel summon for efficiency
    const summonPromises = legendPerspectives.map(legend =>
      client.callTool({
        name: 'summon_legend',
        arguments: { legend_id: legend.id },
      }).then(result => ({
        id: legend.id,
        data: JSON.parse(result.content[0].text),
      }))
    );

    const results = await Promise.all(summonPromises);
    
    console.log(`✅ Summoned ${results.length} legends:\n`);
    results.forEach(({ id, data }) => {
      console.log(`   • ${data.name} - ${data.quick_ref.voice.tone}`);
    });
    console.log();

    return results;

  } catch (error) {
    console.error('❌ Error summoning legends:', error.message);
    throw error;
  }
}

/**
 * Example 2: Extract and Compare Mental Models
 */
async function compareMentalModels(legends) {
  console.log('🧠 Comparing Mental Models\n');

  const comparison = new AdviceComparison();

  legends.forEach(({ id, data }) => {
    comparison.addPerspective(id, data.name, data.quick_ref);
    
    console.log(`${data.name}'s Framework:`);
    console.log(`   Core Principle: ${data.quick_ref.principles[0]}`);
    console.log(`   Key Pattern: ${data.quick_ref.patterns[0].name}`);
    console.log(`   Never Says: "${data.quick_ref.never_say[0]}"`);
    console.log();
  });

  // Analyze for conflicts and agreements
  comparison.analyze();

  return comparison;
}

/**
 * Example 3: Identify Conflict Areas
 */
function displayConflicts(comparison) {
  console.log('⚔️  Conflict Areas\n');

  if (comparison.conflictAreas.length === 0) {
    console.log('   No major conflicts detected - legends are aligned!\n');
    return;
  }

  comparison.conflictAreas.forEach(conflict => {
    console.log(`   Theme: ${conflict.theme.toUpperCase()}`);
    console.log(`     Supporting: ${conflict.for.join(', ')}`);
    console.log(`     Cautionary: ${conflict.against.join(', ')}`);
    console.log();
  });
}

/**
 * Example 4: Find Areas of Agreement
 */
function displayAgreements(comparison) {
  console.log('🤝 Areas of Agreement\n');

  if (comparison.agreements.length === 0) {
    console.log('   No universal agreement - legends have diverse views\n');
    return;
  }

  console.log(`   All ${comparison.perspectives.length} legends agree on:`);
  comparison.agreements.forEach(theme => {
    console.log(`     • ${theme.toUpperCase()}`);
  });
  console.log();
}

/**
 * Example 5: Build Decision Matrix
 */
async function buildDecisionMatrix(legends) {
  console.log('📊 Decision Matrix: B2B SaaS vs B2C Marketplace\n');

  const factors = [
    { name: 'Product-Market Fit', b2b: 7, b2c: 5 },
    { name: 'Growth Potential', b2b: 6, b2c: 9 },
    { name: 'Execution Risk', b2b: 3, b2c: 8 },
    { name: 'Competitive Advantage', b2b: 7, b2c: 4 },
    { name: 'Resource Fit', b2b: 8, b2c: 5 },
  ];

  console.log('   Factor                    | B2B | B2C | Gap');
  console.log('   ' + '-'.repeat(50));

  let b2bTotal = 0;
  let b2cTotal = 0;

  factors.forEach(factor => {
    const gap = factor.b2b - factor.b2c;
    const arrow = gap > 0 ? '←' : gap < 0 ? '→' : '=';
    
    console.log(`   ${factor.name.padEnd(25)} | ${factor.b2b}/10 | ${factor.b2c}/10 | ${arrow} ${Math.abs(gap)}`);
    
    b2bTotal += factor.b2b;
    b2cTotal += factor.b2c;
  });

  console.log('   ' + '-'.repeat(50));
  console.log(`   TOTALS                    | ${b2bTotal}/50 | ${b2cTotal}/50 |`);
  console.log();

  // Legend-weighted scores
  console.log('   Legend-Weighted Recommendation:\n');
  
  legends.forEach(({ id, data }) => {
    const recommendation = getRecommendation(id, factors);
    console.log(`   ${data.name}: ${recommendation}`);
  });
  console.log();
}

function getRecommendation(legendId, factors) {
  // Different legends weight factors differently
  const weights = {
    'paul-graham': { pmf: 0.5, growth: 0.2, risk: 0.15, advantage: 0.1, resource: 0.05 },
    'peter-thiel': { pmf: 0.3, growth: 0.15, risk: 0.2, advantage: 0.3, resource: 0.05 },
    'reid-hoffman': { pmf: 0.2, growth: 0.4, risk: 0.15, advantage: 0.15, resource: 0.1 },
    'jeff-bezos': { pmf: 0.4, growth: 0.2, risk: 0.1, advantage: 0.2, resource: 0.1 },
  };

  const weight = weights[legendId];
  const b2bScore = (factors[0].b2b * weight.pmf) + (factors[1].b2b * weight.growth) + 
                   (factors[2].b2b * weight.risk) + (factors[3].b2b * weight.advantage) + 
                   (factors[4].b2b * weight.resource);
  const b2cScore = (factors[0].b2c * weight.pmf) + (factors[1].b2c * weight.growth) + 
                   (factors[2].b2c * weight.risk) + (factors[3].b2c * weight.advantage) + 
                   (factors[4].b2c * weight.resource);

  if (b2bScore > b2cScore) {
    return `Stay B2B (Score: ${b2bScore.toFixed(1)} vs ${b2cScore.toFixed(1)})`;
  } else if (b2cScore > b2bScore) {
    return `Pivot to B2C (Score: ${b2cScore.toFixed(1)} vs ${b2bScore.toFixed(1)})`;
  } else {
    return `Hybrid approach (Scores tied: ${b2bScore.toFixed(1)})`;
  }
}

/**
 * Example 6: Synthesize Final Recommendation
 */
function synthesizeFinalRecommendation(comparison) {
  console.log('💡 Synthesized Recommendation\n');

  const summary = comparison.generateSummary();

  console.log(`   Analyzed ${summary.totalPerspectives} legendary perspectives`);
  console.log(`   Conflicts detected: ${summary.conflictAreas.length}`);
  console.log(`   Agreements found: ${summary.agreements.length}`);
  console.log();

  console.log(`   Overall Assessment:`);
  console.log(`   ${summary.recommendation}`);
  console.log();

  // Provide actionable next steps
  console.log('   Next Steps:');
  if (summary.conflictAreas.length > 0) {
    console.log('   1. Deep dive into conflict areas with targeted legend insights');
    console.log('   2. Run experiments to validate conflicting hypotheses');
    console.log('   3. Weight legend advice by relevance to your specific context');
  }
  if (summary.agreements.length > 0) {
    console.log('   1. Leverage areas of agreement as strong signals');
    console.log('   2. Build execution plan around consensus themes');
    console.log('   3. Communicate unified legend wisdom to stakeholders');
  }
  console.log();
}

/**
 * Main execution
 */
async function main() {
  try {
    console.log('Strategic Decision Context:');
    console.log(decision.background);
    console.log();
    console.log('─'.repeat(70) + '\n');

    // Step 1: Gather multiple perspectives in parallel
    const legends = await gatherMultiplePerspectives();
    console.log('─'.repeat(70) + '\n');

    // Step 2: Compare mental models
    const comparison = await compareMentalModels(legends);
    console.log('─'.repeat(70) + '\n');

    // Step 3: Display conflicts
    displayConflicts(comparison);
    console.log('─'.repeat(70) + '\n');

    // Step 4: Display agreements
    displayAgreements(comparison);
    console.log('─'.repeat(70) + '\n');

    // Step 5: Build decision matrix
    await buildDecisionMatrix(legends);
    console.log('─'.repeat(70) + '\n');

    // Step 6: Synthesize final recommendation
    synthesizeFinalRecommendation(comparison);

    console.log('🎯 MCP Integration Benefits:');
    console.log('   • Parallel tool calling for efficient legend summoning');
    console.log('   • Structured mental model comparison via YAML schemas');
    console.log('   • Conflict detection through principle/pattern analysis');
    console.log('   • Decision matrix generation from distinct frameworks');
    console.log();

  } catch (error) {
    console.error('Fatal error:', error);
  } finally {
    await client.close();
  }
}

main().catch(console.error);
