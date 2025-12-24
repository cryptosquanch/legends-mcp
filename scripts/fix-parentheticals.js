#!/usr/bin/env node

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const legendsDir = './legends';
const legends = readdirSync(legendsDir);

let fixed = 0;

for (const legend of legends) {
  const yamlPath = join(legendsDir, legend, 'skill.yaml');

  try {
    let content = readFileSync(yamlPath, 'utf8');
    const original = content;

    // Fix pattern: "quoted string" (parenthetical comment)
    // Replace with just: "quoted string"
    content = content.replace(/"([^"]+)"\s+\([^)]+\)/g, '"$1"');

    if (content !== original) {
      writeFileSync(yamlPath, content, 'utf8');
      console.log(`✓ Fixed: ${legend}`);
      fixed++;
    }
  } catch (err) {
    console.error(`✗ Error processing ${legend}:`, err.message);
  }
}

console.log(`\nFixed ${fixed} legend(s)`);
