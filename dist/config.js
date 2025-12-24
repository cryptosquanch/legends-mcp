// Configuration for Legends MCP Server
// No API key required - Claude does the roleplay!
// Legal disclaimer that MUST appear with every response
export const LEGAL_DISCLAIMER = `
---
**IMPORTANT DISCLAIMER**

This is an AI persona created for **educational and entertainment purposes only**.

- NOT affiliated with, endorsed by, or representative of the real individual
- NOT financial, legal, or professional advice
- NOT the actual person - this is an AI simulation
- Based on publicly available information, speeches, and writings
- For learning frameworks and thinking patterns
- Always do your own research (DYOR)

*The views expressed are AI-generated interpretations, not statements from the real person.*
`;
// Short disclaimer for inline use
export const SHORT_DISCLAIMER = `*AI persona for education only. Not the real person. Not advice. DYOR.*`;
// Debug logging
export function log(...args) {
    if (process.env.LEGENDS_MCP_DEBUG === 'true') {
        console.error('[legends-mcp]', ...args);
    }
}
//# sourceMappingURL=config.js.map