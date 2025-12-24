#!/usr/bin/env node

/**
 * Example: Using summon_legend to adopt Crypto Builder personas
 * for blockchain technology discussions
 * 
 * This example demonstrates:
 * 1. Summoning crypto-focused legends (CZ, Andre Cronje, Anatoly)
 * 2. Using their personas for blockchain architecture discussions
 * 3. Error handling and validation
 * 4. Comparing different crypto builder mindsets
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

// Initialize MCP client
const transport = new StdioClientTransport({
  command: 'npx',
  args: ['legends-mcp'],
});

const client = new Client(
  {
    name: 'blockchain-discussion-example',
    version: '1.0.0',
  },
  {
    capabilities: {},
  }
);

await client.connect(transport);

console.log('='.repeat(60));
console.log('Blockchain Discussion: Crypto Builder Personas');
console.log('='.repeat(60));
console.log();

/**
 * Example 1: Summon CZ (Binance) for Exchange Architecture Discussion
 */
async function discussExchangeArchitecture() {
  console.log('🏗️  Discussion: Building a DEX with CZ\'s mindset\n');
  
  try {
    // Summon CZ persona
    const czPersona = await client.callTool({
      name: 'summon_legend',
      arguments: {
        legend_id: 'cz-binance',
      },
    });

    const cz = czPersona.content[0].text;
    console.log('✅ Summoned:', JSON.parse(cz).name);
    console.log();

    // Display CZ's key principles for exchange building
    const czData = JSON.parse(cz);
    console.log('CZ\'s Principles for Exchange Architecture:');
    czData.quick_ref.principles.slice(0, 3).forEach((p, i) => {
      console.log(`  ${i + 1}. ${p}`);
    });
    console.log();

    // Show CZ's approach to scalability
    console.log('CZ\'s Scalability Patterns:');
    const scalabilityPattern = czData.quick_ref.patterns.find(
      p => p.name.includes('Scale') || p.name.includes('Performance')
    );
    if (scalabilityPattern) {
      console.log(`  When: ${scalabilityPattern.when}`);
      console.log(`  Approach: ${scalabilityPattern.approach}`);
    }
    console.log();

    // Model hints for using CZ persona
    if (czData.model_hints) {
      console.log('💡 Model Hints:');
      console.log(`  Temperature: ${czData.model_hints.temperature}`);
      console.log(`  Style: ${czData.model_hints.response_style}`);
    }
    console.log();

  } catch (error) {
    console.error('❌ Error summoning CZ:', error.message);
    if (error.message.includes('not found')) {
      console.log('💡 Tip: Run `list_legends` to see available crypto legends');
    }
  }
}

/**
 * Example 2: Summon Andre Cronje for DeFi Protocol Design
 */
async function discussDeFiProtocol() {
  console.log('🔐 Discussion: DeFi Protocol Security with Andre Cronje\n');
  
  try {
    const andrePersona = await client.callTool({
      name: 'summon_legend',
      arguments: {
        legend_id: 'andre-cronje',
      },
    });

    const andre = JSON.parse(andrePersona.content[0].text);
    console.log('✅ Summoned:', andre.name);
    console.log();

    // Andre's security-first approach
    console.log('Andre\'s Security Principles:');
    andre.quick_ref.principles
      .filter(p => p.toLowerCase().includes('security') || 
                   p.toLowerCase().includes('audit') ||
                   p.toLowerCase().includes('test'))
      .forEach((p, i) => {
        console.log(`  ${i + 1}. ${p}`);
      });
    console.log();

    // What Andre never says (red flags)
    console.log('🚫 Red Flags (Andre would never say):');
    andre.quick_ref.never_say.slice(0, 4).forEach((phrase) => {
      console.log(`  - "${phrase}"`);
    });
    console.log();

    // Anti-patterns to avoid
    console.log('⚠️  Anti-patterns to avoid:');
    andre.quick_ref.anti_patterns.slice(0, 2).forEach((ap) => {
      console.log(`  ${ap.name}: ${ap.why}`);
    });
    console.log();

  } catch (error) {
    console.error('❌ Error summoning Andre:', error.message);
  }
}

/**
 * Example 3: Summon Anatoly Yakovenko for L1 Blockchain Performance
 */
async function discussL1Performance() {
  console.log('⚡ Discussion: L1 Performance with Anatoly (Solana)\n');
  
  try {
    const anatolyPersona = await client.callTool({
      name: 'summon_legend',
      arguments: {
        legend_id: 'anatoly-yakovenko',
      },
    });

    const anatoly = JSON.parse(anatolyPersona.content[0].text);
    console.log('✅ Summoned:', anatoly.name);
    console.log();

    // Anatoly's performance patterns
    console.log('Anatoly\'s Performance Optimization Patterns:');
    anatoly.quick_ref.patterns
      .filter(p => p.name.includes('Performance') || 
                   p.name.includes('Scale') ||
                   p.name.includes('Optimize'))
      .forEach((pattern) => {
        console.log(`  📊 ${pattern.name}`);
        console.log(`     When: ${pattern.when}`);
        console.log(`     Approach: ${pattern.approach.substring(0, 100)}...`);
        console.log();
      });

  } catch (error) {
    console.error('❌ Error summoning Anatoly:', error.message);
  }
}

/**
 * Example 4: Compare Multiple Crypto Builders on Same Topic
 */
async function compareBlockchainApproaches() {
  console.log('🤝 Comparison: Different Crypto Builder Approaches\n');
  
  const cryptoLegends = ['cz-binance', 'andre-cronje', 'anatoly-yakovenko'];
  const topic = 'Building a high-throughput blockchain';
  
  console.log(`Topic: ${topic}\n`);

  for (const legendId of cryptoLegends) {
    try {
      const persona = await client.callTool({
        name: 'summon_legend',
        arguments: { legend_id: legendId },
      });

      const legend = JSON.parse(persona.content[0].text);
      
      console.log(`${legend.name}:`);
      console.log(`  Voice: ${legend.quick_ref.voice.tone}`);
      console.log(`  Focus: ${legend.quick_ref.principles[0]}`);
      console.log(`  Key Pattern: ${legend.quick_ref.patterns[0].name}`);
      console.log();

    } catch (error) {
      console.log(`  ⚠️  ${legendId}: ${error.message}`);
    }
  }
}

/**
 * Example 5: Using search_legends to find crypto-focused personas
 */
async function findCryptoBuilders() {
  console.log('🔍 Finding all Crypto Builder personas\n');
  
  try {
    const searchResult = await client.callTool({
      name: 'search_legends',
      arguments: {
        query: 'crypto blockchain DeFi',
      },
    });

    const results = JSON.parse(searchResult.content[0].text);
    console.log(`Found ${results.length} crypto-focused legends:\n`);
    
    results.forEach((legend) => {
      console.log(`  • ${legend.name} (${legend.id})`);
      console.log(`    ${legend.tagline}`);
      console.log();
    });

  } catch (error) {
    console.error('❌ Error searching:', error.message);
  }
}

/**
 * Main execution
 */
async function main() {
  try {
    // Example 1: CZ for exchange architecture
    await discussExchangeArchitecture();
    console.log('─'.repeat(60) + '\n');

    // Example 2: Andre Cronje for DeFi security
    await discussDeFiProtocol();
    console.log('─'.repeat(60) + '\n');

    // Example 3: Anatoly for L1 performance
    await discussL1Performance();
    console.log('─'.repeat(60) + '\n');

    // Example 4: Compare approaches
    await compareBlockchainApproaches();
    console.log('─'.repeat(60) + '\n');

    // Example 5: Search for more crypto builders
    await findCryptoBuilders();

  } catch (error) {
    console.error('Fatal error:', error);
  } finally {
    await client.close();
  }
}

main().catch(console.error);
