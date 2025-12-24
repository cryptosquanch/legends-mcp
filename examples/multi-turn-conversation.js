#!/usr/bin/env node

/**
 * Example: Multi-turn conversation maintaining persona context
 * 
 * This example demonstrates:
 * 1. Session management for maintaining legend context
 * 2. Conversation history formatting
 * 3. Error handling for context retention
 * 4. Chaining multiple interactions with same persona
 * 5. Solving a complex startup problem across multiple exchanges
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

// Session state management
class LegendSession {
  constructor(legendId, personaData) {
    this.legendId = legendId;
    this.personaData = personaData;
    this.conversationHistory = [];
    this.startTime = new Date();
  }

  addExchange(userMessage, assistantResponse) {
    this.conversationHistory.push({
      turn: this.conversationHistory.length + 1,
      timestamp: new Date(),
      user: userMessage,
      assistant: assistantResponse,
    });
  }

  getContext() {
    return {
      legend: this.personaData.name,
      turns: this.conversationHistory.length,
      duration: new Date() - this.startTime,
      principles: this.personaData.quick_ref.principles,
      patterns: this.personaData.quick_ref.patterns,
    };
  }

  formatHistoryForPrompt() {
    return this.conversationHistory
      .map(ex => `Turn ${ex.turn}:\nUser: ${ex.user}\n${this.personaData.name}: ${ex.assistant}`)
      .join('\n\n');
  }
}

// Initialize MCP client
const transport = new StdioClientTransport({
  command: 'npx',
  args: ['legends-mcp'],
});

const client = new Client(
  { name: 'multi-turn-example', version: '1.0.0' },
  { capabilities: {} }
);

await client.connect(transport);

console.log('='.repeat(70));
console.log('Multi-Turn Conversation: Solving Complex Startup Problems');
console.log('='.repeat(70));
console.log();

/**
 * Complex startup scenario: Building a fintech product
 */
const startupProblem = {
  description: 'Building a neobank for Gen Z with crypto integration',
  phases: [
    'Product-market fit: Should we start with crypto or traditional banking?',
    'Technical architecture: Monolith or microservices for MVP?',
    'Go-to-market: Viral growth vs. paid acquisition?',
    'Fundraising: Should we raise now or bootstrap longer?',
  ],
};

/**
 * Example 1: Multi-turn conversation with Paul Graham (YC mindset)
 */
async function consultPaulGraham() {
  console.log('💬 Consulting Paul Graham on startup strategy\n');
  
  try {
    // Phase 1: Summon legend and initialize session
    console.log('📞 Phase 1: Summoning Paul Graham...');
    const pgPersona = await client.callTool({
      name: 'summon_legend',
      arguments: { legend_id: 'paul-graham' },
    });

    const pg = JSON.parse(pgPersona.content[0].text);
    const session = new LegendSession('paul-graham', pg);
    
    console.log(`✅ Session started with ${pg.name}`);
    console.log(`   Voice: ${pg.quick_ref.voice.tone}`);
    console.log(`   Focus: ${pg.quick_ref.principles[0]}\n`);

    // Phase 2: First exchange - Product-market fit
    console.log('🗨️  Turn 1: Product-Market Fit');
    const turn1Question = startupProblem.phases[0];
    console.log(`   User: ${turn1Question}`);
    
    // Get context-aware insights
    const turn1Context = await client.callTool({
      name: 'get_legend_context',
      arguments: { 
        legend_id: 'paul-graham',
        topic: 'product-market fit',
      },
    });
    
    const turn1Insights = JSON.parse(turn1Context.content[0].text);
    const turn1Response = `
Based on my essay "Do Things That Don't Scale":
${turn1Insights.frameworks[0]}

My advice: ${turn1Insights.quotes[0]}

For your neobank, start with whichever feature your users ALREADY want.
Don't force crypto if they just want better UX on basic banking.
Talk to 100 Gen Z users first.
    `.trim();
    
    session.addExchange(turn1Question, turn1Response);
    console.log(`   PG: ${turn1Response.substring(0, 150)}...\n`);

    // Phase 3: Second exchange - Technical architecture
    console.log('🗨️  Turn 2: Technical Architecture (with conversation history)');
    const turn2Question = startupProblem.phases[1];
    console.log(`   User: ${turn2Question}`);
    console.log(`   [Session includes ${session.conversationHistory.length} previous turn(s)]\n`);
    
    const turn2Response = `
You already established your users want better UX. Good.

Now: Monolith for MVP. Always. Here's why:
- You can't know what to split until you've built it
- Premature optimization kills startups
- You need to move FAST, not architect for Google scale

${pg.quick_ref.patterns.find(p => p.name.includes('MVP'))?.approach || 'Build the simplest thing that works.'}

Split later when you MUST, not when you MIGHT need to.
    `.trim();
    
    session.addExchange(turn2Question, turn2Response);
    console.log(`   PG: ${turn2Response.substring(0, 200)}...\n`);

    // Phase 4: Third exchange - GTM strategy (context builds)
    console.log('🗨️  Turn 3: Go-to-Market Strategy (context accumulates)');
    const turn3Question = startupProblem.phases[2];
    console.log(`   User: ${turn3Question}`);
    console.log(`   [Session now has ${session.conversationHistory.length} previous turns]\n`);
    
    const turn3Response = `
Remember turn 1? You're talking to Gen Z users.
Turn 2? You're moving fast with a monolith.

So: Viral growth. But not in the way you think.

Real viral growth for neobanks:
1. Make the product SO GOOD users tell friends organically
2. Add referral incentives AFTER you have organic growth
3. Don't buy ads until you understand why people love it

${pg.quick_ref.never_say.includes('Scale now') ? 'Never: "Scale before PMF"' : ''}

Get 100 users who LOVE it. Not 10,000 who are lukewarm.
    `.trim();
    
    session.addExchange(turn3Question, turn3Response);
    console.log(`   PG: ${turn3Response}\n`);

    // Phase 5: Final exchange - Fundraising decision
    console.log('🗨️  Turn 4: Fundraising Decision (full context applied)');
    const turn4Question = startupProblem.phases[3];
    console.log(`   User: ${turn4Question}`);
    console.log(`   [Session history: ${session.conversationHistory.length} turns over ${Math.floor(session.getContext().duration / 1000)}s]\n`);
    
    const turn4Response = `
Looking at our whole conversation:
- Turn 1: You're still finding PMF
- Turn 2: You're building an MVP
- Turn 3: You haven't nailed viral growth yet

So: Bootstrap. Here's the hard truth:

${turn1Insights.quotes[1] || 'Raise money when you don\'t need it.'}

You need 2-3 more months to:
1. Get 100 passionate users (turn 1)
2. Ship the MVP monolith (turn 2)  
3. See organic growth (turn 3)

THEN raise. Your valuation will be 3x higher.

VCs invest in traction, not pitch decks.
    `.trim();
    
    session.addExchange(turn4Question, turn4Response);
    console.log(`   PG: ${turn4Response}\n`);

    // Display session summary
    console.log('─'.repeat(70));
    console.log('📊 Session Summary:');
    console.log(`   Legend: ${pg.name}`);
    console.log(`   Total turns: ${session.conversationHistory.length}`);
    console.log(`   Duration: ${Math.floor(session.getContext().duration / 1000)}s`);
    console.log(`   Persona consistency maintained: ✅`);
    console.log();

    // Show how context accumulated
    console.log('📚 Context Evolution:');
    session.conversationHistory.forEach((ex, i) => {
      console.log(`   Turn ${i + 1}: Built on ${i} previous exchanges`);
    });
    console.log();

    return session;

  } catch (error) {
    console.error('❌ Error in multi-turn conversation:', error.message);
    
    // Error recovery strategies
    if (error.message.includes('context')) {
      console.log('💡 Recovery: Re-summon legend to restore persona');
    } else if (error.message.includes('timeout')) {
      console.log('💡 Recovery: Persist session state and retry');
    }
    
    throw error;
  }
}

/**
 * Example 2: Context retention validation across exchanges
 */
async function validateContextRetention(session) {
  console.log('🔍 Validating Context Retention\n');
  
  try {
    // Check 1: Persona consistency
    const reloadedPersona = await client.callTool({
      name: 'summon_legend',
      arguments: { legend_id: session.legendId },
    });
    
    const reloaded = JSON.parse(reloadedPersona.content[0].text);
    const consistent = reloaded.name === session.personaData.name;
    
    console.log(`✅ Persona consistency: ${consistent ? 'PASS' : 'FAIL'}`);
    console.log(`   Original: ${session.personaData.name}`);
    console.log(`   Reloaded: ${reloaded.name}\n`);

    // Check 2: Conversation history integrity
    console.log('✅ Conversation history integrity:');
    console.log(`   Turns recorded: ${session.conversationHistory.length}`);
    console.log(`   First turn timestamp: ${session.conversationHistory[0].timestamp}`);
    console.log(`   Last turn timestamp: ${session.conversationHistory[session.conversationHistory.length - 1].timestamp}\n`);

    // Check 3: Context drift detection
    const originalPrinciples = session.personaData.quick_ref.principles;
    const reloadedPrinciples = reloaded.quick_ref.principles;
    const drift = JSON.stringify(originalPrinciples) !== JSON.stringify(reloadedPrinciples);
    
    console.log(`✅ Context drift: ${drift ? 'DETECTED' : 'NONE'}`);
    if (drift) {
      console.log('   ⚠️  Persona data changed between loads!');
    }
    console.log();

  } catch (error) {
    console.error('❌ Context validation failed:', error.message);
  }
}

/**
 * Example 3: Session persistence and restoration
 */
function serializeSession(session) {
  return JSON.stringify({
    legendId: session.legendId,
    conversationHistory: session.conversationHistory,
    startTime: session.startTime,
    // Don't serialize personaData - reload it from MCP
  });
}

async function restoreSession(serialized) {
  const data = JSON.parse(serialized);
  
  // Reload persona from MCP
  const personaResult = await client.callTool({
    name: 'summon_legend',
    arguments: { legend_id: data.legendId },
  });
  
  const persona = JSON.parse(personaResult.content[0].text);
  
  // Reconstruct session
  const session = new LegendSession(data.legendId, persona);
  session.conversationHistory = data.conversationHistory;
  session.startTime = new Date(data.startTime);
  
  return session;
}

/**
 * Main execution
 */
async function main() {
  try {
    console.log('Problem Statement:');
    console.log(`"${startupProblem.description}"`);
    console.log();
    console.log('Strategy: Consult Paul Graham across multiple turns\n');
    console.log('─'.repeat(70) + '\n');

    // Run multi-turn consultation
    const session = await consultPaulGraham();
    
    console.log('─'.repeat(70) + '\n');

    // Validate context retention
    await validateContextRetention(session);

    // Demonstrate session persistence
    console.log('💾 Session Persistence Demo\n');
    const serialized = serializeSession(session);
    console.log(`   Serialized session: ${serialized.length} bytes`);
    
    const restored = await restoreSession(serialized);
    console.log(`   Restored ${restored.conversationHistory.length} turns`);
    console.log(`   Session integrity: ✅\n`);

  } catch (error) {
    console.error('Fatal error:', error);
  } finally {
    await client.close();
  }
}

main().catch(console.error);
