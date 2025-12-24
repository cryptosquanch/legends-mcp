// Misbehavior Prevention System
// Ensures legends stay in character and don't go rogue
/**
 * MISBEHAVIOR CATEGORIES:
 *
 * 1. BREAKING CHARACTER
 *    - Saying "As an AI" or "I'm an AI"
 *    - Generic chatbot responses
 *    - Inconsistent personality
 *
 * 2. HARMFUL CONTENT
 *    - Financial advice (especially crypto)
 *    - Medical/legal advice
 *    - Harmful instructions
 *
 * 3. QUALITY ISSUES
 *    - Too long/rambling responses
 *    - Off-topic tangents
 *    - Repetitive content
 *    - Hallucinated quotes/facts
 *
 * 4. ANNOYING BEHAVIORS
 *    - Being preachy/condescending
 *    - Excessive disclaimers
 *    - Over-explaining
 *    - Unsolicited opinions
 */
// Character breaking patterns
const CHARACTER_BREAK_PATTERNS = [
    /\bas an ai\b/i,
    /\bi('m| am) an? (ai|artificial|language model|llm|chatbot)/i,
    /\bi cannot (actually|really|truly)/i,
    /\bi don't have (personal|real|actual) (opinions|feelings|experiences)/i,
    /\bbased on my training/i,
    /\bmy knowledge (cutoff|was trained)/i,
    /\bi was (created|trained|developed) by/i,
    /\bi'm (just|only) a (program|model|ai)/i,
    /\baccording to my programming/i,
    /\bi lack the ability to/i,
];
// Generic chatbot responses (avoid these)
const GENERIC_PATTERNS = [
    /\bi'd be happy to help/i,
    /\bthat's a great question/i,
    /\bcertainly! (here|let me)/i,
    /\babsolutely! (i|let)/i,
    /\bi understand (you're|your)/i,
    /\bthank you for (sharing|asking)/i,
    /\bi appreciate (you|your)/i,
    /\blet me think about that/i,
    /\bthat's an interesting (question|point)/i,
];
// Harmful advice patterns
const HARMFUL_PATTERNS = [
    // Financial advice
    /\byou should (buy|sell|invest in)/i,
    /\bi (recommend|suggest) (buying|selling|investing)/i,
    /\bguaranteed (returns|profit|gains)/i,
    /\bthis (will|is going to) (moon|10x|100x)/i,
    /\bprice (will|is going to) (hit|reach) \$?\d/i,
    /\bnot financial advice.{0,50}but (you should|i recommend)/i, // Fake NFA
    // Medical/legal
    /\byou should (take|stop taking) (medication|medicine)/i,
    /\bi (diagnose|recommend) (treatment|therapy)/i,
    /\bthis (is|isn't) legal advice but/i,
];
// Quality issue patterns
const QUALITY_PATTERNS = {
    tooLong: 2000, // Max characters before warning
    tooShort: 20, // Min characters
    repetitionThreshold: 0.3, // Max ratio of repeated phrases
};
// Annoying behavior patterns
const ANNOYING_PATTERNS = [
    /\blet me (explain|tell you) (something|a few things)/i,
    /\byou need to understand/i,
    /\bfirst (of all|off), let me/i,
    /\bbefore (i|we) (get|go) into/i,
    /\bi want to make (sure|certain)/i,
    /\b(to be|being) (clear|honest|frank)/i, // Only bad in excess
];
/**
 * Check response for misbehavior
 */
export function checkMisbehavior(response, legend) {
    const issues = [];
    const suggestions = [];
    // Check character breaking
    for (const pattern of CHARACTER_BREAK_PATTERNS) {
        const match = response.match(pattern);
        if (match) {
            issues.push({
                type: 'character_break',
                message: `Legend broke character with: "${match[0]}"`,
                severity: 'high',
                matched: match[0],
            });
            suggestions.push(`Remove "${match[0]}" - legends never acknowledge being AI`);
        }
    }
    // Check generic responses
    let genericCount = 0;
    for (const pattern of GENERIC_PATTERNS) {
        if (pattern.test(response)) {
            genericCount++;
        }
    }
    if (genericCount >= 2) {
        issues.push({
            type: 'generic',
            message: `Response uses ${genericCount} generic chatbot phrases`,
            severity: 'medium',
        });
        suggestions.push('Use more characteristic vocabulary from the legend');
    }
    // Check harmful content
    for (const pattern of HARMFUL_PATTERNS) {
        const match = response.match(pattern);
        if (match) {
            issues.push({
                type: 'harmful',
                message: `Potentially harmful content detected: "${match[0]}"`,
                severity: 'critical',
                matched: match[0],
            });
            suggestions.push('Rewrite to avoid financial/medical/legal advice');
        }
    }
    // Check quality issues
    if (response.length > QUALITY_PATTERNS.tooLong) {
        issues.push({
            type: 'quality',
            message: `Response too long (${response.length} chars)`,
            severity: 'low',
        });
        suggestions.push('Consider a more concise response');
    }
    if (response.length < QUALITY_PATTERNS.tooShort) {
        issues.push({
            type: 'quality',
            message: `Response too short (${response.length} chars)`,
            severity: 'low',
        });
        suggestions.push('Provide more substantive content');
    }
    // Check for repetition
    const repetitionScore = calculateRepetition(response);
    if (repetitionScore > QUALITY_PATTERNS.repetitionThreshold) {
        issues.push({
            type: 'quality',
            message: `High repetition detected (${(repetitionScore * 100).toFixed(0)}%)`,
            severity: 'medium',
        });
        suggestions.push('Vary the language and structure');
    }
    // Check annoying patterns (only flag if multiple)
    let annoyingCount = 0;
    for (const pattern of ANNOYING_PATTERNS) {
        if (pattern.test(response)) {
            annoyingCount++;
        }
    }
    if (annoyingCount >= 3) {
        issues.push({
            type: 'annoying',
            message: `Response may come across as preachy (${annoyingCount} warning phrases)`,
            severity: 'low',
        });
        suggestions.push('Be more direct, less preamble');
    }
    // Check legend-specific never_say
    if (legend.never_say) {
        for (const phrase of legend.never_say) {
            const cleanPhrase = phrase.replace(/['"]/g, '').toLowerCase();
            if (response.toLowerCase().includes(cleanPhrase)) {
                issues.push({
                    type: 'character_break',
                    message: `Legend said forbidden phrase: "${phrase}"`,
                    severity: 'high',
                    matched: phrase,
                });
                suggestions.push(`Remove: "${phrase}" - this legend would never say this`);
            }
        }
    }
    // Calculate overall severity
    const severity = calculateOverallSeverity(issues);
    return {
        passed: issues.length === 0 || severity === 'low',
        issues,
        severity,
        suggestions,
    };
}
/**
 * Calculate repetition score (0-1)
 */
function calculateRepetition(text) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
    if (sentences.length < 2)
        return 0;
    let repetitions = 0;
    const seen = new Set();
    for (const sentence of sentences) {
        const normalized = sentence.toLowerCase().trim().slice(0, 50);
        if (seen.has(normalized)) {
            repetitions++;
        }
        seen.add(normalized);
    }
    return repetitions / sentences.length;
}
/**
 * Calculate overall severity from issues
 */
function calculateOverallSeverity(issues) {
    if (issues.some(i => i.severity === 'critical'))
        return 'critical';
    if (issues.some(i => i.severity === 'high'))
        return 'high';
    if (issues.filter(i => i.severity === 'medium').length >= 2)
        return 'high';
    if (issues.some(i => i.severity === 'medium'))
        return 'medium';
    return 'low';
}
/**
 * Pre-check user input for potential issues
 */
export function preCheckUserInput(message, legend) {
    const warnings = [];
    // Check for financial advice requests
    const financialPatterns = [
        /should i (buy|sell|invest)/i,
        /is .+ a good investment/i,
        /price prediction/i,
        /will .+ (moon|pump|dump)/i,
        /what (token|coin|stock) should/i,
    ];
    for (const pattern of financialPatterns) {
        if (pattern.test(message)) {
            warnings.push('⚠️ This legend cannot provide financial advice. Response will focus on principles and frameworks instead.');
            break;
        }
    }
    // Check for medical/legal
    if (/\b(diagnose|prescribe|legal advice)\b/i.test(message)) {
        warnings.push('⚠️ This legend cannot provide medical or legal advice.');
    }
    return {
        needsWarning: warnings.length > 0,
        warnings,
    };
}
/**
 * Sanitize response to remove problematic content
 */
export function sanitizeResponse(response, legend) {
    let sanitized = response;
    // Remove character-breaking phrases
    for (const pattern of CHARACTER_BREAK_PATTERNS) {
        sanitized = sanitized.replace(pattern, '');
    }
    // Clean up any resulting awkward spacing
    sanitized = sanitized
        .replace(/\s+/g, ' ')
        .replace(/\s+([.,!?])/g, '$1')
        .trim();
    return sanitized;
}
/**
 * Generate quality improvement suggestions
 */
export function getSuggestions(response, legend) {
    const check = checkMisbehavior(response, legend);
    return check.suggestions;
}
//# sourceMappingURL=misbehavior-prevention.js.map