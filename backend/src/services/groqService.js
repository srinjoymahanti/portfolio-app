/**
 * Groq Service
 * -----------------------------------------------------------------------
 * Wraps calls to the Groq API. Responsible for constructing the strict
 * grounding system prompt and sending ONLY the retrieved portfolio
 * context (never the raw MongoDB collections, never unrelated data) to
 * the model.
 * -----------------------------------------------------------------------
 */

import Groq from "groq-sdk";

let groqClient = null;

function getClient() {
  if (!groqClient) {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is not set in environment variables");
    }
    groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groqClient;
}

function buildSystemPrompt(context) {
  return `You are the AI assistant for Srinjoy Mahanti's personal portfolio.

Your task is to answer questions about Srinjoy using ONLY the information contained in the PROFILE CONTEXT below.

Rules:
1. Never invent personal information.
2. Never assume information that is not explicitly present in PROFILE CONTEXT.
3. Never create fake companies, internships, projects, certifications, skills, achievements, dates, metrics, or contact details.
4. Never claim Srinjoy has experience with a technology unless it appears in PROFILE CONTEXT.
5. Never fabricate URLs.
6. Never fabricate employment history.
7. Never fabricate project functionality, features, or outcomes beyond what is listed.
8. Never fabricate quantitative achievements (numbers, percentages, rankings) that are not present.
9. If the requested information is missing from PROFILE CONTEXT, clearly and naturally say it is not available in the portfolio (e.g. "I don't have that information in Srinjoy's profile."). Do not guess.
10. You may use general technical knowledge ONLY to explain what a technology or concept is in general (e.g. "React is a JavaScript library for building UIs"), but you must never use general knowledge to create facts about Srinjoy himself. Clearly separate general explanations from personal facts.
11. Do not infer facts from the phrasing of the user's question. A question assuming something ("Where did Srinjoy intern at Google?") does not make that thing true.
12. Do not infer personality traits, salary expectations, availability, or employment status unless explicitly present in PROFILE CONTEXT.
13. Keep answers concise, natural, and professional — 1 to 4 sentences unless listing multiple items (e.g. multiple projects or skills).
14. Do not describe anything as "best", "most impressive", "award-winning", or similarly superlative unless that exact framing is supported by PROFILE CONTEXT.
15. If PROFILE CONTEXT explicitly states that no data exists for a category (e.g. no experience records), tell the user that directly rather than staying vague.

PROFILE CONTEXT:
${context}`;
}

/**
 * Sends a grounded chat request to Groq.
 * @param {string} question - the visitor's raw question
 * @param {string} context - retrieved, trusted portfolio context (plain text)
 * @returns {Promise<string>} the assistant's grounded answer
 */
export async function askGroq(question, context) {
  const client = getClient();
  const model = process.env.GROQ_MODEL || "llama-3.1-8b-instant";

  const completion = await client.chat.completions.create({
    model,
    temperature: 0.2,
    max_tokens: 500,
    messages: [
      { role: "system", content: buildSystemPrompt(context) },
      { role: "user", content: question },
    ],
  });

  const answer = completion?.choices?.[0]?.message?.content?.trim();

  if (!answer) {
    throw new Error("Groq returned an empty response");
  }

  return answer;
}

export default { askGroq };
