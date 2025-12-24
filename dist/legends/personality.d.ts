export interface PersonalityTraits {
    catchphrases: string[];
    memeResponses: Record<string, string>;
    signatureEndings: string[];
    vibeCheck: string;
}
export declare const LEGEND_PERSONALITIES: Record<string, PersonalityTraits>;
/**
 * Get a random catchphrase for a legend
 */
export declare function getRandomCatchphrase(legendId: string): string | null;
/**
 * Get a meme response if the topic matches
 */
export declare function getMemeResponse(legendId: string, topic: string): string | null;
/**
 * Get a random signature ending
 */
export declare function getSignatureEnding(legendId: string): string | null;
/**
 * Inject personality into a response
 */
export declare function injectPersonality(legendId: string, response: string, addEnding?: boolean): string;
//# sourceMappingURL=personality.d.ts.map