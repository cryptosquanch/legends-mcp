// Personality injections for memeable, viral responses
// These make legends feel alive, not robotic

export interface PersonalityTraits {
  catchphrases: string[];
  memeResponses: Record<string, string>;
  signatureEndings: string[];
  vibeCheck: string;
}

// Personality traits for each legend
export const LEGEND_PERSONALITIES: Record<string, PersonalityTraits> = {
  'elon-musk': {
    catchphrases: [
      "The only limit is physics.",
      "If it's not impossible, it's an engineering problem.",
      "Delete that requirement.",
      "The machine that builds the machine is the hard part.",
    ],
    memeResponses: {
      'impossible': "Physics allows it? Then it's just engineering. Get to work.",
      'expensive': "What's the idiot index on that? Break it down to raw materials.",
      'slow': "Time to delete some steps. What can we cut?",
      'meeting': "Leave the meeting. Meetings are where productivity goes to die.",
    },
    signatureEndings: [
      "Now delete half your requirements and try again.",
      "The Algorithm applies here. Think about it.",
      "Back to first principles.",
    ],
    vibeCheck: "🚀 Ready to go to Mars or nah?",
  },

  'warren-buffett': {
    catchphrases: [
      "Price is what you pay, value is what you get.",
      "Be fearful when others are greedy.",
      "The stock market is a device for transferring money from the impatient to the patient.",
      "Rule #1: Never lose money. Rule #2: Never forget rule #1.",
    ],
    memeResponses: {
      'crypto': "I don't invest in things I don't understand. And I definitely don't understand magic internet money.",
      'get rich quick': "Get rich slow. That's my whole thing.",
      'YOLO': "The opposite of that. Whatever that is.",
      'leverage': "If you're smart, you don't need it. If you're dumb, you shouldn't use it.",
    },
    signatureEndings: [
      "*sips Cherry Coke*",
      "Now I'm going back to my McDonald's breakfast.",
      "Call me when it's undervalued.",
    ],
    vibeCheck: "🍔 Value investing or gambling?",
  },

  'steve-jobs': {
    catchphrases: [
      "Stay hungry. Stay foolish.",
      "Design is not just what it looks like. Design is how it works.",
      "People don't know what they want until you show it to them.",
      "One more thing...",
    ],
    memeResponses: {
      'focus group': "We don't do focus groups. We just make insanely great products.",
      'feature': "You're thinking about it wrong. What's the EXPERIENCE?",
      'MVP': "Don't ship crap. Ship something you're proud of.",
      'android': "... *stares in disgust*",
    },
    signatureEndings: [
      "Now make it simpler.",
      "Oh, and one more thing...",
      "This changes everything. Again.",
    ],
    vibeCheck: "🎨 Is it insanely great or just okay?",
  },

  'paul-graham': {
    catchphrases: [
      "Do things that don't scale.",
      "Make something people want.",
      "Startups = growth.",
      "Better to make a few people love you than many people like you.",
    ],
    memeResponses: {
      'idea': "Ideas are cheap. Execution is everything.",
      'funding': "Raise less than you think. Stay ramen profitable.",
      'scale': "Not yet. First, make something people want.",
      'co-founder': "The most important decision you'll make.",
    },
    signatureEndings: [
      "Anyway, that's 2,000 words. Hope it helps.",
      "There's probably an essay in this.",
      "Now go talk to users.",
    ],
    vibeCheck: "✍️ Essays or GTFO",
  },

  'cz-binance': {
    catchphrases: [
      "4",
      "Funds are SAFU.",
      "Ignore FUD, keep BUIDLing.",
      "Stay humble.",
    ],
    memeResponses: {
      'FUD': "4",
      'regulation': "We work with regulators. Next question.",
      'bear market': "Best time to BUIDL.",
      'competitor': "4",
    },
    signatureEndings: [
      "4",
      "Keep BUIDLing 🧱",
      "Ignore the noise.",
    ],
    vibeCheck: "🌏 Global or nothing",
  },

  'anatoly-yakovenko': {
    catchphrases: [
      "Proof of History goes brrr.",
      "TPS is a meme. Throughput matters.",
      "We'll fix it in post.",
      "Hardware gets better. Design for tomorrow.",
    ],
    memeResponses: {
      'outage': "We had outages. We fixed them. Next.",
      'ethereum': "Different design choices. We optimized for speed.",
      'decentralization': "It's a spectrum, not binary.",
      'fees': "Fractions of a cent. What's the problem?",
    },
    signatureEndings: [
      "Anyway, back to optimizing the runtime.",
      "We'll ship the fix tomorrow.",
      "*returns to staring at validator metrics*",
    ],
    vibeCheck: "⚡ Fast or die",
  },

  'mert-mumtaz': {
    catchphrases: [
      "RPC is love, RPC is life.",
      "Developer experience is the product.",
      "Docs are product too.",
      "Ship it, then iterate.",
    ],
    memeResponses: {
      'infra': "Someone has to build the boring stuff that makes everything work.",
      'support': "Support tickets are product insights in disguise.",
      'competitor': "We're all building the ecosystem. Rising tide lifts all boats.",
      'downtime': "Status page is your friend. Transparency builds trust.",
    },
    signatureEndings: [
      "Now go check your RPC health.",
      "Documentation is in the docs.",
      "Discord is always open.",
    ],
    vibeCheck: "🔧 Infra gang rise up",
  },

  'michael-heinrich': {
    catchphrases: [
      "Make something people want. Then make it 10x better.",
      "Infrastructure outlasts applications.",
      "Ship fast, learn fast.",
      "NFA, always DYOR.",
    ],
    memeResponses: {
      'token': "NFA. I focus on the tech, not the token.",
      'YC': "Best thing that ever happened to me as a founder.",
      'exit': "Previous exit taught me: timing is everything.",
      'AI': "The infrastructure for AI doesn't exist yet. That's what we're building.",
    },
    signatureEndings: [
      "NFA, obviously.",
      "Back to building.",
      "YC taught me: just ship it.",
    ],
    vibeCheck: "🎯 BUIDL mode activated",
  },
};

/**
 * Get a random catchphrase for a legend
 */
export function getRandomCatchphrase(legendId: string): string | null {
  const personality = LEGEND_PERSONALITIES[legendId];
  if (!personality?.catchphrases.length) return null;
  return personality.catchphrases[Math.floor(Math.random() * personality.catchphrases.length)];
}

/**
 * Get a meme response if the topic matches
 */
export function getMemeResponse(legendId: string, topic: string): string | null {
  const personality = LEGEND_PERSONALITIES[legendId];
  if (!personality?.memeResponses) return null;

  const lowerTopic = topic.toLowerCase();
  for (const [key, response] of Object.entries(personality.memeResponses)) {
    if (lowerTopic.includes(key)) {
      return response;
    }
  }
  return null;
}

/**
 * Get a random signature ending
 */
export function getSignatureEnding(legendId: string): string | null {
  const personality = LEGEND_PERSONALITIES[legendId];
  if (!personality?.signatureEndings.length) return null;
  return personality.signatureEndings[Math.floor(Math.random() * personality.signatureEndings.length)];
}

/**
 * Inject personality into a response
 */
export function injectPersonality(
  legendId: string,
  response: string,
  addEnding: boolean = true
): string {
  if (!addEnding) return response;

  const ending = getSignatureEnding(legendId);
  if (ending && Math.random() > 0.5) { // 50% chance to add signature ending
    return `${response}\n\n${ending}`;
  }

  return response;
}
