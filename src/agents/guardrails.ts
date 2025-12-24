// Agent Guardrails - Enforce character consistency with code, not just prompts
// This prevents legends from saying things they would NEVER say

import type { LegendSkill } from '../types.js';

export interface GuardrailResult {
  passed: boolean;
  violations: string[];
  sanitizedResponse?: string;
}

// Universal guardrails for ALL crypto legends
const UNIVERSAL_CRYPTO_GUARDRAILS = [
  {
    pattern: /\b(buy|sell|invest in|purchase)\s+(this\s+)?token/i,
    message: 'Financial advice detected - legends never give investment advice',
  },
  {
    pattern: /\b(guaranteed|certain|definitely|100%)\s+(returns?|profit|gains?)/i,
    message: 'Guaranteed returns claim detected - never promise financial outcomes',
  },
  {
    pattern: /\b(price|token)\s+will\s+(go|reach|hit)\s+\$?\d+/i,
    message: 'Price prediction detected - legends never predict prices',
  },
  {
    pattern: /\bnot financial advice\b/i,
    invert: true, // This should be PRESENT when discussing finance
    context: 'finance',
  },
];

// Legend-specific guardrails loaded from YAML
export function buildLegendGuardrails(legend: LegendSkill): RegExp[] {
  const patterns: RegExp[] = [];

  // Convert never_say to regex patterns
  if (legend.never_say) {
    for (const item of legend.never_say) {
      // Extract the quoted phrase if present
      const match = item.match(/"([^"]+)"/);
      if (match) {
        patterns.push(new RegExp(match[1], 'i'));
      }
    }
  }

  return patterns;
}

/**
 * Check if a response violates any guardrails
 * Returns violations if any, or empty array if passed
 */
export function checkGuardrails(
  response: string,
  legend: LegendSkill,
  context?: { topic?: string }
): GuardrailResult {
  const violations: string[] = [];

  // Check universal crypto guardrails for crypto legends
  const isCryptoLegend = legend.tags?.includes('crypto');
  if (isCryptoLegend) {
    for (const guardrail of UNIVERSAL_CRYPTO_GUARDRAILS) {
      if (guardrail.invert) {
        // This pattern SHOULD be present in certain contexts
        if (context?.topic === guardrail.context && !guardrail.pattern.test(response)) {
          violations.push(`Missing required disclaimer for ${guardrail.context} topic`);
        }
      } else {
        if (guardrail.pattern.test(response) && guardrail.message) {
          violations.push(guardrail.message);
        }
      }
    }
  }

  // Check legend-specific guardrails
  const legendPatterns = buildLegendGuardrails(legend);
  for (const pattern of legendPatterns) {
    if (pattern.test(response)) {
      violations.push(`Response contains forbidden phrase: ${pattern.source}`);
    }
  }

  return {
    passed: violations.length === 0,
    violations,
  };
}

/**
 * Add required disclaimers to response if missing
 */
export function addRequiredDisclaimers(
  response: string,
  legend: LegendSkill,
  context?: { topic?: string }
): string {
  const isCryptoLegend = legend.tags?.includes('crypto');

  // Add NFA disclaimer for crypto legends discussing anything financial
  if (isCryptoLegend) {
    const financialKeywords = /\b(token|invest|price|trading|portfolio|returns?|profits?)\b/i;
    const hasNFA = /not financial advice|nfa|dyor/i.test(response);

    if (financialKeywords.test(response) && !hasNFA) {
      response += '\n\n---\n*Not financial advice. Always DYOR.*';
    }
  }

  return response;
}

/**
 * Validate response before returning to user
 * This is the main guardrail enforcement function
 */
export function enforceGuardrails(
  response: string,
  legend: LegendSkill,
  context?: { topic?: string }
): { response: string; warnings: string[] } {
  const warnings: string[] = [];

  // Check for violations
  const result = checkGuardrails(response, legend, context);

  if (!result.passed) {
    // Log violations (don't block, but warn)
    warnings.push(...result.violations);

    // For severe violations, we could block or sanitize
    // For now, we add disclaimers and warn
  }

  // Add required disclaimers
  const enhancedResponse = addRequiredDisclaimers(response, legend, context);

  return {
    response: enhancedResponse,
    warnings,
  };
}

/**
 * Pre-check user input for topics that require extra care
 */
export function detectSensitiveTopics(userMessage: string): {
  isFinancial: boolean;
  isInvestmentAdvice: boolean;
  requiresNFA: boolean;
} {
  const isFinancial = /\b(token|price|invest|trading|portfolio|buy|sell)\b/i.test(userMessage);
  const isInvestmentAdvice = /\b(should i (buy|sell|invest)|is .+ a good investment|price prediction)\b/i.test(userMessage);

  return {
    isFinancial,
    isInvestmentAdvice,
    requiresNFA: isFinancial || isInvestmentAdvice,
  };
}

/**
 * Generate pre-prompt injection for sensitive topics
 * This adds extra instructions before the user's message
 */
export function generateSensitivityPreamble(
  userMessage: string,
  legend: LegendSkill
): string | null {
  const sensitivity = detectSensitiveTopics(userMessage);

  if (sensitivity.isInvestmentAdvice) {
    return `[SYSTEM: The user is asking for investment advice. Remember:
1. You NEVER give financial advice
2. Always include "Not financial advice" disclaimer
3. Redirect to technology and fundamentals
4. Remind them to do their own research (DYOR)
5. Never predict prices or promise returns]

`;
  }

  if (sensitivity.isFinancial) {
    return `[SYSTEM: Financial topic detected. Include NFA disclaimer in your response.]

`;
  }

  return null;
}
