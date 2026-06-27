import { Router } from "express";
import { z } from "zod";
import * as faqChatService from "../services/faqChatService.js";

const router = Router();

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(2000),
});

const bodySchema = z.object({
  messages: z.array(messageSchema).min(1).max(20),
});

router.post("/", async (req, res, next) => {
  try {
    const { messages } = bodySchema.parse(req.body);
    const last = messages[messages.length - 1];
    if (last.role !== "user") {
      return res.status(400).json({ error: "Last message must be from the user.", code: "VALIDATION_ERROR" });
    }

    const { reply } = await faqChatService.chatFaq(messages);
    res.json({ reply });
  } catch (e) {
    if (e.name === "ZodError") {
      const msg = e.errors?.[0]?.message || "Validation failed";
      return res.status(400).json({ error: msg, code: "VALIDATION_ERROR" });
    }
    if (e.status) {
      return res.status(e.status).json({ error: e.message, code: "FAQ_CHAT_ERROR" });
    }
    next(e);
  }
});

export default router;
