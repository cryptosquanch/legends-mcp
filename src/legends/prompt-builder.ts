// Port of buildLegendSystemPrompt from the main Vibey codebase
// Enhanced with character training for authentic responses

import type { LegendSkill } from '../types.js';
import { buildCharacterInjection } from './character-training.js';

/**
 * Build a system prompt for a legend persona
 * This creates the instruction set that makes the AI embody the legend
 */
export function buildLegendSystemPrompt(legend: LegendSkill): string {
  const parts: string[] = [];

  // Identity - the core persona
  if (legend.identity) {
    parts.push(legend.identity.trim());
  }

  // Voice guidance
  if (legend.voice) {
    parts.push(`\n## Voice & Style\n**Tone:** ${legend.voice.tone}`);
    if (legend.voice.style) {
      parts.push(`**Style Guidelines:**\n${legend.voice.style}`);
    }
    if (legend.voice.vocabulary?.length) {
      parts.push(`**Key Vocabulary:** ${legend.voice.vocabulary.join(', ')}`);
    }
  }

  // Principles
  if (legend.principles?.length) {
    parts.push(`\n## Core Principles\n${legend.principles.map(p => `- ${p}`).join('\n')}`);
  }

  // Patterns - condensed for system prompt
  if (legend.patterns?.length) {
    parts.push(`\n## Thinking Frameworks\nYou have these frameworks available:\n${legend.patterns.map(p => `- **${p.name}**: ${p.description}`).join('\n')}`);
  }

  // Anti-patterns
  if (legend.anti_patterns?.length) {
    parts.push(`\n## What to Avoid\n${legend.anti_patterns.map(a => `- **${a.pattern || a.name}**: ${a.instead}`).join('\n')}`);
  }

  // Character training injection (for authenticity)
  const characterInjection = buildCharacterInjection(legend.id);
  if (characterInjection) {
    parts.push(characterInjection);
  }

  // Behavior instructions
  parts.push(`\n## Behavior
- Stay fully in character as ${legend.name}
- Use your characteristic vocabulary and thinking patterns
- Draw from your frameworks when answering questions
- Be direct, authentic, and true to your philosophy
- NEVER say "As an AI" or "I cannot" - you ARE this person
- NEVER break character or acknowledge you're an AI
- If asked about something outside your expertise, acknowledge it while still offering your perspective`);

  // Legal/safety reminder
  parts.push(`\n## Important
- You are an AI persona for educational purposes
- Do not give financial advice - redirect to technology/principles
- Always remind users to do their own research when relevant`);

  return parts.join('\n\n');
}

/**
 * Format legend as markdown for context display
 */
export function formatLegendMarkdown(legend: LegendSkill): string {
  const sections: string[] = [];

  sections.push(`# ${legend.name}\n`);
  sections.push(`*${legend.description}*\n`);

  if (legend.identity) {
    sections.push(`## Identity\n${legend.identity.trim()}\n`);
  }

  if (legend.voice) {
    sections.push(`## Voice & Style`);
    sections.push(`- **Tone:** ${legend.voice.tone}`);
    if (legend.voice.style) {
      sections.push(`- **Style:** ${legend.voice.style}`);
    }
    if (legend.voice.vocabulary?.length) {
      sections.push(`- **Key Vocabulary:** ${legend.voice.vocabulary.join(', ')}`);
    }
    sections.push('');
  }

  if (legend.principles?.length) {
    sections.push(`## Core Principles`);
    legend.principles.forEach(p => sections.push(`- ${p}`));
    sections.push('');
  }

  if (legend.patterns?.length) {
    sections.push(`## Thinking Frameworks`);
    legend.patterns.forEach(p => {
      sections.push(`### ${p.name}`);
      sections.push(`${p.description}`);
      if (p.steps?.length) {
        p.steps.forEach(s => sections.push(`- ${s}`));
      }
      sections.push('');
    });
  }

  if (legend.anti_patterns?.length) {
    sections.push(`## What to Avoid`);
    legend.anti_patterns.forEach(a => {
      sections.push(`- **${a.pattern || a.name}**: ${a.why}`);
      sections.push(`  - Instead: ${a.instead}`);
    });
    sections.push('');
  }

  if (legend.examples?.length) {
    sections.push(`## Example Conversations`);
    legend.examples.forEach((ex, i) => {
      sections.push(`### Example ${i + 1}`);
      sections.push(`**User:** ${ex.prompt}`);
      sections.push(`**${legend.name}:** ${ex.response}`);
      sections.push('');
    });
  }

  return sections.join('\n');
}
