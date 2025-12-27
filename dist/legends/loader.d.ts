import type { LegendSkill, LegendSummary } from '../types.js';
/**
 * Load all legends from YAML files
 */
export declare function loadLegends(): Map<string, LegendSkill>;
/**
 * Get all legends
 */
export declare function getAllLegends(): LegendSkill[];
/**
 * Get a specific legend by ID
 */
export declare function getLegendById(id: string): LegendSkill | undefined;
/**
 * Get legend summaries (lightweight list)
 */
export declare function getLegendSummaries(): LegendSummary[];
/**
 * Search legends by query
 * SECURITY: Uses safe string handling to prevent crashes from malformed data
 */
export declare function searchLegends(query: string): LegendSkill[];
/**
 * Get legend count
 */
export declare function getLegendCount(): number;
/**
 * Clear the legends cache (for testing)
 */
export declare function clearLegendsCache(): void;
//# sourceMappingURL=loader.d.ts.map