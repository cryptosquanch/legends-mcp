# Legends MCP - Code Examples

Complete, runnable examples demonstrating all features of Legends MCP. Each example is designed to address specific use cases and Context7 benchmark requirements.

## Prerequisites

```bash
# Install legends-mcp globally or use npx
npm install -g legends-mcp

# Or run examples with npx (no installation needed)
npx legends-mcp
```

## Running Examples

All examples are executable Node.js scripts:

```bash
cd examples/
chmod +x *.js
./combined-workflow.js
```

Or run with Node directly:

```bash
node examples/combined-workflow.js
```

---

## 📚 Example Catalog

### 1. Combined Workflow
**File**: `combined-workflow.js` (328 lines)
**Context7 Question**: Q3 (Score: 72) - "How do I combine get_legend_context and get_legend_insight?"

**What it demonstrates**:
- Using `get_legend_insight` for quick actionable advice
- Following up with `get_legend_context` for comprehensive frameworks
- Optimal workflow for gathering both quick wins and deep understanding
- When to use each tool and how to combine them effectively

**Use case**: Starting new projects or initiatives where you need both speed (insights) and thoroughness (context).

**Key sections**:
```javascript
// Phase 1: Quick insights (takes ~1-2 seconds)
const insights = await getQuickInsights(legendId);

// Phase 2: Comprehensive context (takes ~2-3 seconds)
const context = await getComprehensiveContext(legendId);

// Synthesize into action plan
synthesizeActionPlan(insights, context);
```

**Tool selection guide**:
- Use `get_legend_insight` when time is limited or exploring multiple legends
- Use `get_legend_context` when building detailed implementation plans
- Use both for comprehensive planning and teaching/mentoring

---

### 2. Brainstorming Session
**File**: `brainstorming-session.js` (348 lines)
**Context7 Question**: Q6 (Score: 45) - "How do I alternate between different legend insights?"

**What it demonstrates**:
- Rapid iteration through multiple legend insights
- Alternating between different personas (Elon Musk, Naval Ravikant, etc.)
- Building creative momentum with quick wisdom snippets
- Synthesizing diverse viewpoints into actionable ideas
- Session management for brainstorming workflows

**Use case**: Tackling complex challenges that benefit from multiple perspectives (e.g., "How to make AI agents more trustworthy?").

**Key features**:
- **Sequential alternating**: Builds momentum by switching between legends
- **Rapid-fire parallel mode**: Quick comparison across all legends at once
- **Theme-based synthesis**: Groups insights by transparency, trust, safety, etc.
- **Actionable idea generation**: Converts insights into concrete implementation ideas

**Session manager**:
```javascript
class BrainstormingSession {
  constructor(topic) {
    this.topic = topic;
    this.rounds = [];
    this.insights = [];
  }

  addRound(legendId, legendName, insight) {
    // Tracks each legend's contribution
  }

  synthesizeIdeas() {
    // Groups insights by theme
  }
}
```

---

### 3. Conflicting Advice Resolution
**File**: `conflicting-advice-resolution.js` (416 lines)
**Context7 Question**: Q2 (Score: 28) - "How do I handle conflicting advice from multiple legends?"

**What it demonstrates**:
- Summoning multiple legends for the same strategic decision
- Comparing their distinct mental models and frameworks
- Identifying conflicts and areas of agreement
- Synthesizing a balanced decision matrix
- Using MCP's parallel tool calling for efficient comparison

**Use case**: Strategic decisions where different legends might disagree (e.g., "Should we pivot from B2B SaaS to B2C marketplace?").

**Key components**:
```javascript
class AdviceComparison {
  analyze() {
    this.findConflicts(themes);    // Where legends disagree
    this.findAgreements(themes);   // Universal consensus
    this.buildDecisionMatrix();    // Weighted scoring
  }

  synthesizeRecommendation() {
    // Consensus → proceed with confidence
    // Disagreement → deeper analysis needed
    // Mixed signals → phased approach
  }
}
```

**Parallel legend summoning**:
```javascript
const summonPromises = legendPerspectives.map(legend =>
  client.callTool({
    name: 'summon_legend',
    arguments: { legend_id: legend.id },
  })
);

const results = await Promise.all(summonPromises);
```

---

### 4. Multi-Turn Conversation
**File**: `multi-turn-conversation.js` (350 lines)
**Context7 Question**: Q4 (Score: 28) - "How do I maintain persona context across multiple exchanges?"

**What it demonstrates**:
- Session management for maintaining legend context
- Conversation history formatting
- Error handling for context retention
- Chaining multiple interactions with same persona
- Solving a complex startup problem across multiple exchanges

**Use case**: Complex problems requiring iterative discussion (e.g., building a fintech product with decisions on product-market fit, architecture, GTM, fundraising).

**Session state management**:
```javascript
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

  formatHistoryForPrompt() {
    // Format conversation history for context
  }
}
```

**Context validation**:
- Persona consistency checks
- Conversation history integrity
- Context drift detection
- Session persistence and restoration

---

### 5. Blockchain Discussion
**File**: `blockchain-discussion.js` (270 lines)
**Context7 Question**: Q5 (Score: 72) - "Show me a code snippet using the Crypto Builder personas"

**What it demonstrates**:
- Using `summon_legend` to adopt Crypto Builder personas
- Summoning crypto-focused legends (CZ, Andre Cronje, Anatoly)
- Using their personas for blockchain architecture discussions
- Error handling and validation
- Comparing different crypto builder mindsets

**Use case**: Blockchain/crypto projects needing specialized expertise on exchanges, DeFi protocols, or L1 performance.

**Available crypto legends**:
- **CZ (Binance)**: Exchange architecture, scalability, global operations
- **Andre Cronje (Yearn)**: DeFi protocol security, smart contract safety
- **Anatoly Yakovenko (Solana)**: L1 performance, Proof of History, TPS optimization
- **Mert Mumtaz (Helius)**: RPC infrastructure, developer experience

**Example discussions**:
```javascript
// Exchange architecture with CZ
await discussExchangeArchitecture();

// DeFi security with Andre Cronje
await discussDeFiProtocol();

// L1 performance with Anatoly
await discussL1Performance();

// Compare all approaches
await compareBlockchainApproaches();
```

---

## 🛠️ Tool Reference

### Core MCP Tools Used in Examples

#### 1. `list_legends`
Lists all available legends with metadata.

```javascript
const legends = await client.callTool({
  name: 'list_legends',
  arguments: {},
});
```

**Returns**: Array of legends with `id`, `name`, `tagline`, `category`, `tags`.

---

#### 2. `summon_legend`
Summons a specific legend's full persona for Claude to adopt.

```javascript
const persona = await client.callTool({
  name: 'summon_legend',
  arguments: {
    legend_id: 'paul-graham',
  },
});
```

**Returns**: Complete persona data including:
- Identity (name, role, era)
- Voice (tone, style, vocabulary)
- Principles (core beliefs)
- Patterns (decision-making frameworks)
- Anti-patterns (things to avoid)
- Mental models
- Examples (quotes, analogies, heuristics)

---

#### 3. `get_legend_context`
Get comprehensive frameworks and mental models for a specific topic.

```javascript
const context = await client.callTool({
  name: 'get_legend_context',
  arguments: {
    legend_id: 'steve-jobs',
    topic: 'product design',
  },
});
```

**Returns**: Deep context including:
- Principles relevant to the topic
- Decision patterns (when/approach)
- Anti-patterns to avoid
- Mental models
- Frameworks

**Best for**: Implementation planning, understanding complex decision patterns, adopting a legend's complete mindset.

---

#### 4. `get_legend_insight`
Get quick actionable advice and memorable quotes.

```javascript
const insight = await client.callTool({
  name: 'get_legend_insight',
  arguments: {
    legend_id: 'elon-musk',
    topic: 'product-market fit',
  },
});
```

**Returns**: Quick wisdom including:
- Memorable quotes (3-5 actionable statements)
- Key frameworks (condensed versions)
- Topic-relevant principles

**Best for**: Brainstorming, rapid decisions, communication, exploring multiple legends quickly.

---

#### 5. `search_legends`
Search for legends by keywords, categories, or expertise areas.

```javascript
const results = await client.callTool({
  name: 'search_legends',
  arguments: {
    query: 'crypto blockchain DeFi',
  },
});
```

**Returns**: Array of matching legends ranked by relevance.

**Best for**: Discovering legends you didn't know existed, finding domain-specific expertise.

---

## 🎯 Mapping to Context7 Benchmark

| Question | Score | Example File | Status |
|----------|-------|--------------|--------|
| Q1: Architecture for custom personas | 15 | See `../ARCHITECTURE.md` | ✅ |
| Q2: Conflicting advice resolution | 28 | `conflicting-advice-resolution.js` | ✅ |
| Q3: Combining tools (context + insight) | 72 | `combined-workflow.js` | ✅ |
| Q4: Multi-turn conversations | 28 | `multi-turn-conversation.js` | ✅ |
| Q5: Crypto Builder code snippet | 72 | `blockchain-discussion.js` | ✅ |
| Q6: Brainstorming with alternating insights | 45 | `brainstorming-session.js` | ✅ |
| Q7: Warren Buffett investment principles | 78 | Use `summon_legend` with `warren-buffett` | ✅ |
| Q8: Steve Jobs product design | 78 | Use `summon_legend` with `steve-jobs` | ✅ |
| Q9: List all legends capability | 92 | Use `list_legends` tool | ✅ |
| Q10: Claude Code configuration | 96 | See main `README.md` | ✅ |

---

## 📊 Performance Considerations

### Tool Response Times (Approximate)

| Tool | Typical Response Time | Use Case |
|------|----------------------|----------|
| `list_legends` | ~100ms | Directory listing |
| `summon_legend` | ~200-500ms | Full persona loading |
| `get_legend_insight` | ~1-2s | Quick advice generation |
| `get_legend_context` | ~2-3s | Deep framework analysis |
| `search_legends` | ~100-300ms | Fuzzy search across legends |

### Optimization Strategies

1. **Parallel tool calls**: Summon multiple legends simultaneously
   ```javascript
   const promises = legends.map(id =>
     client.callTool({ name: 'summon_legend', arguments: { legend_id: id } })
   );
   const results = await Promise.all(promises);
   ```

2. **Cache persona data**: Store summoned legends to avoid re-fetching
   ```javascript
   const personaCache = new Map();
   if (!personaCache.has(legendId)) {
     const persona = await client.callTool({ ... });
     personaCache.set(legendId, persona);
   }
   ```

3. **Use insights for exploration**: Start with `get_legend_insight` to quickly explore options, then deep-dive with `get_legend_context` for chosen approach.

---

## 🔧 Error Handling Patterns

All examples include comprehensive error handling:

```javascript
try {
  const result = await client.callTool({ ... });
} catch (error) {
  console.error('❌ Error:', error.message);

  // Specific error recovery
  if (error.message.includes('not found')) {
    console.log('💡 Tip: Run list_legends to see available legends');
  } else if (error.message.includes('context')) {
    console.log('💡 Recovery: Re-summon legend to restore persona');
  }
}
```

Common error scenarios:
- **Legend not found**: Invalid `legend_id` → Use `list_legends` to verify
- **Context retention failure**: Session state lost → Re-summon with `summon_legend`
- **Tool timeout**: Network/MCP issues → Implement retry logic
- **YAML parse errors**: Malformed persona data → Report issue on GitHub

---

## 🚀 Best Practices

### 1. Start with Quick Insights
```javascript
// ✅ Good: Explore first
const insight = await client.callTool({
  name: 'get_legend_insight',
  arguments: { legend_id: 'paul-graham', topic: 'MVP' }
});

// Then deep dive if relevant
const context = await client.callTool({
  name: 'get_legend_context',
  arguments: { legend_id: 'paul-graham', topic: 'MVP' }
});
```

### 2. Use Parallel Calls for Comparison
```javascript
// ✅ Good: Parallel comparison (fast)
const promises = ['elon-musk', 'steve-jobs', 'jeff-bezos'].map(id =>
  client.callTool({ name: 'summon_legend', arguments: { legend_id: id } })
);
const legends = await Promise.all(promises);

// ❌ Bad: Sequential (slow)
for (const id of ['elon-musk', 'steve-jobs', 'jeff-bezos']) {
  const legend = await client.callTool({ ... });
}
```

### 3. Maintain Session State for Multi-Turn
```javascript
// ✅ Good: Track conversation history
class Session {
  constructor(legend) { this.history = []; }
  addTurn(user, assistant) { this.history.push({ user, assistant }); }
}

// ❌ Bad: Stateless queries (loses context)
await askQuestion1();
await askQuestion2();  // No memory of question 1
```

### 4. Validate Persona Consistency
```javascript
// ✅ Good: Verify persona hasn't drifted
const original = await summonLegend('paul-graham');
// ... many operations later ...
const reloaded = await summonLegend('paul-graham');
const consistent = JSON.stringify(original.principles) ===
                   JSON.stringify(reloaded.principles);
```

---

## 📖 Additional Resources

- **[Main README](../README.md)**: Quick start and configuration
- **[Architecture Guide](../ARCHITECTURE.md)**: Scaling with custom personas
- **[GitHub Issues](https://github.com/cryptosquanch/legends-mcp/issues)**: Report bugs or request features
- **[Context7 Benchmark](https://context7.com/cryptosquanch/legends-mcp?tab=benchmark)**: View documentation quality scores

---

## 💡 Contributing Examples

Have a great use case? Submit a PR with:

1. **Executable script** following existing patterns
2. **Clear comments** explaining each phase
3. **Error handling** for common failure modes
4. **Real-world scenario** that others can relate to
5. **Performance notes** if using parallel calls or caching

Example template:
```javascript
#!/usr/bin/env node

/**
 * Example: [Brief description]
 *
 * This example demonstrates:
 * 1. [Key concept 1]
 * 2. [Key concept 2]
 * 3. [Key concept 3]
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

// ... your implementation ...
```

---

<p align="center">
  <i>"The best way to learn is by example. These are yours."</i>
</p>
