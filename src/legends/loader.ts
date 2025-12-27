// Legend loader - loads and caches legend data from bundled YAML files

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'yaml';
import type { LegendSkill, LegendSummary } from '../types.js';
import { safeString } from '../utils/sanitize.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cache for loaded legends
let legendsCache: Map<string, LegendSkill> | null = null;

// Maximum file size to prevent DoS (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Maximum number of legends to load
const MAX_LEGENDS = 500;

/**
 * Get the path to the bundled legends directory
 * SECURITY: Only load from package directory unless explicitly allowed
 */
function getLegendsDir(): string {
  // Check for explicit custom directory (opt-in only)
  const customDir = process.env.LEGENDS_MCP_LEGENDS_DIR;
  if (customDir) {
    if (fs.existsSync(customDir)) {
      console.error(`[legends-mcp] Using custom legends directory: ${customDir}`);
      return customDir;
    }
    throw new Error(`Custom legends directory not found: ${customDir}`);
  }

  // SECURITY: Only load from package directory (relative to compiled file)
  // Do NOT fall back to process.cwd() to prevent loading untrusted legends
  const possiblePaths = [
    path.join(__dirname, '..', '..', 'legends'),
    path.join(__dirname, '..', 'legends'),
  ];

  // Only allow CWD if explicitly opted in (for development)
  if (process.env.LEGENDS_MCP_ALLOW_CWD === '1') {
    possiblePaths.push(path.join(process.cwd(), 'legends'));
    console.error('[legends-mcp] WARNING: CWD loading enabled - only use in trusted environments');
  }

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }

  throw new Error(
    'Could not find legends directory. Ensure the package is properly installed. ' +
    'For custom directories, set LEGENDS_MCP_LEGENDS_DIR environment variable.'
  );
}

/**
 * Validate a legend file before loading
 */
function validateLegendFile(filePath: string): boolean {
  try {
    const stats = fs.statSync(filePath);
    if (stats.size > MAX_FILE_SIZE) {
      console.error(`[legends-mcp] Skipping oversized file: ${filePath} (${stats.size} bytes)`);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate required fields in a legend
 */
function validateLegend(data: any, filePath: string): boolean {
  if (!data || typeof data !== 'object') {
    console.error(`[legends-mcp] Invalid legend data in ${filePath}`);
    return false;
  }

  // Must have at least a name or id
  if (!data.name && !data.id) {
    console.error(`[legends-mcp] Legend missing name/id in ${filePath}`);
    return false;
  }

  return true;
}

/**
 * Load all legends from YAML files
 */
export function loadLegends(): Map<string, LegendSkill> {
  if (legendsCache) {
    return legendsCache;
  }

  const legendsDir = getLegendsDir();
  const legends = new Map<string, LegendSkill>();

  const entries = fs.readdirSync(legendsDir, { withFileTypes: true });

  let loadedCount = 0;
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (loadedCount >= MAX_LEGENDS) {
      console.error(`[legends-mcp] Maximum legends limit reached (${MAX_LEGENDS})`);
      break;
    }

    const skillPath = path.join(legendsDir, entry.name, 'skill.yaml');
    if (!fs.existsSync(skillPath)) continue;

    // Validate file before loading
    if (!validateLegendFile(skillPath)) continue;

    try {
      const content = fs.readFileSync(skillPath, 'utf-8');
      const data = yaml.parse(content) as LegendSkill;

      // Validate legend data
      if (!validateLegend(data, skillPath)) continue;

      // Ensure required fields with safe defaults
      if (!data.id) data.id = entry.name;
      if (!data.category) data.category = 'legends';
      if (!data.name) data.name = entry.name;
      if (!data.description) data.description = '';

      legends.set(data.id, data);
      loadedCount++;
    } catch (error) {
      console.error(`[legends-mcp] Error loading ${skillPath}:`, error);
    }
  }

  legendsCache = legends;
  return legends;
}

/**
 * Get all legends
 */
export function getAllLegends(): LegendSkill[] {
  const legends = loadLegends();
  return Array.from(legends.values());
}

/**
 * Get a specific legend by ID
 */
export function getLegendById(id: string): LegendSkill | undefined {
  const legends = loadLegends();
  return legends.get(id);
}

/**
 * Get legend summaries (lightweight list)
 */
export function getLegendSummaries(): LegendSummary[] {
  const legends = getAllLegends();
  return legends.map(l => ({
    id: l.id,
    name: safeString(l.name, l.id),
    description: safeString(l.description, ''),
    expertise: l.owns || [],
    tags: l.tags || [],
  }));
}

/**
 * Search legends by query
 * SECURITY: Uses safe string handling to prevent crashes from malformed data
 */
export function searchLegends(query: string): LegendSkill[] {
  const legends = getAllLegends();
  const q = safeString(query, '').toLowerCase();

  if (!q) return [];

  return legends.filter(l => {
    // Safe string comparisons with fallbacks
    const name = safeString(l.name, '').toLowerCase();
    const description = safeString(l.description, '').toLowerCase();
    const tags = (l.tags || []).map(t => safeString(t, '').toLowerCase());
    const owns = (l.owns || []).map(o => safeString(o, '').toLowerCase());

    return (
      name.includes(q) ||
      description.includes(q) ||
      tags.some(t => t.includes(q)) ||
      owns.some(o => o.includes(q))
    );
  });
}

/**
 * Get legend count
 */
export function getLegendCount(): number {
  return loadLegends().size;
}

/**
 * Clear the legends cache (for testing)
 */
export function clearLegendsCache(): void {
  legendsCache = null;
}
