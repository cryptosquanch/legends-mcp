# Legends MCP

> **Chat with legendary founders & investors in Claude Code. No API key required!**

Ever wanted to ask Elon Musk about first principles? Get Warren Buffett's take on your investment thesis? Have Steve Jobs roast your product design?

Now you can. Kinda.

## Quick Start

**Claude Code config** (`~/.claude/config.json`):
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

**That's it.** No API key needed. Restart Claude Code and start chatting.

---

## The Council of Legends

### Tech Titans
| Legend | Vibe |
|--------|------|
| **Elon Musk** | First principles. Physics. Delete requirements. Sleep at factory. |
| **Steve Jobs** | Design is how it works. Reality distortion field. One more thing... |
| **Jeff Bezos** | Day 1 forever. Regret minimization. Customer obsession. |
| **Jensen Huang** | Leather jacket CEO. CUDA everything. AI is eating the world. |

### Investors
| Legend | Vibe |
|--------|------|
| **Warren Buffett** | Cherry Coke. Compound interest. Be fearful when others are greedy. |
| **Charlie Munger** | Mental models. Brutal honesty. Invert, always invert. |
| **Peter Thiel** | Zero to one. Contrarian bets. Competition is for losers. |
| **Marc Andreessen** | Software eating world. Techno-optimist. It's time to build. |

### Startup Sages
| Legend | Vibe |
|--------|------|
| **Paul Graham** | Essays. Make something people want. Do things that don't scale. |
| **Sam Altman** | AGI believer. YC to OpenAI. Move fast on AI. |
| **Naval Ravikant** | Seek wealth, not money. Specific knowledge. Leverage. |
| **Reid Hoffman** | LinkedIn mafia. Blitzscaling. Networks. |

### Crypto Builders
| Legend | Vibe |
|--------|------|
| **CZ** | BUIDL. 4. Funds are SAFU. Global from day one. |
| **Anatoly Yakovenko** | Proof of History. TPS maximalist. Hardware trends. |
| **Mert Mumtaz** | RPC is life. Developer experience. Docs are product. |
| **Michael Heinrich** | YC alum. Web exit. Decentralized AI infrastructure. |

---

## Usage

Once configured, use these tools in Claude Code:

### List all legends
```
Use list_legends to see who's available
```

### Summon a legend
```
Use summon_legend with legend_id="elon-musk" to channel Elon
```
Claude will adopt the legend's persona and respond in character!

### Get deep context
```
Use get_legend_context to see their frameworks, principles, and examples
```

### Get quick insight
```
Use get_legend_insight with legend_id="warren-buffett" for a quick wisdom snippet
```

---

## How It Works

Unlike other AI persona tools that require API keys, **Legends MCP** works differently:

1. **You call `summon_legend`** with a legend ID
2. **MCP returns the persona context** (identity, voice, principles, frameworks)
3. **Claude adopts the persona** and responds in character

No external API calls. No API keys. Just Claude + persona data = magic.

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `LEGENDS_MCP_DEBUG` | `false` | Enable debug logging |

---

## Important Disclaimers

```
NOT affiliated with, endorsed by, or representative of any real individual
NOT financial, legal, or professional advice
AI personas for EDUCATIONAL and ENTERTAINMENT purposes only
Based on publicly available information, speeches, and writings
Always do your own research (DYOR)
```

The views expressed by these AI personas are generated interpretations, not actual statements from the real people.

---

## Contributing

Want to add a legend? PRs welcome!

Each legend needs:
- `skill.yaml` with identity, voice, principles, patterns
- Authentic voice based on public knowledge
- Clear guardrails (things they'd never say)

---

## License

MIT - Do what you want, but include the disclaimers.

---

<p align="center">
  <i>"The best time to get advice from a legend was 20 years ago. The second best time is now."</i>
</p>
