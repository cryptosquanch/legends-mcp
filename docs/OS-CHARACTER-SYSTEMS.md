# 🎭 Open Source Character AI Systems

> Research on OS character systems we can learn from, clone, or integrate

---

## 📊 Comparison Matrix

| System | License | Character Format | Active | Clone-able | Notes |
|--------|---------|------------------|--------|------------|-------|
| **SillyTavern** | AGPL-3.0 | Character Cards (JSON/PNG) | ✅ Very Active | ✅ Yes | Best prompt engineering |
| **TavernAI** | AGPL-3.0 | Character Cards | ⚠️ Slow | ✅ Yes | SillyTavern fork origin |
| **Oobabooga** | AGPL-3.0 | JSON/YAML | ✅ Active | ✅ Yes | Text-gen focused |
| **KoboldAI** | AGPL-3.0 | JSON | ✅ Active | ✅ Yes | Story/RP focused |
| **Pygmalion** | Apache 2.0 | Fine-tuned models | ⚠️ Slow | ⚠️ Partial | Model-based |
| **Chub.ai** | Proprietary | Cards (PNG/JSON) | ✅ Active | ❌ No | Card hosting |
| **RisuAI** | MIT | Universal | ✅ Active | ✅ Yes | Multi-platform |

---

## 🏆 Top Systems to Study

### 1. SillyTavern (BEST FOR US)

**Why Study:**
- Most advanced prompt engineering
- Character card standard (we can adopt)
- Active community with examples
- Works with any LLM API

**Key Concepts to Clone:**

```
CHARACTER CARD FORMAT (Chub/SillyTavern Standard)
├── name: "Character Name"
├── description: "Short description"
├── personality: "Detailed personality traits"
├── scenario: "Current situation/context"
├── first_mes: "First message (greeting)"
├── mes_example: "Example dialogues"
├── creator_notes: "Usage instructions"
├── system_prompt: "Custom system prompt"
├── post_history_instructions: "Injected after history"
├── tags: ["tag1", "tag2"]
├── creator: "Creator name"
└── character_version: "1.0"
```

**GitHub:** https://github.com/SillyTavern/SillyTavern

---

### 2. Chub Character Card Format (STANDARD)

**The V2 Spec (Industry Standard):**

```json
{
  "spec": "chara_card_v2",
  "spec_version": "2.0",
  "data": {
    "name": "Character Name",
    "description": "{{char}} is a...",
    "personality": "traits, mannerisms",
    "scenario": "current context",
    "first_mes": "greeting message",
    "mes_example": "<START>\\n{{user}}: Hello\\n{{char}}: ...",
    "creator_notes": "how to use",
    "system_prompt": "custom system prompt",
    "post_history_instructions": "jailbreak/reminder",
    "alternate_greetings": ["alt1", "alt2"],
    "character_book": {
      "entries": [
        {
          "keys": ["trigger", "words"],
          "content": "injected when triggered",
          "enabled": true,
          "insertion_order": 100
        }
      ]
    },
    "tags": ["tech", "founder"],
    "creator": "vibey",
    "character_version": "1.0"
  }
}
```

**Key Innovation:** `character_book` (Lorebook)
- Entries triggered by keywords
- Inject context dynamically
- Like our topic→legend mapping

---

### 3. Lorebook / World Info System

**Concept:** Inject relevant context based on conversation content

```
USER SAYS: "Tell me about first principles"
                    │
                    ▼
LOREBOOK SCANS: keywords = ["first principles", "physics", "elon"]
                    │
                    ▼
MATCH FOUND: "first_principles" entry
                    │
                    ▼
INJECT INTO CONTEXT:
  "First principles thinking means breaking down problems
   to their fundamental truths and reasoning up from there.
   Elon Musk popularized this approach..."
                    │
                    ▼
LLM GENERATES: Response with relevant context
```

**Our Implementation:** `smart-injection.ts` does this!

---

### 4. RisuAI (Modern Approach)

**Why Study:**
- MIT License (can freely clone)
- Modern TypeScript codebase
- Multi-platform (web, desktop)
- Clean architecture

**Key Features:**
- Emotion tracking
- Memory management
- Multi-character scenes
- Plugin system

**GitHub:** https://github.com/kwaroran/RisuAI

---

## 🔧 What We Should Clone/Adopt

### 1. Character Card Export

Add export to standard format:

```typescript
// Export legend as Chub-compatible character card
function exportAsCharacterCard(legend: LegendSkill): CharacterCard {
  return {
    spec: "chara_card_v2",
    spec_version: "2.0",
    data: {
      name: legend.name,
      description: legend.description,
      personality: legend.voice?.tone || "",
      scenario: `You are chatting with ${legend.name}`,
      first_mes: generateGreeting(legend),
      mes_example: formatExamples(legend.examples),
      system_prompt: buildLegendSystemPrompt(legend),
      tags: legend.tags || [],
      creator: "vibey",
      character_version: legend.version || "1.0",
      character_book: buildLorebook(legend),
    }
  };
}
```

### 2. Lorebook Integration

Our `TOPIC_LEGEND_MAP` is a lorebook! Enhance it:

```typescript
interface LorebookEntry {
  keys: string[];           // Trigger keywords
  content: string;          // Injected content
  enabled: boolean;
  insertion_order: number;  // Priority
  case_sensitive: boolean;
  use_regex: boolean;
}

// Convert legend patterns to lorebook
function legendPatternsToLorebook(legend: LegendSkill): LorebookEntry[] {
  return legend.patterns?.map(p => ({
    keys: [p.name.toLowerCase(), ...extractKeywords(p.description)],
    content: `**${p.name}**: ${p.description}\n${p.example || ""}`,
    enabled: true,
    insertion_order: 100,
    case_sensitive: false,
    use_regex: false,
  })) || [];
}
```

### 3. Memory/Conversation Tracking

Learn from how SillyTavern handles:
- Short-term memory (recent messages)
- Long-term memory (summaries)
- Character memories (what char remembers)

```typescript
interface CharacterMemory {
  facts: string[];          // Things learned about user
  summaries: string[];      // Conversation summaries
  lastTopics: string[];     // Recent discussion topics
  emotionalState: string;   // Current mood (optional)
}
```

---

## 📥 Resources to Download/Study

| Resource | URL | What to Learn |
|----------|-----|---------------|
| SillyTavern Docs | docs.sillytavern.app | Prompt engineering |
| Chub.ai Cards | chub.ai/characters | Example characters |
| Risu Codebase | github.com/kwaroran/RisuAI | Architecture |
| CharacterHub | characterhub.org | Community cards |
| Pygmalion Discord | discord.gg/pygmalionai | Community insights |

---

## 🎯 Implementation Priority

### Phase 1: NOW
- [x] Basic YAML character format
- [x] Topic-based insight injection
- [x] Misbehavior prevention
- [ ] Export to Chub format (easy win)

### Phase 2: NEXT
- [ ] Lorebook entries from patterns
- [ ] Example dialogue formatting
- [ ] Alternate greetings
- [ ] Character book triggers

### Phase 3: FUTURE
- [ ] Import from Chub cards
- [ ] Memory system
- [ ] Multi-character scenes
- [ ] Community contributions

---

## ⚠️ Legal Notes

| System | Can We Clone? | Notes |
|--------|---------------|-------|
| SillyTavern | ⚠️ AGPL-3.0 | Must open source derivative |
| RisuAI | ✅ MIT | Free to use |
| Chub Format | ✅ Open Spec | Format is public |
| Character Cards | ✅ User Created | Individual licensing |

**Our Approach:**
- Learn concepts (legal)
- Implement our own code (clean room)
- Use open format standards
- MIT license our implementation

---

## 🔗 Quick Links

- **SillyTavern:** https://github.com/SillyTavern/SillyTavern
- **RisuAI:** https://github.com/kwaroran/RisuAI
- **Character Card Spec:** https://github.com/malfoyslastname/character-card-spec-v2
- **Chub.ai:** https://chub.ai (character database)
- **Pygmalion:** https://pygmalion.chat

---

*This document helps us stay current with the OS character AI ecosystem.*
