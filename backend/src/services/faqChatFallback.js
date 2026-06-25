import { FAQ_ENTRIES, FAQ_KNOWLEDGE } from "../data/faqKnowledge.js";

const STOP_WORDS = new Set([
  "a", "an", "the", "is", "are", "was", "were", "be", "been", "being",
  "have", "has", "had", "do", "does", "did", "will", "would", "could", "should",
  "may", "might", "must", "shall", "can", "need", "dare", "ought", "used",
  "i", "you", "he", "she", "it", "we", "they", "what", "which", "who", "whom",
  "this", "that", "these", "those", "am", "to", "of", "in", "for", "on", "with",
  "at", "by", "from", "as", "into", "through", "during", "before", "after",
  "above", "below", "between", "under", "again", "further", "then", "once",
  "here", "there", "when", "where", "why", "how", "all", "each", "few", "more",
  "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same",
  "so", "than", "too", "very", "just", "and", "but", "if", "or", "because",
  "about", "my", "your", "our", "their", "me", "us", "them", "please", "tell",
  "know", "get", "like", "also", "any", "asta",
]);

function tokens(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

function scoreEntry(userMessage, entry) {
  const lower = userMessage.toLowerCase();
  const userTokens = tokens(userMessage);
  if (userTokens.length === 0) return 0;

  let score = 0;

  for (const phrase of entry.keywords || []) {
    if (lower.includes(phrase.toLowerCase())) score += 4;
  }

  const keywordBlob = (entry.keywords || []).join(" ").toLowerCase();
  for (const word of userTokens) {
    if (keywordBlob.includes(word)) score += 2;
  }

  const questionTokens = tokens(entry.q);
  for (const word of userTokens) {
    if (questionTokens.includes(word)) score += 1;
  }

  return score;
}

function findBestEntry(userMessage) {
  let best = null;
  let bestScore = 0;

  for (const entry of FAQ_ENTRIES) {
    const score = scoreEntry(userMessage, entry);
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }

  // Require a minimum match so random text doesn't hit a weak FAQ
  if (bestScore >= 3) return best;
  return null;
}

const k = FAQ_KNOWLEDGE;

/** Offline fallback when OpenRouter is unavailable — FAQ scope only. */
export function fallbackFaqReply(userMessage) {
  const q = userMessage.trim();
  const lower = q.toLowerCase();

  if (/something else|speak to someone|talk to someone|human agent/.test(lower)) {
    return `For anything beyond this FAQ assistant, please contact our team:\n\n${k.website}${k.contactPath}\nEmail: ${k.email}\nPhone: ${k.phone}`;
  }

  const matched = findBestEntry(q);
  if (matched) {
    return `${matched.a}\n\nMore FAQs: ${k.website}${k.faqsPath}`;
  }

  return `I'm not sure about that specific question, but our team can help.\n\nBrowse all FAQs: ${k.website}${k.faqsPath}\nContact us: ${k.website}${k.contactPath}\nEmail: ${k.email}\nPhone: ${k.phone}`;
}
