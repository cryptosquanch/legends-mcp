# Architecture Guide: Scaling Legends MCP

This document addresses architectural considerations for extending Legends MCP to support custom user-defined personas while maintaining our privacy-first, zero-API approach.

## Core Design Principles

### Privacy-First Architecture

Legends MCP is designed with **zero external API dependencies**:
- All persona data lives locally in YAML files
- No telemetry, tracking, or external calls
- User data never leaves the local machine
- MCP stdio transport ensures process isolation

This architecture makes scaling to custom personas straightforward while preserving privacy.

## Custom Persona System Architecture

### 1. Directory Structure for Custom Personas

Extend the existing `legends/` directory structure:

```
legends-mcp/
├── legends/           # Built-in personas (shipped with package)
│   ├── elon-musk/
│   ├── warren-buffett/
│   └── ...
└── ~/.legends-mcp/    # User's custom personas (local only)
    └── custom/
        ├── my-mentor/
        │   └── skill.yaml
        ├── company-founder/
        │   └── skill.yaml
        └── ...
```

**Privacy guarantee**: User personas stay in `~/.legends-mcp/` and never get packaged or uploaded.

### 2. YAML Schema Extension for User-Defined Personas

The existing YAML schema supports all custom persona needs:

```yaml
# ~/.legends-mcp/custom/my-mentor/skill.yaml
name: "My Mentor"
tagline: "Leadership coach focused on team building"
category: custom  # Flag as user-defined

expertise:
  owns:
    - "Leadership frameworks I've learned"
    - "Team management strategies"

principles:
  - name: "Servant Leadership"
    description: "Lead by serving the team's needs"

patterns:
  - name: "1-on-1 Framework"
    when: "Having individual check-ins"
    approach: "Ask open-ended questions, listen actively"
```

**No external dependencies needed** - the YAML loader handles custom personas identically to built-in ones.

### 3. Persona Discovery & Loading

Modify `src/legends/loader.ts` to scan both directories:

```typescript
import { homedir } from 'os';
import { join } from 'path';

const BUILTIN_DIR = './legends';
const USER_DIR = join(homedir(), '.legends-mcp', 'custom');

export function loadAllLegends(): LegendSkill[] {
  const builtin = loadFromDirectory(BUILTIN_DIR);
  const custom = loadFromDirectory(USER_DIR);

  return [...builtin, ...custom];
}
```

**Privacy maintained**: Custom personas load from user's home directory, never transmitted.

### 4. Multi-Tenancy Considerations

Since Legends MCP runs as a **local stdio server**, each user automatically gets isolated:

- **Process isolation**: Each Claude Code instance spawns its own `npx legends-mcp` process
- **User isolation**: Custom personas in `~/.legends-mcp/` are per-user by default
- **No shared state**: No database, no network calls, no cross-contamination

For true multi-user scenarios (e.g., team sharing), consider:

```
~/.legends-mcp/
├── custom/          # Personal personas (private)
└── team/            # Shared personas (version controlled)
    └── company-values/
        └── skill.yaml
```

Users can symlink `team/` to a shared Git repo while keeping `custom/` private.

## Storage Solutions for User-Defined Personas

### File System as Database

The **filesystem IS the database** for Legends MCP:

**Advantages:**
- Zero configuration required
- Git-friendly (version control for personas)
- Human-readable (YAML is editable)
- No migrations or schema management
- Instant backups via file sync tools

**Persona CRUD Operations:**

```bash
# Create
mkdir -p ~/.legends-mcp/custom/my-mentor
vi ~/.legends-mcp/custom/my-mentor/skill.yaml

# Read (automatic via MCP tools)
# list_legends includes all custom personas

# Update
vi ~/.legends-mcp/custom/my-mentor/skill.yaml

# Delete
rm -rf ~/.legends-mcp/custom/my-mentor
```

### Optional: SQLite for Advanced Features

If you need search/indexing for 1000+ custom personas:

```typescript
// Optional: src/legends/db.ts
import Database from 'better-sqlite3';
import { homedir } from 'os';

const db = new Database(join(homedir(), '.legends-mcp', 'cache.db'));

// Index personas for fast search
db.exec(`
  CREATE TABLE IF NOT EXISTS persona_index (
    id TEXT PRIMARY KEY,
    name TEXT,
    tags TEXT,
    path TEXT
  )
`);
```

**Privacy preserved**: SQLite DB lives in `~/.legends-mcp/`, never synced externally.

## Extending the YAML Structure

### Validation Schema

Add custom field validation in `scripts/validate-legends.js`:

```javascript
const REQUIRED_FIELDS = ['name', 'tagline', 'category'];
const OPTIONAL_FIELDS = ['expertise', 'principles', 'patterns', 'user_notes'];

function validateCustomPersona(yaml) {
  // Allow user-specific fields without breaking validation
  if (yaml.category === 'custom') {
    // Relaxed validation for custom personas
    return validateRequired(yaml, REQUIRED_FIELDS);
  }
  return validateBuiltin(yaml);
}
```

### Custom Fields for User Personas

Users can add private fields to their personas:

```yaml
name: "My Mentor"
category: custom

# Standard fields
expertise:
  owns: ["Team building"]

# User-specific fields (ignored by built-in tools)
user_notes: |
  Last conversation: 2024-01-15
  Topics discussed: Conflict resolution

reminders:
  - "Ask about quarterly goals"
  - "Follow up on team feedback"
```

These fields don't affect the MCP tools but are preserved in the YAML.

## Privacy Architecture Patterns

### Principle 1: Local-Only Data Flow

```
┌─────────────────────────────────────────────────┐
│ Claude Code (User's Machine)                    │
│                                                  │
│  ┌──────────────┐      stdio      ┌──────────┐ │
│  │ Claude AI    │ ◄──────────────► │ legends  │ │
│  │              │                  │ -mcp     │ │
│  └──────────────┘                  └────┬─────┘ │
│                                         │       │
│                                         ▼       │
│                              ┌────────────────┐ │
│                              │ legends/       │ │
│                              │ ~/.legends-mcp/│ │
│                              └────────────────┘ │
└─────────────────────────────────────────────────┘

No network boundaries crossed ✓
No external APIs called ✓
User data stays local ✓
```

### Principle 2: Explicit User Control

```typescript
// Only load custom personas if user opts in
const customEnabled = process.env.LEGENDS_ENABLE_CUSTOM === 'true';

if (customEnabled) {
  legends.push(...loadCustomPersonas());
}
```

### Principle 3: No Implicit Sharing

Custom personas are **never** included in:
- npm package
- GitHub repository (unless user explicitly commits them)
- Error reports
- Analytics (we have none)

## Scaling Considerations

### Performance at Scale

**Current**: 36 personas, ~2MB YAML, loads in <100ms

**Projected**: 1000 personas, ~50MB YAML, loads in ~2-3s

**Optimization strategies**:

1. **Lazy loading**: Only load personas when requested
   ```typescript
   export function getLegend(id: string): LegendSkill {
     return loadSingleLegend(id); // On-demand
   }
   ```

2. **Caching**: Build index file on first load
   ```typescript
   // ~/.legends-mcp/index.json
   {
     "my-mentor": { "name": "...", "path": "custom/my-mentor" }
   }
   ```

3. **Search optimization**: Use text search on indexed fields
   ```typescript
   function searchLegends(query: string): string[] {
     const index = loadIndex();
     return index.filter(p =>
       p.name.includes(query) ||
       p.tags.includes(query)
     );
   }
   ```

### Memory Footprint

- Each persona: ~50KB YAML = ~200KB in memory (parsed)
- 36 personas: ~7MB RAM
- 1000 personas: ~200MB RAM (still reasonable for local process)

## Implementation Roadmap

### Phase 1: Basic Custom Persona Support (v1.2.0)
- [ ] Add `~/.legends-mcp/custom/` directory scanning
- [ ] Update `list_legends` to include custom personas
- [ ] Add `category: custom` tag to differentiate
- [ ] Document YAML schema for custom personas

### Phase 2: Advanced Features (v1.3.0)
- [ ] Add `create_legend` MCP tool (generate YAML template)
- [ ] Add `edit_legend` MCP tool (modify existing persona)
- [ ] Add `delete_legend` MCP tool (remove custom persona)
- [ ] Implement lazy loading for performance

### Phase 3: Team Sharing (v1.4.0)
- [ ] Support `~/.legends-mcp/team/` directory (Git-tracked)
- [ ] Add export/import tools for persona sharing
- [ ] Create persona validation CLI tool
- [ ] Add persona templating system

## Security Considerations

### Input Validation

```typescript
// Sanitize user-provided YAML
function validatePersona(yaml: any): LegendSkill {
  // Prevent code injection via YAML
  if (typeof yaml === 'function') {
    throw new Error('YAML cannot contain functions');
  }

  // Validate required fields
  if (!yaml.name || !yaml.tagline) {
    throw new Error('Missing required fields');
  }

  return yaml as LegendSkill;
}
```

### Filesystem Safety

```typescript
// Prevent path traversal attacks
function sanitizePath(legendId: string): string {
  // Only allow alphanumeric + hyphens
  if (!/^[a-z0-9-]+$/.test(legendId)) {
    throw new Error('Invalid legend ID');
  }
  return legendId;
}
```

## Testing Strategy

### Unit Tests for Custom Personas

```typescript
describe('Custom Persona Loading', () => {
  it('loads custom personas from user directory', () => {
    const legends = loadAllLegends();
    const custom = legends.filter(l => l.category === 'custom');
    expect(custom.length).toBeGreaterThan(0);
  });

  it('prioritizes built-in over custom for conflicts', () => {
    // If user has 'elon-musk' custom, built-in wins
    const elon = getLegend('elon-musk');
    expect(elon.category).toBe('legends');
  });
});
```

### Integration Tests

```bash
# Test custom persona end-to-end
mkdir -p ~/.legends-mcp/custom/test-persona
cat > ~/.legends-mcp/custom/test-persona/skill.yaml << EOF
name: "Test Persona"
tagline: "Test"
category: custom
EOF

npx legends-mcp # Should load without errors
```

## FAQ

**Q: Can I use a database instead of YAML files?**

A: You can, but YAML files maintain privacy-first design. If you add a database, ensure it's local-only (SQLite in `~/.legends-mcp/`).

**Q: How do I share custom personas with my team?**

A: Create a Git repo in `~/.legends-mcp/team/` and have team members clone it there. Each user controls what they sync.

**Q: Can custom personas call external APIs?**

A: No. The MCP protocol doesn't support network calls from personas. This is intentional for privacy.

**Q: What about cloud sync for custom personas?**

A: Use standard file sync tools (Dropbox, iCloud, Git) on the `~/.legends-mcp/` directory. The data stays under your control.

## Conclusion

Legends MCP's architecture naturally supports custom personas through:
- **Filesystem-based storage** (Git-friendly, human-editable)
- **Local-only processing** (no APIs, no telemetry)
- **Process isolation** (multi-tenancy via OS-level separation)
- **YAML extensibility** (custom fields without breaking changes)

No external dependencies. No privacy compromises. Just local files and standard tooling.
