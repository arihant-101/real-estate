import { FAQ_KNOWLEDGE } from "../data/faqKnowledge.js";

const k = FAQ_KNOWLEDGE;

/** Offline fallback when OpenRouter is unavailable — FAQ scope only. */
export function fallbackFaqReply(userMessage) {
  const q = userMessage.toLowerCase();

  if (/service|offer|do you do|management|landlord|tenant|holiday|financial/.test(q)) {
    return `ASTA Property Management offers:\n\n${k.services.map((s) => `• ${s}`).join("\n")}\n\nLearn more on our Services pages, or contact us at ${k.email}.`;
  }

  if (/contact|email|phone|call|reach|office|address|where are you/.test(q)) {
    return `You can reach ASTA Property Management:\n\n• Email: ${k.email}\n• Phone: ${k.phone}\n• Hours: ${k.hours}\n• Office: ${k.address}\n\nUse our contact form: ${k.website}${k.contactPath}`;
  }

  if (/repair|maintenance|fix|broken|leak|issue report/.test(q)) {
    return `${k.repairs}\n\nMaintenance request form: ${k.website}${k.maintenanceFormPath}\nRepairs (tenants): ${k.website}${k.repairsPath}\n\nFor emergencies, also call the number provided at move-in.`;
  }

  if (/hour|open|when|time|available/.test(q)) {
    return `Our office hours are ${k.hours}.\n\nEmail: ${k.email}\nPhone: ${k.phone}\n\nWe usually respond to enquiries within one working day.`;
  }

  if (/something else|other|help|speak|human|agent/.test(q)) {
    return `For anything beyond this FAQ assistant, please contact our team:\n\n${k.website}${k.contactPath}\nEmail: ${k.email}\nPhone: ${k.phone}`;
  }

  return `I can help with ASTA services, contact details, and reporting repairs. For other questions, please use our contact form:\n\n${k.website}${k.contactPath}\nEmail: ${k.email}`;
}
