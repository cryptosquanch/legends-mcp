#!/usr/bin/env node
// Legends MCP Server
// Chat with AI personas of legendary founders & investors
// No API key required - Claude does the roleplay!
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ListToolsRequestSchema, CallToolRequestSchema, ListResourcesRequestSchema, ReadResourceRequestSchema, } from '@modelcontextprotocol/sdk/types.js';
import { loadLegends, getAllLegends, getLegendById, getLegendCount } from './legends/loader.js';
import { formatLegendMarkdown } from './legends/prompt-builder.js';
import { allTools, listLegends, formatLegendsMarkdown, summonLegend, formatSummonedLegend, getLegendContext, getLegendInsight, searchLegends, formatSearchResults, } from './tools/index.js';
// Load legends at startup
const legends = loadLegends();
console.error(`[legends-mcp] Loaded ${getLegendCount()} legends`);
console.error(`[legends-mcp] No API key required - Claude does the roleplay!`);
// Create MCP server
const server = new Server({
    name: 'legends-mcp',
    version: '1.1.3',
}, {
    capabilities: {
        tools: {},
        resources: {},
    },
});
// Handler: List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: allTools,
    };
});
// Handler: Call a tool
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
        switch (name) {
            case 'list_legends': {
                const input = (args || {});
                const result = listLegends(input);
                const markdown = formatLegendsMarkdown(result, input.vibe || 'serious');
                return {
                    content: [
                        {
                            type: 'text',
                            text: markdown,
                        },
                    ],
                };
            }
            case 'summon_legend': {
                const input = args;
                try {
                    const summoned = summonLegend(input);
                    const formatted = formatSummonedLegend(summoned);
                    return {
                        content: [
                            {
                                type: 'text',
                                text: formatted,
                            },
                        ],
                    };
                }
                catch (error) {
                    return {
                        content: [
                            {
                                type: 'text',
                                text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                            },
                        ],
                        isError: true,
                    };
                }
            }
            case 'get_legend_context': {
                const input = args;
                try {
                    const result = getLegendContext({
                        legend_id: input.legend_id,
                        format: input.format || 'full',
                        include_related: input.include_related || false,
                    });
                    let text = result.content;
                    // Add metadata
                    text += `\n\n---\n**Metadata:**\n`;
                    text += `- Frameworks: ${result.metadata.framework_count}\n`;
                    text += `- Principles: ${result.metadata.principle_count}\n`;
                    text += `- Examples: ${result.metadata.example_count}\n`;
                    if (result.related_legends?.length) {
                        text += `\n**Related Legends:**\n`;
                        result.related_legends.forEach(r => {
                            text += `- ${r.name} (${r.relationship})\n`;
                        });
                    }
                    return {
                        content: [{ type: 'text', text }],
                    };
                }
                catch (error) {
                    return {
                        content: [
                            {
                                type: 'text',
                                text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                            },
                        ],
                        isError: true,
                    };
                }
            }
            case 'get_legend_insight': {
                const input = args;
                const result = getLegendInsight(input);
                return {
                    content: [{ type: 'text', text: result.content }],
                    ...(result.isError && { isError: true }),
                };
            }
            case 'search_legends': {
                const input = args;
                if (!input.query) {
                    return {
                        content: [{ type: 'text', text: 'Error: query parameter is required' }],
                        isError: true,
                    };
                }
                const result = searchLegends(input);
                const formatted = formatSearchResults(result, input.query);
                return {
                    content: [{ type: 'text', text: formatted }],
                };
            }
            default:
                return {
                    content: [{ type: 'text', text: `Unknown tool: ${name}` }],
                    isError: true,
                };
        }
    }
    catch (error) {
        console.error(`[legends-mcp] Tool error:`, error);
        return {
            content: [
                {
                    type: 'text',
                    text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                },
            ],
            isError: true,
        };
    }
});
// Handler: List resources (legends as resources)
server.setRequestHandler(ListResourcesRequestSchema, async () => {
    const legends = getAllLegends();
    return {
        resources: legends.map(legend => ({
            uri: `legend://${legend.id}`,
            name: legend.name,
            description: legend.description,
            mimeType: 'text/markdown',
        })),
    };
});
// Handler: Read a resource
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const { uri } = request.params;
    // Parse legend:// URI
    const match = uri.match(/^legend:\/\/(.+)$/);
    if (!match) {
        throw new Error(`Invalid URI format: ${uri}`);
    }
    const legendId = match[1];
    const legend = getLegendById(legendId);
    if (!legend) {
        throw new Error(`Legend not found: ${legendId}`);
    }
    const content = formatLegendMarkdown(legend);
    return {
        contents: [
            {
                uri,
                mimeType: 'text/markdown',
                text: content,
            },
        ],
    };
});
// Start the server
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('[legends-mcp] MCP server running on stdio');
}
main().catch((error) => {
    console.error('[legends-mcp] Fatal error:', error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map