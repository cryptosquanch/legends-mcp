/**
 * Sanitize user-provided context to prevent prompt injection
 *
 * Strategy:
 * 1. Truncate to max length
 * 2. Detect obvious injection patterns
 * 3. Escape special characters
 * 4. Wrap in clear delimiters
 */
export declare function sanitizeContext(context: string): {
    sanitized: string;
    wasModified: boolean;
    warnings: string[];
};
/**
 * Escape backticks in text to prevent markdown code block breaking
 */
export declare function escapeBackticks(text: string): string;
/**
 * Wrap context in safe delimiters that make it clear this is user data
 */
export declare function wrapUserContext(context: string): string;
/**
 * Validate a string is safe (non-null, non-undefined)
 */
export declare function safeString(value: unknown, fallback?: string): string;
//# sourceMappingURL=sanitize.d.ts.map