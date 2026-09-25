import { retrieveContext } from "../services/retrievalService.js";
import { askGroq } from "../services/groqService.js";
import ChatLog from "../models/ChatLog.js";

const FALLBACK_MESSAGE =
  "I'm unable to access my portfolio information right now. Please try again.";

export async function postChat(req, res, next) {
  const { message } = req.body;

  // Basic validation (defense in depth alongside express-validator on the route)
  if (!message || typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ error: "A non-empty 'message' field is required." });
  }
  if (message.length > 500) {
    return res.status(400).json({ error: "Message is too long (max 500 characters)." });
  }

  try {
    // 1. Retrieve grounded context from MongoDB based on the question
    const { context, categories } = await retrieveContext(message);

    // 2. Send the question + ONLY the retrieved context to Groq
    const answer = await askGroq(message, context);

    // 3. Log for debugging/analytics (best-effort, non-blocking)
    ChatLog.create({
      question: message,
      answer,
      retrievedCategories: categories,
    }).catch((e) => console.warn("Chat log write failed:", e.message));

    res.json({ answer, categories });
  } catch (err) {
    console.error("[CHAT ERROR]", err.message);
    // Never expose Groq/Mongo internals to the client
    return res.status(200).json({ answer: FALLBACK_MESSAGE, error: true });
  }
}
