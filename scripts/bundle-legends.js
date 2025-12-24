#!/usr/bin/env node
// Validate legend YAML files exist in the package

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LEGENDS_DIR = path.join(__dirname, '..', 'legends');

function validateLegends() {
  console.log('Validating legends...');

  if (!fs.existsSync(LEGENDS_DIR)) {
    console.error(`Error: Legends directory not found at ${LEGENDS_DIR}`);
    process.exit(1);
  }

  const entries = fs.readdirSync(LEGENDS_DIR, { withFileTypes: true });
  const legends = entries.filter(e => e.isDirectory());

  let valid = 0;
  let invalid = 0;

  for (const legend of legends) {
    const skillPath = path.join(LEGENDS_DIR, legend.name, 'skill.yaml');
    if (fs.existsSync(skillPath)) {
      valid++;
    } else {
      console.warn(`  ⚠ ${legend.name}: missing skill.yaml`);
      invalid++;
    }
  }

  console.log(`\n✓ ${valid} legends validated`);
  if (invalid > 0) {
    console.warn(`⚠ ${invalid} legends have issues`);
  }
}

validateLegends();
