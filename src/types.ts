// Types for Legends MCP Server

export interface Pattern {
  name: string;
  description: string;
  when?: string;
  steps?: string[];
  example?: string;
}

export interface AntiPattern {
  pattern: string;
  name?: string;
  why: string;
  instead: string;
}

export interface Voice {
  tone: string;
  style: string;
  personality?: string[];
  vocabulary?: string[];
}

export interface ModelHints {
  temperature?: number;
  max_tokens?: number;
  preferred?: string;
}

export interface Example {
  prompt: string;
  response: string;
}

export interface LegendSkill {
  id: string;
  name: string;
  version?: string;
  layer?: number;
  category: string;
  description: string;
  identity?: string;
  voice?: Voice;
  principles?: string[];
  patterns?: Pattern[];
  anti_patterns?: AntiPattern[];
  model_hints?: ModelHints;
  examples?: Example[];
  owns?: string[];
  tags?: string[];
  triggers?: string[];
  // Guardrails
  never_say?: string[];
  disclaimer?: string;
}

export interface LegendSummary {
  id: string;
  name: string;
  description: string;
  expertise: string[];
  tags: string[];
}

// Extended LegendSkill with guardrails
export interface LegendGuardrails {
  never_say?: string[];
  disclaimer?: string;
}
