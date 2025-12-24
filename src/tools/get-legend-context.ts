// MCP Tool: get_legend_context
// Get a legend's full background, principles, and frameworks
// EXTREMELY DETAILED - exposes the full richness of each persona

import { getLegendById, getAllLegends } from '../legends/loader.js';
import { buildLegendSystemPrompt, formatLegendMarkdown } from '../legends/prompt-builder.js';
import type { LegendSkill, Pattern, AntiPattern } from '../types.js';

export interface GetLegendContextInput {
  legend_id: string;
  format?: 'full' | 'markdown' | 'system_prompt' | 'frameworks' | 'principles' | 'voice' | 'examples';
  include_related?: boolean;
}

export interface LegendContext {
  legend_id: string;
  name: string;
  format: string;
  content: string;
  metadata: {
    expertise: string[];
    tags: string[];
    framework_count: number;
    principle_count: number;
    example_count: number;
  };
  related_legends?: Array<{
    id: string;
    name: string;
    relationship: string;
  }>;
}

/**
 * Get detailed context about a legend
 * This provides EXTREMELY DETAILED information for maximum usefulness
 */
export function getLegendContext(input: GetLegendContextInput): LegendContext {
  const legend = getLegendById(input.legend_id);
  if (!legend) {
    throw new Error(
      `Legend "${input.legend_id}" not found. Use list_legends to see available legends.`
    );
  }

  const format = input.format || 'full';
  let content: string;

  switch (format) {
    case 'full':
      content = formatFullLegendContext(legend);
      break;
    case 'system_prompt':
      content = buildLegendSystemPrompt(legend);
      break;
    case 'frameworks':
      content = formatFrameworks(legend);
      break;
    case 'principles':
      content = formatPrinciples(legend);
      break;
    case 'voice':
      content = formatVoice(legend);
      break;
    case 'examples':
      content = formatExamples(legend);
      break;
    case 'markdown':
    default:
      content = formatLegendMarkdown(legend);
      break;
  }

  const result: LegendContext = {
    legend_id: legend.id,
    name: legend.name,
    format,
    content,
    metadata: {
      expertise: legend.owns || [],
      tags: legend.tags || [],
      framework_count: legend.patterns?.length || 0,
      principle_count: legend.principles?.length || 0,
      example_count: legend.examples?.length || 0,
    },
  };

  // Add related legends if requested
  if (input.include_related) {
    result.related_legends = findRelatedLegends(legend);
  }

  return result;
}

/**
 * Format the FULL legend context - everything we know
 */
function formatFullLegendContext(legend: LegendSkill): string {
  const sections: string[] = [];

  // Header with full description
  sections.push(`# ${legend.name}`);
  sections.push(`*${legend.description}*`);
  sections.push('');

  // Metadata
  if (legend.owns?.length || legend.tags?.length) {
    sections.push('## Quick Reference');
    if (legend.owns?.length) {
      sections.push(`**Areas of Expertise:** ${legend.owns.join(', ')}`);
    }
    if (legend.tags?.length) {
      sections.push(`**Tags:** ${legend.tags.join(', ')}`);
    }
    sections.push('');
  }

  // Full Identity - the core persona description
  if (legend.identity) {
    sections.push('## Identity & Background');
    sections.push(legend.identity.trim());
    sections.push('');
  }

  // Voice & Communication Style
  if (legend.voice) {
    sections.push('## Voice & Communication Style');
    sections.push(`**Tone:** ${legend.voice.tone}`);
    if (legend.voice.style) {
      sections.push('');
      sections.push('**Style Guidelines:**');
      sections.push(legend.voice.style);
    }
    if (legend.voice.personality?.length) {
      sections.push('');
      sections.push(`**Personality Traits:** ${legend.voice.personality.join(', ')}`);
    }
    if (legend.voice.vocabulary?.length) {
      sections.push('');
      sections.push('**Characteristic Vocabulary:**');
      legend.voice.vocabulary.forEach(v => sections.push(`- "${v}"`));
    }
    sections.push('');
  }

  // Core Principles - beliefs and values
  if (legend.principles?.length) {
    sections.push('## Core Principles & Beliefs');
    sections.push('These are the fundamental beliefs that guide their thinking:');
    sections.push('');
    legend.principles.forEach((p, i) => {
      sections.push(`${i + 1}. ${p}`);
    });
    sections.push('');
  }

  // Thinking Frameworks - DETAILED
  if (legend.patterns?.length) {
    sections.push('## Thinking Frameworks');
    sections.push('Use these frameworks to think like this legend:');
    sections.push('');
    legend.patterns.forEach(p => {
      sections.push(`### ${p.name}`);
      sections.push(`*${p.description}*`);
      if (p.when) {
        sections.push('');
        sections.push(`**When to use:** ${p.when}`);
      }
      if (p.steps?.length) {
        sections.push('');
        sections.push('**Steps:**');
        p.steps.forEach((s, i) => sections.push(`${i + 1}. ${s}`));
      }
      if (p.example) {
        sections.push('');
        sections.push(`**Example:** ${p.example}`);
      }
      sections.push('');
    });
  }

  // Anti-Patterns - what they would NEVER do
  if (legend.anti_patterns?.length) {
    sections.push('## What They Would NEVER Do');
    sections.push('Avoid these patterns when channeling this legend:');
    sections.push('');
    legend.anti_patterns.forEach(a => {
      sections.push(`### ${a.pattern || a.name}`);
      sections.push(`**Why this is wrong:** ${a.why}`);
      sections.push(`**Instead, they would:** ${a.instead}`);
      sections.push('');
    });
  }

  // Example Conversations
  if (legend.examples?.length) {
    sections.push('## Example Conversations');
    sections.push('See how they respond in character:');
    sections.push('');
    legend.examples.forEach((ex, i) => {
      sections.push(`### Example ${i + 1}`);
      sections.push(`**User asks:** "${ex.prompt}"`);
      sections.push('');
      sections.push(`**${legend.name} responds:**`);
      sections.push(`> ${ex.response.split('\n').join('\n> ')}`);
      sections.push('');
    });
  }

  // Best Use Cases
  sections.push('## When to Consult This Legend');
  sections.push(generateUseCases(legend));
  sections.push('');

  // Disclaimer
  sections.push('---');
  sections.push('*DISCLAIMER: This is an AI persona inspired by public knowledge about this individual. It is not affiliated with, endorsed by, or representative of the real person. Use for educational and entertainment purposes.*');

  return sections.join('\n');
}

/**
 * Format just the thinking frameworks
 */
function formatFrameworks(legend: LegendSkill): string {
  const sections: string[] = [
    `# ${legend.name}'s Thinking Frameworks`,
    '',
  ];

  if (!legend.patterns?.length) {
    sections.push('No frameworks documented for this legend.');
    return sections.join('\n');
  }

  legend.patterns.forEach(p => {
    sections.push(`## ${p.name}`);
    sections.push(`*${p.description}*`);
    sections.push('');

    if (p.when) {
      sections.push(`**When to use:** ${p.when}`);
      sections.push('');
    }

    if (p.steps?.length) {
      sections.push('**How to apply:**');
      p.steps.forEach((s, i) => sections.push(`${i + 1}. ${s}`));
      sections.push('');
    }

    if (p.example) {
      sections.push(`**Example:** ${p.example}`);
      sections.push('');
    }

    sections.push('---');
    sections.push('');
  });

  return sections.join('\n');
}

/**
 * Format just the principles
 */
function formatPrinciples(legend: LegendSkill): string {
  const sections: string[] = [
    `# ${legend.name}'s Core Principles`,
    '',
    `*${legend.description}*`,
    '',
  ];

  if (!legend.principles?.length) {
    sections.push('No principles documented for this legend.');
    return sections.join('\n');
  }

  sections.push('## Fundamental Beliefs');
  legend.principles.forEach((p, i) => {
    sections.push(`${i + 1}. **${p}**`);
  });

  // Add anti-patterns as "What they reject"
  if (legend.anti_patterns?.length) {
    sections.push('');
    sections.push('## What They Reject');
    legend.anti_patterns.forEach(a => {
      sections.push(`- ${a.pattern || a.name}: ${a.why}`);
    });
  }

  return sections.join('\n');
}

/**
 * Format just the voice/style
 */
function formatVoice(legend: LegendSkill): string {
  const sections: string[] = [
    `# How ${legend.name} Communicates`,
    '',
  ];

  if (!legend.voice) {
    sections.push('No voice guidelines documented for this legend.');
    return sections.join('\n');
  }

  sections.push(`**Overall Tone:** ${legend.voice.tone}`);
  sections.push('');

  if (legend.voice.style) {
    sections.push('## Style Guidelines');
    sections.push(legend.voice.style);
    sections.push('');
  }

  if (legend.voice.personality?.length) {
    sections.push('## Personality Traits');
    legend.voice.personality.forEach(p => sections.push(`- ${p}`));
    sections.push('');
  }

  if (legend.voice.vocabulary?.length) {
    sections.push('## Signature Phrases & Vocabulary');
    sections.push('Watch for these characteristic expressions:');
    legend.voice.vocabulary.forEach(v => sections.push(`- "${v}"`));
    sections.push('');
  }

  return sections.join('\n');
}

/**
 * Format just the examples
 */
function formatExamples(legend: LegendSkill): string {
  const sections: string[] = [
    `# ${legend.name} - Example Conversations`,
    '',
    'See how they respond to different types of questions:',
    '',
  ];

  if (!legend.examples?.length) {
    sections.push('No example conversations documented for this legend.');
    return sections.join('\n');
  }

  legend.examples.forEach((ex, i) => {
    sections.push(`## Example ${i + 1}`);
    sections.push('');
    sections.push('**User:**');
    sections.push(`> ${ex.prompt}`);
    sections.push('');
    sections.push(`**${legend.name}:**`);
    sections.push(`> ${ex.response.split('\n').join('\n> ')}`);
    sections.push('');
    sections.push('---');
    sections.push('');
  });

  return sections.join('\n');
}

/**
 * Generate use cases based on the legend's expertise
 */
function generateUseCases(legend: LegendSkill): string {
  const lines: string[] = [];

  // Based on expertise/owns
  if (legend.owns?.length) {
    lines.push(`This legend is ideal for questions about: ${legend.owns.join(', ')}.`);
    lines.push('');
  }

  // Based on patterns
  if (legend.patterns?.length) {
    lines.push('Consider consulting them when you need to:');
    legend.patterns.forEach(p => {
      if (p.when) {
        lines.push(`- ${p.when}`);
      } else {
        lines.push(`- Apply ${p.name} thinking`);
      }
    });
  }

  // Generic fallback
  if (lines.length === 0) {
    lines.push('Consult this legend for strategic thinking and decision-making advice.');
  }

  return lines.join('\n');
}

/**
 * Find legends with complementary or contrasting perspectives
 */
function findRelatedLegends(legend: LegendSkill): Array<{ id: string; name: string; relationship: string }> {
  const allLegends = getAllLegends();
  const related: Array<{ id: string; name: string; relationship: string }> = [];

  // Define relationships based on expertise overlap
  const legendTags = new Set(legend.tags || []);
  const legendExpertise = new Set(legend.owns || []);

  for (const other of allLegends) {
    if (other.id === legend.id) continue;

    const otherTags = new Set(other.tags || []);
    const otherExpertise = new Set(other.owns || []);

    // Check for tag overlap
    const tagOverlap = [...legendTags].filter(t => otherTags.has(t));
    const expertiseOverlap = [...legendExpertise].filter(e => otherExpertise.has(e));

    if (tagOverlap.length > 0 || expertiseOverlap.length > 0) {
      const overlap = [...tagOverlap, ...expertiseOverlap].slice(0, 2).join(', ');
      related.push({
        id: other.id,
        name: other.name,
        relationship: `Shares expertise in: ${overlap}`,
      });
    }
  }

  // Limit to top 3 related
  return related.slice(0, 3);
}

// MCP Tool Definition
export const getLegendContextTool = {
  name: 'get_legend_context',
  description: `Get EXTREMELY DETAILED information about a legendary founder or investor.

This tool provides:
- **Full identity** - Who they are, their background, their worldview
- **Voice & style** - How they communicate, characteristic phrases
- **Core principles** - Their fundamental beliefs and values
- **Thinking frameworks** - Step-by-step methods they use for decisions
- **Anti-patterns** - What they would NEVER do
- **Example conversations** - See them respond in character
- **Use cases** - When to consult this legend

Formats available:
- \`full\` - Everything (recommended for deep understanding)
- \`frameworks\` - Just their thinking methods
- \`principles\` - Just their beliefs
- \`voice\` - Just their communication style
- \`examples\` - Just sample conversations
- \`system_prompt\` - For custom AI integrations
- \`markdown\` - Readable overview

DISCLAIMER: AI personas for educational purposes only. Not affiliated with real individuals.`,
  inputSchema: {
    type: 'object' as const,
    properties: {
      legend_id: {
        type: 'string',
        description: 'The legend ID (e.g., "elon-musk", "warren-buffett", "steve-jobs")',
      },
      format: {
        type: 'string',
        enum: ['full', 'markdown', 'system_prompt', 'frameworks', 'principles', 'voice', 'examples'],
        description: 'Output format (default: "full" for maximum detail)',
        default: 'full',
      },
      include_related: {
        type: 'boolean',
        description: 'Include related legends with complementary perspectives',
        default: false,
      },
    },
    required: ['legend_id'],
  },
};
