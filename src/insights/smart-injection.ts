// Smart Insight Injection System
// Knows WHEN, WHERE, and HOW to recommend legend insights

import type { LegendSkill } from '../types.js';
import { getAllLegends, getLegendById } from '../legends/loader.js';

/**
 * INSIGHT INJECTION STRATEGY
 *
 * WHERE to inject insights:
 * 1. Topic-triggered: User discusses topic → relevant legend speaks
 * 2. Task-completion: After finishing work → celebratory wisdom
 * 3. Problem-solving: User stuck → mentor perspective
 * 4. Decision points: User choosing options → framework suggestion
 * 5. Learning moments: User asks "how" → pattern/principle injection
 *
 * HOW MANY:
 * - Max 1 insight per conversation turn
 * - Max 3 insights per session (avoid spam)
 * - Cooldown: 5 messages minimum between insights
 * - User can disable with LEGENDS_DISABLE_INSIGHTS=true
 */

// Topic → Legend mapping for smart recommendations
export const TOPIC_LEGEND_MAP: Record<string, string[]> = {
  // Tech & Engineering
  'first principles': ['elon-musk'],
  'physics': ['elon-musk'],
  'manufacturing': ['elon-musk'],
  'rockets': ['elon-musk'],
  'electric vehicles': ['elon-musk'],
  'scaling': ['elon-musk', 'jeff-bezos'],

  // Product & Design
  'design': ['steve-jobs'],
  'product': ['steve-jobs', 'paul-graham'],
  'simplicity': ['steve-jobs'],
  'user experience': ['steve-jobs', 'mert-mumtaz'],
  'ux': ['steve-jobs', 'mert-mumtaz'],

  // Investing & Finance
  'investing': ['warren-buffett', 'charlie-munger'],
  'value': ['warren-buffett'],
  'moat': ['warren-buffett'],
  'compounding': ['warren-buffett', 'naval-ravikant'],
  'mental models': ['charlie-munger'],

  // Startups
  'startup': ['paul-graham', 'sam-altman'],
  'yc': ['paul-graham', 'sam-altman', 'michael-heinrich'],
  'y combinator': ['paul-graham', 'sam-altman', 'michael-heinrich'],
  'fundraising': ['paul-graham', 'marc-andreessen'],
  'mvp': ['paul-graham'],
  'launch': ['paul-graham'],

  // Crypto & Web3
  'crypto': ['cz-binance', 'anatoly-yakovenko'],
  'blockchain': ['cz-binance', 'anatoly-yakovenko'],
  'solana': ['anatoly-yakovenko', 'mert-mumtaz'],
  'exchange': ['cz-binance'],
  'binance': ['cz-binance'],
  'rpc': ['mert-mumtaz'],
  'infrastructure': ['mert-mumtaz', 'michael-heinrich'],
  'decentralization': ['anatoly-yakovenko', 'michael-heinrich'],
  'ai infrastructure': ['michael-heinrich'],
  '0g': ['michael-heinrich'],

  // Business & Strategy
  'network effects': ['reid-hoffman'],
  'blitzscaling': ['reid-hoffman'],
  'marketplace': ['reid-hoffman'],
  'monopoly': ['peter-thiel'],
  'competition': ['peter-thiel'],
  'contrarian': ['peter-thiel'],
  'zero to one': ['peter-thiel'],

  // AI & Technology
  'ai': ['sam-altman', 'jensen-huang', 'michael-heinrich'],
  'agi': ['sam-altman'],
  'gpu': ['jensen-huang'],
  'nvidia': ['jensen-huang'],
  'cuda': ['jensen-huang'],

  // Philosophy & Wealth
  'wealth': ['naval-ravikant'],
  'leverage': ['naval-ravikant'],
  'specific knowledge': ['naval-ravikant'],
  'happiness': ['naval-ravikant'],

  // Developer Experience
  'developer experience': ['mert-mumtaz'],
  'dx': ['mert-mumtaz'],
  'documentation': ['mert-mumtaz'],
  'docs': ['mert-mumtaz'],
  'api': ['mert-mumtaz'],
};

// Context types for insight injection
export type InsightContext =
  | 'topic_match'      // User discussing relevant topic
  | 'task_complete'    // User finished a task
  | 'problem_solving'  // User stuck on problem
  | 'decision_point'   // User choosing between options
  | 'learning_moment'  // User asking how to do something
  | 'random_wisdom';   // Periodic inspiration

// Insight injection rules
export interface InsightInjectionRule {
  context: InsightContext;
  trigger: RegExp | string[];
  legend_ids: string[];
  priority: number; // 1-10, higher = more important
  cooldown_messages: number; // Minimum messages before can trigger again
}

// Default injection rules
export const INJECTION_RULES: InsightInjectionRule[] = [
  // High priority - direct topic matches
  {
    context: 'topic_match',
    trigger: /first\s*principles?/i,
    legend_ids: ['elon-musk'],
    priority: 9,
    cooldown_messages: 3,
  },
  {
    context: 'topic_match',
    trigger: /value\s*invest/i,
    legend_ids: ['warren-buffett'],
    priority: 9,
    cooldown_messages: 3,
  },
  {
    context: 'topic_match',
    trigger: /solana|sol\s+(network|blockchain)/i,
    legend_ids: ['anatoly-yakovenko', 'mert-mumtaz'],
    priority: 8,
    cooldown_messages: 3,
  },

  // Medium priority - problem solving
  {
    context: 'problem_solving',
    trigger: ['stuck', 'help', "can't figure out", 'struggling'],
    legend_ids: ['paul-graham', 'charlie-munger'],
    priority: 6,
    cooldown_messages: 5,
  },

  // Decision points
  {
    context: 'decision_point',
    trigger: ['should I', 'which option', 'better approach', 'trade-off'],
    legend_ids: ['charlie-munger', 'jeff-bezos'],
    priority: 7,
    cooldown_messages: 5,
  },

  // Task completion celebration
  {
    context: 'task_complete',
    trigger: ['done', 'finished', 'completed', 'shipped'],
    legend_ids: ['steve-jobs', 'paul-graham'],
    priority: 4,
    cooldown_messages: 10,
  },
];

// Session state for rate limiting
interface SessionState {
  insightCount: number;
  messagesSinceLastInsight: number;
  lastInsightLegend: string | null;
  disabledUntil: number; // Timestamp
}

const sessionStates = new Map<string, SessionState>();

const DEFAULT_SESSION_STATE: SessionState = {
  insightCount: 0,
  messagesSinceLastInsight: 0,
  lastInsightLegend: null,
  disabledUntil: 0,
};

// Configuration
export const INSIGHT_CONFIG = {
  maxInsightsPerSession: 3,
  minMessagesBetweenInsights: 5,
  globalCooldownMs: 60000, // 1 minute minimum between any insights
  enabled: process.env.LEGENDS_DISABLE_INSIGHTS !== 'true',
};

/**
 * Detect topics in user message and find relevant legends
 */
export function detectRelevantLegends(message: string): string[] {
  const messageLower = message.toLowerCase();
  const relevantLegends: Set<string> = new Set();

  for (const [topic, legends] of Object.entries(TOPIC_LEGEND_MAP)) {
    if (messageLower.includes(topic.toLowerCase())) {
      legends.forEach(l => relevantLegends.add(l));
    }
  }

  return Array.from(relevantLegends);
}

/**
 * Check if insight should be injected based on context and rules
 */
export function shouldInjectInsight(
  sessionId: string,
  message: string,
  context?: InsightContext
): { should: boolean; legendId?: string; reason?: string } {
  // Check if disabled
  if (!INSIGHT_CONFIG.enabled) {
    return { should: false, reason: 'Insights disabled by config' };
  }

  // Get or create session state
  let state = sessionStates.get(sessionId);
  if (!state) {
    state = { ...DEFAULT_SESSION_STATE };
    sessionStates.set(sessionId, state);
  }

  // Check session limits
  if (state.insightCount >= INSIGHT_CONFIG.maxInsightsPerSession) {
    return { should: false, reason: 'Max insights per session reached' };
  }

  // Check message cooldown
  if (state.messagesSinceLastInsight < INSIGHT_CONFIG.minMessagesBetweenInsights) {
    state.messagesSinceLastInsight++;
    return { should: false, reason: 'Cooldown period active' };
  }

  // Check global cooldown
  if (Date.now() < state.disabledUntil) {
    return { should: false, reason: 'Global cooldown active' };
  }

  // Find matching rules
  const messageLower = message.toLowerCase();
  let bestMatch: { rule: InsightInjectionRule; legendId: string } | null = null;

  for (const rule of INJECTION_RULES) {
    if (context && rule.context !== context) continue;

    let matches = false;
    if (rule.trigger instanceof RegExp) {
      matches = rule.trigger.test(message);
    } else {
      matches = rule.trigger.some(t => messageLower.includes(t.toLowerCase()));
    }

    if (matches) {
      // Pick a legend that isn't the last one used
      const availableLegends = rule.legend_ids.filter(l => l !== state!.lastInsightLegend);
      const legendId = availableLegends[0] || rule.legend_ids[0];

      if (!bestMatch || rule.priority > bestMatch.rule.priority) {
        bestMatch = { rule, legendId };
      }
    }
  }

  if (bestMatch) {
    // Update state
    state.insightCount++;
    state.messagesSinceLastInsight = 0;
    state.lastInsightLegend = bestMatch.legendId;
    state.disabledUntil = Date.now() + INSIGHT_CONFIG.globalCooldownMs;

    return {
      should: true,
      legendId: bestMatch.legendId,
      reason: `Matched rule: ${bestMatch.rule.context}`,
    };
  }

  // Increment message counter even if no insight
  state.messagesSinceLastInsight++;

  return { should: false, reason: 'No matching rules' };
}

/**
 * Get a recommended insight for the current context
 */
export function getRecommendedInsight(
  sessionId: string,
  message: string
): { insight: string; legendId: string } | null {
  const check = shouldInjectInsight(sessionId, message);

  if (!check.should || !check.legendId) {
    return null;
  }

  const legend = getLegendById(check.legendId);
  if (!legend) return null;

  // Import the insight generator
  // Note: This would be imported from get-legend-insight.ts
  // For now, return a simple format
  return {
    insight: `💡 **${legend.name}** might have wisdom on this topic. Try: \`get_legend_insight legend_id="${check.legendId}"\``,
    legendId: check.legendId,
  };
}

/**
 * Reset session state (for testing or new conversations)
 */
export function resetSession(sessionId: string): void {
  sessionStates.delete(sessionId);
}

/**
 * Get session stats (for debugging)
 */
export function getSessionStats(sessionId: string): SessionState {
  return sessionStates.get(sessionId) || DEFAULT_SESSION_STATE;
}
