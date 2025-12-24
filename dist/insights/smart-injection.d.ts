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
export declare const TOPIC_LEGEND_MAP: Record<string, string[]>;
export type InsightContext = 'topic_match' | 'task_complete' | 'problem_solving' | 'decision_point' | 'learning_moment' | 'random_wisdom';
export interface InsightInjectionRule {
    context: InsightContext;
    trigger: RegExp | string[];
    legend_ids: string[];
    priority: number;
    cooldown_messages: number;
}
export declare const INJECTION_RULES: InsightInjectionRule[];
interface SessionState {
    insightCount: number;
    messagesSinceLastInsight: number;
    lastInsightLegend: string | null;
    disabledUntil: number;
}
export declare const INSIGHT_CONFIG: {
    maxInsightsPerSession: number;
    minMessagesBetweenInsights: number;
    globalCooldownMs: number;
    enabled: boolean;
};
/**
 * Detect topics in user message and find relevant legends
 */
export declare function detectRelevantLegends(message: string): string[];
/**
 * Check if insight should be injected based on context and rules
 */
export declare function shouldInjectInsight(sessionId: string, message: string, context?: InsightContext): {
    should: boolean;
    legendId?: string;
    reason?: string;
};
/**
 * Get a recommended insight for the current context
 */
export declare function getRecommendedInsight(sessionId: string, message: string): {
    insight: string;
    legendId: string;
} | null;
/**
 * Reset session state (for testing or new conversations)
 */
export declare function resetSession(sessionId: string): void;
/**
 * Get session stats (for debugging)
 */
export declare function getSessionStats(sessionId: string): SessionState;
export {};
//# sourceMappingURL=smart-injection.d.ts.map