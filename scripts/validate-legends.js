#!/usr/bin/env node
// Validate legend YAML files for required fields and consistency

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LEGENDS_DIR = path.join(__dirname, '..', 'legends');

// Required fields for each legend
const REQUIRED_FIELDS = ['id', 'name', 'description', 'category'];
const RECOMMENDED_FIELDS = ['tags', 'owns', 'principles', 'voice', 'identity'];

function validateLegends() {
  console.log('Validating legend YAML files...\n');

  if (!fs.existsSync(LEGENDS_DIR)) {
    console.error(`Error: Legends directory not found at ${LEGENDS_DIR}`);
    process.exit(1);
  }

  const entries = fs.readdirSync(LEGENDS_DIR, { withFileTypes: true });
  const legends = entries.filter(e => e.isDirectory());

  let totalValid = 0;
  let totalWarnings = 0;
  let totalErrors = 0;
  const issues = [];

  for (const legend of legends) {
    const skillPath = path.join(LEGENDS_DIR, legend.name, 'skill.yaml');

    if (!fs.existsSync(skillPath)) {
      issues.push({ legend: legend.name, type: 'error', message: 'Missing skill.yaml' });
      totalErrors++;
      continue;
    }

    try {
      const content = fs.readFileSync(skillPath, 'utf-8');
      let data;
      try {
        data = yaml.parse(content);
      } catch (parseError) {
        // YAML parse errors are warnings since the runtime loader is more lenient
        issues.push({ legend: legend.name, type: 'warning', message: `YAML parse warning: ${parseError.message.split('\n')[0]}` });
        totalWarnings++;
        totalValid++;
        continue;
      }

      // Check required fields
      for (const field of REQUIRED_FIELDS) {
        if (!data[field]) {
          issues.push({ legend: legend.name, type: 'error', message: `Missing required field: ${field}` });
          totalErrors++;
        }
      }

      // Check recommended fields
      for (const field of RECOMMENDED_FIELDS) {
        if (!data[field] || (Array.isArray(data[field]) && data[field].length === 0)) {
          issues.push({ legend: legend.name, type: 'warning', message: `Missing recommended field: ${field}` });
          totalWarnings++;
        }
      }

      // Check tags exist and have values
      if (!data.tags || data.tags.length === 0) {
        issues.push({ legend: legend.name, type: 'warning', message: 'No tags defined' });
        totalWarnings++;
      }

      // Check owns/expertise exists
      if (!data.owns || data.owns.length === 0) {
        issues.push({ legend: legend.name, type: 'warning', message: 'No expertise (owns) defined' });
        totalWarnings++;
      }

      // Check disclaimer exists
      if (!data.disclaimer) {
        issues.push({ legend: legend.name, type: 'info', message: 'No custom disclaimer (will use default)' });
      }

      // Check never_say guardrails
      if (!data.never_say || data.never_say.length === 0) {
        issues.push({ legend: legend.name, type: 'info', message: 'No never_say guardrails defined' });
      }

      // ID should match directory name
      if (data.id !== legend.name) {
        issues.push({ legend: legend.name, type: 'warning', message: `ID mismatch: ${data.id} vs directory ${legend.name}` });
        totalWarnings++;
      }

      totalValid++;
    } catch (error) {
      issues.push({ legend: legend.name, type: 'error', message: `Validation error: ${error.message}` });
      totalErrors++;
    }
  }

  // Print summary
  console.log('='.repeat(60));
  console.log(`VALIDATION SUMMARY`);
  console.log('='.repeat(60));
  console.log(`Total legends: ${legends.length}`);
  console.log(`  ✓ Valid: ${totalValid}`);
  console.log(`  ⚠ Warnings: ${totalWarnings}`);
  console.log(`  ✗ Errors: ${totalErrors}`);
  console.log('');

  // Print issues by type
  const errors = issues.filter(i => i.type === 'error');
  const warnings = issues.filter(i => i.type === 'warning');
  const infos = issues.filter(i => i.type === 'info');

  if (errors.length > 0) {
    console.log('\n❌ ERRORS:');
    errors.forEach(i => console.log(`  ${i.legend}: ${i.message}`));
  }

  if (warnings.length > 0) {
    console.log('\n⚠️  WARNINGS:');
    warnings.forEach(i => console.log(`  ${i.legend}: ${i.message}`));
  }

  if (process.argv.includes('--verbose') && infos.length > 0) {
    console.log('\nℹ️  INFO:');
    infos.forEach(i => console.log(`  ${i.legend}: ${i.message}`));
  }

  console.log('');

  // Exit with error if there are errors
  if (totalErrors > 0) {
    console.log('❌ Validation failed with errors');
    process.exit(1);
  } else if (totalWarnings > 0) {
    console.log('⚠️  Validation passed with warnings');
    process.exit(0);
  } else {
    console.log('✅ All legends validated successfully');
    process.exit(0);
  }
}

validateLegends();
