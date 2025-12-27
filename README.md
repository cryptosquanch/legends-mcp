# 🏛️ Legends MCP

[![npm version](https://img.shields.io/npm/v/legends-mcp.svg)](https://www.npmjs.com/package/legends-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **Chat with legendary founders & investors in Claude. No API key required!**

Ever wanted to ask Elon Musk about first principles? Get Warren Buffett's take on your investment? Have Steve Jobs roast your product design? Get Paul Graham and Marc Andreessen to **debate** your startup idea?

**Now you can.** With Party Mode, multiple legends can discuss your questions together!

---

## ✨ What's New in v1.4

| Feature | Description |
|---------|-------------|
| 🎭 **Party Mode** | Multiple legends discuss your question together |
| 🔮 **Smart Suggest** | Proactively recommends relevant legends |
| 🎯 **Auto Match** | Deep analysis of which legends fit your topic |
| 🔒 **Security Fixes** | Prompt injection protection, input sanitization |

---

## 🚀 Quick Start

**Claude Code** (`~/.claude/settings.json`):
```json
{
  "mcpServers": {
    "legends": {
      "command": "npx",
      "args": ["legends-mcp"]
    }
  }
}
```

**That's it.** No API key needed. Restart Claude Code and start chatting!

---

## 🎭 Party Mode - Multi-Legend Discussions

Ask complex questions and get perspectives from multiple legends:

```
You: "How should I approach raising my seed round?"

Claude: *Activates Party Mode with Paul Graham, Marc Andreessen, and Bill Gurley*

Paul Graham: "The best fundraising advice is: make something people want first.
Don't optimize for raising money. Optimize for building something users love..."

Marc Andreessen: "Software is eating the world, and VCs know it. Show us
the market size. Show us why NOW is the time..."

Bill Gurley: "Valuation is a vanity metric. What matters is finding partners
who truly understand your business..."
```

### When Party Mode Activates
- Complex questions with multiple valid perspectives
- "Pros and cons" or "different viewpoints" requests
- Debates between different schools of thought
- Questions matching 2+ legends' expertise

---

## 🔮 Smart Suggest - Proactive Recommendations

The `suggest` tool analyzes your question and returns **ready-to-execute actions**:

```
User: "How do I build a crypto exchange?"

suggest() returns:
┌─────────────────────────────────────────────────┐
│ primary_action: {                               │
│   tool: "party_mode",                           │
│   params: {                                     │
│     question: "How do I build a crypto exchange"│
│     legends: ["cz-binance", "brian-armstrong"]  │
│   }                                             │
│ }                                               │
│                                                 │
│ suggested_actions: [                            │
│   { tool: "party_mode", ... },                  │
│   { tool: "summon_legend", id: "cz-binance" },  │
│   { tool: "summon_legend", id: "brian-armstrong"│
│   { tool: "auto_match", ... }                   │
│ ]                                               │
└─────────────────────────────────────────────────┘

Claude picks the best option and executes it!
```

---

## 👥 The Council of Legends (36 Total)

### 🚀 Tech Titans
| Legend | Specialty |
|--------|-----------|
| **Elon Musk** | First principles, physics thinking, building the impossible |
| **Steve Jobs** | Product design, reality distortion, user experience |
| **Jeff Bezos** | Day 1 thinking, customer obsession, long-term vision |
| **Jensen Huang** | GPUs, AI infrastructure, CUDA everything |
| **Satya Nadella** | Enterprise transformation, cloud, culture change |

### 💰 Legendary Investors
| Legend | Specialty |
|--------|-----------|
| **Warren Buffett** | Value investing, compound interest, circle of competence |
| **Charlie Munger** | Mental models, multidisciplinary thinking, inversion |
| **Ray Dalio** | Principles, radical transparency, macro investing |
| **Peter Thiel** | Zero to one, contrarian bets, monopolies |
| **Marc Andreessen** | Software eating world, venture capital, tech optimism |

### 🌱 Startup Sages
| Legend | Specialty |
|--------|-----------|
| **Paul Graham** | Essays, YC wisdom, making things people want |
| **Sam Altman** | Startups, AI/AGI, scaling companies |
| **Naval Ravikant** | Wealth creation, leverage, specific knowledge |
| **Reid Hoffman** | Network effects, blitzscaling, LinkedIn |
| **Brian Chesky** | Design thinking, Airbnb, company culture |

### ⛓️ Crypto Builders
| Legend | Specialty |
|--------|-----------|
| **CZ (Changpeng Zhao)** | Exchange building, BUIDL, global expansion |
| **Vitalik Buterin** | Ethereum, smart contracts, crypto philosophy |
| **Anatoly Yakovenko** | Solana, proof of history, performance |
| **Balaji Srinivasan** | Network state, crypto predictions, tech trends |

*...and 17 more legends including Tim Ferriss, Gary Vaynerchuk, Tobi Lütke, and others!*

---

## 🛠️ All Tools

| Tool | Purpose | Example |
|------|---------|---------|
| `suggest` | 🔮 Proactive recommendations | Analyzes your question, suggests best legend(s) |
| `party_mode` | 🎭 Multi-legend discussion | Get 2-5 legends to discuss together |
| `summon_legend` | 👤 Single legend advice | Channel one legend's perspective |
| `auto_match` | 🎯 Deep legend discovery | Detailed analysis of which legends fit |
| `list_legends` | 📋 Browse all legends | See all 36 available legends |
| `search_legends` | 🔍 Find by keyword | Search by expertise, name, or topic |
| `get_legend_context` | 📖 Deep dive | Get frameworks, principles, examples |
| `get_legend_insight` | 💡 Quick wisdom | Get a concise insight on any topic |

---

## 🔒 Security

v1.3+ includes security hardening:

- ✅ **Prompt injection protection** - User context isolated from system prompts
- ✅ **Input sanitization** - Detects and neutralizes injection attempts
- ✅ **Safe output encoding** - JSON encoding prevents markdown injection
- ✅ **No CWD loading** - Only loads bundled legends (opt-in for custom)
- ✅ **No external APIs** - Zero network requests, zero data leakage

---

## 📊 How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                    ARCHITECTURE                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   User Question                                              │
│        │                                                     │
│        ▼                                                     │
│   ┌──────────────────┐                                       │
│   │  suggest()       │  ← Analyzes question                  │
│   │  "Who can help?" │                                       │
│   └────────┬─────────┘                                       │
│            │                                                 │
│            ▼                                                 │
│   ┌──────────────────┐     ┌──────────────────┐             │
│   │  party_mode()    │ OR  │  summon_legend() │             │
│   │  (multi-legend)  │     │  (single legend) │             │
│   └────────┬─────────┘     └────────┬─────────┘             │
│            │                        │                        │
│            ▼                        ▼                        │
│   ┌──────────────────────────────────────────────┐          │
│   │           legends/*.yaml                      │          │
│   │  (36 bundled persona files - NO API calls!)  │          │
│   └──────────────────────────────────────────────┘          │
│            │                                                 │
│            ▼                                                 │
│   Claude adopts persona(s) and responds in character!       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Zero external APIs. Zero API keys. Just Claude + persona data.**

---

## 🎯 Usage Examples

### Get startup advice from multiple perspectives
```
"What's the most important thing for a first-time founder?"
→ Party Mode: Paul Graham + Sam Altman + Brian Chesky discuss
```

### Deep dive on investing
```
"Should I invest in Bitcoin?"
→ Warren Buffett (skeptic) vs Balaji (bull) debate
```

### Technical decisions
```
"How do I scale my database?"
→ Summon Jeff Bezos for Day 1 / SOA thinking
```

### Life advice
```
"How do I build wealth?"
→ Naval Ravikant on leverage, specific knowledge, equity
```

---

## ⚙️ Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `LEGENDS_MCP_LEGENDS_DIR` | (bundled) | Custom legends directory |
| `LEGENDS_MCP_ALLOW_CWD` | `false` | Allow loading from current directory |
| `LEGENDS_MCP_DEBUG` | `false` | Enable debug logging |

---

## ⚠️ Disclaimers

```
⚠️ NOT affiliated with, endorsed by, or representative of any real individual
⚠️ NOT financial, legal, or professional advice
⚠️ AI personas for EDUCATIONAL and ENTERTAINMENT purposes only
⚠️ Based on publicly available information, speeches, and writings
⚠️ Always do your own research (DYOR)
```

The views expressed by these AI personas are **generated interpretations**, not actual statements from the real people.

---

## 🤝 Contributing

Want to add a legend? PRs welcome!

Each legend needs:
- `legends/<name>/skill.yaml` with identity, voice, principles, patterns
- Authentic voice based on public knowledge
- Clear guardrails (things they'd never say)

See existing legends for examples.

---

## 📄 License

MIT - Use freely, but include the disclaimers.

---

<p align="center">
  <b>🏛️ "The best time to get advice from a legend was 20 years ago.<br>The second best time is now."</b>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/legends-mcp">npm</a> •
  <a href="https://github.com/cryptosquanch/legends-mcp">GitHub</a> •
  <a href="https://glama.ai/mcp/servers/legends-mcp">Glama</a>
</p>
