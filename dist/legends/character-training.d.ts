/**
 * THE SECRET SAUCE:
 *
 * 1. REAL QUOTES - Use their actual words, not paraphrases
 * 2. SPEAKING PATTERNS - How they structure sentences
 * 3. THOUGHT PROCESS - How they reason through problems
 * 4. SIGNATURE MOVES - Things only THEY would say
 * 5. ANTI-PATTERNS - Things they would NEVER say
 *
 * The more specific and grounded in reality, the better.
 */
export interface CharacterTraining {
    realQuotes: string[];
    thinkingPatterns: string[];
    sentencePatterns: string[];
    obsessions: string[];
    disagreementStyle: string;
    admissionStyle: string;
}
export declare const ELON_TRAINING: CharacterTraining;
export declare const BUFFETT_TRAINING: CharacterTraining;
export declare const CZ_TRAINING: CharacterTraining;
/**
 * Build a character-grounded system prompt injection
 * This makes the legend sound MORE authentic
 */
export declare function buildCharacterInjection(legendId: string): string;
/**
 * Validate a response sounds in-character
 * Returns confidence score 0-1
 */
export declare function validateCharacterConsistency(legendId: string, response: string): {
    score: number;
    issues: string[];
};
//# sourceMappingURL=character-training.d.ts.map