// Legend loader - loads and caches legend data from bundled YAML files

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'yaml';
import type { LegendSkill, LegendSummary } from '../types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cache for loaded legends
let legendsCache: Map<string, LegendSkill> | null = null;

/**
 * Get the path to the bundled legends directory
 */
function getLegendsDir(): string {
  // In dist/legends/ or ../legends/ relative to the compiled file
  const possiblePaths = [
    path.join(__dirname, '..', '..', 'legends'),
    path.join(__dirname, '..', 'legends'),
    path.join(process.cwd(), 'legends'),
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }

  throw new Error('Could not find legends directory. Ensure the package is properly installed.');
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

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const skillPath = path.join(legendsDir, entry.name, 'skill.yaml');
    if (!fs.existsSync(skillPath)) continue;

    try {
      const content = fs.readFileSync(skillPath, 'utf-8');
      const data = yaml.parse(content) as LegendSkill;

      // Ensure required fields
      if (!data.id) data.id = entry.name;
      if (!data.category) data.category = 'legends';

      legends.set(data.id, data);
    } catch (error) {
      console.error(`[vibey-legends] Error loading ${skillPath}:`, error);
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
    name: l.name,
    description: l.description,
    expertise: l.owns || [],
    tags: l.tags || [],
  }));
}

/**
 * Search legends by query
 */
export function searchLegends(query: string): LegendSkill[] {
  const legends = getAllLegends();
  const q = query.toLowerCase();

  return legends.filter(l =>
    l.name.toLowerCase().includes(q) ||
    l.description.toLowerCase().includes(q) ||
    l.tags?.some(t => t.toLowerCase().includes(q)) ||
    l.owns?.some(o => o.toLowerCase().includes(q))
  );
}

/**
 * Get legend count
 */
export function getLegendCount(): number {
  return loadLegends().size;
}
