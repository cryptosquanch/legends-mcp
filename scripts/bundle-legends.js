#!/usr/bin/env node
// Bundle legend YAML files into the package

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_DIR = path.join(__dirname, '..', '..', '..', 'content', 'skills', 'legends');
const DEST_DIR = path.join(__dirname, '..', 'legends');

// Legends to include
const LEGENDS = [
  'elon-musk',
  'warren-buffett',
  'steve-jobs',
  'jeff-bezos',
  'charlie-munger',
  'paul-graham',
  'jensen-huang',
  'marc-andreessen',
  'naval-ravikant',
  'reid-hoffman',
  'peter-thiel',
  'sam-altman',
  // Crypto legends
  'cz-binance',
  'anatoly-yakovenko',
  'mert-mumtaz',
  'michael-heinrich',
];

function bundleLegends() {
  console.log('Bundling legends...');

  // Create destination directory
  if (!fs.existsSync(DEST_DIR)) {
    fs.mkdirSync(DEST_DIR, { recursive: true });
  }

  let count = 0;
  for (const legend of LEGENDS) {
    const sourcePath = path.join(SOURCE_DIR, legend, 'skill.yaml');
    const destPath = path.join(DEST_DIR, legend);

    if (!fs.existsSync(sourcePath)) {
      console.warn(`Warning: ${legend} not found at ${sourcePath}`);
      continue;
    }

    // Create legend directory in dest
    if (!fs.existsSync(destPath)) {
      fs.mkdirSync(destPath, { recursive: true });
    }

    // Copy skill.yaml
    fs.copyFileSync(sourcePath, path.join(destPath, 'skill.yaml'));
    count++;
    console.log(`  ✓ ${legend}`);
  }

  console.log(`\nBundled ${count} legends to ${DEST_DIR}`);
}

bundleLegends();
